// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useQuery } from "@tanstack/react-query";
// import { updateMerchant } from "../../store/authSlice";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);

//   // ── Queries ─────────────────────────────────────────────────
//   const { data: storeData, isLoading } = useQuery({
//     queryKey: ["myStore"],
//     queryFn: async () => {
//       const { data } = await API.get("/merchants/my-store");
//       return data;
//     },
//   });
//   useEffect(() => {
//     if (storeData) dispatch(updateMerchant(storeData));
//   }, [storeData]);

//   const { data: financeData } = useQuery({
//     queryKey: ["financeSummary"],
//     queryFn: async () => {
//       const { data } = await API.get("/transactions/financial-statements");
//       return data;
//     },
//   });

//   const { data: faqData } = useQuery({
//     queryKey: ["faqHome"],
//     queryFn: async () => {
//       const { data } = await API.get("/questions");
//       return data;
//     },
//   });

//   // ── Derived ──────────────────────────────────────────────────
//   const store = storeData || merchant;

//   const todayStats = financeData?.statements?.[0];

//   const chartData = financeData?.statements
//     ? [...(financeData.statements || [])]
//         .slice(0, 7)
//         .reverse()
//         .map((s) => ({
//           date: s._id ? s._id.slice(5) : "",
//           sales: parseFloat(s.totalSales) || 0,
//         }))
//     : [];

//   const faqCategories = faqData
//     ? [...new Map(faqData.map((q) => [q.category, q.category])).values()]
//     : [];

