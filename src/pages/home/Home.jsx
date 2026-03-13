// /////////////////////////// ==================  offer section added in homepage /////////////// =================

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
//   X,
//   Zap,
// } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);
//   const [offerDismissed, setOfferDismissed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState("");

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

//   const { data: offerData } = useQuery({
//     queryKey: ["activeOffer"],
//     queryFn: async () => {
//       const { data } = await API.get("/offers/active");
//       return data.offer || null;
//     },
//     refetchInterval: 60000,
//   });

//   // ── Countdown timer ──────────────────────────────────────────
//   useEffect(() => {
//     if (!offerData) return;
//     const tick = () => {
//       const diff = new Date(offerData.endTime) - new Date();
//       if (diff <= 0) {
//         setTimeLeft("Expired");
//         return;
//       }
//       const h = Math.floor(diff / 3600000);
//       const m = Math.floor((diff % 3600000) / 60000);
//       const s = Math.floor((diff % 60000) / 1000);
//       setTimeLeft(
//         `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [offerData]);

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

//   const topQuestions = faqData
//     ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
//     : [];

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

//   const showOffer = offerData && !offerDismissed;

//   return (
//     <div className="min-h-screen bg-gray-50" style={{ paddingBottom: "90px" }}>
//       {/* ════════ STICKY TOP BAR ════════ */}
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
//           boxShadow: "0 4px 15px rgba(240,45,101,0.2)",
//         }}
//       >
//         {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
//         </div> */}

//         <div className="flex items-center">
//           {/* {step === 2 && (
//               <ArrowLeft
//                 size={20}
//                 className="mr-3 cursor-pointer text-gray-800 hover:text-gray-600"
//                 onClick={() => setStep(1)}
//               />
//             )} */}
//           {/* ✅ NEW: Using the exact uploaded logo image */}
//           <img
//             src="/demo_logo.png"
//             alt="TikTok Shop"
//             className="h-10 object-contain" // Adjusted height to match demo top bar
//           />
//         </div>

//         <button
//           onClick={() => navigate("/chat")}
//           style={{
//             width: "36px",
//             height: "36px",
//             borderRadius: "50%",
//             backgroundColor: "rgba(255,255,255,0.2)",
//             backdropFilter: "blur(4px)",
//             border: "1px solid rgba(255,255,255,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//           }}
//         >
//           <Headset size={18} color="#fff" />
//         </button>
//       </div>

//       {/* ════════ HERO SECTION ════════ */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           padding: "24px 20px 60px 20px",
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
//                 style={{ paddingLeft: "3px", paddingRight: "3px" }}
//                 className="bg-white rounded-xl text-[#F3395C]"
//               >
//                 vip
//                 {store?.vipLevel && (
//                   <span
//                     style={{
//                       backgroundColor: "#fbbf24",
//                       color: "#78350f",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                       padding: "2px 6px",
//                       borderRadius: "4px",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "2px",
//                       marginLeft: "2px",
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

//       {/* ════════ OFFER BANNER ════════ */}
//       {showOffer && (
//         <div
//           style={{
//             padding: "12px 16px 0 16px",
//             position: "relative",
//             zIndex: 5,
//           }}
//         >
//           <style>{`@keyframes shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>
//           <div
//             style={{
//               borderRadius: "16px",
//               overflow: "hidden",
//               background:
//                 "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
//               boxShadow: "0 8px 32px rgba(240,45,101,0.35)",
//               position: "relative",
//             }}
//           >
//             {/* Glowing orbs */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: "-20px",
//                 right: "-20px",
//                 width: "100px",
//                 height: "100px",
//                 borderRadius: "50%",
//                 background:
//                   "radial-gradient(circle, rgba(240,45,101,0.4) 0%, transparent 70%)",
//                 pointerEvents: "none",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "-10px",
//                 left: "30px",
//                 width: "60px",
//                 height: "60px",
//                 borderRadius: "50%",
//                 background:
//                   "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)",
//                 pointerEvents: "none",
//               }}
//             />

//             <div style={{ padding: "16px 20px", position: "relative" }}>
//               {/* Badge row */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "8px" }}
//                 >
//                   <div
//                     style={{
//                       backgroundColor: "#f02d65",
//                       borderRadius: "6px",
//                       padding: "3px 10px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "4px",
//                     }}
//                   >
//                     <Zap size={11} color="#fff" fill="#fff" />
//                     <span
//                       style={{
//                         color: "#fff",
//                         fontSize: "10px",
//                         fontWeight: "900",
//                         letterSpacing: "1px",
//                       }}
//                     >
//                       {offerData.badgeText || "LIMITED OFFER"}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       backgroundColor: "rgba(255,255,255,0.08)",
//                       borderRadius: "6px",
//                       padding: "3px 10px",
//                       border: "1px solid rgba(255,255,255,0.12)",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#fbbf24",
//                         fontSize: "16px",
//                         fontWeight: "bold",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       ⏱ {timeLeft}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setOfferDismissed(true)}
//                   style={{
//                     background: "rgba(255,255,255,0.1)",
//                     border: "none",
//                     borderRadius: "50%",
//                     width: "24px",
//                     height: "24px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <X size={13} color="rgba(255,255,255,0.7)" />
//                 </button>
//               </div>

//               {/* Content row: text + image + bonus pill */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: "12px",
//                 }}
//               >
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <h3
//                     style={{
//                       color: "#fff",
//                       fontSize: "16px",
//                       fontWeight: "900",
//                       margin: "0 0 4px 0",
//                       lineHeight: "1.2",
//                     }}
//                   >
//                     {offerData.title}
//                   </h3>
//                   {offerData.description && (
//                     <p
//                       style={{
//                         color: "rgba(255,255,255,0.6)",
//                         fontSize: "12px",
//                         margin: 0,
//                         lineHeight: "1.4",
//                       }}
//                     >
//                       {offerData.description}
//                     </p>
//                   )}
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {/* Banner image thumbnail */}
//                   {offerData.bannerImage && (
//                     <img
//                       src={offerData.bannerImage}
//                       alt="offer"
//                       style={{
//                         width: "70px",
//                         height: "70px",
//                         objectFit: "cover",
//                         borderRadius: "12px",
//                         border: "2px solid rgba(255,255,255,0.2)",
//                         flexShrink: 0,
//                       }}
//                     />
//                   )}
//                   {/* Bonus pill */}
//                   {offerData.discountPercent > 0 && (
//                     <div
//                       style={{
//                         width: "64px",
//                         height: "64px",
//                         borderRadius: "50%",
//                         background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         boxShadow: "0 4px 15px rgba(240,45,101,0.5)",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "#fff",
//                           fontSize: "18px",
//                           fontWeight: "900",
//                           lineHeight: "1",
//                         }}
//                       >
//                         +{offerData.discountPercent}%
//                       </span>
//                       <span
//                         style={{
//                           color: "rgba(255,255,255,0.8)",
//                           fontSize: "9px",
//                           fontWeight: "bold",
//                           letterSpacing: "0.5px",
//                         }}
//                       >
//                         BONUS
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Shimmer bar */}
//               <div
//                 style={{
//                   marginTop: "12px",
//                   height: "3px",
//                   borderRadius: "2px",
//                   background:
//                     "linear-gradient(90deg, #f02d65, #ff6b35, #fbbf24, #f02d65)",
//                   backgroundSize: "200% 100%",
//                   animation: "shimmer 2s linear infinite",
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ════════ FINANCIAL CARD ════════ */}
//       <div
//         style={{
//           padding: "0 16px",
//           marginTop: showOffer ? "16px" : "-40px",
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
//                 background: "rgba(240,45,101,0.1)",
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

//       {/* ════════ QUICK ACTIONS ════════ */}
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

//       {/* ════════ SALES CHART ════════ */}
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

//       {/* ════════ FAQ LIST ════════ */}
//       {topQuestions.length > 0 && (
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
//               {topQuestions.map((q, idx) => (
//                 <button
//                   key={q._id}
//                   onClick={() => navigate(`/faq/${q._id}`)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     padding: "10px 0",
//                     background: "none",
//                     border: "none",
//                     borderBottom:
//                       idx !== topQuestions.length - 1
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
//                       textAlign: "left",
//                       display: "-webkit-box",
//                       WebkitLineClamp: 1,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                       paddingRight: "16px",
//                     }}
//                   >
//                     {q.title}
//                   </span>
//                   <ChevronRight
//                     size={18}
//                     color="#cbd5e1"
//                     style={{ flexShrink: 0 }}
//                   />
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => navigate("/faq")}
//               style={{
//                 width: "100%",
//                 marginTop: "12px",
//                 padding: "12px",
//                 border: "1px solid #f1f5f9",
//                 borderRadius: "12px",
//                 background: "none",
//                 color: "#f02d65",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//               }}
//             >
//               View All Guides
//             </button>
//           </div>
//         </div>
//       )}

