import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const ChatWidget = () => {
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [room, setRoom] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Fetch or create room ──
  const { data: roomData, isLoading: roomLoading } = useQuery({
    queryKey: ["myRoom"],
    queryFn: async () => {
      const { data } = await API.get("/chat/room");
      return data;
    },
    onSuccess: (data) => setRoom(data),
    onError: (error) => {
      if (error.response?.status === 403) {
        toast.error("You are blacklisted from chat");
      }
    },
  });

  // ── Fetch chat history ──
  const { data: historyData } = useQuery({
    queryKey: ["chatHistory", roomData?.roomId],
    queryFn: async () => {
      const { data } = await API.get(`/chat/messages/${roomData?.roomId}`);
      return data;
    },
    enabled: !!roomData?.roomId,
    onSuccess: (data) => setMessages(data.messages || []),
  });

  // ── Fetch FAQ for tab ──
  const { data: faqData } = useQuery({
    queryKey: ["faqForChat"],
    queryFn: async () => {
      const { data } = await API.get("/questions");
      return data;
    },
  });

  // ── Setup Socket.io ──
  useEffect(() => {
    if (!roomData?.roomId) return;

    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      // Tell server we are online
      newSocket.emit("user_online", {
        userId: user._id,
        role: "merchant",
      });
      // Join our room
      newSocket.emit("join_room", { roomId: roomData.roomId });
      // Mark messages as read
      newSocket.emit("mark_read", { roomId: roomData.roomId });
    });

    // Receive new message
    newSocket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
      // Mark as read immediately since we are in the room
      newSocket.emit("mark_read", { roomId: roomData.roomId });
    });

    // Typing indicator
    newSocket.on("typing_indicator", ({ isTyping }) => {
      setAgentTyping(isTyping);
    });

    // Agent assigned
    newSocket.on("agent_assigned", ({ agentName }) => {
      toast.success(`${agentName} joined the chat!`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomData?.roomId, user._id]);

  // ── Auto scroll to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !roomData?.roomId) return;

    socket.emit("send_message", {
      roomId: roomData.roomId,
      message: newMessage.trim(),
      messageType: "text",
      senderName: user.username,
      senderAvatar: user.avatar || "",
    });

    setNewMessage("");
    // Stop typing indicator
    socket.emit("typing", {
      roomId: roomData.roomId,
      isTyping: false,
    });
  };

  // ── Typing indicator ──
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !roomData?.roomId) return;

    socket.emit("typing", {
      roomId: roomData.roomId,
      isTyping: true,
    });

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        roomId: roomData.roomId,
        isTyping: false,
      });
    }, 2000);
  };

  // ── Send image ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket || !roomData?.roomId) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=general", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      socket.emit("send_message", {
        roomId: roomData.roomId,
        message: "",
        messageType: "image",
        imageUrl: data.url,
        senderName: user.username,
        senderAvatar: user.avatar || "",
      });
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Handle Enter key ──
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="Customer Service" />
        <div className="flex items-center justify-center h-80">
          <svg
            className="animate-spin h-8 w-8"
            style={{ color: "#f02d65" }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar
        title="Customer Service"
        rightElement={
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                roomData?.status === "active" ? "bg-green-400" : "bg-gray-300"
              }`}
            />
            <span className="text-xs text-gray-400">
              {roomData?.status === "active" ? "Online" : "Waiting"}
            </span>
          </div>
        }
      />

      {/* ── TABS ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          {[
            { key: "chat", label: "💬 Chat" },
            { key: "faq", label: "❓ FAQ" },
          ].map((tab) => (
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
                  -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: "#f02d65" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* ── SERVICE HOURS ── */}
          <div
            className="mx-4 mt-3 p-3 bg-blue-50 rounded-xl
            border border-blue-100 flex items-center gap-2"
          >
            <span className="text-blue-400">🕐</span>
            <p className="text-blue-600 text-xs">
              Service hours: 09:00 - 22:00 (Mon-Sun)
            </p>
          </div>

          {/* ── MESSAGES ── */}
          <div
            className="flex-1 overflow-y-auto p-4 pb-2 space-y-3"
            style={{ maxHeight: "calc(100vh - 280px)" }}
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full mx-auto
                  flex items-center justify-center text-3xl mb-3"
                  style={{
                    background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                  }}
                >
                  🎧
                </div>
                <p className="text-gray-600 font-bold text-sm">
                  TikTok Shop Support
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Hello! How can we help you today?
                </p>
                {roomData?.status === "waiting" && (
                  <div
                    className="mt-3 px-4 py-2 bg-yellow-50
                    rounded-xl inline-block"
                  >
                    <p className="text-yellow-600 text-xs">
                      ⏳ Waiting for an agent...
                    </p>
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, i) => {
              const isMe =
                msg.sender === user._id || msg.senderRole === "merchant";

              return (
                <div
                  key={msg._id || i}
                  className={`flex items-end gap-2 ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  {!isMe && (
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0
                      flex items-center justify-center text-white text-sm"
                      style={{
                        background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                      }}
                    >
                      🎧
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[70%] ${
                      isMe ? "items-end" : "items-start"
                    } flex flex-col gap-1`}
                  >
                    {/* Sender name for agent */}
                    {!isMe && (
                      <p className="text-gray-400 text-[10px] px-1">
                        {msg.senderName || "Support"}
                      </p>
                    )}

                    {msg.messageType === "image" ? (
                      <img
                        src={msg.imageUrl}
                        alt="sent image"
                        className="max-w-full rounded-2xl shadow-sm
                          max-h-48 object-cover"
                      />
                    ) : (
                      <div
                        className={`px-4 py-2.5 rounded-2xl
                        text-sm leading-relaxed ${
                          isMe
                            ? "text-white rounded-br-sm"
                            : "bg-white text-gray-700 shadow-sm rounded-bl-sm"
                        }`}
                        style={{
                          background: isMe
                            ? "linear-gradient(135deg, #f02d65, #ff6b35)"
                            : undefined,
                        }}
                      >
                        {msg.message}
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-gray-300 text-[10px] px-1">
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Agent typing indicator */}
            {agentTyping && (
              <div className="flex items-end gap-2">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0
                  flex items-center justify-center text-white text-sm"
                  style={{
                    background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                  }}
                >
                  🎧
                </div>
                <div
                  className="bg-white px-4 py-3 rounded-2xl
                  rounded-bl-sm shadow-sm flex gap-1"
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full
                        animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT BAR ── */}
          <div
            className="bg-white border-t border-gray-100 p-3
            flex items-center gap-2"
          >
            {/* Image upload */}
            <label
              className="w-10 h-10 rounded-xl bg-gray-100
              flex items-center justify-center cursor-pointer
              active:bg-gray-200 flex-shrink-0"
            >
              {uploading ? (
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                <span className="text-xl">📷</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Text input */}
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl
                text-sm outline-none focus:bg-gray-50 transition-all"
            />

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 rounded-xl flex items-center
                justify-center text-white flex-shrink-0
                transition-all active:scale-90 disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #f02d65, #ff6b35)",
              }}
            >
              ➤
            </button>
          </div>
        </>
      ) : (
        // ── FAQ TAB ──
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-gray-400 text-xs font-medium mb-3">QUICK HELP</p>
          {faqData?.map((q) => (
            <div key={q._id} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm font-bold mb-2">
                {q.question}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