//   // Quick actions — 6 items, 3-col grid, black icons
//   const actions = [
//     {
//       label: "Recharge",
//       path: "/recharge",
//       icon: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <rect x="2" y="5" width="20" height="14" rx="2" />
//           <path d="M2 10h20" />
//           <path d="M6 15h4" />
//         </svg>
//       ),
//     },
//     {
//       label: "Withdrawal",
//       path: "/withdraw",
//       icon: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <rect x="2" y="7" width="20" height="14" rx="2" />
//           <path d="M16 3H8l-2 4h12z" />
//           <path d="M12 12v4M10 14h4" />
//         </svg>
//       ),
//     },
//     {
//       label: "Peningkatan VIP",
//       path: "/vip",
//       icon: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <path d="M3 17l3-8 4 5 3-7 4 10H3z" />
//           <circle cx="19" cy="5" r="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Merchant Service",
//       path: "/chat",
//       icon: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//           <path d="M16 11l2 2 4-4" />
//         </svg>
//       ),
//     },
//     {
//       label: "Shop Settings",
//       path: "/profile",
//       icon: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <circle cx="12" cy="12" r="3" />
//           <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
//         </svg>
//       ),
//     },
//     {
//       label: "Sign In",
//       path: "/calendar",
//       icon: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//         >
//           <rect x="3" y="4" width="18" height="18" rx="2" />
//           <path d="M16 2v4M8 2v4M3 10h18" />
//           <path d="M9 16l2 2 4-4" />
//         </svg>
//       ),
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen pb-24 bg-[#f5f5f5] font-sans">
//       {/* ── HEADER ── */}
//       <div className="bg-white px-4 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
//             {store?.storeLogo ? (
//               <img
//                 src={store.storeLogo}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-xl">
//                 🏪
//               </div>
//             )}
//           </div>
//           {/* Name + Stars */}
//           <div>
//             <p className="font-semibold text-gray-900 text-[15px]">
//               {store?.storeName || user?.username}
//             </p>
//             <div className="flex items-center gap-0.5 mt-0.5">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <svg
//                   key={i}
//                   viewBox="0 0 20 20"
//                   className="w-4 h-4"
//                   fill={
//                     i <= Math.round(store?.starRating || 0)
//                       ? "#FBBF24"
//                       : "#D1D5DB"
//                   }
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//               ))}
//             </div>
//           </div>
//         </div>
//         {/* Chat icon */}
//         <button
//           onClick={() => navigate("/chat")}
//           className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center"
//         >
//           <svg
//             viewBox="0 0 24 24"
//             className="w-5 h-5"
//             fill="none"
//             stroke="#333"
//             strokeWidth="1.8"
//           >
//             <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
//             <line x1="9" y1="10" x2="15" y2="10" strokeWidth="1.5" />
//             <line x1="9" y1="14" x2="13" y2="14" strokeWidth="1.5" />
//           </svg>
//         </button>
//       </div>

//       <div className="px-0 space-y-3 mt-3">
//         {/* ── SHOP DATA CARD ── */}
//         <div className="bg-white mx-0 px-4 py-4">
//           {/* Title row */}
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-gray-900 font-semibold text-[15px]">
//               Shop Data
//             </span>
//             <button
//               onClick={() => setExpanded(!expanded)}
//               className="text-gray-400 text-[13px] flex items-center gap-1"
//             >
//               Expand Details
//               <svg
//                 viewBox="0 0 24 24"
//                 className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M6 9l6 6 6-6" />
//               </svg>
//             </button>
//           </div>

//           {/* Total Sales + Total Profit */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <p className="text-gray-900 font-bold text-[20px]">
//                 $ {(store?.totalSales || 0).toFixed(2)}
//               </p>
//               <div className="flex items-center gap-1 mt-0.5">
//                 <svg
//                   viewBox="0 0 24 24"
//                   className="w-3.5 h-3.5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 6v6l4 2" />
//                 </svg>
//                 <span className="text-gray-400 text-[12px]">Total Sales</span>
//               </div>
//             </div>
//             <div>
//               <p className="text-gray-900 font-bold text-[20px]">
//                 $ {(store?.totalProfit || 0).toFixed(2)}
//               </p>
//               <div className="flex items-center gap-1 mt-0.5">
//                 <svg
//                   viewBox="0 0 24 24"
//                   className="w-3.5 h-3.5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <circle cx="12" cy="12" r="10" />
//                   <path d="M12 6v6l4 2" />
//                 </svg>
//                 <span className="text-gray-400 text-[12px]">Total Profit</span>
//               </div>
//             </div>
//           </div>

//           {/* 3 Dark stat boxes */}
//           <div className="grid grid-cols-3 gap-2 mb-2">
//             {[
//               {
//                 label: "Today's Orders Sold",
//                 val: todayStats?.totalOrders ?? 0,
//               },
//               {
//                 label: "Today's Total Sales",
//                 val: (todayStats?.totalSales || 0).toFixed(2),
//               },
//               {
//                 label: "Today's profit forecast",
//                 val: (todayStats?.totalProfit || 0).toFixed(2),
//               },
//             ].map((s, i) => (
//               <div
//                 key={i}
//                 className="bg-gray-900 rounded-lg px-3 py-3 text-center"
//               >
//                 <p className="text-white font-bold text-[15px]">{s.val}</p>
//                 <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">
//                   {s.label}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* 6 Light stat boxes (shown when expanded or always) */}
//           <div className="grid grid-cols-3 gap-2">
//             {[
//               { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
//               { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
//               { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
//               { label: "Shop Followers", val: store?.followers ?? 0 },
//               {
//                 label: "Positive Rating Rate",
//                 val: store?.positiveRatingRate ?? 0,
//               },
//               { label: "Credit Score", val: store?.creditScore ?? 100 },
//             ].map((s, i) => (
//               <div
//                 key={i}
//                 className="border border-gray-100 rounded-lg px-3 py-3 text-center"
//               >
//                 <p className="text-gray-900 font-semibold text-[15px]">
//                   {s.val}
//                 </p>
//                 <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">
//                   {s.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── QUICK ACTIONS ── */}
//         <div className="bg-white px-4 py-5">
//           <div className="grid grid-cols-3 gap-y-6">
//             {actions.map((a, i) => (
//               <button
//                 key={i}
//                 onClick={() => navigate(a.path)}
//                 className="flex flex-col items-center gap-2 active:opacity-70 transition-opacity"
//               >
//                 <div className="text-gray-800">{a.icon}</div>
//                 <span className="text-gray-600 text-[11px] text-center leading-tight">
//                   {a.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── SALES DATA CURVE ── */}
//         <div className="bg-white px-4 py-4">
//           <p className="text-rose-500 font-semibold text-[14px] mb-4">
//             Sales Data Curve
//           </p>
//           <div className="h-[200px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={chartData}
//                 margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
//               >
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#e5e7eb"
//                 />
//                 <XAxis
//                   dataKey="date"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 10, fill: "#9ca3af" }}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 10, fill: "#9ca3af" }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     fontSize: 11,
//                     borderRadius: 8,
//                     border: "1px solid #e5e7eb",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#3b82f6"
//                   strokeWidth={1.5}
//                   dot={{ r: 3, fill: "#3b82f6" }}
//                   activeDot={{ r: 5 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ── FREQUENTLY ASKED QUESTIONS ── */}
//         <div className="bg-white px-4 py-4">
//           <p className="text-rose-500 font-semibold text-[14px] mb-3">
//             Frequently asked questions
//           </p>
//           <div className="divide-y divide-gray-100">
//             {faqCategories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => navigate("/faq")}
//                 className="w-full py-4 flex items-center justify-between active:bg-gray-50"
//               >
//                 <span className="text-gray-700 text-[14px]">{cat}</span>
//                 <svg
//                   viewBox="0 0 24 24"
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M9 18l6-6-6-6" />
//                 </svg>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

////////////////////////// =================== latest version ( by gemeni) =======================////////////////////

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useQuery } from "@tanstack/react-query";
// import { updateMerchant } from "../../store/authSlice";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { ChevronDown, Store, Star, Headset, Wallet, Landmark, Gem, Settings, LogIn, ChevronRight, Loader2, Sparkles, TrendingUp } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);