//       <BottomNav />
//     </div>
//   );
// }

///////////////////================================= lates 2 version of Home ========================///////////////

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
//   ShieldCheck,
//   ChevronRight,
//   X,
//   Zap,
// } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);
//   const [offerDismissed, setOfferDismissed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState("");

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
//   }, [storeData, dispatch]); // Added dispatch to deps to be perfectly safe

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

//   const { data: offerData } = useQuery({
//     queryKey: ["activeOffer"],
//     queryFn: async () => {
//       const { data } = await API.get("/offers/active");
//       return data.offer || null;
//     },
//     refetchInterval: 60000,
//   });

//   // ── Countdown timer ──────────────────────────────────────────
//   useEffect(() => {
//     if (!offerData) return;
//     const tick = () => {
//       const diff = new Date(offerData.endTime) - new Date();
//       if (diff <= 0) {
//         setTimeLeft("Expired");
//         return;
//       }
//       const h = Math.floor(diff / 3600000);
//       const m = Math.floor((diff % 3600000) / 60000);
//       const s = Math.floor((diff % 60000) / 1000);
//       setTimeLeft(
//         `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [offerData]);

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

//   const topQuestions = faqData
//     ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
//     : [];

//   // Updated to match the new unified Teal design language
//   const actions = [
//     {
//       label: "Recharge",
//       path: "/recharge",
//       icon: <Wallet size={24} color="#018784" strokeWidth={1.5} />,
//     },
//     {
//       label: "Withdraw",
//       path: "/withdraw",
//       icon: <Landmark size={24} color="#018784" strokeWidth={1.5} />,
//     },
//     {
//       label: "VIP Upgrade",
//       path: "/vip",
//       icon: <Gem size={24} color="#018784" strokeWidth={1.5} />,
//     },
//     {
//       label: "Support",
//       path: "/chat",
//       icon: <Headset size={24} color="#018784" strokeWidth={1.5} />,
//     },
//     {
//       label: "Settings",
//       path: "/profile",
//       icon: <Settings size={24} color="#018784" strokeWidth={1.5} />,
//     },
//     {
//       label: "Attendance",
//       path: "/calendar",
//       icon: <CalendarCheck size={24} color="#018784" strokeWidth={1.5} />,
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen bg-gray-100 w-full relative flex justify-center items-center">
//         <Loader2 size={32} className="animate-spin text-[#018784]" />
//       </div>
//     );

//   const showOffer = offerData && !offerDismissed;

//   return (
//     // ── Outer Desktop Wrapper ──
//     <div className="min-h-screen w-full relative flex justify-center bg-gray-100">

//       {/* ── Inner Mobile App Container ── */}
//       <div
//         className="w-full flex flex-col bg-white overflow-x-hidden relative"
//         style={{ maxWidth: "480px", minHeight: "100vh", paddingBottom: "90px" }}
//       >
//         {/* ════════ STICKY TOP BAR ════════ */}
//         <div
//           style={{
//             position: "sticky",
//             top: 0,
//             zIndex: 50,
//             backgroundColor: "#ffffff",
//             padding: "16px 20px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             borderBottom: "1px solid #e5e7eb",
//           }}
//         >
//           <div className="flex items-center gap-3">
//             <img
//               src="/demo_logo.png"
//               alt="TikTok Shop"
//               className="h-8 object-contain"
//             />
//             <div className="w-[1px] h-4 bg-gray-300"></div>
//             <span className="text-[14px] font-semibold text-[#121212] tracking-tight">
//               Seller Center
//             </span>
//           </div>

//           <button
//             onClick={() => navigate("/chat")}
//             style={{
//               width: "32px",
//               height: "32px",
//               borderRadius: "50%",
//               backgroundColor: "#f9fafb",
//               border: "1px solid #e5e7eb",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <Headset size={16} color="#018784" />
//           </button>
//         </div>

//         {/* ════════ HERO SECTION (CLEAN FLAT DESIGN) ════════ */}
//         <div style={{ padding: "24px 20px", backgroundColor: "#ffffff" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//             <div
//               style={{
//                 width: "64px",
//                 height: "64px",
//                 borderRadius: "50%",
//                 backgroundColor: "#f9fafb",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 overflow: "hidden",
//                 border: "1px solid #e5e7eb",
//               }}
//             >
//               {store?.storeLogo ? (
//                 <img
//                   src={store.storeLogo}
//                   alt="Logo"
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               ) : (
//                 <Store size={28} color="#9ca3af" />
//               )}
//             </div>
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   marginBottom: "4px",
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: 0,
//                     fontSize: "18px",
//                     fontWeight: "bold",
//                     color: "#121212",
//                   }}
//                 >
//                   {store?.storeName || user?.username}
//                 </h2>
//                 {store?.vipLevel !== undefined && (
//                   <span
//                     style={{
//                       backgroundColor: "rgba(1,135,132,0.1)",
//                       color: "#018784",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                       padding: "2px 6px",
//                       borderRadius: "4px",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "2px",
//                       border: "1px solid rgba(1,135,132,0.2)",
//                     }}
//                   >
//                     <Gem size={10} /> VIP {store.vipLevel}
//                   </span>
//                 )}
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     fill={
//                       i <= Math.round(store?.starRating || 0)
//                         ? "#FBBF24"
//                         : "#f3f4f6"
//                     }
//                     color={
//                       i <= Math.round(store?.starRating || 0)
//                         ? "#FBBF24"
//                         : "#e5e7eb"
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ════════ OFFER BANNER (RE-THEMED) ════════ */}
//         {showOffer && (
//           <div style={{ padding: "0 20px 16px 20px" }}>
//             <style>{`@keyframes shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>
//             <div
//               style={{
//                 borderRadius: "8px",
//                 overflow: "hidden",
//                 background: "linear-gradient(135deg, #015b59 0%, #018784 100%)",
//                 position: "relative",
//               }}
//             >
//               <div style={{ padding: "16px 20px", position: "relative" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <div
//                       style={{
//                         backgroundColor: "#fff",
//                         borderRadius: "4px",
//                         padding: "3px 8px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "4px",
//                       }}
//                     >
//                       <Zap size={11} color="#018784" fill="#018784" />
//                       <span
//                         style={{
//                           color: "#018784",
//                           fontSize: "10px",
//                           fontWeight: "900",
//                           letterSpacing: "1px",
//                         }}
//                       >
//                         {offerData.badgeText || "LIMITED OFFER"}
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         backgroundColor: "rgba(0,0,0,0.15)",
//                         borderRadius: "4px",
//                         padding: "3px 8px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "#fff",
//                           fontSize: "14px",
//                           fontWeight: "bold",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         ⏱ {timeLeft}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setOfferDismissed(true)}
//                     style={{
//                       background: "rgba(255,255,255,0.1)",
//                       border: "none",
//                       borderRadius: "50%",
//                       width: "24px",
//                       height: "24px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <X size={13} color="rgba(255,255,255,0.9)" />
//                   </button>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     gap: "12px",
//                   }}
//                 >
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <h3
//                       style={{
//                         color: "#fff",
//                         fontSize: "16px",
//                         fontWeight: "800",
//                         margin: "0 0 4px 0",
//                         lineHeight: "1.2",
//                       }}
//                     >
//                       {offerData.title}
//                     </h3>
//                     {offerData.description && (
//                       <p
//                         style={{
//                           color: "rgba(255,255,255,0.8)",
//                           fontSize: "12px",
//                           margin: 0,
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         {offerData.description}
//                       </p>
//                     )}
//                   </div>

//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       flexShrink: 0,
//                     }}
//                   >
//                     {offerData.bannerImage && (
//                       <img
//                         src={offerData.bannerImage}
//                         alt="offer"
//                         style={{
//                           width: "64px",
//                           height: "64px",
//                           objectFit: "cover",
//                           borderRadius: "6px",
//                           border: "2px solid rgba(255,255,255,0.3)",
//                         }}
//                       />
//                     )}
//                     {offerData.discountPercent > 0 && (
//                       <div
//                         style={{
//                           width: "56px",
//                           height: "56px",
//                           borderRadius: "50%",
//                           background: "#fff",
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#018784",
//                             fontSize: "16px",
//                             fontWeight: "900",
//                             lineHeight: "1",
//                           }}
//                         >
//                           +{offerData.discountPercent}%
//                         </span>
//                         <span
//                           style={{
//                             color: "#4b5563",
//                             fontSize: "9px",
//                             fontWeight: "bold",
//                             letterSpacing: "0.5px",
//                             marginTop: "2px"
//                           }}
//                         >
//                           BONUS
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Shimmer bar */}
//                 <div
//                   style={{
//                     marginTop: "12px",
//                     height: "3px",
//                     borderRadius: "2px",
//                     background:
//                       "linear-gradient(90deg, rgba(255,255,255,0.2), #ffffff, rgba(255,255,255,0.2))",
//                     backgroundSize: "200% 100%",
//                     animation: "shimmer 2s linear infinite",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ════════ FINANCIAL CARD (CLEAN FLAT DESIGN) ════════ */}
//         <div style={{ padding: "0 20px", marginBottom: "16px" }}>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "20px",
//               border: "1px solid #e5e7eb",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "16px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   color: "#121212",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                 }}
//               >
//                 <ShieldCheck size={18} color="#018784" /> Financial Overview
//               </span>
//               <button
//                 onClick={() => setExpanded(!expanded)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "4px",
//                   fontSize: "12px",
//                   fontWeight: "600",
//                   color: "#4b5563",
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 {expanded ? "Less" : "More"}
//                 <ChevronDown
//                   size={14}
//                   style={{
//                     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//                     transition: "transform 0.3s",
//                   }}
//                 />
//               </button>
//             </div>

