// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useQuery } from "@tanstack/react-query";
// import { io } from "socket.io-client";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import { ArrowLeft, Image as ImageIcon, Send, Loader2, Headset, CheckCircle2, X } from "lucide-react";

// export default function ChatWidget() {
//   const navigate = useNavigate();
//   const { user, merchant } = useSelector((s) => s.auth);

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [adminTyping, setAdminTyping] = useState(false);

//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewFile, setPreviewFile] = useState(null);

//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   // 1. Fetch official Room Data from Backend FIRST
//   const { data: roomData, isLoading: initializingRoom } = useQuery({
//     queryKey: ["initChatRoom"],
//     queryFn: async () => {
//       const { data } = await API.get("/chat/room");
//       return data;
//     },
//     retry: false,
//   });

//   // CRITICAL FIX: Use the properly formatted roomId from the database (e.g. "room_12345")
//   const actualRoomId = roomData?.roomId;
//   const isBlacklisted = roomData?.isBlacklisted;

//   // 2. Fetch History only after we have the real roomId
//   const { data: historyData, isLoading: loadingHistory } = useQuery({
//     queryKey: ["chatHistory", actualRoomId],
//     queryFn: async () => {
//       const { data } = await API.get(`/chat/messages/${actualRoomId}`);
//       return data;
//     },
//     enabled: !!actualRoomId,
//   });

//   useEffect(() => {
//     if (historyData?.messages) {
//       setMessages(historyData.messages);
//       scrollToBottom();
//     }
//   }, [historyData]);

//   // ── 3. Socket.io Connection ──
//   useEffect(() => {
//     if (!actualRoomId || isBlacklisted) return;

//     const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       socket.emit("join_room", { roomId: actualRoomId });
//       socket.emit("user_online", { userId: user._id });
//     });

//     socket.on("new_message", (msg) => {
//       // NEW: Toast Notification when Admin replies
//       if (msg.senderRole !== "merchant") {
//         toast.info(`Support: ${msg.messageType === 'image' ? '[Image]' : msg.message.substring(0, 30)}`);
//       }

//       setMessages((prev) => {
//         if (prev.find((m) => m._id === msg._id)) return prev;
//         return [...prev, msg];
//       });
//       scrollToBottom();
//     });

//     socket.on("typing_indicator", ({ isTyping, role }) => {
//       if (role !== "merchant") setAdminTyping(isTyping);
//     });