//   // ── Queries ─────────────────────────────────────────────────
//   const { data: storeData, isLoading } = useQuery({
//     queryKey: ["myStore"],
//     queryFn: async () => {
//       const { data } = await API.get("/merchants/my-store");
//       return data;
//     },
//   });
//   useEffect(() => {
//     if (storeData) dispatch(updateMerchant(storeData));
//   }, [storeData]);

//   const { data: financeData } = useQuery({
//     queryKey: ["financeSummary"],
//     queryFn: async () => {
//       const { data } = await API.get("/transactions/financial-statements");
//       return data;
//     },
//   });

//   const { data: faqData } = useQuery({
//     queryKey: ["faqHome"],
//     queryFn: async () => {
//       const { data } = await API.get("/questions");
//       return data;
//     },
//   });

//   // ── Derived ──────────────────────────────────────────────────
//   const store = storeData || merchant;
//   const todayStats = financeData?.statements?.[0];

//   const chartData = financeData?.statements
//     ? [...(financeData.statements || [])]
//         .slice(0, 7)
//         .reverse()
//         .map((s) => ({
//           date: s._id ? s._id.slice(5) : "",
//           sales: parseFloat(s.totalSales) || 0,
//         }))
//     : [];

//   const faqCategories = faqData
//     ? [...new Map(faqData.map((q) => [q.category, q.category])).values()]
//     : [];

//   const actions = [
//     { label: "Recharge", path: "/recharge", icon: <Wallet size={24} strokeWidth={1.5} /> },
//     { label: "Withdrawal", path: "/withdraw", icon: <Landmark size={24} strokeWidth={1.5} /> },
//     { label: "VIP Upgrade", path: "/vip", icon: <Gem size={24} strokeWidth={1.5} /> },
//     { label: "Customer Service", path: "/chat", icon: <Headset size={24} strokeWidth={1.5} /> },
//     { label: "Shop Settings", path: "/profile", icon: <Settings size={24} strokeWidth={1.5} /> },
//     { label: "Daily Sign In", path: "/calendar", icon: <LogIn size={24} strokeWidth={1.5} /> },
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2 size={32} className="animate-spin text-rose-500" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50" style={{ paddingBottom: "90px" }}>

//       {/* ── HEADER (Profile & Store Info) ── */}
//       <div className="bg-white" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #ffe4e6" }}>
//             {store?.storeLogo ? (
//               <img src={store.storeLogo} className="w-full h-full object-cover" />
//             ) : (
//               <Store size={28} color="#f02d65" />
//             )}
//           </div>
//           <div>
//             <p style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>
//               {store?.storeName || user?.username}
//             </p>
//             <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <Star key={i} size={14} fill={i <= Math.round(store?.starRating || 0) ? "#FBBF24" : "#e5e7eb"} color={i <= Math.round(store?.starRating || 0) ? "#FBBF24" : "#e5e7eb"} />
//               ))}
//             </div>
//           </div>
//         </div>
//         <button onClick={() => navigate("/chat")} style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//           <Headset size={20} color="#4b5563" />
//         </button>
//       </div>

//       <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>

//         {/* ── SHOP DATA CARD ── */}
//         <div className="bg-white" style={{ borderRadius: "16px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
//             <span style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>Shop Performance</span>
//             <button onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "600", color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
//               Expand Details
//               <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
//             </button>
//           </div>

//           {/* Main Financials */}
//           <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
//             <div style={{ flex: 1, padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
//               <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0", fontWeight: "600" }}>Total Sales</p>
//               <p style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", margin: 0, fontFamily: "monospace" }}>${(store?.totalSales || 0).toFixed(2)}</p>
//             </div>
//             <div style={{ flex: 1, padding: "16px", backgroundColor: "#fff1f2", borderRadius: "12px", border: "1px solid #ffe4e6" }}>
//               <p style={{ fontSize: "12px", color: "#e11d48", margin: "0 0 4px 0", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}><Sparkles size={12} /> Total Profit</p>
//               <p style={{ fontSize: "22px", fontWeight: "900", color: "#be123c", margin: 0, fontFamily: "monospace" }}>${(store?.totalProfit || 0).toFixed(2)}</p>
//             </div>
//           </div>

//           {/* Today's Stats (Dark Row) */}
//           <div style={{ display: "flex", gap: "8px", marginBottom: expanded ? "8px" : "0" }}>
//             {[
//               { label: "Today's Orders", val: todayStats?.totalOrders ?? 0 },
//               { label: "Today's Sales", val: `$${(todayStats?.totalSales || 0).toFixed(2)}` },
//               { label: "Today's Profit", val: `$${(todayStats?.totalProfit || 0).toFixed(2)}` },
//             ].map((s, i) => (
//               <div key={i} style={{ flex: 1, backgroundColor: "#1e293b", borderRadius: "10px", padding: "12px 8px", textAlign: "center" }}>
//                 <p style={{ color: "#fff", fontWeight: "bold", fontSize: "15px", margin: "0 0 2px 0" }}>{s.val}</p>
//                 <p style={{ color: "#94a3b8", fontSize: "10px", margin: 0, lineHeight: "1.2" }}>{s.label}</p>
//               </div>
//             ))}
//           </div>