//             <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
//               <div style={{ flex: 1 }}>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#64748b",
//                     margin: "0 0 4px 0",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Total Sales
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "bold",
//                     color: "#121212",
//                     margin: 0,
//                   }}
//                 >
//                   ${(store?.totalSales || 0).toFixed(2)}
//                 </p>
//               </div>
//               <div style={{ width: "1px", backgroundColor: "#e5e7eb" }} />
//               <div style={{ flex: 1 }}>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#64748b",
//                     margin: "0 0 4px 0",
//                     fontWeight: "500",
//                   }}
//                 >
//                   Total Profit
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "bold",
//                     color: "#018784", // Accent color for profit
//                     margin: 0,
//                   }}
//                 >
//                   ${(store?.totalProfit || 0).toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 gap: "8px",
//                 marginBottom: expanded ? "14px" : "0",
//               }}
//             >
//               {[
//                 { label: "Today's Orders", val: todayStats?.totalOrders ?? 0 },
//                 {
//                   label: "Today's Sales",
//                   val: `$${(todayStats?.totalSales || 0).toFixed(2)}`,
//                 },
//                 {
//                   label: "Today's Profit",
//                   val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
//                 },
//               ].map((s, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#f9fafb",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "6px",
//                     padding: "10px 6px",
//                     textAlign: "center",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "#121212",
//                       fontWeight: "bold",
//                       fontSize: "16px",
//                       margin: "0 0 2px 0",
//                     }}
//                   >
//                     {s.val}
//                   </p>
//                   <p
//                     style={{
//                       color: "#4b5563",
//                       fontSize: "11px",
//                       margin: 0,
//                       fontWeight: "500",
//                     }}
//                   >
//                     {s.label}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {expanded && (
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr 1fr",
//                   gap: "8px",
//                 }}
//               >
//                 {[
//                   { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
//                   { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
//                   { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
//                   { label: "Followers", val: store?.followers ?? 0 },
//                   { label: "Rating", val: `${store?.positiveRatingRate ?? 0}%` },
//                   { label: "Credit Score", val: store?.creditScore ?? 100 },
//                 ].map((s, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       backgroundColor: "#f9fafb",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "6px",
//                       padding: "10px 6px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <p
//                       style={{
//                         color: "#121212",
//                         fontWeight: "bold",
//                         fontSize: "14px",
//                         margin: "0 0 2px 0",
//                       }}
//                     >
//                       {s.val}
//                     </p>
//                     <p
//                       style={{
//                         color: "#64748b",
//                         fontSize: "10px",
//                         margin: 0,
//                         fontWeight: "500",
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ════════ QUICK ACTIONS (CLEAN GRID) ════════ */}
//         <div style={{ padding: "0 20px 20px 20px" }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr",
//               gap: "10px",
//             }}
//           >
//             {actions.map((a, i) => (
//               <button
//                 key={i}
//                 onClick={() => navigate(a.path)}
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "8px",
//                   padding: "16px 8px",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: "8px",
//                   border: "1px solid #e5e7eb",
//                   cursor: "pointer",
//                   transition: "background-color 0.1s",
//                 }}
//                 onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
//                 onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
//               >
//                 <div
//                   style={{
//                     width: "44px",
//                     height: "44px",
//                     borderRadius: "50%",
//                     backgroundColor: "rgba(1,135,132,0.06)", // Faint Teal Circle
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   {a.icon}
//                 </div>
//                 <span
//                   style={{
//                     color: "#4b5563",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   {a.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ════════ SALES CHART ════════ */}
//         <div style={{ padding: "0 20px 20px 20px" }}>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "20px",
//               border: "1px solid #e5e7eb",
//             }}
//           >
//             <p
//               style={{
//                 color: "#121212",
//                 fontWeight: "bold",
//                 fontSize: "16px",
//                 margin: "0 0 20px 0",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//               }}
//             >
//               <TrendingUp size={18} color="#018784" /> Performance Curve
//             </p>
//             <div style={{ height: "200px", width: "100%", marginLeft: "-15px" }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#e5e7eb"
//                   />
//                   <XAxis
//                     dataKey="date"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 10, fill: "#6b7280" }}
//                     dy={10}
//                   />
//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 10, fill: "#6b7280" }}
//                     dx={-10}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       fontSize: 12,
//                       borderRadius: 6,
//                       border: "1px solid #e5e7eb",
//                       boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                       fontWeight: "bold",
//                       color: "#121212",
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="sales"
//                     stroke="#018784" // Changed to Teal
//                     strokeWidth={3}
//                     dot={{
//                       r: 4,
//                       fill: "#018784",
//                       strokeWidth: 2,
//                       stroke: "#fff",
//                     }}
//                     activeDot={{
//                       r: 6,
//                       fill: "#018784",
//                       stroke: "#fff",
//                       strokeWidth: 2,
//                     }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* ════════ FAQ LIST ════════ */}
//         {topQuestions.length > 0 && (
//           <div style={{ padding: "0 20px 24px 20px" }}>
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "8px",
//                 padding: "20px",
//                 border: "1px solid #e5e7eb",
//               }}
//             >
//               <p
//                 style={{
//                   color: "#121212",
//                   fontWeight: "bold",
//                   fontSize: "16px",
//                   margin: "0 0 12px 0",
//                 }}
//               >
//                 Platform Guidelines
//               </p>
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 {topQuestions.map((q, idx) => (
//                   <button
//                     key={q._id}
//                     onClick={() => navigate(`/faq/${q._id}`)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "12px 0",
//                       background: "none",
//                       border: "none",
//                       borderBottom:
//                         idx !== topQuestions.length - 1
//                           ? "1px solid #f3f4f6"
//                           : "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#4b5563",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         textAlign: "left",
//                         display: "-webkit-box",
//                         WebkitLineClamp: 1,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                         paddingRight: "16px",
//                       }}
//                     >
//                       {q.title}
//                     </span>
//                     <ChevronRight
//                       size={18}
//                       color="#9ca3af"
//                       style={{ flexShrink: 0 }}
//                     />
//                   </button>
//                 ))}
//               </div>
//               <button
//                 onClick={() => navigate("/faq")}
//                 style={{
//                   width: "100%",
//                   marginTop: "12px",
//                   padding: "12px",
//                   border: "1px solid #e5e7eb",
//                   borderRadius: "6px",
//                   background: "#f9fafb",
//                   color: "#018784", // Changed to Teal
//                   fontSize: "13px",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                 }}
//               >
//                 View All Guides
//               </button>
//             </div>
//           </div>
//         )}

//         <BottomNav />
//       </div>
//     </div>
//   );
// }

//////////////////////// ======================= latest verison 3 by ======================////////////////////

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
//   ShieldCheck,
//   ChevronRight,
//   X,
//   Zap,
//   MessageSquareMore,
// } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);
//   const [offerDismissed, setOfferDismissed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState("");

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

//   const { data: offerData } = useQuery({
//     queryKey: ["activeOffer"],
//     queryFn: async () => {
//       const { data } = await API.get("/offers/active");
//       return data.offer || null;
//     },
//     refetchInterval: 60000,
//   });

//   // ── Countdown timer ──────────────────────────────────────────
//   useEffect(() => {
//     if (!offerData) return;
//     const tick = () => {
//       const diff = new Date(offerData.endTime) - new Date();
//       if (diff <= 0) {
//         setTimeLeft("Expired");
//         return;
//       }
//       const h = Math.floor(diff / 3600000);
//       const m = Math.floor((diff % 3600000) / 60000);
//       const s = Math.floor((diff % 60000) / 1000);
//       setTimeLeft(
//         `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [offerData]);

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

//   const topQuestions = faqData
//     ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
//     : [];

//   const actions = [
//     {
//       label: "Recharge",
//       path: "/recharge",
//       icon: <Wallet size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Withdraw",
//       path: "/withdraw",
//       icon: <Landmark size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "VIP Upgrade",
//       path: "/vip",
//       icon: <Gem size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Support",
//       path: "/chat",
//       icon: <Headset size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Settings",
//       path: "/profile",
//       icon: <Settings size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Attendance",
//       path: "/calendar",
//       icon: <CalendarCheck size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2
//           size={28}
//           className="animate-spin"
//           style={{ color: "#018784" }}
//         />
//       </div>
//     );

//   const showOffer = offerData && !offerDismissed;

//   // ── Matching Login.jsx: same max-width, bg, padding, font sizes ──
//   return (
//     <div
//       className="min-h-screen w-full relative flex justify-center bg-gray-100"
//       style={{ paddingBottom: "80px" }}
//     >
//       <div
//         className="w-full flex flex-col bg-white overflow-x-hidden relative"
//         style={{ maxWidth: "480px", minHeight: "100vh" }}
//       >
//         {/* ════ TOP NAV — matches Login.jsx exactly ════ */}
//         <div
//           className="flex justify-between items-center px-5 py-4 relative z-20"
//           style={{ borderBottom: "1px solid #f3f4f6" }}
//         >
//           <div className="flex items-center gap-3">
//             <img
//               src="/demo_logo.png"
//               alt="TikTok Shop"
//               className="h-10 object-contain"
//             />
//           </div>
//           <button
//             onClick={() => navigate("/chat")}
//             style={{
//               width: "34px",
//               height: "34px",
//               borderRadius: "50%",
//               backgroundColor: "rgba(1,135,132,0.08)",
//               border: "none",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <MessageSquareMore size={18} color="#018784" />
//           </button>
//         </div>

//         {/* ════ HERO / STORE INFO — matches Login hero image section ════ */}
//         <div
//           className="flex flex-col items-center justify-center"
//           style={{
//             padding: "24px 20px 20px 20px",
//             borderBottom: "1px solid #f3f4f6",
//           }}
//         >
//           {/* Store logo — same size as Login hero image area */}
//           <div
//             style={{
//               width: "80px",
//               height: "80px",
//               borderRadius: "50%",
//               backgroundColor: "#f3f4f6",
//               border: "3px solid #fff",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//               overflow: "hidden",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "12px",
//             }}
//           >
//             {store?.storeLogo ? (
//               <img
//                 src={store.storeLogo}
//                 alt="Logo"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <Store size={32} color="#9ca3af" />
//             )}
//           </div>

//           {/* Store name — matches Login h1 */}
//           <h1
//             style={{
//               fontSize: "22px",
//               fontWeight: "bold",
//               color: "#121212",
//               margin: "0 0 4px 0",
//             }}
//           >
//             {store?.storeName || user?.username}
//           </h1>

//           {/* VIP badge */}
//           {store?.vipLevel > 0 && (
//             <span
//               style={{
//                 backgroundColor: "#fbbf24",
//                 color: "#78350f",
//                 fontSize: "11px",
//                 fontWeight: "bold",
//                 padding: "3px 10px",
//                 borderRadius: "20px",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "4px",
//                 marginBottom: "8px",
//               }}
//             >
//               <Gem size={11} /> VIP {store.vipLevel}
//             </span>
//           )}

//           {/* Star rating */}
//           <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Star
//                 key={i}
//                 size={16}
//                 fill={
//                   i <= Math.round(store?.starRating || 0)
//                     ? "#fbbf24"
//                     : "#e5e7eb"
//                 }
//                 color={
//                   i <= Math.round(store?.starRating || 0)
//                     ? "#fbbf24"
//                     : "#e5e7eb"
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* ════ CONTENT AREA — matches Login form container padding ════ */}
//         <div
//           style={{
//             padding: "16px 18px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "14px",
//           }}
//         >
//           {/* ── OFFER BANNER ── */}
//           {showOffer && (
//             <div
//               style={{
//                 borderRadius: "8px",
//                 overflow: "hidden",
//                 background:
//                   "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
//                 boxShadow: "0 4px 16px rgba(1,135,132,0.2)",
//                 position: "relative",
//               }}
//             >
//               <style>{`@keyframes shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>
//               <div style={{ padding: "14px 16px", position: "relative" }}>
//                 {/* Badge row */}
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         backgroundColor: "#018784",
//                         borderRadius: "4px",
//                         padding: "3px 8px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "4px",
//                       }}
//                     >
//                       <Zap size={10} color="#fff" fill="#fff" />
//                       <span
//                         style={{
//                           color: "#fff",
//                           fontSize: "10px",
//                           fontWeight: "700",
//                           letterSpacing: "0.5px",
//                         }}
//                       >
//                         {offerData.badgeText || "LIMITED OFFER"}
//                       </span>
//                     </div>
//                     <span
//                       style={{
//                         color: "#fbbf24",
//                         fontSize: "13px",
//                         fontWeight: "bold",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       ⏱ {timeLeft}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => setOfferDismissed(true)}
//                     style={{
//                       background: "rgba(255,255,255,0.1)",
//                       border: "none",
//                       borderRadius: "50%",
//                       width: "22px",
//                       height: "22px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <X size={12} color="rgba(255,255,255,0.7)" />
//                   </button>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     gap: "10px",
//                   }}
//                 >
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <h3
//                       style={{
//                         color: "#fff",
//                         fontSize: "14px",
//                         fontWeight: "700",
//                         margin: "0 0 3px 0",
//                         lineHeight: "1.3",
//                       }}
//                     >
//                       {offerData.title}
//                     </h3>
//                     {offerData.description && (
//                       <p
//                         style={{
//                           color: "rgba(255,255,255,0.6)",
//                           fontSize: "11px",
//                           margin: 0,
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         {offerData.description}
//                       </p>
//                     )}
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       flexShrink: 0,
//                     }}
//                   >
//                     {offerData.bannerImage && (
//                       <img
//                         src={offerData.bannerImage}
//                         alt="offer"
//                         style={{
//                           width: "56px",
//                           height: "56px",
//                           objectFit: "cover",
//                           borderRadius: "8px",
//                           border: "2px solid rgba(255,255,255,0.15)",
//                         }}
//                       />
//                     )}
//                     {offerData.discountPercent > 0 && (
//                       <div
//                         style={{
//                           width: "52px",
//                           height: "52px",
//                           borderRadius: "50%",
//                           background:
//                             "linear-gradient(135deg, #018784, #01a09d)",
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "0 4px 12px rgba(1,135,132,0.4)",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#fff",
//                             fontSize: "15px",
//                             fontWeight: "900",
//                             lineHeight: "1",
//                           }}
//                         >
//                           +{offerData.discountPercent}%
//                         </span>
//                         <span
//                           style={{
//                             color: "rgba(255,255,255,0.8)",
//                             fontSize: "8px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           BONUS
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     marginTop: "10px",
//                     height: "2px",
//                     borderRadius: "2px",
//                     background:
//                       "linear-gradient(90deg, #018784, #01c4c0, #fbbf24, #018784)",
//                     backgroundSize: "200% 100%",
//                     animation: "shimmer 2s linear infinite",
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* ── FINANCIAL CARD — matches Login form card style ── */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               border: "1px solid #e5e7eb",
//               overflow: "hidden",
//             }}
//           >
//             {/* Card header */}
//             <div
//               style={{
//                 padding: "14px 16px",
//                 borderBottom: "1px solid #f3f4f6",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#4b5563",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                 }}
//               >
//                 <ShieldCheck size={16} color="#018784" /> Financial Overview
//               </span>
//               <button
//                 onClick={() => setExpanded(!expanded)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "3px",
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   color: "#018784",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 0,
//                 }}
//               >
//                 {expanded ? "Less" : "More"}
//                 <ChevronDown
//                   size={13}
//                   style={{
//                     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//                     transition: "transform 0.3s",
//                   }}
//                 />
//               </button>
//             </div>

//             <div
//               style={{
//                 padding: "14px 16px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//               }}
//             >
//               {/* Total Sales & Profit */}
//               <div style={{ display: "flex", gap: "12px" }}>
//                 {[
//                   {
//                     label: "Total Sales",
//                     val: `$${(store?.totalSales || 0).toFixed(2)}`,
//                     color: "#121212",
//                   },
//                   {
//                     label: "Total Profit",
//                     val: `$${(store?.totalProfit || 0).toFixed(2)}`,
//                     color: "#018784",
//                   },
//                 ].map((s, i) => (
//                   <div key={i} style={{ flex: 1 }}>
//                     <p
//                       style={{
//                         fontSize: "12px",
//                         color: "#9ca3af",
//                         margin: "0 0 3px 0",
//                         fontWeight: "500",
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "20px",
//                         fontWeight: "700",
//                         color: s.color,
//                         margin: 0,
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       {s.val}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Today stats */}
//               <div style={{ display: "flex", gap: "8px" }}>
//                 {[
//                   {
//                     label: "Today's Orders",
//                     val: todayStats?.totalOrders ?? 0,
//                   },
//                   {
//                     label: "Today's Sales",
//                     val: `$${(todayStats?.totalSales || 0).toFixed(2)}`,
//                   },
//                   {
//                     label: "Today's Profit",
//                     val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
//                   },
//                 ].map((s, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       flex: 1,
//                       backgroundColor: "#f9fafb",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "6px",
//                       padding: "10px 6px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <p
//                       style={{
//                         color: "#018784",
//                         fontWeight: "700",
//                         fontSize: "15px",
//                         margin: "0 0 2px 0",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       {s.val}
//                     </p>
//                     <p
//                       style={{
//                         color: "#9ca3af",
//                         fontSize: "10px",
//                         margin: 0,
//                         lineHeight: "1.3",
//                         fontWeight: "500",
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Expanded stats */}
//               {expanded && (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr 1fr",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
//                     { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
//                     { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
//                     { label: "Followers", val: store?.followers ?? 0 },
//                     {
//                       label: "Rating",
//                       val: `${store?.positiveRatingRate ?? 0}%`,
//                     },
//                     { label: "Credit Score", val: store?.creditScore ?? 100 },
//                   ].map((s, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         backgroundColor: "#f9fafb",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "6px",
//                         padding: "10px 6px",
//                         textAlign: "center",
//                       }}
//                     >
//                       <p
//                         style={{
//                           color: "#121212",
//                           fontWeight: "700",
//                           fontSize: "14px",
//                           margin: "0 0 2px 0",
//                         }}
//                       >
//                         {s.val}
//                       </p>
//                       <p
//                         style={{
//                           color: "#9ca3af",
//                           fontSize: "10px",
//                           margin: 0,
//                           lineHeight: "1.3",
//                           fontWeight: "500",
//                         }}
//                       >
//                         {s.label}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── QUICK ACTIONS — matches Login button style ── */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               border: "1px solid #e5e7eb",
//               padding: "14px 16px",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "13px",
//                 fontWeight: "600",
//                 color: "#4b5563",
//                 margin: "0 0 12px 0",
//               }}
//             >
//               Quick Actions
//             </p>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr 1fr",
//                 gap: "10px",
//               }}
//             >
//               {actions.map((a, i) => (
//                 <button
//                   key={i}
//                   onClick={() => navigate(a.path)}
//                   style={{
//                     backgroundColor: "#f9fafb",
//                     borderRadius: "8px",
//                     border: "1px solid #e5e7eb",
//                     padding: "12px 6px",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "6px",
//                     cursor: "pointer",
//                     transition: "border-color 0.2s",
//                   }}
//                   onMouseDown={(e) =>
//                     (e.currentTarget.style.borderColor = "#018784")
//                   }
//                   onMouseUp={(e) =>
//                     (e.currentTarget.style.borderColor = "#e5e7eb")
//                   }
//                 >
//                   <div
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "8px",
//                       backgroundColor: a.bg,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {a.icon}
//                   </div>
//                   <span
//                     style={{
//                       color: "#4b5563",
//                       fontSize: "11px",
//                       fontWeight: "500",
//                       textAlign: "center",
//                     }}
//                   >
//                     {a.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ── SALES CHART — matches Login card style ── */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               border: "1px solid #e5e7eb",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "14px 16px",
//                 borderBottom: "1px solid #f3f4f6",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "13px",
//                   fontWeight: "600",
//                   color: "#4b5563",
//                   margin: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                 }}
//               >
//                 <TrendingUp size={14} color="#018784" /> Performance Curve
//               </p>
//             </div>
//             <div style={{ padding: "14px 16px" }}>
//               <div
//                 style={{ height: "180px", width: "100%", marginLeft: "-10px" }}
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={chartData}>
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#f3f4f6"
//                     />
//                     <XAxis
//                       dataKey="date"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 10, fill: "#9ca3af" }}
//                       dy={8}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 10, fill: "#9ca3af" }}
//                       dx={-8}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         fontSize: 12,
//                         borderRadius: 6,
//                         border: "1px solid #e5e7eb",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                         fontWeight: "600",
//                         color: "#121212",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="sales"
//                       stroke="#018784"
//                       strokeWidth={2.5}
//                       dot={{
//                         r: 3,
//                         fill: "#018784",
//                         strokeWidth: 2,
//                         stroke: "#fff",
//                       }}
//                       activeDot={{
//                         r: 5,
//                         fill: "#018784",
//                         stroke: "#fff",
//                         strokeWidth: 2,
//                       }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* ── FAQ LIST — matches Login link/text style ── */}
//           {topQuestions.length > 0 && (
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "8px",
//                 border: "1px solid #e5e7eb",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "14px 16px",
//                   borderBottom: "1px solid #f3f4f6",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: "13px",
//                     fontWeight: "600",
//                     color: "#4b5563",
//                     margin: 0,
//                   }}
//                 >
//                   Platform Guidelines
//                 </p>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 {topQuestions.map((q, idx) => (
//                   <button
//                     key={q._id}
//                     onClick={() => navigate(`/faq/${q._id}`)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "12px 16px",
//                       background: "none",
//                       border: "none",
//                       borderBottom:
//                         idx !== topQuestions.length - 1
//                           ? "1px solid #f3f4f6"
//                           : "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#4b5563",
//                         fontSize: "13px",
//                         fontWeight: "500",
//                         textAlign: "left",
//                         display: "-webkit-box",
//                         WebkitLineClamp: 1,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                         paddingRight: "12px",
//                       }}
//                     >
//                       {q.title}
//                     </span>
//                     <ChevronRight
//                       size={15}
//                       color="#d1d5db"
//                       style={{ flexShrink: 0 }}
//                     />
//                   </button>
//                 ))}
//               </div>
//               <div style={{ padding: "12px 16px" }}>
//                 <button
//                   onClick={() => navigate("/faq")}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "4px",
//                     background: "none",
//                     color: "#018784",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     cursor: "pointer",
//                     transition: "border-color 0.2s",
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#018784")}
//                   onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
//                 >
//                   View All Guides
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <BottomNav />
//       </div>
//     </div>
//   );
// }

