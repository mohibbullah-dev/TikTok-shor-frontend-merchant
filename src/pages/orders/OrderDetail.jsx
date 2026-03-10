// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const OrderDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [showPickupModal, setShowPickupModal] = useState(false);

//   // Fetch order detail
//   const { data: order, isLoading } = useQuery({
//     queryKey: ["order", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/orders/${id}`);
//       return data;
//     },
//   });

//   // Pickup mutation
//   const pickupMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.put(`/orders/${id}/pickup`);
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Order picked up successfully!");
//       queryClient.invalidateQueries(["order", id]);
//       queryClient.invalidateQueries(["myOrders"]);
//       queryClient.invalidateQueries(["myStore"]);
//       queryClient.invalidateQueries(["merchantProfile"]); // ✅ add both
//       queryClient.invalidateQueries(["me"]); // ✅ safety net
//       setShowPickupModal(false);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Pickup failed");
//       setShowPickupModal(false);
//     },
//   });

//   const getStatusColor = (status) => {
//     const colors = {
//       pendingPayment: "#f59e0b",
//       pendingShipment: "#3b82f6",
//       shipped: "#8b5cf6",
//       received: "#06b6d4",
//       completed: "#22c55e",
//       cancelled: "#ef4444",
//     };
//     return colors[status] || "#888";
//   };

//   const getStatusLabel = (status) => {
//     const labels = {
//       pendingPayment: "Pending Pickup",
//       pendingShipment: "Processing",
//       shipped: "Shipped",
//       received: "Received",
//       completed: "Completed",
//       cancelled: "Cancelled",
//     };
//     return labels[status] || status;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <TopBar title="Order Detail" />
//         <div className="p-4 space-y-3">
//           {[...Array(4)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl p-4 animate-pulse h-24"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div
//         className="min-h-screen bg-gray-50 flex items-center
//         justify-center"
//       >
//         <div className="text-center">
//           <span className="text-5xl">❌</span>
//           <p className="text-gray-500 mt-3">Order not found</p>
//           <button
//             onClick={() => navigate("/orders")}
//             className="mt-4 px-6 py-2 rounded-xl text-white text-sm font-bold"
//             style={{ background: "#f02d65" }}
//           >
//             Back to Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-32">
//       {/* Top Bar */}
//       <TopBar
//         title="Order Detail"
//         rightElement={
//           <span
//             className="text-[11px] px-2 py-1 rounded-full text-white font-medium"
//             style={{ background: getStatusColor(order.status) }}
//           >
//             {getStatusLabel(order.status)}
//           </span>
//         }
//       />

//       {/* ── ORDER NUMBER ── */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
//         <div className="flex items-center justify-between">
//           <p className="text-gray-400 text-xs">Order Number</p>
//           <button
//             onClick={() => {
//               navigator.clipboard.writeText(order.orderSn);
//               toast.success("Copied!");
//             }}
//             className="text-xs font-medium"
//             style={{ color: "#f02d65" }}
//           >
//             Copy
//           </button>
//         </div>
//         <p className="text-gray-700 text-sm font-bold mt-1 tracking-wide">
//           {order.orderSn}
//         </p>
//         <p className="text-gray-400 text-xs mt-1">
//           {new Date(order.createdAt).toLocaleString("en-US", {
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </p>
//       </div>