//           {/* Expanded Stats */}
//           {expanded && (
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px" }}>
//               {[
//                 { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
//                 { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
//                 { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
//                 { label: "Followers", val: store?.followers ?? 0 },
//                 { label: "Rating Rate", val: `${store?.positiveRatingRate ?? 0}%` },
//                 { label: "Credit Score", val: store?.creditScore ?? 100 },
//               ].map((s, i) => (
//                 <div key={i} style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", padding: "12px 8px", textAlign: "center" }}>
//                   <p style={{ color: "#334155", fontWeight: "bold", fontSize: "14px", margin: "0 0 2px 0" }}>{s.val}</p>
//                   <p style={{ color: "#64748b", fontSize: "10px", margin: 0, lineHeight: "1.2" }}>{s.label}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── QUICK ACTIONS ── */}
//         <div className="bg-white" style={{ borderRadius: "16px", padding: "20px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
//             {actions.map((a, i) => (
//               <button
//                 key={i}
//                 onClick={() => navigate(a.path)}
//                 style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
//               >
//                 <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", color: "#1f2937", border: "1px solid #f3f4f6" }}>
//                   {a.icon}
//                 </div>
//                 <span style={{ color: "#4b5563", fontSize: "11px", fontWeight: "600", textAlign: "center", lineHeight: "1.2" }}>{a.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── SALES DATA CURVE ── */}
//         <div className="bg-white" style={{ borderRadius: "16px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
//           <p style={{ color: "#1f2937", fontWeight: "bold", fontSize: "15px", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "6px" }}>
//             <TrendingUp size={16} color="#f02d65" /> Sales Performance
//           </p>
//           <div style={{ height: "200px", width: "100%" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
//                 <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
//                 <Line type="monotone" dataKey="sales" stroke="#f02d65" strokeWidth={3} dot={{ r: 4, fill: "#f02d65", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ── FREQUENTLY ASKED QUESTIONS ── */}
//         {faqCategories.length > 0 && (
//           <div className="bg-white" style={{ borderRadius: "16px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
//             <p style={{ color: "#1f2937", fontWeight: "bold", fontSize: "15px", margin: "0 0 12px 0" }}>
//               Support Hub
//             </p>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               {faqCategories.map((cat, idx) => (
//                 <button
//                   key={cat}
//                   onClick={() => navigate("/faq")}
//                   style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", background: "none", border: "none", borderBottom: idx !== faqCategories.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer" }}
//                 >
//                   <span style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>{cat}</span>
//                   <ChevronRight size={16} color="#cbd5e1" />
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>

//       <BottomNav />
//     </div>
//   );
// }

///////////////////////// =========================== section version (by gemeni) ===========/////////////

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useQuery } from "@tanstack/react-query";
// import { updateMerchant } from "../../store/authSlice";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   ChevronDown,
//   Store,
//   Star,
//   Headset,
//   Wallet,
//   Landmark,
//   Gem,
//   Settings,
//   CalendarCheck,
//   Loader2,
//   TrendingUp,
//   ShoppingBag,
//   ShieldCheck,
//   ChevronRight,
// } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);

//   // ── Queries ─────────────────────────────────────────────────
//   const { data: storeData, isLoading } = useQuery({
//     queryKey: ["myStore"],
//     queryFn: async () => {
//       const { data } = await API.get("/merchants/my-store");
//       return data;
//     },
//   });
//   useEffect(() => {
//     if (storeData) dispatch(updateMerchant(storeData));
//   }, [storeData]);

//   const { data: financeData } = useQuery({
//     queryKey: ["financeSummary"],
//     queryFn: async () => {
//       const { data } = await API.get("/transactions/financial-statements");
//       return data;
//     },
//   });

//   const { data: faqData } = useQuery({
//     queryKey: ["faqHome"],
//     queryFn: async () => {
//       const { data } = await API.get("/questions");
//       return data;
//     },
//   });

//   // ── Derived ──────────────────────────────────────────────────
//   const store = storeData || merchant;
//   const todayStats = financeData?.statements?.[0];

//   const chartData = financeData?.statements
//     ? [...(financeData.statements || [])]
//         .slice(0, 7)
//         .reverse()
//         .map((s) => ({
//           date: s._id ? s._id.slice(5) : "",
//           sales: parseFloat(s.totalSales) || 0,
//         }))
//     : [];

//   const faqCategories = faqData
//     ? [...new Map(faqData.map((q) => [q.category, q.category])).values()]
//     : [];