//////////////////////// ======================= latest 4 by ======================////////////////////

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
//   ShieldCheck,
//   ChevronRight,
//   X,
//   Zap,
// } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, merchant } = useSelector((s) => s.auth);
//   const [expanded, setExpanded] = useState(false);
//   const [offerDismissed, setOfferDismissed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState("");

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

//   const { data: offerData } = useQuery({
//     queryKey: ["activeOffer"],
//     queryFn: async () => {
//       const { data } = await API.get("/offers/active");
//       return data.offer || null;
//     },
//     refetchInterval: 60000,
//   });

//   // ── Countdown timer ──────────────────────────────────────────
//   useEffect(() => {
//     if (!offerData) return;
//     const tick = () => {
//       const diff = new Date(offerData.endTime) - new Date();
//       if (diff <= 0) {
//         setTimeLeft("Expired");
//         return;
//       }
//       const h = Math.floor(diff / 3600000);
//       const m = Math.floor((diff % 3600000) / 60000);
//       const s = Math.floor((diff % 60000) / 1000);
//       setTimeLeft(
//         `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
//       );
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [offerData]);

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

//   const topQuestions = faqData
//     ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
//     : [];

//   const actions = [
//     {
//       label: "Recharge",
//       path: "/recharge",
//       icon: <Wallet size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Withdraw",
//       path: "/withdraw",
//       icon: <Landmark size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "VIP Upgrade",
//       path: "/vip",
//       icon: <Gem size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Support",
//       path: "/chat",
//       icon: <Headset size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Settings",
//       path: "/profile",
//       icon: <Settings size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//     {
//       label: "Attendance",
//       path: "/calendar",
//       icon: <CalendarCheck size={24} color="#018784" strokeWidth={1.5} />,
//       bg: "rgba(1,135,132,0.08)",
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2
//           size={28}
//           className="animate-spin"
//           style={{ color: "#018784" }}
//         />
//       </div>
//     );

