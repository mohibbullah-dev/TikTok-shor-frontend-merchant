// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { logout } from "../../store/authSlice";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";

// const Profile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((state) => state.auth);

//   const vipColors = {
//     0: "#888888",
//     1: "#cd7f32",
//     2: "#aaaaaa",
//     3: "#ffd700",
//     4: "#00bcd4",
//     5: "#9c27b0",
//     6: "#f02d65",
//   };

//   const vipLevel = merchant?.vipLevel || 0;

//   // Logout mutation
//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       await API.post("/auth/logout");
//     },
//     onSuccess: () => {
//       dispatch(logout());
//       navigate("/login");
//     },
//     onError: () => {
//       // Even if API fails, logout locally
//       dispatch(logout());
//       navigate("/login");
//     },
//   });

//   const menuItems = [
//     {
//       section: "Store",
//       items: [
//         {
//           icon: "🏪",
//           label: "Basic Info",
//           sub: "Store name, logo, address",
//           path: "/profile/baseinfo",
//         },
//         {
//           icon: "🖼️",
//           label: "Banner Settings",
//           sub: "Upload store banners",
//           path: "/profile/banners",
//         },
//         {
//           icon: "👑",
//           label: "VIP Upgrade",
//           sub: `Current: VIP${vipLevel}`,
//           path: "/vip",
//           badge: `VIP${vipLevel}`,
//           badgeColor: vipColors[vipLevel],
//         },
//       ],
//     },
//     {
//       section: "Finance",
//       items: [
//         {
//           icon: "💰",
//           label: "Fund Records",
//           sub: "Transaction history",
//           path: "/funds",
//         },
//         {
//           icon: "📊",
//           label: "Financial Statements",
//           sub: "Daily profit summary",
//           path: "/finance",
//         },
//         {
//           icon: "📅",
//           label: "Sign-in Calendar",
//           sub: "Daily $15 reward",
//           path: "/calendar",
//         },
//       ],
//     },
//     {
//       section: "Account",
//       items: [
//         {
//           icon: "👤",
//           label: "Personal Info",
//           sub: "Name, phone, email",
//           path: "/profile/personal",
//         },
//         {
//           icon: "⚙️",
//           label: "Settings",
//           sub: "Password, security",
//           path: "/profile/settings",
//         },
//         {
//           icon: "❓",
//           label: "Help & FAQ",
//           sub: "Common questions",
//           path: "/faq",
//         },
//         {
//           icon: "🌍",
//           label: "Language",
//           sub: "Change display language",
//           path: "/profile/language",
//         },
//         {
//           icon: "📜",
//           label: "Complaint",
//           sub: "Submit order complaint",
//           path: "/complaint",
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">
//       {/* ── HEADER ── */}
//       <div
//         className="relative pb-6"
//         style={{
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//         }}
//       >
//         {/* Top spacing */}
//         <div className="h-12" />

//         {/* Profile info */}
//         <div className="flex flex-col items-center px-4">
//           {/* Avatar */}
//           <div className="relative mb-3">
//             <div
//               className="w-20 h-20 rounded-full border-4
//               border-white shadow-lg overflow-hidden bg-white/20
//               flex items-center justify-center"
//             >
//               {user?.avatar ? (
//                 <img
//                   src={user.avatar}
//                   alt="avatar"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-4xl">👤</span>
//               )}
//             </div>
//             {/* VIP badge on avatar */}
//             <div
//               className="absolute -bottom-1 -right-1 px-2 py-0.5
//               rounded-full text-white text-[10px] font-bold shadow-md"
//               style={{ background: vipColors[vipLevel] }}
//             >
//               VIP{vipLevel}
//             </div>
//           </div>

//           {/* Name */}
//           <h2 className="text-white text-lg font-bold">
//             {merchant?.storeName || user?.username}
//           </h2>
//           <p className="text-white/70 text-xs mt-0.5">
//             @{user?.username} · ID: {merchant?.merchantId}
//           </p>