//       {/* ── PRODUCTS ── */}
//       <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 text-sm font-bold mb-3">
//           Products ({order.products?.length})
//         </p>
//         <div className="space-y-3">
//           {order.products?.map((product, i) => (
//             <div key={i} className="flex gap-3">
//               {/* Image */}
//               <div
//                 className="w-16 h-16 rounded-xl overflow-hidden
//                 bg-pink-50 flex items-center justify-center flex-shrink-0
//                 border border-pink-100"
//               >
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt=""
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-2xl">📦</span>
//                 )}
//               </div>
//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 <p
//                   className="text-gray-700 text-sm font-medium
//                   line-clamp-2 leading-snug"
//                 >
//                   {product.title}
//                 </p>
//                 <div className="flex items-center justify-between mt-1.5">
//                   <p className="text-gray-400 text-xs">×{product.quantity}</p>
//                   <p className="text-gray-700 text-sm font-bold">
//                     ${(product.price * product.quantity).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── BUYER INFO ── */}
//       <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 text-sm font-bold mb-3">
//           Buyer Information
//         </p>
//         <div className="space-y-2.5">
//           {[
//             { icon: "👤", label: "Buyer", value: order.buyerName },
//             { icon: "📞", label: "Phone", value: order.phoneNumber },
//             {
//               icon: "📍",
//               label: "Address",
//               value: order.shippingAddress,
//             },
//             { icon: "🌍", label: "Country", value: order.country },
//           ].map((item, i) => (
//             <div key={i} className="flex gap-3">
//               <span className="text-base w-5 flex-shrink-0">{item.icon}</span>
//               <div className="flex-1">
//                 <p className="text-gray-400 text-[10px]">{item.label}</p>
//                 <p className="text-gray-700 text-sm">{item.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── FINANCIAL SUMMARY ── */}
//       <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 text-sm font-bold mb-3">
//           Financial Summary
//         </p>
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400 text-sm">Total Payment</span>
//             <span className="text-red-400 font-bold">
//               -${order.totalCost?.toFixed(2)}
//             </span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-400 text-sm">Selling Price</span>
//             <span className="text-gray-600 font-medium">
//               ${order.sellingPrice?.toFixed(2)}
//             </span>
//           </div>
//           <div className="h-px bg-gray-100" />
//           <div className="flex justify-between items-center">
//             <span className="text-gray-700 text-sm font-bold">
//               Total Earnings
//             </span>
//             <span className="text-green-500 font-bold text-lg">
//               +${order.earnings?.toFixed(2)}
//             </span>
//           </div>
//           {order.profitConfirmed && (
//             <div
//               className="flex items-center gap-2 mt-2 p-2
//               bg-green-50 rounded-xl"
//             >
//               <span className="text-green-500">✓</span>
//               <span className="text-green-600 text-xs font-medium">
//                 Profit confirmed by admin
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── LOGISTICS TIMELINE ── */}
//       {order.logisticsInfo && order.logisticsInfo.length > 0 && (
//         <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <p className="text-gray-700 text-sm font-bold">
//               Logistics Timeline
//             </p>
//             {order.trackingNumber && (
//               <p className="text-gray-400 text-[10px]">
//                 TN: {order.trackingNumber?.slice(-8)}
//               </p>
//             )}
//           </div>

//           <div className="relative">
//             {/* Vertical line */}
//             <div
//               className="absolute left-[7px] top-2 bottom-2
//               w-0.5 bg-gray-100"
//             />

//             <div className="space-y-4">
//               {[...order.logisticsInfo].reverse().map((log, i) => (
//                 <div key={i} className="flex gap-3 relative">
//                   {/* Dot */}
//                   <div
//                     className={`w-3.5 h-3.5 rounded-full flex-shrink-0
//                     mt-0.5 border-2 z-10 ${
//                       i === 0
//                         ? "border-pink-500 bg-pink-500"
//                         : "border-gray-300 bg-white"
//                     }`}
//                   />
//                   <div className="flex-1">
//                     <p
//                       className={`text-sm leading-snug ${
//                         i === 0
//                           ? "font-bold text-gray-800"
//                           : "text-gray-400 text-xs"
//                       }`}
//                     >
//                       {log.status}
//                     </p>
//                     <p className="text-gray-300 text-[10px] mt-0.5">
//                       {new Date(log.time).toLocaleString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── NO LOGISTICS YET ── */}
//       {(!order.logisticsInfo || order.logisticsInfo.length === 0) &&
//         order.status !== "pendingPayment" && (
//           <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//             <p className="text-gray-700 text-sm font-bold mb-2">Logistics</p>
//             <p className="text-gray-400 text-sm text-center py-4">
//               - No logistics information available -
//             </p>
//           </div>
//         )}

//       {/* ── PICKUP BUTTON ── */}
//       {order.status === "pendingPayment" && (
//         <div
//           className="fixed bottom-0 left-1/2 -translate-x-1/2
//           w-full max-w-[620px] bg-white border-t border-gray-100
//           p-4 shadow-lg z-50"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-gray-500 text-sm">Cost to pickup:</span>
//             <span className="text-red-400 font-bold text-lg">
//               ${order.totalCost?.toFixed(2)}
//             </span>
//           </div>
//           <button
//             onClick={() => setShowPickupModal(true)}
//             className="w-full py-4 rounded-xl text-white font-bold
//               text-base shadow-lg active:scale-95 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//             }}
//           >
//             CLICK TO PICKUP 📦
//           </button>
//         </div>
//       )}

//       {/* ── PICKUP CONFIRMATION MODAL ── */}
//       {showPickupModal && (
//         <div
//           className="fixed inset-0 bg-black/50 z-50 flex items-end
//           justify-center"
//         >
//           <div
//             className="bg-white w-full max-w-[480px] rounded-t-3xl
//             p-6 animate-slide-up"
//           >
//             <div className="text-center mb-6">
//               <span className="text-5xl">📦</span>
//               <h3 className="text-gray-800 font-bold text-lg mt-3">
//                 Confirm Pickup
//               </h3>
//               <p className="text-gray-400 text-sm mt-1">
//                 This will deduct from your wallet balance
//               </p>
//             </div>