//   // Premium Quick Actions with brand-tinted colors
//   const actions = [
//     {
//       label: "Recharge",
//       path: "/recharge",
//       icon: <Wallet size={28} color="#f02d65" strokeWidth={1.5} />,
//       bg: "#fff1f2",
//     },
//     {
//       label: "Withdraw",
//       path: "/withdraw",
//       icon: <Landmark size={28} color="#ff6b35" strokeWidth={1.5} />,
//       bg: "#fff7ed",
//     },
//     {
//       label: "VIP Upgrade",
//       path: "/vip",
//       icon: <Gem size={28} color="#8b5cf6" strokeWidth={1.5} />,
//       bg: "#f5f3ff",
//     },
//     {
//       label: "Support",
//       path: "/chat",
//       icon: <Headset size={28} color="#0ea5e9" strokeWidth={1.5} />,
//       bg: "#f0f9ff",
//     },
//     {
//       label: "Settings",
//       path: "/profile",
//       icon: <Settings size={28} color="#64748b" strokeWidth={1.5} />,
//       bg: "#f8fafc",
//     },
//     {
//       label: "Attendance",
//       path: "/calendar",
//       icon: <CalendarCheck size={28} color="#10b981" strokeWidth={1.5} />,
//       bg: "#ecfdf5",
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2 size={32} className="animate-spin text-rose-500" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50" style={{ paddingBottom: "90px" }}>
//       {/* ════════════ STICKY TOP BAR ════════════ */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 50,
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           padding: "12px 20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           boxShadow: "0 4px 15px rgba(240, 45, 101, 0.2)",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               padding: "6px",
//               borderRadius: "8px",
//             }}
//           >
//             <ShoppingBag size={18} color="#f02d65" strokeWidth={2.5} />
//           </div>
//           <span
//             style={{
//               color: "#fff",
//               fontWeight: "bold",
//               fontSize: "16px",
//               letterSpacing: "0.5px",
//             }}
//           >
//             TikTok Shop
//           </span>
//         </div>

//         <button
//           onClick={() => navigate("/chat")}
//           style={{
//             width: "36px",
//             height: "36px",
//             borderRadius: "50%",
//             backgroundColor: "rgba(255, 255, 255, 0.2)",
//             backdropFilter: "blur(4px)",
//             border: "1px solid rgba(255, 255, 255, 0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//           }}
//         >
//           <Headset size={18} color="#fff" />
//         </button>
//       </div>

//       {/* ════════════ SEAMLESS HERO SECTION ════════════ */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           padding: "24px 20px 60px 20px", // Extra bottom padding for the overlapping card
//           borderBottomLeftRadius: "24px",
//           borderBottomRightRadius: "24px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <div
//             style={{
//               width: "60px",
//               height: "60px",
//               borderRadius: "50%",
//               backgroundColor: "#fff",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               overflow: "hidden",
//               border: "3px solid rgba(255,255,255,0.4)",
//             }}
//           >
//             {store?.storeLogo ? (
//               <img
//                 src={store.storeLogo}
//                 alt="Logo"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <Store size={30} color="#f02d65" />
//             )}
//           </div>
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 marginBottom: "4px",
//               }}
//             >
//               <h2
//                 style={{
//                   margin: 0,
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   color: "#fff",
//                 }}
//               >
//                 {store?.storeName || user?.username}
//               </h2>
//               <span
//                 style={{
//                   paddingLeft: "3px",
//                   paddingRight: "3px",
//                   paddingTop: "0px",
//                   paddingBottom: "0px",
//                 }}
//                 className=" bg-white rounded-xl  text-[#F3395C]"
//               >
//                 {" "}
//                 vip{" "}
//                 {store?.vipLevel && (
//                   <span
//                     style={{
//                       backgroundColor: "#fbbf24",
//                       color: "#78350f",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                       padding: "2px 6px",
//                       borderRadius: "4px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "2px",
//                     }}
//                   >
//                     <Gem size={10} /> VIP {store.vipLevel}
//                   </span>
//                 )}
//               </span>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <Star
//                   key={i}
//                   size={24}
//                   fill={
//                     i <= Math.round(store?.starRating || 0)
//                       ? "#ffffff"
//                       : "rgba(255,255,255,0.5)"
//                   }
//                   color={
//                     i <= Math.round(store?.starRating || 0)
//                       ? "#FBBF24"
//                       : "transparent"
//                   }
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ════════════ OVERLAPPING FINANCIAL CARD ════════════ */}
//       <div
//         style={{
//           padding: "0 16px",
//           marginTop: "-40px",
//           position: "relative",
//           zIndex: 10,
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "16px",
//             padding: "20px",
//             boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: "16px",
//             }}
//           >
//             <span
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 color: "#1f2937",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//               }}
//             >
//               <ShieldCheck size={20} color="#10b981" /> Financial Overview
//             </span>
//             <button
//               onClick={() => setExpanded(!expanded)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "4px",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 color: "#f02d65",
//                 background: "rgba(240, 45, 101, 0.1)",
//                 border: "none",
//                 padding: "4px 10px",
//                 borderRadius: "20px",
//                 cursor: "pointer",
//               }}
//             >
//               {expanded ? "Less" : "More"}
//               <ChevronDown
//                 size={14}
//                 style={{
//                   transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//                   transition: "transform 0.3s",
//                 }}
//               />
//             </button>
//           </div>