//           {/* Stats Row */}
//           <div className="flex gap-6 mt-4">
//             {[
//               {
//                 label: "Balance",
//                 value: `$${(merchant?.balance || 0).toFixed(0)}`,
//               },
//               {
//                 label: "Profit",
//                 value: `$${(merchant?.totalProfit || 0).toFixed(0)}`,
//               },
//               {
//                 label: "Credit",
//                 value: merchant?.creditScore || 100,
//               },
//             ].map((stat, i) => (
//               <div key={i} className="text-center">
//                 <p className="text-white font-bold text-base">{stat.value}</p>
//                 <p className="text-white/60 text-[10px]">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── MENU SECTIONS ── */}
//       <div className="px-4 -mt-3 space-y-4">
//         {menuItems.map((section) => (
//           <div key={section.section}>
//             <p className="text-gray-400 text-xs font-medium mb-2 px-1">
//               {section.section.toUpperCase()}
//             </p>
//             <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//               {section.items.map((item, i) => (
//                 <button
//                   key={i}
//                   onClick={() => navigate(item.path)}
//                   className="w-full flex items-center gap-3 px-4 py-3.5
//                     border-b border-gray-50 last:border-0
//                     active:bg-gray-50 transition-all text-left"
//                 >
//                   {/* Icon */}
//                   <div
//                     className="w-9 h-9 rounded-xl bg-pink-50
//                     flex items-center justify-center text-lg flex-shrink-0"
//                   >
//                     {item.icon}
//                   </div>

//                   {/* Label */}
//                   <div className="flex-1">
//                     <p className="text-gray-700 text-sm font-medium">
//                       {item.label}
//                     </p>
//                     <p className="text-gray-400 text-[11px] mt-0.5">
//                       {item.sub}
//                     </p>
//                   </div>

//                   {/* Badge if any */}
//                   {item.badge && (
//                     <span
//                       className="text-[10px] px-2 py-0.5 rounded-full
//                       text-white font-bold mr-1"
//                       style={{ background: item.badgeColor }}
//                     >
//                       {item.badge}
//                     </span>
//                   )}

//                   {/* Arrow */}
//                   <span className="text-gray-300">›</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Logout Button */}
//         <button
//           onClick={() => logoutMutation.mutate()}
//           disabled={logoutMutation.isPending}
//           className="w-full py-4 rounded-2xl font-bold text-sm
//             border-2 border-red-100 text-red-400 bg-white
//             active:bg-red-50 transition-all"
//         >
//           {logoutMutation.isPending ? "Logging out..." : "🚪 Logout"}
//         </button>

//         {/* App version */}
//         <p className="text-center text-gray-300 text-xs pb-2">
//           TikTok Shop Merchant v1.0.0
//         </p>
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default Profile;

/////////////////////////======================= latest version (by gemeni) =========================== /////////////////////////

// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { logout } from "../../store/authSlice";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Wallet, Landmark, Copy, Settings, Users,
//   ShieldCheck, HelpCircle, ChevronRight, LogOut, Gem
// } from "lucide-react";

// export default function Profile() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);

//   const handleLogout = async () => {
//     try {
//       await API.post("/auth/logout");
//       dispatch(logout());
//       navigate("/login");
//     } catch (error) {
//       dispatch(logout());
//       navigate("/login");
//     }
//   };

//   const copyInviteCode = () => {
//     // Assuming the backend returns an inviteCode, or we use merchantId
//     navigator.clipboard.writeText(merchant?.merchantId || user?._id);
//     toast.success("Invite Code copied to clipboard!");
//   };

//   const menuGroups = [
//     {
//       title: "Store Management",
//       items: [
//         { label: "Personal Information", icon: <ShieldCheck size={20} color="#3b82f6" />, path: "/profile/personal" },
//         { label: "My Team / Affiliates", icon: <Users size={20} color="#10b981" />, path: "/team" },
//         { label: "Account Settings", icon: <Settings size={20} color="#64748b" />, path: "/profile/settings" },
//       ]
//     },
//     {
//       title: "Support & Security",
//       items: [
//         { label: "Help Center (FAQ)", icon: <HelpCircle size={20} color="#f59e0b" />, path: "/faq" },
//       ]
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col relative" style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "100px" }}>