//   const showOffer = offerData && !offerDismissed;

//   return (
//     <div
//       className="min-h-screen w-full relative flex justify-center bg-gray-100"
//       style={{ paddingBottom: "80px" }}
//     >
//       <div
//         className="w-full flex flex-col bg-white overflow-x-hidden relative"
//         style={{ maxWidth: "480px", minHeight: "100vh" }}
//       >
//         {/* ════ TOP NAV ════ */}
//         <div
//           className="flex justify-between items-center px-5 py-4 relative z-20"
//           style={{ borderBottom: "1px solid #f3f4f6" }}
//         >
//           <img
//             src="/demo_logo.png"
//             alt="TikTok Shop"
//             className="h-10 object-contain"
//           />
//           <button
//             onClick={() => navigate("/chat")}
//             style={{
//               width: "34px",
//               height: "34px",
//               borderRadius: "50%",
//               backgroundColor: "rgba(1,135,132,0.08)",
//               border: "none",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <Headset size={18} color="#018784" />
//           </button>
//         </div>

//         {/* ════ HERO SECTION — bg #018784 ════ */}
//         <div
//           className="flex flex-col items-center justify-center"
//           style={{
//             padding: "28px 20px 24px 20px",
//             backgroundColor: "#018784",
//           }}
//         >
//           {/* Store logo */}
//           <div
//             style={{
//               width: "80px",
//               height: "80px",
//               borderRadius: "50%",
//               backgroundColor: "rgba(255,255,255,0.15)",
//               border: "3px solid rgba(255,255,255,0.4)",
//               overflow: "hidden",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: "12px",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
//             }}
//           >
//             {store?.storeLogo ? (
//               <img
//                 src={store.storeLogo}
//                 alt="Logo"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <Store size={32} color="rgba(255,255,255,0.9)" />
//             )}
//           </div>