//             {/* Summary */}
//             <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-500 text-sm">Order Cost</span>
//                 <span className="text-red-400 font-bold">
//                   -${order.totalCost?.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500 text-sm">Expected Profit</span>
//                 <span className="text-green-500 font-bold">
//                   +${order.earnings?.toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowPickupModal(false)}
//                 className="flex-1 py-3.5 rounded-xl border-2
//                   border-gray-200 text-gray-500 font-bold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => pickupMutation.mutate()}
//                 disabled={pickupMutation.isPending}
//                 className="flex-1 py-3.5 rounded-xl text-white
//                   font-bold shadow-lg active:scale-95 transition-all
//                   disabled:opacity-70"
//                 style={{
//                   background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//                 }}
//               >
//                 {pickupMutation.isPending ? "Processing..." : "Confirm Pickup"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ── REFUND REQUEST BUTTON ── */}
//       {(order.status === "pendingShipment" || order.status === "shipped") && (
//         <div
//           className="fixed bottom-0 left-1/2 -translate-x-1/2
//     w-full max-w-[620px] bg-white border-t border-gray-100
//     p-4 shadow-lg z-50"
//         >
//           <button
//             onClick={() => navigate(`/refund-request?orderSn=${order.orderSn}`)}
//             style={{
//               width: "100%",
//               padding: "14px",
//               borderRadius: "12px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               color: "#fff",
//               border: "none",
//               cursor: "pointer",
//               background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
//               boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//             }}
//           >
//             ↩ Request Refund for This Order
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetail;

////////////////////////// latest version (by gemeni) =============================//////////////////////////

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";
// import {
//   Package,
//   User,
//   Phone,
//   MapPin,
//   Globe,
//   Wallet,
//   CheckCircle2,
//   Clock,
//   Copy,
//   Loader2,
//   Undo2,
//   Truck,
//   PackageX,
// } from "lucide-react";

// // ── Live Countdown Component ──
// const Countdown = ({ deadline }) => {
//   const [timeLeft, setTimeLeft] = useState("");

//   useEffect(() => {
//     const calculateTime = () => {
//       const now = new Date().getTime();
//       const end = new Date(deadline).getTime();
//       const distance = end - now;

//       if (distance < 0) {
//         setTimeLeft("Expired");
//         return;
//       }

//       const h = Math.floor(
//         (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
//       );
//       const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       const s = Math.floor((distance % (1000 * 60)) / 1000);

//       setTimeLeft(`${h}h ${m}m ${s}s`);
//     };
//     calculateTime();
//     const timer = setInterval(calculateTime, 1000);
//     return () => clearInterval(timer);
//   }, [deadline]);

//   return <span>{timeLeft}</span>;
// };

// const OrderDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [showPickupModal, setShowPickupModal] = useState(false);

//   // Fetch order detail
//   const { data: order, isLoading } = useQuery({
//     queryKey: ["order", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/orders/${id}`);
//       return data;
//     },
//   });

//   // Pickup mutation
//   const pickupMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.put(`/orders/${id}/pickup`);
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Order picked up successfully!");
//       queryClient.invalidateQueries(["order", id]);
//       queryClient.invalidateQueries(["myOrders"]);
//       queryClient.invalidateQueries(["myStore"]);
//       queryClient.invalidateQueries(["merchantProfile"]);
//       queryClient.invalidateQueries(["me"]);
//       setShowPickupModal(false);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Pickup failed");
//       setShowPickupModal(false);
//     },
//   });

//   const getStatusConfig = (status) => {
//     const map = {
//       pendingPayment: {
//         label: "Waiting Pickup",
//         color: "#f02d65",
//         bg: "#fff1f2",
//       },
//       pendingShipment: { label: "Processing", color: "#d97706", bg: "#fef3c7" },
//       shipped: { label: "Shipped", color: "#3b82f6", bg: "#eff6ff" },
//       received: { label: "Received", color: "#8b5cf6", bg: "#f5f3ff" },
//       completed: { label: "Completed", color: "#10b981", bg: "#ecfdf5" },
//       cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2" },
//     };
//     return map[status] || { label: status, color: "#64748b", bg: "#f1f5f9" };
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
//         <Loader2 size={32} className="animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <PackageX size={48} className="mx-auto text-gray-300 mb-3" />
//           <p className="text-gray-500 font-bold">Order not found</p>
//           <button
//             onClick={() => navigate("/orders")}
//             className="mt-6 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md"
//             style={{
//               background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//             }}
//           >
//             Back to Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const statusCfg = getStatusConfig(order.status);

