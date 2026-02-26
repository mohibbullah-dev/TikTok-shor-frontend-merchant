import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const Questions = () => {
  const [openId, setOpenId] = useState(null);
  const [showContract, setShowContract] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["faqQuestions"],
    queryFn: async () => {
      const { data } = await API.get("/questions");
      return data;
    },
  });

  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: async () => {
      const { data } = await API.get("/questions/contract");
      return data;
    },
  });

  const categoryIcons = {
    "Account Status": "👤",
    "Product Management": "📦",
    "Advertising Regulations": "📢",
    "Transportation Rules": "🚚",
    "Capital Safety": "💰",
    "Complaints & Disputes": "🚨",
    "Store Management": "🏪",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopBar title="Help & FAQ" />

      {/* Contract Banner */}
      <button
        onClick={() => setShowContract(true)}
        className="mx-4 mt-4 w-[calc(100%-32px)] rounded-2xl p-4
          flex items-center gap-3 shadow-sm text-left"
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
        }}
      >
        <span className="text-3xl">📜</span>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Cooperation Agreement</p>
          <p className="text-white/70 text-xs">TikTok Shop platform terms</p>
        </div>
        <span className="text-white/70">›</span>
      </button>

      {/* FAQ List */}
      <div className="mx-4 mt-4 space-y-2">
        <p className="text-gray-400 text-xs font-medium mb-3">
          FREQUENTLY ASKED QUESTIONS
        </p>

        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-14 animate-pulse"
              />
            ))
          : questions?.map((q) => (
              <div
                key={q._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Question Header */}
                <button
                  onClick={() => setOpenId(openId === q._id ? null : q._id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <span className="text-xl flex-shrink-0">
                    {categoryIcons[q.category] || "❓"}
                  </span>
                  <p className="flex-1 text-gray-700 text-sm font-medium">
                    {q.question}
                  </p>
                  <span
                    className="text-gray-300 transition-transform
                    flex-shrink-0"
                    style={{
                      transform: openId === q._id ? "rotate(90deg)" : "none",
                    }}
                  >
                    ›
                  </span>
                </button>

                {/* Answer */}
                {openId === q._id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Contract Modal */}
      {showContract && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex
          items-end justify-center"
        >
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl
            max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5
              border-b border-gray-100"
            >
              <h3 className="font-bold text-gray-800">Cooperation Agreement</h3>
              <button
                onClick={() => setShowContract(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex
                  items-center justify-center text-gray-500"
              >
                ×
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <p
                className="text-gray-600 text-sm leading-relaxed
                whitespace-pre-line"
              >
                {contract?.content}
              </p>
            </div>
            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowContract(false)}
                className="w-full py-3 rounded-xl text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                }}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