//           <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
//             <div style={{ flex: 1 }}>
//               <p
//                 style={{
//                   fontSize: "14px",
//                   color: "#64748b",
//                   margin: "0 0 4px 0",
//                   fontWeight: "600",
//                 }}
//               >
//                 Total Sales
//               </p>
//               <p
//                 style={{
//                   fontSize: "22px",
//                   fontWeight: "900",
//                   color: "#1e293b",
//                   margin: 0,
//                   fontFamily: "monospace",
//                 }}
//               >
//                 ${(store?.totalSales || 0).toFixed(2)}
//               </p>
//             </div>
//             <div style={{ width: "1px", backgroundColor: "#f1f5f9" }} />
//             <div style={{ flex: 1 }}>
//               <p
//                 style={{
//                   fontSize: "14px",
//                   color: "#64748b",
//                   margin: "0 0 4px 0",
//                   fontWeight: "600",
//                 }}
//               >
//                 Total Profit
//               </p>
//               <p
//                 style={{
//                   fontSize: "22px",
//                   fontWeight: "900",
//                   color: "#f02d65",
//                   margin: 0,
//                   fontFamily: "monospace",
//                 }}
//               >
//                 ${(store?.totalProfit || 0).toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Dark Stats Row */}
//           <div
//             style={{
//               display: "flex",
//               gap: "8px",
//               marginBottom: expanded ? "14px" : "0",
//             }}
//           >
//             {[
//               { label: "Today's Orders", val: todayStats?.totalOrders ?? 0 },
//               {
//                 label: "Today's Sales",
//                 val: `$${(todayStats?.totalSales || 0).toFixed(2)}`,
//               },
//               {
//                 label: "Today's Profit",
//                 val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
//               },
//             ].map((s, i) => (
//               <div
//                 key={i}
//                 style={{
//                   flex: 1,
//                   backgroundColor: "#F3375E",
//                   borderRadius: "10px",
//                   padding: "12px 8px",
//                   textAlign: "center",
//                 }}
//               >
//                 <p
//                   style={{
//                     color: "#fff",
//                     fontWeight: "bold",
//                     fontSize: "20px",
//                     margin: "0 0 4px 0",
//                     fontFamily: "monospace",
//                   }}
//                 >
//                   {s.val}
//                 </p>
//                 <p
//                   style={{
//                     color: "#000",
//                     fontSize: "14px",
//                     margin: 0,
//                     lineHeight: "1.2",
//                     fontWeight: "500",
//                   }}
//                 >
//                   {s.label}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Expanded Secondary Stats */}
//           {expanded && (
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr 1fr",
//                 gap: "8px",
//               }}
//             >
//               {[
//                 { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
//                 { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
//                 { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
//                 { label: "Followers", val: store?.followers ?? 0 },
//                 { label: "Rating", val: `${store?.positiveRatingRate ?? 0}%` },
//                 { label: "Credit Score", val: store?.creditScore ?? 100 },
//               ].map((s, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     border: "1px solid #f1f5f9",
//                     borderRadius: "10px",
//                     padding: "12px 8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "#334155",
//                       fontWeight: "bold",
//                       fontSize: "16px",
//                       margin: "0 0 2px 0",
//                     }}
//                   >
//                     {s.val}
//                   </p>
//                   <p
//                     style={{
//                       color: "#64748b",
//                       fontSize: "12px",
//                       margin: 0,
//                       lineHeight: "1.2",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {s.label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ════════════ QUICK ACTIONS (SaaS Grid) ════════════ */}
//       <div style={{ padding: "16px" }}>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr 1fr",
//             gap: "12px",
//           }}
//         >
//           {actions.map((a, i) => (
//             <button
//               key={i}
//               onClick={() => navigate(a.path)}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "16px",
//                 padding: "16px 8px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: "6px",
//                 border: "none",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
//                 transition: "transform 0.1s",
//               }}
//               onMouseDown={(e) =>
//                 (e.currentTarget.style.transform = "scale(0.95)")
//               }
//               onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             >
//               <div
//                 style={{
//                   width: "48px",
//                   height: "48px",
//                   borderRadius: "16px",
//                   backgroundColor: a.bg,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "26",
//                 }}
//               >
//                 {a.icon}
//               </div>
//               <span
//                 style={{
//                   color: "#4b5563",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                 }}
//               >
//                 {a.label}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ════════════ SALES DATA CURVE ════════════ */}
//       <div style={{ padding: "0 16px 16px 16px" }}>
//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "16px",
//             padding: "20px",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
//           }}
//         >
//           <p
//             style={{
//               color: "#1f2937",
//               fontWeight: "bold",
//               fontSize: "20px",
//               margin: "0 0 20px 0",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             <TrendingUp size={18} color="#f02d65" /> Performance Curve
//           </p>
//           <div style={{ height: "200px", width: "100%", marginLeft: "-10px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#f1f5f9"
//                 />
//                 <XAxis
//                   dataKey="date"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 10, fill: "#94a3b8" }}
//                   dy={10}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 10, fill: "#94a3b8" }}
//                   dx={-10}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     fontSize: 12,
//                     borderRadius: 12,
//                     border: "none",
//                     boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                     fontWeight: "bold",
//                     color: "#1e293b",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="url(#colorUv)"
//                   strokeWidth={4}
//                   dot={{
//                     r: 4,
//                     fill: "#f02d65",
//                     strokeWidth: 2,
//                     stroke: "#fff",
//                   }}
//                   activeDot={{
//                     r: 6,
//                     fill: "#f02d65",
//                     stroke: "#fff",
//                     strokeWidth: 3,
//                   }}
//                 />
//                 <defs>
//                   <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
//                     <stop offset="0%" stopColor="#f02d65" />
//                     <stop offset="100%" stopColor="#ff6b35" />
//                   </linearGradient>
//                 </defs>
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ════════════ SUPPORT / FAQ HUB ════════════ */}
//       {faqCategories.length > 0 && (
//         <div style={{ padding: "0 16px 24px 16px" }}>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "16px",
//               padding: "20px",
//               boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
//             }}
//           >
//             <p
//               style={{
//                 color: "#1f2937",
//                 fontWeight: "bold",
//                 fontSize: "20px",
//                 margin: "0 0 12px 0",
//               }}
//             >
//               Platform Guidelines
//             </p>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               {faqCategories.map((cat, idx) => (
//                 <button
//                   key={cat}
//                   onClick={() => navigate("/faq")}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     padding: "10px 0",
//                     background: "none",
//                     border: "none",
//                     borderBottom:
//                       idx !== faqCategories.length - 1
//                         ? "1px solid #f1f5f9"
//                         : "none",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <span
//                     style={{
//                       color: "#475569",
//                       fontSize: "16px",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {cat}
//                   </span>
//                   <ChevronRight size={18} color="#cbd5e1" />
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <BottomNav />
//     </div>
//   );
// }