//   return (
//     <div
//       className="min-h-screen bg-gray-50 pb-32"
//       style={{ margin: "0 auto", maxWidth: "620px" }}
//     >
//       {/* Top Bar */}
//       <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
//         <TopBar
//           title="Order Details"
//           backgroundColor="#1e293b"
//           textColor="text-white"
//           showBack={true}
//           rightElement={
//             <span
//               className="text-[10px] px-2 py-1 rounded-full font-bold shadow-sm"
//               style={{ background: statusCfg.bg, color: statusCfg.color }}
//             >
//               {statusCfg.label}
//             </span>
//           }
//         />
//       </div>

//       <div
//         style={{
//           padding: "16px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "16px",
//         }}
//       >
//         {/* ── LIVE COUNTDOWN ALERT (If Pending Payment) ── */}
//         {order.status === "pendingPayment" && order.pickupDeadline && (
//           <div
//             style={{
//               backgroundColor: "#fffbeb",
//               padding: "16px",
//               borderRadius: "12px",
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//               border: "1px dashed #fde68a",
//               boxShadow: "0 4px 15px rgba(217, 119, 6, 0.05)",
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "#fef3c7",
//                 padding: "8px",
//                 borderRadius: "50%",
//               }}
//             >
//               <Clock size={20} color="#d97706" />
//             </div>
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: "12px",
//                   color: "#b45309",
//                   fontWeight: "600",
//                 }}
//               >
//                 Time remaining to pickup
//               </p>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: "16px",
//                   color: "#92400e",
//                   fontWeight: "900",
//                   fontFamily: "monospace",
//                 }}
//               >
//                 <Countdown deadline={order.pickupDeadline} />
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ── ORDER NUMBER & DATE ── */}
//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "16px",
//             padding: "20px",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
//           }}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
//               Order Number
//             </p>
//             <button
//               onClick={() => {
//                 navigator.clipboard.writeText(order.orderSn);
//                 toast.success("Copied!");
//               }}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "#f02d65",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "4px",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//               }}
//             >
//               <Copy size={12} /> Copy
//             </button>
//           </div>
//           <p className="text-gray-900 text-base font-black font-monospace tracking-wide mb-3">
//             {order.orderSn}
//           </p>
//           <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
//             <Clock size={14} className="text-gray-400" />
//             <p className="text-gray-500 text-xs font-medium">
//               Created: {new Date(order.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* ── PRODUCTS ── */}
//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "16px",
//             padding: "20px",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
//           }}
//         >
//           <p className="text-gray-800 text-sm font-bold mb-4 flex items-center gap-2">
//             <Package size={18} className="text-gray-400" /> Products (
//             {order.products?.length})
//           </p>
//           <div className="space-y-4">
//             {order.products?.map((product, i) => (
//               <div key={i} className="flex gap-4 items-center">
//                 <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
//                   {product.image ? (
//                     <img
//                       src={product.image}
//                       alt=""
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <Package size={24} className="text-gray-300" />
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-gray-800 text-sm font-bold line-clamp-2 leading-snug mb-1">
//                     {product.title}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <p className="text-gray-500 text-xs font-medium">
//                       Qty: {product.quantity}
//                     </p>
//                     <p className="text-gray-900 text-sm font-black font-monospace">
//                       ${(product.price * product.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── BUYER INFO ── */}
//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "16px",
//             padding: "20px",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
//           }}
//         >
//           <p className="text-gray-800 text-sm font-bold mb-4 flex items-center gap-2">
//             <User size={18} className="text-gray-400" /> Buyer Information
//           </p>
//           <div className="space-y-3">
//             {[
//               { icon: User, label: "Name", value: order.buyerName },
//               { icon: Phone, label: "Phone", value: order.phoneNumber },
//               { icon: MapPin, label: "Address", value: order.shippingAddress },
//               { icon: Globe, label: "Country", value: order.country },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-100"
//               >
//                 <item.icon
//                   size={16}
//                   className="text-gray-400 mt-0.5 flex-shrink-0"
//                 />
//                 <div className="flex-1">
//                   <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
//                     {item.label}
//                   </p>
//                   <p className="text-gray-800 text-sm font-medium leading-snug">
//                     {item.value}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── FINANCIAL SUMMARY ── */}
//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "16px",
//             padding: "20px",
//             boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
//           }}
//         >
//           <p className="text-gray-800 text-sm font-bold mb-4 flex items-center gap-2">
//             <Wallet size={18} className="text-gray-400" /> Financial Summary
//           </p>
//           <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 text-sm font-medium">
//                 Total Cost (Deduct)
//               </span>
//               <span className="text-red-500 font-bold font-monospace">
//                 -${order.totalCost?.toFixed(2)}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 text-sm font-medium">
//                 Selling Price
//               </span>
//               <span className="text-gray-800 font-bold font-monospace">
//                 ${order.sellingPrice?.toFixed(2)}
//               </span>
//             </div>
//             <div className="h-px bg-gray-200 my-1" />
//             <div className="flex justify-between items-center">
//               <span className="text-gray-900 text-sm font-black">
//                 Expected Profit
//               </span>
//               <span className="text-emerald-500 font-black text-lg font-monospace">
//                 +${order.earnings?.toFixed(2)}
//               </span>
//             </div>
//           </div>
//           {order.profitConfirmed && (
//             <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
//               <CheckCircle2 size={16} />
//               <span className="text-xs font-bold">
//                 Profit confirmed and added to wallet
//               </span>
//             </div>
//           )}
//         </div>