//           {/* Store name */}
//           <h1
//             style={{
//               fontSize: "20px",
//               fontWeight: "bold",
//               color: "#fff",
//               margin: "0 0 6px 0",
//             }}
//           >
//             {store?.storeName || user?.username}
//           </h1>

//           {/* VIP badge */}
//           {store?.vipLevel > 0 && (
//             <span
//               style={{
//                 backgroundColor: "rgba(255,255,255,0.2)",
//                 color: "#fff",
//                 fontSize: "11px",
//                 fontWeight: "700",
//                 padding: "3px 10px",
//                 borderRadius: "20px",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "4px",
//                 marginBottom: "8px",
//                 border: "1px solid rgba(255,255,255,0.3)",
//               }}
//             >
//               <Gem size={11} /> VIP {store.vipLevel}
//             </span>
//           )}

//           {/* Star rating */}
//           <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Star
//                 key={i}
//                 size={16}
//                 fill={
//                   i <= Math.round(store?.starRating || 0)
//                     ? "#fff"
//                     : "rgba(255,255,255,0.3)"
//                 }
//                 color={
//                   i <= Math.round(store?.starRating || 0)
//                     ? "#fff"
//                     : "rgba(255,255,255,0.3)"
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* ════ CONTENT AREA ════ */}
//         <div
//           style={{
//             padding: "16px 18px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "14px",
//           }}
//         >
//           {/* ── OFFER BANNER ── */}
//           {showOffer && (
//             <div
//               style={{
//                 borderRadius: "8px",
//                 overflow: "hidden",
//                 background:
//                   "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
//                 boxShadow: "0 4px 16px rgba(1,135,132,0.2)",
//                 position: "relative",
//               }}
//             >
//               <style>{`@keyframes shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>
//               <div style={{ padding: "14px 16px", position: "relative" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         backgroundColor: "#018784",
//                         borderRadius: "4px",
//                         padding: "3px 8px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "4px",
//                       }}
//                     >
//                       <Zap size={10} color="#fff" fill="#fff" />
//                       <span
//                         style={{
//                           color: "#fff",
//                           fontSize: "10px",
//                           fontWeight: "700",
//                           letterSpacing: "0.5px",
//                         }}
//                       >
//                         {offerData.badgeText || "LIMITED OFFER"}
//                       </span>
//                     </div>
//                     <span
//                       style={{
//                         color: "#fbbf24",
//                         fontSize: "13px",
//                         fontWeight: "bold",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       ⏱ {timeLeft}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => setOfferDismissed(true)}
//                     style={{
//                       background: "rgba(255,255,255,0.1)",
//                       border: "none",
//                       borderRadius: "50%",
//                       width: "22px",
//                       height: "22px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <X size={12} color="rgba(255,255,255,0.7)" />
//                   </button>
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     gap: "10px",
//                   }}
//                 >
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <h3
//                       style={{
//                         color: "#fff",
//                         fontSize: "14px",
//                         fontWeight: "700",
//                         margin: "0 0 3px 0",
//                         lineHeight: "1.3",
//                       }}
//                     >
//                       {offerData.title}
//                     </h3>
//                     {offerData.description && (
//                       <p
//                         style={{
//                           color: "rgba(255,255,255,0.6)",
//                           fontSize: "11px",
//                           margin: 0,
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         {offerData.description}
//                       </p>
//                     )}
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       flexShrink: 0,
//                     }}
//                   >
//                     {offerData.bannerImage && (
//                       <img
//                         src={offerData.bannerImage}
//                         alt="offer"
//                         style={{
//                           width: "56px",
//                           height: "56px",
//                           objectFit: "cover",
//                           borderRadius: "8px",
//                           border: "2px solid rgba(255,255,255,0.15)",
//                         }}
//                       />
//                     )}
//                     {offerData.discountPercent > 0 && (
//                       <div
//                         style={{
//                           width: "52px",
//                           height: "52px",
//                           borderRadius: "50%",
//                           background:
//                             "linear-gradient(135deg, #018784, #01a09d)",
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           boxShadow: "0 4px 12px rgba(1,135,132,0.4)",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#fff",
//                             fontSize: "15px",
//                             fontWeight: "900",
//                             lineHeight: "1",
//                           }}
//                         >
//                           +{offerData.discountPercent}%
//                         </span>
//                         <span
//                           style={{
//                             color: "rgba(255,255,255,0.8)",
//                             fontSize: "8px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           BONUS
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     marginTop: "10px",
//                     height: "2px",
//                     borderRadius: "2px",
//                     background:
//                       "linear-gradient(90deg, #018784, #01c4c0, #fbbf24, #018784)",
//                     backgroundSize: "200% 100%",
//                     animation: "shimmer 2s linear infinite",
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* ── FINANCIAL CARD — bg #018784 ── */}
//           <div
//             style={{
//               backgroundColor: "#018784",
//               borderRadius: "8px",
//               overflow: "hidden",
//             }}
//           >
//             {/* Card header */}
//             <div
//               style={{
//                 padding: "14px 16px",
//                 borderBottom: "1px solid rgba(255,255,255,0.15)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#fff",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                 }}
//               >
//                 <ShieldCheck size={16} color="rgba(255,255,255,0.8)" />{" "}
//                 Financial Overview
//               </span>
//               <button
//                 onClick={() => setExpanded(!expanded)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "3px",
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   color: "#fff",
//                   background: "rgba(255,255,255,0.15)",
//                   border: "none",
//                   padding: "4px 10px",
//                   borderRadius: "20px",
//                   cursor: "pointer",
//                 }}
//               >
//                 {expanded ? "Less" : "More"}
//                 <ChevronDown
//                   size={13}
//                   style={{
//                     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//                     transition: "transform 0.3s",
//                   }}
//                 />
//               </button>
//             </div>

