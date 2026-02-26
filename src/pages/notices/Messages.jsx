import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import moment from "moment";

const Messages = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);

  const tabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "read", label: "Read" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["myNotices", activeTab],
    queryFn: async () => {
      const type = activeTab === "all" ? "" : activeTab;
      const { data } = await API.get(
        `/notices/my-notices${type ? `?type=${type}` : ""}`,
      );
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (noticeId) => {
      await API.put(`/notices/${noticeId}/seen`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myNotices"]);
      queryClient.invalidateQueries(["unreadNotices"]);
    },
  });

  const handleOpenNotice = (notice) => {
    setSelectedNotice(notice);
    if (!notice.isSeen) {
      markReadMutation.mutate(notice._id);
    }
  };

  const notices = data?.notices || [];

  const getTypeIcon = (type) => {
    const icons = {
      system: "🔔",
      recharge: "💳",
      withdrawal: "💸",
      order: "📦",
      vip: "👑",
      warning: "⚠️",
      general: "📢",
    };
    return icons[type] || "📢";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopBar title="Messages" />

      {/* Tabs */}
      <div className="bg-white sticky top-[52px] z-30 shadow-sm">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 text-sm font-medium
                transition-all relative"
              style={{
                color: activeTab === tab.key ? "#f02d65" : "#9ca3af",
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 left-1/2
                  -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ background: "#f02d65" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notice List */}
      <div className="p-4 space-y-2">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl animate-pulse h-20" />
          ))
        ) : notices.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">📭</span>
            <p className="text-gray-500 mt-4 font-medium">No messages yet</p>
          </div>
        ) : (
          notices.map((notice) => (
            <button
              key={notice._id}
              onClick={() => handleOpenNotice(notice)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm
                flex items-start gap-3 active:bg-gray-50
                transition-all text-left"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center
                justify-center text-xl flex-shrink-0"
                style={{
                  background: notice.isSeen ? "#f3f4f6" : "#fff0f3",
                }}
              >
                {getTypeIcon(notice.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm ${
                      notice.isSeen
                        ? "text-gray-500 font-medium"
                        : "text-gray-800 font-bold"
                    }`}
                  >
                    {notice.title}
                  </p>
                  {!notice.isSeen && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0
                      ml-2"
                      style={{ background: "#f02d65" }}
                    />
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                  {notice.content}
                </p>
                <p className="text-gray-300 text-[10px] mt-1">
                  {moment(notice.createdAt).fromNow()}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex
          items-end justify-center"
        >
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl
            max-h-[80vh] flex flex-col"
          >
            <div
              className="flex items-center justify-between p-5
              border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getTypeIcon(selectedNotice.type)}
                </span>
                <h3 className="font-bold text-gray-800 text-sm">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex
                  items-center justify-center text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedNotice.content}
              </p>
              <p className="text-gray-300 text-xs mt-4">
                {moment(selectedNotice.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedNotice(null)}
                className="w-full py-3 rounded-xl text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