//         {/* ── LOGISTICS TIMELINE ── */}
//         {order.logisticsInfo && order.logisticsInfo.length > 0 ? (
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "16px",
//               padding: "20px",
//               boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
//             }}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-gray-800 text-sm font-bold flex items-center gap-2">
//                 <Truck size={18} className="text-gray-400" /> Logistics Tracking
//               </p>
//               {order.trackingNumber && (
//                 <span className="text-gray-500 text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">
//                   TN: {order.trackingNumber?.slice(-8)}
//                 </span>
//               )}
//             </div>

//             <div className="relative ml-2">
//               <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100" />
//               <div className="space-y-6">
//                 {[...order.logisticsInfo].reverse().map((log, i) => (
//                   <div key={i} className="flex gap-4 relative">
//                     <div
//                       className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 border-[3px] z-10 ${
//                         i === 0
//                           ? "border-teal-500 bg-white"
//                           : "border-gray-300 bg-white"
//                       }`}
//                     />
//                     <div className="flex-1 pb-1">
//                       <p
//                         className={`text-sm leading-snug ${
//                           i === 0
//                             ? "font-bold text-gray-800"
//                             : "font-medium text-gray-500"
//                         }`}
//                       >
//                         {log.status}
//                       </p>
//                       <p className="text-gray-400 text-[11px] mt-1 font-medium">
//                         {new Date(log.time).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : (
//           order.status !== "pendingPayment" && (
//             <div
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "16px",
//                 padding: "24px",
//                 textAlign: "center",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
//               }}
//             >
//               <Truck size={32} className="mx-auto text-gray-200 mb-2" />
//               <p className="text-gray-400 text-sm font-medium">
//                 No logistics data available yet
//               </p>
//             </div>
//           )
//         )}
//       </div>

//       {/* ── FLOATING ACTION BUTTONS ── */}
//       {order.status === "pendingPayment" && (
//         <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[620px] bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
//           <div className="flex items-center justify-between mb-3 px-2">
//             <span className="text-gray-500 text-sm font-bold">
//               Cost to pickup:
//             </span>
//             <span className="text-gray-900 font-black text-xl font-monospace">
//               ${order.totalCost?.toFixed(2)}
//             </span>
//           </div>
//           <button
//             onClick={() => setShowPickupModal(true)}
//             className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//             style={{
//               background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//             }}
//           >
//             <Wallet size={18} /> PAY & PICKUP ORDER
//           </button>
//         </div>
//       )}

//       {(order.status === "pendingShipment" || order.status === "shipped") && (
//         <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[620px] bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
//           <button
//             onClick={() => navigate(`/refund-request?orderSn=${order.orderSn}`)}
//             className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//             style={{
//               background: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
//             }}
//           >
//             <Undo2 size={18} /> REQUEST REFUND
//           </button>
//         </div>
//       )}