//     return () => {
//       socket.emit("user_offline", { userId: user._id });
//       socket.disconnect();
//     };
//   }, [actualRoomId, user._id, isBlacklisted]);

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   const handleTyping = (e) => {
//     setNewMessage(e.target.value);
//     try {
//       if (socketRef.current && socketRef.current.connected) {
//         socketRef.current.emit("typing", { roomId: actualRoomId, isTyping: true, role: "merchant" });
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => {
//           socketRef.current.emit("typing", { roomId: actualRoomId, isTyping: false, role: "merchant" });
//         }, 2000);
//       }
//     } catch (err) {}
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const objectUrl = URL.createObjectURL(file);
//     setPreviewImage(objectUrl);
//     setPreviewFile(file);
//     e.target.value = "";
//   };

//   const cancelImagePreview = () => {
//     setPreviewImage(null);
//     setPreviewFile(null);
//   };

//   // 4. Send Message (Optimistic UI Restored)
//   const sendMessage = async () => {
//     if ((!newMessage.trim() && !previewFile) || isBlacklisted || !actualRoomId) return;

//     const msgText = newMessage.trim();
//     const fileToUpload = previewFile;

//     setNewMessage("");
//     setPreviewImage(null);
//     setPreviewFile(null);

//     // Image Handle
//     if (fileToUpload) {
//       setUploading(true);
//       try {
//         const fd = new FormData();
//         fd.append("file", fileToUpload);
//         const { data } = await API.post("/upload/single?folder=chat", fd, { headers: { "Content-Type": "multipart/form-data" } });

//         const imgMsg = {
//           _id: Date.now().toString(),
//           roomId: actualRoomId,
//           message: "",
//           messageType: "image",
//           imageUrl: data.url,
//           senderRole: "merchant",
//           senderName: merchant?.storeName || user?.username,
//           senderAvatar: user?.avatar || "",
//           createdAt: new Date().toISOString(),
//         };

//         setMessages((prev) => [...prev, imgMsg]);
//         scrollToBottom();

//         if (socketRef.current && socketRef.current.connected) {
//           socketRef.current.emit("send_message", imgMsg);
//         } else {
//           await API.post("/chat/send", imgMsg);
//         }
//       } catch {
//         toast.error("Failed to upload image");
//       } finally {
//         setUploading(false);
//       }
//     }

//     // Text Handle
//     if (msgText) {
//       const tempTextMsg = {
//         _id: Date.now().toString(),
//         roomId: actualRoomId,
//         message: msgText,
//         messageType: "text",
//         senderRole: "merchant",
//         senderName: merchant?.storeName || user?.username,
//         senderAvatar: user?.avatar || "",
//         createdAt: new Date().toISOString(),
//       };

//       // Instantly render in UI
//       setMessages((prev) => [...prev, tempTextMsg]);
//       scrollToBottom();

//       if (socketRef.current && socketRef.current.connected) {
//         socketRef.current.emit("send_message", tempTextMsg);
//         socketRef.current.emit("typing", { roomId: actualRoomId, isTyping: false, role: "merchant" });
//       } else {
//         await API.post("/chat/send", tempTextMsg);
//       }
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const isLoading = initializingRoom || loadingHistory;

//   return (
//     <div className="bg-gray-50 flex flex-col relative" style={{ height: "100vh", margin: "0 auto", maxWidth: "620px", overflow: "hidden" }}>
//       {/* ════════════ STICKY HEADER ════════════ */}
//       <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(240, 45, 101, 0.2)", zIndex: 50, flexShrink: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.2)", border: "none", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
//             <ArrowLeft size={20} color="#fff" />
//           </button>
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Headset size={20} color="#f02d65" />
//             </div>
//             <div>
//               <h1 style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", margin: "0 0 2px 0" }}>Merchant Support</h1>
//               <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "11px", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
//                 <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isBlacklisted ? "#ef4444" : "#10b981", display: "inline-block" }}></span>
//                 {isBlacklisted ? "Unavailable" : "Online"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ════════════ MESSAGE AREA ════════════ */}
//       <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
//         <div style={{ textAlign: "center", marginBottom: "8px" }}>
//           <span style={{ backgroundColor: "#e2e8f0", color: "#64748b", padding: "4px 12px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" }}>Chat is end-to-end secured</span>
//         </div>

//         {isLoading ? (
//           <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Loader2 size={24} color="#f02d65" className="animate-spin" /></div>
//         ) : isBlacklisted ? (
//           <div style={{ textAlign: "center", padding: "40px 20px", color: "#ef4444", fontWeight: "bold" }}>You have been restricted from contacting support.</div>
//         ) : messages.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "40px 20px", opacity: 0.5 }}>
//             <Headset size={48} color="#94a3b8" style={{ margin: "0 auto 12px auto" }} />
//             <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "bold", margin: 0 }}>How can we help you today?</p>
//             <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Send a message to connect with an agent.</p>
//           </div>
//         ) : (
//           messages.map((msg, idx) => {
//             const isMe = msg.senderRole === "merchant";
//             return (
//               <div key={msg._id || idx} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", width: "100%" }}>
//                 <div style={{ maxWidth: "75%", padding: "12px 16px", fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", background: isMe ? "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)" : "#fff", color: isMe ? "#fff" : "#1e293b", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", border: isMe ? "none" : "1px solid #f1f5f9" }}>
//                   {msg.messageType === "image" ? (
//                     <img src={msg.imageUrl} alt="attachment" style={{ width: "100%", borderRadius: "8px", cursor: "pointer" }} onClick={() => window.open(msg.imageUrl, "_blank")} />
//                   ) : ( msg.message )}
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", padding: isMe ? "0 4px 0 0" : "0 0 0 4px" }}>
//                   <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "500" }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
//                   {isMe && <CheckCircle2 size={12} color="#10b981" />}
//                 </div>
//               </div>
//             );
//           })
//         )}

//         {adminTyping && (
//           <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
//             <div style={{ backgroundColor: "#fff", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
//               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
//               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
//               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ════════════ INPUT AREA ════════════ */}
//       <div style={{ backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", zIndex: 50, flexShrink: 0, paddingBottom: "calc(env(safe-area-inset-bottom))" }}>

//         {previewImage && (
//           <div style={{ padding: "12px 16px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
//             <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", border: "2px solid #f02d65" }}>
//               <img src={previewImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//               <button onClick={cancelImagePreview} style={{ position: "absolute", top: "2px", right: "2px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}><X size={12} /></button>
//             </div>
//             <p style={{ fontSize: "12px", color: "#64748b", margin: 0, fontWeight: "500" }}>Image attached. Send with a message.</p>
//           </div>
//         )}

//         <div style={{ padding: "12px 16px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
//           <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" style={{ display: "none" }} />
//           <button onClick={() => fileInputRef.current?.click()} disabled={uploading || isBlacklisted} style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: isBlacklisted ? "not-allowed" : "pointer", flexShrink: 0, padding: 0 }}>
//             {uploading ? <Loader2 size={18} color="#f02d65" className="animate-spin" /> : <ImageIcon size={20} color="#64748b" />}
//           </button>
//           <textarea value={newMessage} onChange={handleTyping} onKeyDown={handleKeyPress} disabled={isBlacklisted} placeholder={isBlacklisted ? "Chat disabled" : "Type a message..."} rows={1} style={{ flex: 1, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "10px 16px", fontSize: "14px", color: "#1e293b", outline: "none", resize: "none", maxHeight: "100px", lineHeight: "1.4" }} />
//           <button onClick={sendMessage} disabled={(!newMessage.trim() && !previewFile) || uploading || isBlacklisted} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0, transition: "background 0.3s", background: (newMessage.trim() || previewFile) && !isBlacklisted ? "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)" : "#e2e8f0", cursor: (newMessage.trim() || previewFile) && !isBlacklisted ? "pointer" : "not-allowed" }}>
//             <Send size={18} color="#fff" style={{ transform: "translateX(-1px) translateY(1px)" }} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

////////////////// ======================= latest version (claud io) ===================== //////////////////////
////////////////// ======================= latest version (claud io) ===================== //////////////////////
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import API from "../../api/axios";
import {
  ArrowLeft,
  Image as ImageIcon,
  Send,
  Loader2,
  Headset,
  CheckCircle2,
  X,
  Bell,
} from "lucide-react";

export default function ChatWidget() {
  const navigate = useNavigate();
  const { user, merchant } = useSelector((s) => s.auth);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // ── NEW: unread notification count ──
  const [notifCount, setNotifCount] = useState(0);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Fetch official Room Data from Backend FIRST
  const { data: roomData, isLoading: initializingRoom } = useQuery({
    queryKey: ["initChatRoom"],
    queryFn: async () => {
      const { data } = await API.get("/chat/room");
      return data;
    },
    retry: false,
  });

  const actualRoomId = roomData?.roomId;
  const isBlacklisted = roomData?.isBlacklisted;

  // 2. Fetch History only after we have the real roomId
  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ["chatHistory", actualRoomId],
    queryFn: async () => {
      const { data } = await API.get(`/chat/messages/${actualRoomId}`);
      return data;
    },
    enabled: !!actualRoomId,
  });

  useEffect(() => {
    if (historyData?.messages) {
      setMessages(historyData.messages);
      scrollToBottom();
    }
  }, [historyData]);

  // ── 3. Socket.io Connection ──
  useEffect(() => {
    if (!actualRoomId || isBlacklisted) return;

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
    );
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", { roomId: actualRoomId });
      socket.emit("user_online", { userId: user._id });
    });

    socket.on("new_message", (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;

        const isTempMatch = prev.find(
          (m) =>
            String(m._id).length === 13 &&
            m.roomId === msg.roomId &&
            m.senderRole === msg.senderRole &&
            m.message === msg.message,
        );
        if (isTempMatch) {
          return prev.map((m) => (m._id === isTempMatch._id ? msg : m));
        }

        return [...prev, msg];
      });
      scrollToBottom();
    });

    socket.on(
      "new_admin_message",
      ({ senderName, senderRole, message, messageType }) => {
        const label =
          senderRole === "superAdmin"
            ? "Support"
            : senderRole === "merchantAdmin"
              ? "Your Account Manager"
              : "Support";
        const preview =
          messageType === "image" ? "📷 Image" : message?.substring(0, 40);
        toast.info(`${label}: ${preview}`);

        // ── NEW: increment notification badge ──
        setNotifCount((prev) => prev + 1);
      },
    );

    socket.on("typing_indicator", ({ isTyping, role }) => {
      if (role !== "merchant") setAdminTyping(isTyping);
    });

    return () => {
      socket.emit("user_offline", { userId: user._id });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [actualRoomId, user._id, isBlacklisted]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("typing", {
          roomId: actualRoomId,
          isTyping: true,
          role: "merchant",
        });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          socketRef.current?.emit("typing", {
            roomId: actualRoomId,
            isTyping: false,
            role: "merchant",
          });
        }, 2000);
      }
    } catch (err) {}
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setPreviewFile(file);
    e.target.value = "";
  };

  const cancelImagePreview = () => {
    setPreviewImage(null);
    setPreviewFile(null);
  };

  // 4. Send Message (Optimistic UI)
  const sendMessage = async () => {
    if ((!newMessage.trim() && !previewFile) || isBlacklisted || !actualRoomId)
      return;

    const msgText = newMessage.trim();
    const fileToUpload = previewFile;

    setNewMessage("");
    setPreviewImage(null);
    setPreviewFile(null);

    // Image Handle
    if (fileToUpload) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", fileToUpload);
        const { data } = await API.post("/upload/single?folder=chat", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imgMsg = {
          _id: Date.now().toString(),
          roomId: actualRoomId,
          message: "",
          messageType: "image",
          imageUrl: data.url,
          senderRole: "merchant",
          senderName: merchant?.storeName || user?.username,
          sender: user?._id,
          senderId: user?._id,
          senderAvatar: user?.avatar || "",
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, imgMsg]);
        scrollToBottom();

        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("send_message", imgMsg);
        } else {
          await API.post("/chat/send", imgMsg);
        }
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    }

    // Text Handle
    if (msgText) {
      const tempTextMsg = {
        _id: Date.now().toString(),
        roomId: actualRoomId,
        message: msgText,
        messageType: "text",
        senderRole: "merchant",
        senderName: merchant?.storeName || user?.username,
        sender: user?._id,
        senderId: user?._id,
        senderAvatar: user?.avatar || "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempTextMsg]);
      scrollToBottom();

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("send_message", tempTextMsg);
        socketRef.current.emit("typing", {
          roomId: actualRoomId,
          isTyping: false,
          role: "merchant",
        });
      } else {
        await API.post("/chat/send", tempTextMsg);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isLoading = initializingRoom || loadingHistory;

  return (
    <div
      className="bg-gray-50 flex flex-col relative"
      style={{
        height: "100vh",
        margin: "0 auto",
        maxWidth: "620px",
        overflow: "hidden",
      }}
    >
      {/* ════════════ STICKY HEADER ════════════ */}
      <div
        style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 15px rgba(240, 45, 101, 0.2)",
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Left side — unchanged */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Headset size={20} color="#f02d65" />
            </div>
            <div>
              <h1
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "0 0 2px 0",
                }}
              >
                Merchant Support
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "11px",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: isBlacklisted ? "#ef4444" : "#10b981",
                    display: "inline-block",
                  }}
                ></span>
                {isBlacklisted ? "Unavailable" : "Online"}
              </p>
            </div>
          </div>
        </div>

        {/* ── NEW: Notification Bell — clicking clears the count ── */}
        <button
          onClick={() => setNotifCount(0)}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <Bell size={18} color="#fff" />
          {notifCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                backgroundColor: "#facc15",
                color: "#1e293b",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "10px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>
      </div>

      {/* ════════════ MESSAGE AREA ════════════ */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <span
            style={{
              backgroundColor: "#e2e8f0",
              color: "#64748b",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            Chat is end-to-end secured
          </span>
        </div>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <Loader2 size={24} color="#f02d65" className="animate-spin" />
          </div>
        ) : isBlacklisted ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#ef4444",
              fontWeight: "bold",
            }}
          >
            You have been restricted from contacting support.
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              opacity: 0.5,
            }}
          >
            <Headset
              size={48}
              color="#94a3b8"
              style={{ margin: "0 auto 12px auto" }}
            />
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              How can we help you today?
            </p>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Send a message to connect with an agent.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderRole === "merchant";
            return (
              <div
                key={msg._id || idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    background: isMe
                      ? "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)"
                      : "#fff",
                    color: isMe ? "#fff" : "#1e293b",
                    borderRadius: isMe
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    border: isMe ? "none" : "1px solid #f1f5f9",
                  }}
                >
                  {msg.messageType === "image" ? (
                    <img
                      src={msg.imageUrl}
                      alt="attachment"
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(msg.imageUrl, "_blank")}
                    />
                  ) : (
                    msg.message
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "4px",
                    padding: isMe ? "0 4px 0 0" : "0 0 0 4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      fontWeight: "500",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCircle2 size={12} color="#10b981" />}
                </div>
              </div>
            );
          })
        )}

        {adminTyping && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 4px",
                border: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ════════════ INPUT AREA ════════════ */}
      <div
        style={{
          backgroundColor: "#fff",
          borderTop: "1px solid #e2e8f0",
          zIndex: 50,
          flexShrink: 0,
          paddingBottom: "calc(env(safe-area-inset-bottom))",
        }}
      >
        {previewImage && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #f02d65",
              }}
            >
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={cancelImagePreview}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={12} />
              </button>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              Image attached. Send with a message.
            </p>
          </div>
        )}

        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || isBlacklisted}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isBlacklisted ? "not-allowed" : "pointer",
              flexShrink: 0,
              padding: 0,
            }}
          >
            {uploading ? (
              <Loader2 size={18} color="#f02d65" className="animate-spin" />
            ) : (
              <ImageIcon size={20} color="#64748b" />
            )}
          </button>
          <textarea
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyPress}
            disabled={isBlacklisted}
            placeholder={isBlacklisted ? "Chat disabled" : "Type a message..."}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "10px 16px",
              fontSize: "14px",
              color: "#1e293b",
              outline: "none",
              resize: "none",
              maxHeight: "100px",
              lineHeight: "1.4",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={
              (!newMessage.trim() && !previewFile) || uploading || isBlacklisted
            }
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: 0,
              transition: "background 0.3s",
              background:
                (newMessage.trim() || previewFile) && !isBlacklisted
                  ? "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)"
                  : "#e2e8f0",
              cursor:
                (newMessage.trim() || previewFile) && !isBlacklisted
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            <Send
              size={18}
              color="#fff"
              style={{ transform: "translateX(-1px) translateY(1px)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