//       {/* ════════════ SEAMLESS GRADIENT HEADER ════════════ */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           padding: "40px 20px 80px 20px",
//           borderBottomLeftRadius: "32px",
//           borderBottomRightRadius: "32px"
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           {/* Avatar */}
//           <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid rgba(255,255,255,0.3)" }}>
//             {user?.avatar ? (
//               <img src={user.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             ) : (
//               <span style={{ fontSize: "24px", fontWeight: "bold", color: "#f02d65" }}>{user?.username?.[0]?.toUpperCase()}</span>
//             )}
//           </div>

//           {/* User Info */}
//           <div style={{ flex: 1 }}>
//             <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
//               {user?.username || "Merchant"}
//             </h2>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ backgroundColor: "#fbbf24", color: "#78350f", fontSize: "11px", fontWeight: "bold", padding: "2px 8px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
//                 <Gem size={12} /> VIP {merchant?.vipLevel || 0}
//               </span>
//               <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
//                 ID: {merchant?.merchantId}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Invite Code Banner */}
//         <div style={{ marginTop: "24px", backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <div>
//             <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "0 0 4px 0" }}>My Invitation Code</p>
//             <p style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", margin: 0, letterSpacing: "2px" }}>{merchant?.merchantId}</p>
//           </div>
//           <button onClick={copyInviteCode} style={{ background: "#fff", border: "none", borderRadius: "8px", padding: "8px 12px", color: "#f02d65", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
//             <Copy size={14} /> Copy
//           </button>
//         </div>
//       </div>

//       {/* ════════════ OVERLAPPING WALLET CARD ════════════ */}
//       <div style={{ padding: "0 16px", marginTop: "-40px", position: "relative", zIndex: 10 }}>
//         <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>

//           <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
//             <Wallet size={16} color="#94a3b8" /> Available Balance
//           </p>
//           <p style={{ color: "#1e293b", fontSize: "32px", fontWeight: "900", margin: "0 0 20px 0", fontFamily: "monospace" }}>
//             ${(merchant?.balance || 0).toFixed(2)}
//           </p>