///////////////////====================== secode version (by gemeni) ===================== //////////////////////
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { updateMerchant } from "../../store/authSlice";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  Store,
  Star,
  Headset,
  Wallet,
  Landmark,
  Gem,
  Settings,
  CalendarCheck,
  Loader2,
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);
  const [expanded, setExpanded] = useState(false);

  // ── Queries ─────────────────────────────────────────────────
  const { data: storeData, isLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: async () => {
      const { data } = await API.get("/merchants/my-store");
      return data;
    },
  });
  useEffect(() => {
    if (storeData) dispatch(updateMerchant(storeData));
  }, [storeData]);

  const { data: financeData } = useQuery({
    queryKey: ["financeSummary"],
    queryFn: async () => {
      const { data } = await API.get("/transactions/financial-statements");
      return data;
    },
  });

  const { data: faqData } = useQuery({
    queryKey: ["faqHome"],
    queryFn: async () => {
      const { data } = await API.get("/questions");
      return data;
    },
  });

  // ── Derived ──────────────────────────────────────────────────
  const store = storeData || merchant;
  const todayStats = financeData?.statements?.[0];

  const chartData = financeData?.statements
    ? [...(financeData.statements || [])]
        .slice(0, 7)
        .reverse()
        .map((s) => ({
          date: s._id ? s._id.slice(5) : "",
          sales: parseFloat(s.totalSales) || 0,
        }))
    : [];

  // FIX FOR ISSUE #1: Get top 5 questions (using correct backend schema)
  const topQuestions = faqData
    ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
    : [];

  // Premium Quick Actions with brand-tinted colors
  const actions = [
    {
      label: "Recharge",
      path: "/recharge",
      icon: <Wallet size={28} color="#f02d65" strokeWidth={1.5} />,
      bg: "#fff1f2",
    },
    {
      label: "Withdraw",
      path: "/withdraw",
      icon: <Landmark size={28} color="#ff6b35" strokeWidth={1.5} />,
      bg: "#fff7ed",
    },
    {
      label: "VIP Upgrade",
      path: "/vip",
      icon: <Gem size={28} color="#8b5cf6" strokeWidth={1.5} />,
      bg: "#f5f3ff",
    },
    {
      label: "Support",
      path: "/chat",
      icon: <Headset size={28} color="#0ea5e9" strokeWidth={1.5} />,
      bg: "#f0f9ff",
    },
    {
      label: "Settings",
      path: "/profile",
      icon: <Settings size={28} color="#64748b" strokeWidth={1.5} />,
      bg: "#f8fafc",
    },
    {
      label: "Attendance",
      path: "/calendar",
      icon: <CalendarCheck size={28} color="#10b981" strokeWidth={1.5} />,
      bg: "#ecfdf5",
    },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-rose-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: "90px" }}>
      {/* ════════════ STICKY TOP BAR ════════════ */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 15px rgba(240, 45, 101, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            <ShoppingBag size={18} color="#f02d65" strokeWidth={2.5} />
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "0.5px",
            }}
          >
            TikTok Shop
          </span>
        </div>

        <button
          onClick={() => navigate("/chat")}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Headset size={18} color="#fff" />
        </button>
      </div>

      {/* ════════════ SEAMLESS HERO SECTION ════════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          padding: "24px 20px 60px 20px", // Extra bottom padding for the overlapping card
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.4)",
            }}
          >
            {store?.storeLogo ? (
              <img
                src={store.storeLogo}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Store size={30} color="#f02d65" />
            )}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {store?.storeName || user?.username}
              </h2>
              <span
                style={{
                  paddingLeft: "3px",
                  paddingRight: "3px",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                }}
                className=" bg-white rounded-xl  text-[#F3395C]"
              >
                {" "}
                vip{" "}
                {store?.vipLevel && (
                  <span
                    style={{
                      backgroundColor: "#fbbf24",
                      color: "#78350f",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <Gem size={10} /> VIP {store.vipLevel}
                  </span>
                )}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={24}
                  fill={
                    i <= Math.round(store?.starRating || 0)
                      ? "#ffffff"
                      : "rgba(255,255,255,0.5)"
                  }
                  color={
                    i <= Math.round(store?.starRating || 0)
                      ? "#FBBF24"
                      : "transparent"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ OVERLAPPING FINANCIAL CARD ════════════ */}
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
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ShieldCheck size={20} color="#10b981" /> Financial Overview
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#f02d65",
                background: "rgba(240, 45, 101, 0.1)",
                border: "none",
                padding: "4px 10px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              {expanded ? "Less" : "More"}
              <ChevronDown
                size={14}
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </button>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontWeight: "600",
                }}
              >
                Total Sales
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  color: "#1e293b",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(store?.totalSales || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ width: "1px", backgroundColor: "#f1f5f9" }} />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontWeight: "600",
                }}
              >
                Total Profit
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  color: "#f02d65",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(store?.totalProfit || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Dark Stats Row */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: expanded ? "14px" : "0",
            }}
          >
            {[
              { label: "Today's Orders", val: todayStats?.totalOrders ?? 0 },
              {
                label: "Today's Sales",
                val: `$${(todayStats?.totalSales || 0).toFixed(2)}`,
              },
              {
                label: "Today's Profit",
                val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: "#F3375E",
                  borderRadius: "10px",
                  padding: "12px 8px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    margin: "0 0 4px 0",
                    fontFamily: "monospace",
                  }}
                >
                  {s.val}
                </p>
                <p
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: "1.2",
                    fontWeight: "500",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Expanded Secondary Stats */}
          {expanded && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
              }}
            >
              {[
                { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
                { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
                { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
                { label: "Followers", val: store?.followers ?? 0 },
                { label: "Rating", val: `${store?.positiveRatingRate ?? 0}%` },
                { label: "Credit Score", val: store?.creditScore ?? 100 },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: "10px",
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#334155",
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: "0 0 2px 0",
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      margin: 0,
                      lineHeight: "1.2",
                      fontWeight: "500",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════════ QUICK ACTIONS (SaaS Grid) ════════════ */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "16px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  backgroundColor: a.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26",
                }}
              >
                {a.icon}
              </div>
              <span
                style={{
                  color: "#4b5563",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ════════════ SALES DATA CURVE ════════════ */}
      <div style={{ padding: "0 16px 16px 16px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          }}
        >
          <p
            style={{
              color: "#1f2937",
              fontWeight: "bold",
              fontSize: "20px",
              margin: "0 0 20px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <TrendingUp size={18} color="#f02d65" /> Performance Curve
          </p>
          <div style={{ height: "200px", width: "100%", marginLeft: "-10px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="url(#colorUv)"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#f02d65",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#f02d65",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f02d65" />
                    <stop offset="100%" stopColor="#ff6b35" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ════════════ FIX FOR ISSUE #1: FAQ LIST ════════════ */}
      {topQuestions.length > 0 && (
        <div style={{ padding: "0 16px 24px 16px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
          >
            <p
              style={{
                color: "#1f2937",
                fontWeight: "bold",
                fontSize: "20px",
                margin: "0 0 12px 0",
              }}
            >
              Platform Guidelines
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* NOW IT USES q.title BASED ON YOUR BACKEND SCHEMA */}
              {topQuestions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => navigate(`/faq/${q._id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    background: "none",
                    border: "none",
                    borderBottom:
                      idx !== topQuestions.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "16px",
                      fontWeight: "500",
                      textAlign: "left",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      paddingRight: "16px",
                    }}
                  >
                    {q.title}
                  </span>
                  <ChevronRight
                    size={18}
                    color="#cbd5e1"
                    style={{ flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>
            {/* View All Button */}
            <button
              onClick={() => navigate("/faq")}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "12px",
                border: "1px solid #f1f5f9",
                borderRadius: "12px",
                background: "none",
                color: "#f02d65",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View All Guides
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