//       {/* ── PICKUP CONFIRMATION MODAL ── */}
//       {showPickupModal && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
//           <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 pb-8 animate-slide-up shadow-2xl border-t border-gray-100">
//             <div className="text-center mb-6 pt-2">
//               <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
//                 <Wallet size={32} color="#f02d65" />
//               </div>
//               <h3 className="text-gray-900 font-black text-xl">
//                 Confirm Payment
//               </h3>
//               <p className="text-gray-500 text-sm mt-2 font-medium px-4">
//                 This will deduct the cost price from your wallet balance to
//                 process the order.
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm font-bold">
//                   Wallet Deduction
//                 </span>
//                 <span className="text-red-500 font-black text-lg font-monospace">
//                   -${order.totalCost?.toFixed(2)}
//                 </span>
//               </div>
//               <div className="h-px bg-gray-200" />
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500 text-sm font-bold">
//                   Expected Return
//                 </span>
//                 <span className="text-emerald-500 font-black text-lg font-monospace">
//                   +${(order.totalCost + order.earnings)?.toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowPickupModal(false)}
//                 className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-bold bg-white hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => pickupMutation.mutate()}
//                 disabled={pickupMutation.isPending}
//                 className="flex-[2] py-3.5 rounded-xl text-white font-bold shadow-md active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                 }}
//               >
//                 {pickupMutation.isPending ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" /> Processing...
//                   </>
//                 ) : (
//                   "Confirm Payment"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetail;



/////////////////////// ========================= latest versio (by claude) =========================//////////////////

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import {
  Package, User, Phone, MapPin, Globe, Wallet,
  CheckCircle2, Clock, Copy, Loader2, Undo2,
  Truck, PackageX, TrendingUp, ArrowLeft,
} from "lucide-react";

const Countdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgent, setUrgent] = useState(false);
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const distance = end - now;
      if (distance < 0) { setTimeLeft("Expired"); return; }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setUrgent(h < 2);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  return <span style={{ fontFamily: "monospace", fontWeight: "900", color: urgent ? "#ef4444" : "#92400e" }}>{timeLeft}</span>;
};

const STATUS_MAP = {
  pendingPayment:  { label: "Wait Pickup", color: "#f02d65", bg: "#fff1f2" },
  pendingShipment: { label: "Processing",  color: "#d97706", bg: "#fef3c7" },
  shipped:         { label: "Shipped",     color: "#3b82f6", bg: "#eff6ff" },
  received:        { label: "Received",    color: "#8b5cf6", bg: "#f5f3ff" },
  completed:       { label: "Completed",   color: "#10b981", bg: "#ecfdf5" },
  cancelled:       { label: "Cancelled",   color: "#ef4444", bg: "#fef2f2" },
};