//             <div
//               style={{
//                 padding: "14px 16px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//               }}
//             >
//               {/* Total Sales & Profit */}
//               <div style={{ display: "flex", gap: "12px" }}>
//                 {[
//                   {
//                     label: "Total Sales",
//                     val: `$${(store?.totalSales || 0).toFixed(2)}`,
//                     color: "#fff",
//                   },
//                   {
//                     label: "Total Profit",
//                     val: `$${(store?.totalProfit || 0).toFixed(2)}`,
//                     color: "#fbbf24",
//                   },
//                 ].map((s, i) => (
//                   <div key={i} style={{ flex: 1 }}>
//                     <p
//                       style={{
//                         fontSize: "12px",
//                         color: "rgba(255,255,255,0.7)",
//                         margin: "0 0 3px 0",
//                         fontWeight: "500",
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "20px",
//                         fontWeight: "700",
//                         color: s.color,
//                         margin: 0,
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       {s.val}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Today stats */}
//               <div style={{ display: "flex", gap: "8px" }}>
//                 {[
//                   {
//                     label: "Today's Orders",
//                     val: todayStats?.totalOrders ?? 0,
//                   },
//                   {
//                     label: "Today's Sales",
//                     val: `$${(todayStats?.totalSales || 0).toFixed(2)}`,
//                   },
//                   {
//                     label: "Today's Profit",
//                     val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
//                   },
//                 ].map((s, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       flex: 1,
//                       backgroundColor: "rgba(255,255,255,0.12)",
//                       border: "1px solid rgba(255,255,255,0.15)",
//                       borderRadius: "6px",
//                       padding: "10px 6px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <p
//                       style={{
//                         color: "#fff",
//                         fontWeight: "700",
//                         fontSize: "15px",
//                         margin: "0 0 2px 0",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       {s.val}
//                     </p>
//                     <p
//                       style={{
//                         color: "rgba(255,255,255,0.7)",
//                         fontSize: "10px",
//                         margin: 0,
//                         lineHeight: "1.3",
//                         fontWeight: "500",
//                       }}
//                     >
//                       {s.label}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Expanded stats */}
//               {expanded && (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr 1fr",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
//                     { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
//                     { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
//                     { label: "Followers", val: store?.followers ?? 0 },
//                     {
//                       label: "Rating",
//                       val: `${store?.positiveRatingRate ?? 0}%`,
//                     },
//                     { label: "Credit Score", val: store?.creditScore ?? 100 },
//                   ].map((s, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         backgroundColor: "rgba(255,255,255,0.12)",
//                         border: "1px solid rgba(255,255,255,0.15)",
//                         borderRadius: "6px",
//                         padding: "10px 6px",
//                         textAlign: "center",
//                       }}
//                     >
//                       <p
//                         style={{
//                           color: "#fff",
//                           fontWeight: "700",
//                           fontSize: "14px",
//                           margin: "0 0 2px 0",
//                         }}
//                       >
//                         {s.val}
//                       </p>
//                       <p
//                         style={{
//                           color: "rgba(255,255,255,0.7)",
//                           fontSize: "10px",
//                           margin: 0,
//                           lineHeight: "1.3",
//                           fontWeight: "500",
//                         }}
//                       >
//                         {s.label}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── QUICK ACTIONS ── */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               border: "1px solid #e5e7eb",
//               padding: "14px 16px",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "13px",
//                 fontWeight: "600",
//                 color: "#4b5563",
//                 margin: "0 0 12px 0",
//               }}
//             >
//               Quick Actions
//             </p>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr 1fr",
//                 gap: "10px",
//               }}
//             >
//               {actions.map((a, i) => (
//                 <button
//                   key={i}
//                   onClick={() => navigate(a.path)}
//                   style={{
//                     backgroundColor: "#f9fafb",
//                     borderRadius: "8px",
//                     border: "1px solid #e5e7eb",
//                     padding: "12px 6px",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "6px",
//                     cursor: "pointer",
//                     transition: "border-color 0.2s",
//                   }}
//                   onMouseDown={(e) =>
//                     (e.currentTarget.style.borderColor = "#018784")
//                   }
//                   onMouseUp={(e) =>
//                     (e.currentTarget.style.borderColor = "#e5e7eb")
//                   }
//                 >
//                   <div
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "8px",
//                       backgroundColor: a.bg,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {a.icon}
//                   </div>
//                   <span
//                     style={{
//                       color: "#4b5563",
//                       fontSize: "11px",
//                       fontWeight: "500",
//                       textAlign: "center",
//                     }}
//                   >
//                     {a.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ── SALES CHART ── */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               border: "1px solid #e5e7eb",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "14px 16px",
//                 borderBottom: "1px solid #f3f4f6",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "13px",
//                   fontWeight: "600",
//                   color: "#4b5563",
//                   margin: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                 }}
//               >
//                 <TrendingUp size={14} color="#018784" /> Performance Curve
//               </p>
//             </div>
//             <div style={{ padding: "14px 16px" }}>
//               <div
//                 style={{ height: "180px", width: "100%", marginLeft: "-10px" }}
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={chartData}>
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#f3f4f6"
//                     />
//                     <XAxis
//                       dataKey="date"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 10, fill: "#9ca3af" }}
//                       dy={8}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 10, fill: "#9ca3af" }}
//                       dx={-8}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         fontSize: 12,
//                         borderRadius: 6,
//                         border: "1px solid #e5e7eb",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                         fontWeight: "600",
//                         color: "#121212",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="sales"
//                       stroke="#018784"
//                       strokeWidth={2.5}
//                       dot={{
//                         r: 3,
//                         fill: "#018784",
//                         strokeWidth: 2,
//                         stroke: "#fff",
//                       }}
//                       activeDot={{
//                         r: 5,
//                         fill: "#018784",
//                         stroke: "#fff",
//                         strokeWidth: 2,
//                       }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* ── FAQ LIST ── */}
//           {topQuestions.length > 0 && (
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "8px",
//                 border: "1px solid #e5e7eb",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "14px 16px",
//                   borderBottom: "1px solid #f3f4f6",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: "13px",
//                     fontWeight: "600",
//                     color: "#4b5563",
//                     margin: 0,
//                   }}
//                 >
//                   Platform Guidelines
//                 </p>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 {topQuestions.map((q, idx) => (
//                   <button
//                     key={q._id}
//                     onClick={() => navigate(`/faq/${q._id}`)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "12px 16px",
//                       background: "none",
//                       border: "none",
//                       borderBottom:
//                         idx !== topQuestions.length - 1
//                           ? "1px solid #f3f4f6"
//                           : "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#4b5563",
//                         fontSize: "13px",
//                         fontWeight: "500",
//                         textAlign: "left",
//                         display: "-webkit-box",
//                         WebkitLineClamp: 1,
//                         WebkitBoxOrient: "vertical",
//                         overflow: "hidden",
//                         paddingRight: "12px",
//                       }}
//                     >
//                       {q.title}
//                     </span>
//                     <ChevronRight
//                       size={15}
//                       color="#d1d5db"
//                       style={{ flexShrink: 0 }}
//                     />
//                   </button>
//                 ))}
//               </div>
//               <div style={{ padding: "12px 16px" }}>
//                 <button
//                   onClick={() => navigate("/faq")}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "4px",
//                     background: "none",
//                     color: "#018784",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     cursor: "pointer",
//                     transition: "border-color 0.2s",
//                   }}
//                   onFocus={(e) => (e.target.style.borderColor = "#018784")}
//                   onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
//                 >
//                   View All Guides
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <BottomNav />
//       </div>
//     </div>
//   );
// }