//           <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
//             <div style={{ flex: 1 }}>
//               <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 4px 0" }}>Pending Amount</p>
//               <p style={{ color: "#f59e0b", fontSize: "16px", fontWeight: "bold", margin: 0, fontFamily: "monospace" }}>${(merchant?.pendingAmount || 0).toFixed(2)}</p>
//             </div>
//             <div style={{ width: "1px", backgroundColor: "#f1f5f9" }} />
//             <div style={{ flex: 1 }}>
//               <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 4px 0" }}>Total Income</p>
//               <p style={{ color: "#10b981", fontSize: "16px", fontWeight: "bold", margin: 0, fontFamily: "monospace" }}>${(merchant?.totalIncome || 0).toFixed(2)}</p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button onClick={() => navigate("/recharge")} style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)", color: "#fff", fontSize: "14px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)" }}>
//               <Wallet size={16} /> Recharge
//             </button>
//             <button onClick={() => navigate("/withdraw")} style={{ flex: 1, padding: "14px", borderRadius: "12px", backgroundColor: "#fff1f2", color: "#f02d65", fontSize: "14px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
//               <Landmark size={16} /> Withdraw
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ════════════ MENU LISTS ════════════ */}
//       <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "20px" }}>
//         {menuGroups.map((group, idx) => (
//           <div key={idx}>
//             <p style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 12px" }}>
//               {group.title}
//             </p>
//             <div style={{ backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", overflow: "hidden" }}>
//               {group.items.map((item, i) => (
//                 <button
//                   key={i}
//                   onClick={() => navigate(item.path)}
//                   style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", borderBottom: i !== group.items.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer" }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                     <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       {item.icon}
//                     </div>
//                     <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>{item.label}</span>
//                   </div>
//                   <ChevronRight size={18} color="#cbd5e1" />
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           style={{ width: "100%", padding: "16px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #fee2e2", color: "#e11d48", fontSize: "15px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}
//         >
//           <LogOut size={18} /> Secure Logout
//         </button>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

/////////////////////////////// =============================== second version (by gemeni) =====================//////////////////////

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../store/authSlice";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import {
  Wallet,
  Landmark,
  Copy,
  Settings,
  Users,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  LogOut,
  Gem,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(merchant?.merchantId || user?._id);
    toast.success("Invite Code copied to clipboard!");
  };

  // ISSUE #2 FIX: Added the "Submit a Complaint" button here!
  const menuGroups = [
    {
      title: "Store Management",
      items: [
        {
          label: "Personal Information",
          icon: <ShieldCheck size={20} color="#3b82f6" />,
          path: "/profile/personal",
        },
        {
          label: "My Team / Affiliates",
          icon: <Users size={20} color="#10b981" />,
          path: "/team",
        },
        {
          label: "Traffic Tasks",
          icon: <TrendingUp size={20} color="#f97316" />,
          path: "/tasks",
        },
        {
          label: "Account Settings",
          icon: <Settings size={20} color="#64748b" />,
          path: "/profile/settings",
        },
      ],
    },
    {
      title: "Support & Security",
      items: [
        {
          label: "Help Center (FAQ)",
          icon: <HelpCircle size={20} color="#f59e0b" />,
          path: "/faq",
        },
        {
          label: "Submit a Complaint",
          icon: <AlertCircle size={20} color="#e11d48" />,
          path: "/complaint",
        },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "100px" }}
    >
      {/* ════════════ SEAMLESS GRADIENT HEADER ════════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          padding: "40px 20px 80px 20px",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#f02d65",
                }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {user?.username || "Merchant"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  backgroundColor: "#fbbf24",
                  color: "#78350f",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Gem size={12} /> VIP {merchant?.vipLevel || 0}
              </span>
              <span
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
              >
                ID: {merchant?.merchantId}
              </span>
            </div>
          </div>
        </div>

        {/* Invite Code Banner */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "11px",
                margin: "0 0 4px 0",
              }}
            >
              My Invitation Code
            </p>
            <p
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              {merchant?.merchantId}
            </p>
          </div>
          <button
            onClick={copyInviteCode}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "#f02d65",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Copy size={14} /> Copy
          </button>
        </div>
      </div>

      {/* ════════════ OVERLAPPING WALLET CARD ════════════ */}
      <div
        style={{
          padding: "0 16px",
          marginTop: "-40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Wallet size={16} color="#94a3b8" /> Available Balance
          </p>
          <p
            style={{
              color: "#1e293b",
              fontSize: "32px",
              fontWeight: "900",
              margin: "0 0 20px 0",
              fontFamily: "monospace",
            }}
          >
            ${(merchant?.balance || 0).toFixed(2)}
          </p>

          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                Pending Amount
              </p>
              <p
                style={{
                  color: "#f59e0b",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(merchant?.pendingAmount || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ width: "1px", backgroundColor: "#f1f5f9" }} />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                Total Income
              </p>
              <p
                style={{
                  color: "#10b981",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(merchant?.totalIncome || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate("/recharge")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)",
              }}
            >
              <Wallet size={16} /> Recharge
            </button>
            <button
              onClick={() => navigate("/withdraw")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "#fff1f2",
                color: "#f02d65",
                fontSize: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Landmark size={16} /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ════════════ MENU LISTS ════════════ */}
      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "0 0 12px 12px",
              }}
            >
              {group.title}
            </p>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                overflow: "hidden",
              }}
            >
              {group.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    borderBottom:
                      i !== group.items.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      style={{
                        color: "#1e293b",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight size={18} color="#cbd5e1" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #fee2e2",
            color: "#e11d48",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "10px",
          }}
        >
          <LogOut size={18} /> Secure Logout
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