// Section card wrapper
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: "14px", overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9",
    ...style,
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title, right }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px", borderBottom: "1px solid #f8fafc",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "8px",
        background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={15} color="#64748b" />
      </div>
      <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{title}</span>
    </div>
    {right}
  </div>
);

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPickupModal, setShowPickupModal] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await API.get(`/orders/${id}`);
      return data;
    },
  });

  const pickupMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.put(`/orders/${id}/pickup`);
      return data;
    },
    onSuccess: () => {
      toast.success("Order picked up successfully!");
      queryClient.invalidateQueries(["order", id]);
      queryClient.invalidateQueries(["myOrders"]);
      queryClient.invalidateQueries(["myStore"]);
      queryClient.invalidateQueries(["merchantProfile"]);
      queryClient.invalidateQueries(["me"]);
      setShowPickupModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Pickup failed");
      setShowPickupModal(false);
    },
  });

  if (isLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", background: "#f8fafc" }}>
      <Loader2 size={28} color="#f02d65" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Loading order...</p>
    </div>
  );

  if (!order) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", background: "#f8fafc" }}>
      <PackageX size={40} color="#e2e8f0" />
      <p style={{ color: "#64748b", fontWeight: "700", margin: 0 }}>Order not found</p>
      <button onClick={() => navigate("/orders")} style={{
        padding: "10px 24px", borderRadius: "10px", background: "#1e293b",
        color: "#fff", fontWeight: "700", fontSize: "13px", border: "none", cursor: "pointer",
      }}>Back to Orders</button>
    </div>
  );

  const cfg = STATUS_MAP[order.status] || { label: order.status, color: "#64748b", bg: "#f1f5f9" };
  const isPending = order.status === "pendingPayment";
  const canRefund = order.status === "pendingShipment" || order.status === "shipped";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", maxWidth: "620px", margin: "0 auto", paddingBottom: "100px" }}>

      {/* ── HEADER ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={() => navigate("/orders")}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "7px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ArrowLeft size={16} color="#fff" />
            </button>

            <h1 style={{ color: "#fff", fontSize: "16px", fontWeight: "800", margin: 0 }}>Order Details</h1>

            <span style={{
              background: cfg.bg, color: cfg.color,
              padding: "5px 12px", borderRadius: "20px",
              fontSize: "11px", fontWeight: "700",
            }}>
              {cfg.label}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* ── COUNTDOWN ── */}
        {isPending && order.pickupDeadline && (
          <div style={{
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid #fde68a", borderRadius: "12px", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "#fef3c7", border: "1px solid #fde68a",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Clock size={20} color="#d97706" />
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#92400e", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Time Remaining
              </p>
              <p style={{ margin: 0, fontSize: "20px", color: "#78350f", fontWeight: "900", letterSpacing: "-0.5px" }}>
                <Countdown deadline={order.pickupDeadline} />
              </p>
            </div>
          </div>
        )}

        {/* ── ORDER NUMBER ── */}
        <Card>
          <CardHeader
            icon={Package}
            title="Order Number"
            right={
              <button
                onClick={() => { navigator.clipboard.writeText(order.orderSn); toast.success("Copied!"); }}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: "6px", padding: "5px 10px",
                  color: "#64748b", fontSize: "11px", fontWeight: "700", cursor: "pointer",
                }}
              >
                <Copy size={11} /> Copy
              </button>
            }
          />
          <div style={{ padding: "14px 16px" }}>
            <p style={{
              margin: "0 0 10px", fontFamily: "monospace", fontSize: "14px",
              fontWeight: "800", color: "#1e293b", letterSpacing: "0.5px",
              wordBreak: "break-all",
            }}>
              {order.orderSn}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={12} color="#94a3b8" />
              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>
                Created: {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* ── PRODUCTS ── */}
        <Card>
          <CardHeader icon={Package} title={`Products (${order.products?.length})`} />
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {order.products?.map((product, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "10px",
                  background: "#f8fafc", border: "1px solid #f1f5f9",
                  overflow: "hidden", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {product.image
                    ? <img src={product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Package size={20} color="#e2e8f0" />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: "#1e293b",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {product.title}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>Qty: {product.quantity}</span>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#1e293b", fontFamily: "monospace" }}>
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── BUYER INFO ── */}
        <Card>
          <CardHeader icon={User} title="Buyer Information" />
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { icon: User,   label: "Name",    value: order.buyerName },
              { icon: Phone,  label: "Phone",   value: order.phoneNumber },
              { icon: MapPin, label: "Address", value: order.shippingAddress },
              { icon: Globe,  label: "Country", value: order.country },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: "10px", alignItems: "flex-start",
                background: "#f8fafc", borderRadius: "8px", padding: "10px 12px",
                border: "1px solid #f1f5f9",
              }}>
                <item.icon size={14} color="#94a3b8" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#1e293b", fontWeight: "600" }}>
                    {item.value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── FINANCIAL SUMMARY ── */}
        <Card>
          <CardHeader icon={TrendingUp} title="Financial Summary" />
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>Total Cost (Deduct)</span>
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#ef4444", fontFamily: "monospace" }}>
                  -${order.totalCost?.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>Selling Price</span>
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#1e293b", fontFamily: "monospace" }}>
                  ${order.sellingPrice?.toFixed(2)}
                </span>
              </div>
              <div style={{ height: "1px", background: "#f1f5f9" }} />
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#ecfdf5", borderRadius: "8px", padding: "10px 12px",
                border: "1px solid #a7f3d0",
              }}>
                <span style={{ fontSize: "13px", color: "#065f46", fontWeight: "700" }}>Expected Profit</span>
                <span style={{ fontSize: "18px", fontWeight: "900", color: "#059669", fontFamily: "monospace" }}>
                  +${order.earnings?.toFixed(2)}
                </span>
              </div>
            </div>
            {order.profitConfirmed && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                marginTop: "12px", padding: "10px", borderRadius: "8px",
                background: "#ecfdf5", color: "#059669", fontSize: "12px", fontWeight: "700",
                border: "1px solid #a7f3d0",
              }}>
                <CheckCircle2 size={14} /> Profit confirmed and added to wallet
              </div>
            )}
          </div>
        </Card>

        {/* ── LOGISTICS ── */}
        {order.logisticsInfo && order.logisticsInfo.length > 0 ? (
          <Card>
            <CardHeader
              icon={Truck}
              title="Logistics Tracking"
              right={order.trackingNumber && (
                <span style={{
                  fontSize: "10px", fontWeight: "700", color: "#64748b",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: "6px", padding: "3px 8px", fontFamily: "monospace",
                }}>
                  TN: {order.trackingNumber?.slice(-8)}
                </span>
              )}
            />
            <div style={{ padding: "14px 16px" }}>
              <div style={{ position: "relative", marginLeft: "8px" }}>
                <div style={{ position: "absolute", left: "7px", top: "8px", bottom: "8px", width: "1px", background: "#e2e8f0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[...order.logisticsInfo].reverse().map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "15px", height: "15px", borderRadius: "50%", flexShrink: 0,
                        border: i === 0 ? "3px solid #10b981" : "3px solid #e2e8f0",
                        background: "#fff", marginTop: "2px", zIndex: 1,
                      }} />
                      <div>
                        <p style={{
                          margin: "0 0 2px", fontSize: "13px",
                          fontWeight: i === 0 ? "700" : "500",
                          color: i === 0 ? "#1e293b" : "#64748b",
                        }}>
                          {log.status}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>
                          {new Date(log.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : order.status !== "pendingPayment" && (
          <Card>
            <div style={{ padding: "28px", textAlign: "center" }}>
              <Truck size={28} color="#e2e8f0" style={{ marginBottom: "8px" }} />
              <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500", margin: 0 }}>
                No logistics data yet
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* ── FLOATING ACTION — PAY & PICKUP ── */}
      {isPending && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: "620px", background: "#fff",
          borderTop: "1px solid #f1f5f9", padding: "14px 16px",
          boxShadow: "0 -8px 30px rgba(0,0,0,0.08)", zIndex: 50,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Cost to pickup</span>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "#1e293b", fontFamily: "monospace" }}>
              ${order.totalCost?.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowPickupModal(true)}
            style={{
              width: "100%", padding: "15px", borderRadius: "12px",
              color: "#fff", fontWeight: "800", fontSize: "15px", border: "none",
              cursor: "pointer", letterSpacing: "0.3px",
              background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
              boxShadow: "0 6px 20px rgba(240,45,101,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <Wallet size={18} /> PAY & PICKUP ORDER
          </button>
        </div>
      )}

      {/* ── FLOATING ACTION — REFUND ── */}
      {canRefund && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: "620px", background: "#fff",
          borderTop: "1px solid #f1f5f9", padding: "14px 16px",
          boxShadow: "0 -8px 30px rgba(0,0,0,0.08)", zIndex: 50,
        }}>
          <button
            onClick={() => navigate(`/refund-request?orderSn=${order.orderSn}`)}
            style={{
              width: "100%", padding: "15px", borderRadius: "12px",
              color: "#fff", fontWeight: "800", fontSize: "15px", border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <Undo2 size={18} /> REQUEST REFUND
          </button>
        </div>
      )}

      {/* ── PICKUP CONFIRMATION MODAL ── */}
      {showPickupModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)",
          backdropFilter: "blur(4px)", zIndex: 100,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", width: "100%", maxWidth: "480px",
            borderRadius: "20px 20px 0 0", padding: "24px 20px 32px",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.2)",
          }}>
            {/* Modal handle */}
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e2e8f0", margin: "0 auto 20px" }} />

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: "#fff1f2", border: "1px solid #fecdd3",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <Wallet size={28} color="#f02d65" />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>
                Confirm Payment
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
                This will deduct the cost from your wallet to process the order.
              </p>
            </div>

            <div style={{
              background: "#f8fafc", borderRadius: "12px", padding: "16px",
              border: "1px solid #f1f5f9", marginBottom: "20px",
              display: "flex", flexDirection: "column", gap: "10px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Wallet Deduction</span>
                <span style={{ fontSize: "16px", fontWeight: "900", color: "#ef4444", fontFamily: "monospace" }}>
                  -${order.totalCost?.toFixed(2)}
                </span>
              </div>
              <div style={{ height: "1px", background: "#e2e8f0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Expected Return</span>
                <span style={{ fontSize: "16px", fontWeight: "900", color: "#10b981", fontFamily: "monospace" }}>
                  +${(order.totalCost + order.earnings)?.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowPickupModal(false)}
                style={{
                  flex: 1, padding: "14px", borderRadius: "12px",
                  border: "1px solid #e2e8f0", background: "#fff",
                  color: "#64748b", fontWeight: "700", fontSize: "14px", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => pickupMutation.mutate()}
                disabled={pickupMutation.isPending}
                style={{
                  flex: 2, padding: "14px", borderRadius: "12px",
                  border: "none", color: "#fff", fontWeight: "800", fontSize: "14px",
                  cursor: pickupMutation.isPending ? "not-allowed" : "pointer",
                  background: pickupMutation.isPending ? "#e2e8f0" : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                  boxShadow: pickupMutation.isPending ? "none" : "0 4px 14px rgba(240,45,101,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {pickupMutation.isPending
                  ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Processing...</>
                  : "Confirm Payment"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;