//////////////////////// ======================= latest 5 by ======================////////////////////

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
  ShieldCheck,
  ChevronRight,
  X,
  Zap,
  MessageSquareMore,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);
  const [expanded, setExpanded] = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

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
  }, [storeData, dispatch]);

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

  const { data: offerData } = useQuery({
    queryKey: ["activeOffer"],
    queryFn: async () => {
      const { data } = await API.get("/offers/active");
      return data.offer || null;
    },
    refetchInterval: 60000,
  });

  // ── Countdown timer ──────────────────────────────────────────
  useEffect(() => {
    if (!offerData) return;
    const tick = () => {
      const diff = new Date(offerData.endTime) - new Date();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offerData]);

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

  const topQuestions = faqData
    ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
    : [];

  const actions = [
    {
      label: "Recharge",
      path: "/recharge",
      icon: <Wallet size={22} color="#018784" strokeWidth={2} />,
    },
    {
      label: "Withdraw",
      path: "/withdraw",
      icon: <Landmark size={22} color="#018784" strokeWidth={2} />,
    },

    {
      label: "Support",
      path: "/chat",
      icon: <Headset size={22} color="#018784" strokeWidth={2} />,
    },
    {
      label: "VIP Upgrade",
      path: "/vip",
      icon: <Gem size={22} color="#018784" strokeWidth={2} />,
    },

    {
      label: "Settings",
      path: "/profile",
      icon: <Settings size={22} color="#018784" strokeWidth={2} />,
    },
    {
      label: "Attendance",
      path: "/calendar",
      icon: <CalendarCheck size={22} color="#018784" strokeWidth={2} />,
    },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#f8fafc]">
        <Loader2 size={32} className="animate-spin text-[#018784]" />
      </div>
    );

  const showOffer = offerData && !offerDismissed;

  return (
    // ── Outer Desktop Wrapper ──
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100 font-sans">
      {/* ── Inner Mobile App Container (SaaS Background #f8fafc) ── */}
      <div
        className="w-full flex flex-col bg-[#f8fafc] overflow-x-hidden relative"
        style={{ maxWidth: "480px", minHeight: "100vh", paddingBottom: "90px" }}
      >
        {/* ════════ STICKY TOP BAR ════════ */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            // backgroundColor: "rgba(255, 255, 255, 0.95)",
            backgroundColor: "#018784",
            backdropFilter: "blur(8px)",
            padding: "14px 3.5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)", // Subtle slate border
          }}
        >
          <div className="flex items-center gap-3 relative">
            <img
              src="/bg_image_3.png"
              alt="TikTok Shop"
              className="h-10 object-contain"
            />
            <div className="w-[1px] h-4 text-[#ffffff]"></div>
            <span className="text-[16px] font-semibold text-[#ffffff] tracking-tight">
              Seller Center
            </span>
            <div className="bg-[#018784] w-4 h-4 absolute right-26 bottom-0"></div>
          </div>

          <button
            onClick={() => navigate("/chat")}
            className="transition-transform hover:scale-105 active:scale-95"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px", // Squircle instead of circle for SaaS feel
              backgroundColor: "#018784",
              // border: "1px solid #e2e8f0",
              // boxShadow: "0 1px 2px rgba(0,0,0,0.09)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <MessageSquareMore size={24} color="#fff" />
          </button>
        </div>

        {/* ════════ HERO PROFILE SECTION ════════ */}
        <div style={{ padding: "2.5px 3.5px 3.5px 3.5px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "#ffffff",
              padding: "16px",
              borderRadius: "16px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
              border: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px", // Squircle
                backgroundColor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              {store?.storeLogo ? (
                <img
                  src={store.storeLogo}
                  alt="Logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Store size={26} color="#94a3b8" />
              )}
            </div>
            <div style={{ flex: 1 }}>
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
                    fontSize: "17px",
                    fontWeight: "800",
                    color: "#0f172a",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {store?.storeName || user?.username}
                </h2>
                {store?.vipLevel !== undefined && (
                  <span
                    style={{
                      backgroundColor: "rgba(1,135,132,0.1)",
                      color: "#018784",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "3px 6px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <Gem size={10} strokeWidth={2.5} /> VIP {store.vipLevel}
                  </span>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={
                      i <= Math.round(store?.starRating || 0)
                        ? "#F59E0B"
                        : "#f1f5f9"
                    }
                    color={
                      i <= Math.round(store?.starRating || 0)
                        ? "#F59E0B"
                        : "#e2e8f0"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════ OFFER BANNER ════════ */}
        {showOffer && (
          <div style={{ padding: "2.5px 10px" }}>
            <style>{`@keyframes shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Premium Dark SaaS look
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
                position: "relative",
              }}
            >
              {/* Subtle accent glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  right: "-20%",
                  width: "150px",
                  height: "150px",
                  background:
                    "radial-gradient(circle, rgba(1,135,132,0.4) 0%, rgba(0,0,0,0) 70%)",
                  pointerEvents: "none",
                }}
              ></div>

              <div
                style={{
                  padding: "16px 20px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#018784",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Zap size={10} color="#fff" fill="#fff" />
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: "800",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {offerData.badgeText || "SPECIAL OFFER"}
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "6px",
                        padding: "3px 8px",
                      }}
                    >
                      <span
                        style={{
                          color: "#cbd5e1",
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "monospace",
                          letterSpacing: "1px",
                        }}
                      >
                        ⏱ {timeLeft}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOfferDismissed(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <X size={16} color="#94a3b8" />
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        color: "#f8fafc",
                        fontSize: "17px",
                        fontWeight: "800",
                        margin: "0 0 4px 0",
                        lineHeight: "1.2",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {offerData.title}
                    </h3>
                    {offerData.description && (
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "12px",
                          margin: 0,
                          lineHeight: "1.4",
                          fontWeight: "500",
                        }}
                      >
                        {offerData.description}
                      </p>
                    )}
                  </div>

                  {offerData.discountPercent > 0 && (
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: "#018784",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(1,135,132,0.4)",
                      }}
                    >
                      <span
                        style={{
                          color: "#ffffff",
                          fontSize: "16px",
                          fontWeight: "900",
                          lineHeight: "1",
                        }}
                      >
                        +{offerData.discountPercent}%
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "8px",
                          fontWeight: "800",
                          letterSpacing: "0.5px",
                          marginTop: "3px",
                        }}
                      >
                        BONUS
                      </span>
                    </div>
                  )}
                </div>

                {/* Shimmer bar */}
                <div
                  style={{
                    marginTop: "0px",
                    height: "3px",
                    borderRadius: "2px",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2.5s linear infinite",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ════════ FINANCIAL CARD (PREMIUM SAAS DESIGN) ════════ */}
        <div style={{ padding: "2.5px 3.5px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "800",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "-0.3px",
                }}
              >
                <div
                  style={{
                    padding: "6px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "8px",
                  }}
                >
                  <ShieldCheck size={16} color="#018784" strokeWidth={2.5} />
                </div>
                Financial Overview
              </span>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#64748b",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
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

            {/* Main Stats Row */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    margin: "0 0 6px 0",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Sales
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#0f172a",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  ${(store?.totalSales || 0).toFixed(2)}
                </p>
              </div>
              <div style={{ width: "1px", backgroundColor: "#e2e8f0" }} />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    margin: "0 0 6px 0",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Profit
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#018784",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  ${(store?.totalProfit || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Today's Micro Stats */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: expanded ? "16px" : "0",
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
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#0f172a",
                      fontWeight: "800",
                      fontSize: "15px",
                      margin: "0 0 4px 0",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "10px",
                      margin: 0,
                      fontWeight: "600",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Expanded Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                maxHeight: expanded ? "200px" : "0px",
                opacity: expanded ? 1 : 0,
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
                    backgroundColor: "#ffffff",
                    border: "1px solid #f1f5f9",
                    borderRadius: "8px",
                    padding: "10px 6px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#334155",
                      fontWeight: "700",
                      fontSize: "13px",
                      margin: "0 0 2px 0",
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "10px",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ QUICK ACTIONS (CLEAN GRID) ════════ */}
        <div style={{ padding: "2.5px 3.5px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
            }}
          >
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.path)}
                className="group"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "16px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "#018784")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "#e2e8f0")
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.96)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(1,135,132,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {a.icon}
                </div>
                <span
                  style={{
                    color: "#475569",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════ SALES CHART ════════ */}
        <div style={{ padding: "2.5px 3.5px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <p
              style={{
                color: "#0f172a",
                fontWeight: "800",
                fontSize: "15px",
                margin: "0 0 24px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                letterSpacing: "-0.3px",
              }}
            >
              <div
                style={{
                  padding: "6px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "8px",
                }}
              >
                <TrendingUp size={16} color="#018784" strokeWidth={2.5} />
              </div>
              Performance Curve
            </p>
            <div
              style={{ height: "200px", width: "100%", marginLeft: "-15px" }}
            >
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
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontWeight: "bold",
                      color: "#0f172a",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#018784"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#ffffff",
                      strokeWidth: 2,
                      stroke: "#018784",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#018784",
                      stroke: "#ffffff",
                      strokeWidth: 3,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ════════ FAQ LIST ════════ */}
        {topQuestions.length > 0 && (
          <div style={{ padding: "2.5px 3.5px 2.5px 3.5px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "8px 20px 20px 20px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                {topQuestions.map((q, idx) => (
                  <button
                    key={q._id}
                    onClick={() => navigate(`/faq/${q._id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 0",
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
                        color: "#334155",
                        fontSize: "14px",
                        fontWeight: "600",
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
                      size={20}
                      color="#018784"
                      style={{ flexShrink: 0 }}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/faq")}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  padding: "14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  color: "#018784",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f1f5f9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8fafc")
                }
              >
                View All Guidelines
              </button>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
