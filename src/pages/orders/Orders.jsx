//////////////////// ==================latest versio (gemeni)============================= ////////////////////////////////////
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Search,
//   Loader2,
//   PackageX,
//   Copy,
//   Clock,
//   Wallet,
//   CheckCircle2,
// } from "lucide-react";

// export default function Orders() {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const tabs = [
//     { key: "all", label: "All" },
//     { key: "pendingPayment", label: "Wait Pickup" },
//     { key: "pendingShipment", label: "Processing" },
//     { key: "completed", label: "Completed" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["myOrders", activeTab],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/orders/my-orders${activeTab !== "all" ? `?status=${activeTab}` : ""}`,
//       );
//       return data;
//     },
//   });

//   const pickupMutation = useMutation({
//     mutationFn: async (orderId) => {
//       const { data } = await API.put(`/orders/${orderId}/pickup`);
//       return data;
//     },
//     onSuccess: (res) => {
//       toast.success("Order picked up! Cost deducted from wallet.");
//       queryClient.invalidateQueries(["myOrders"]);
//       queryClient.invalidateQueries(["myStore"]); // Refresh wallet
//     },
//     onError: (err) => {
//       toast.error(
//         err.response?.data?.message || "Failed to pickup order. Check balance.",
//       );
//     },
//   });

//   const orders = data?.orders || [];
//   const filtered = searchQuery
//     ? orders.filter(
//         (o) =>
//           o.orderSn.includes(searchQuery) ||
//           o.products[0]?.title
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()),
//       )
//     : orders;

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Copied to clipboard");
//   };

//   const getStatusConfig = (status) => {
//     const map = {
//       pendingPayment: {
//         label: "Waiting for Pickup",
//         color: "#f02d65",
//         bg: "#fff1f2",
//         border: "#fecdd3",
//       },
//       pendingShipment: {
//         label: "Pending Shipment",
//         color: "#d97706",
//         bg: "#fef3c7",
//         border: "#fde68a",
//       },
//       shipped: {
//         label: "Shipped",
//         color: "#3b82f6",
//         bg: "#eff6ff",
//         border: "#bfdbfe",
//       },
//       received: {
//         label: "Received",
//         color: "#8b5cf6",
//         bg: "#f5f3ff",
//         border: "#ddd6fe",
//       },
//       completed: {
//         label: "Completed",
//         color: "#10b981",
//         bg: "#ecfdf5",
//         border: "#a7f3d0",
//       },
//       cancelled: {
//         label: "Cancelled",
//         color: "#64748b",
//         bg: "#f1f5f9",
//         border: "#e2e8f0",
//       },
//     };
//     return map[status] || map.pendingPayment;
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-50 flex flex-col relative"
//       style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "90px" }}
//     >
//       {/* ── STICKY TOP BAR ── */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 40,
//           backgroundColor: "#fff",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//         }}
//       >
//         <div
//           style={{
//             padding: "16px 20px",
//             background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <h1
//             style={{
//               color: "#fff",
//               fontSize: "18px",
//               fontWeight: "bold",
//               margin: 0,
//               letterSpacing: "0.5px",
//             }}
//           >
//             Order Processing
//           </h1>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             overflowX: "auto",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//           className="custom-scrollbar"
//         >
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 flexShrink: 0,
//                 padding: "14px 20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 border: "none",
//                 background: "none",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 color: activeTab === tab.key ? "#f02d65" : "#64748b",
//                 borderBottom:
//                   activeTab === tab.key
//                     ? "2px solid #f02d65"
//                     : "2px solid transparent",
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
//           <div style={{ position: "relative" }}>
//             <Search
//               size={16}
//               color="#9ca3af"
//               style={{
//                 position: "absolute",
//                 left: "16px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//               }}
//             />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search order number..."
//               style={{
//                 width: "100%",
//                 padding: "12px 16px 12px 40px",
//                 backgroundColor: "#f8fafc",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "12px",
//                 fontSize: "13px",
//                 color: "#1e293b",
//                 outline: "none",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── ORDER LIST ── */}
//       <div
//         style={{
//           padding: "16px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "16px",
//         }}
//       >
//         {isLoading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "40px",
//             }}
//           >
//             <Loader2 size={32} className="animate-spin text-rose-500" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               backgroundColor: "#fff",
//               borderRadius: "16px",
//               border: "1px dashed #cbd5e1",
//             }}
//           >
//             <PackageX
//               size={48}
//               color="#cbd5e1"
//               style={{ margin: "0 auto 16px auto" }}
//             />
//             <p
//               style={{
//                 color: "#1e293b",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 margin: "0 0 8px 0",
//               }}
//             >
//               No Orders Found
//             </p>
//             <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
//               You have no orders in this status.
//             </p>
//           </div>
//         ) : (
//           filtered.map((order) => {
//             const statusCfg = getStatusConfig(order.status);
//             return (
//               <div
//                 key={order._id}
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "16px",
//                   padding: "20px",
//                   boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
//                   border: `1px solid ${statusCfg.border}`,
//                 }}
//               >
//                 {/* Header */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "16px",
//                     paddingBottom: "12px",
//                     borderBottom: "1px dashed #e2e8f0",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#1e293b",
//                         fontSize: "13px",
//                         fontWeight: "bold",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       SN: {order.orderSn}
//                     </span>
//                     <button
//                       onClick={() => copyToClipboard(order.orderSn)}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: 0,
//                         color: "#9ca3af",
//                         display: "flex",
//                       }}
//                     >
//                       <Copy size={14} />
//                     </button>
//                   </div>
//                   <span
//                     style={{
//                       backgroundColor: statusCfg.bg,
//                       color: statusCfg.color,
//                       padding: "4px 10px",
//                       borderRadius: "20px",
//                       fontSize: "11px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {statusCfg.label}
//                   </span>
//                 </div>

//                 {/* Products */}
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "12px",
//                     marginBottom: "16px",
//                   }}
//                 >
//                   {order.products.map((item, idx) => (
//                     <div
//                       key={idx}
//                       style={{
//                         display: "flex",
//                         gap: "12px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "60px",
//                           height: "60px",
//                           borderRadius: "8px",
//                           backgroundColor: "#f8fafc",
//                           overflow: "hidden",
//                           flexShrink: 0,
//                           border: "1px solid #f1f5f9",
//                         }}
//                       >
//                         {item.image ? (
//                           <img
//                             src={item.image}
//                             alt="product"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         ) : (
//                           <PackageX color="#cbd5e1" />
//                         )}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <p
//                           style={{
//                             margin: "0 0 4px 0",
//                             fontSize: "13px",
//                             color: "#1e293b",
//                             fontWeight: "600",
//                             display: "-webkit-box",
//                             WebkitLineClamp: 2,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                           }}
//                         >
//                           {item.title}
//                         </p>
//                         <p
//                           style={{
//                             margin: 0,
//                             fontSize: "12px",
//                             color: "#64748b",
//                           }}
//                         >
//                           Qty: {item.quantity} ×{" "}
//                           <span style={{ fontFamily: "monospace" }}>
//                             ${item.price.toFixed(2)}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Financial Summary */}
//                 <div
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     padding: "12px",
//                     borderRadius: "12px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom:
//                       order.status === "pendingPayment" ? "16px" : "0",
//                   }}
//                 >
//                   <div>
//                     <p
//                       style={{
//                         margin: "0 0 2px 0",
//                         fontSize: "11px",
//                         color: "#64748b",
//                       }}
//                     >
//                       Order Cost (Deducted)
//                     </p>
//                     <p
//                       style={{
//                         margin: 0,
//                         fontSize: "16px",
//                         color: "#1e293b",
//                         fontWeight: "900",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       ${order.totalCost?.toFixed(2)}
//                     </p>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <p
//                       style={{
//                         margin: "0 0 2px 0",
//                         fontSize: "11px",
//                         color: "#64748b",
//                       }}
//                     >
//                       Estimated Commission
//                     </p>
//                     <p
//                       style={{
//                         margin: 0,
//                         fontSize: "16px",
//                         color: "#10b981",
//                         fontWeight: "900",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       +${order.earnings?.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Action Button (Crucial Logic) */}
//                 {order.status === "pendingPayment" && (
//                   <button
//                     onClick={() => pickupMutation.mutate(order._id)}
//                     disabled={pickupMutation.isPending}
//                     style={{
//                       width: "100%",
//                       padding: "14px",
//                       borderRadius: "12px",
//                       fontSize: "14px",
//                       fontWeight: "bold",
//                       color: "#fff",
//                       border: "none",
//                       cursor: pickupMutation.isPending
//                         ? "not-allowed"
//                         : "pointer",
//                       background: pickupMutation.isPending
//                         ? "#cbd5e1"
//                         : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                       boxShadow: pickupMutation.isPending
//                         ? "none"
//                         : "0 4px 15px rgba(240, 45, 101, 0.3)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "8px",
//                       transition: "transform 0.1s",
//                     }}
//                     onMouseDown={(e) =>
//                       (e.currentTarget.style.transform = "scale(0.98)")
//                     }
//                     onMouseUp={(e) =>
//                       (e.currentTarget.style.transform = "scale(1)")
//                     }
//                   >
//                     {pickupMutation.isPending ? (
//                       <Loader2 size={16} className="animate-spin" />
//                     ) : (
//                       <>
//                         <Wallet size={16} /> Pay & Pickup Order
//                       </>
//                     )}
//                   </button>
//                 )}

//                 {order.status === "completed" && (
//                   <div
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       borderRadius: "12px",
//                       backgroundColor: "#ecfdf5",
//                       color: "#059669",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "6px",
//                     }}
//                   >
//                     <CheckCircle2 size={16} /> Commission Paid to Wallet
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

//////////////////////// latest version (by gemeni)  ==================================//////////////////////////

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Search,
//   Loader2,
//   PackageX,
//   Copy,
//   Clock,
//   Wallet,
//   CheckCircle2,
//   ChevronRight,
// } from "lucide-react";

// // ── NEW: Live Countdown Component ──
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

// export default function Orders() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const tabs = [
//     { key: "all", label: "All" },
//     { key: "pendingPayment", label: "Wait Pickup" },
//     { key: "pendingShipment", label: "Processing" },
//     { key: "completed", label: "Completed" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["myOrders", activeTab],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/orders/my-orders${activeTab !== "all" ? `?status=${activeTab}` : ""}`,
//       );
//       return data;
//     },
//   });

//   const pickupMutation = useMutation({
//     mutationFn: async (orderId) => {
//       const { data } = await API.put(`/orders/${orderId}/pickup`);
//       return data;
//     },
//     onSuccess: (res) => {
//       toast.success("Order picked up! Cost deducted from wallet.");
//       queryClient.invalidateQueries(["myOrders"]);
//       queryClient.invalidateQueries(["myStore"]); // Refresh wallet
//     },
//     onError: (err) => {
//       toast.error(
//         err.response?.data?.message || "Failed to pickup order. Check balance.",
//       );
//     },
//   });

//   const orders = data?.orders || [];
//   const filtered = searchQuery
//     ? orders.filter(
//         (o) =>
//           o.orderSn.includes(searchQuery) ||
//           o.products[0]?.title
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()),
//       )
//     : orders;

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Copied to clipboard");
//   };

//   const getStatusConfig = (status) => {
//     const map = {
//       pendingPayment: {
//         label: "Waiting for Pickup",
//         color: "#f02d65",
//         bg: "#fff1f2",
//         border: "#fecdd3",
//       },
//       pendingShipment: {
//         label: "Pending Shipment",
//         color: "#d97706",
//         bg: "#fef3c7",
//         border: "#fde68a",
//       },
//       shipped: {
//         label: "Shipped",
//         color: "#3b82f6",
//         bg: "#eff6ff",
//         border: "#bfdbfe",
//       },
//       received: {
//         label: "Received",
//         color: "#8b5cf6",
//         bg: "#f5f3ff",
//         border: "#ddd6fe",
//       },
//       completed: {
//         label: "Completed",
//         color: "#10b981",
//         bg: "#ecfdf5",
//         border: "#a7f3d0",
//       },
//       cancelled: {
//         label: "Cancelled",
//         color: "#64748b",
//         bg: "#f1f5f9",
//         border: "#e2e8f0",
//       },
//     };
//     return map[status] || map.pendingPayment;
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-50 flex flex-col relative"
//       style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "90px" }}
//     >
//       {/* ── STICKY TOP BAR ── */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 40,
//           backgroundColor: "#fff",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//         }}
//       >
//         <div
//           style={{
//             padding: "16px 20px",
//             background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <h1
//             style={{
//               color: "#fff",
//               fontSize: "18px",
//               fontWeight: "bold",
//               margin: 0,
//               letterSpacing: "0.5px",
//             }}
//           >
//             Order Processing
//           </h1>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             overflowX: "auto",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//           className="custom-scrollbar"
//         >
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 flexShrink: 0,
//                 padding: "14px 20px",
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 border: "none",
//                 background: "none",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 color: activeTab === tab.key ? "#f02d65" : "#64748b",
//                 borderBottom:
//                   activeTab === tab.key
//                     ? "2px solid #f02d65"
//                     : "2px solid transparent",
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
//           <div style={{ position: "relative" }}>
//             <Search
//               size={16}
//               color="#9ca3af"
//               style={{
//                 position: "absolute",
//                 left: "16px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//               }}
//             />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search order number..."
//               style={{
//                 width: "100%",
//                 padding: "12px 16px 12px 40px",
//                 backgroundColor: "#f8fafc",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "12px",
//                 fontSize: "13px",
//                 color: "#1e293b",
//                 outline: "none",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── ORDER LIST ── */}
//       <div
//         style={{
//           padding: "16px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "16px",
//         }}
//       >
//         {isLoading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "40px",
//             }}
//           >
//             <Loader2 size={32} className="animate-spin text-rose-500" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               backgroundColor: "#fff",
//               borderRadius: "16px",
//               border: "1px dashed #cbd5e1",
//             }}
//           >
//             <PackageX
//               size={48}
//               color="#cbd5e1"
//               style={{ margin: "0 auto 16px auto" }}
//             />
//             <p
//               style={{
//                 color: "#1e293b",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 margin: "0 0 8px 0",
//               }}
//             >
//               No Orders Found
//             </p>
//             <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
//               You have no orders in this status.
//             </p>
//           </div>
//         ) : (
//           filtered.map((order) => {
//             const statusCfg = getStatusConfig(order.status);
//             return (
//               <div
//                 key={order._id}
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "16px",
//                   padding: "20px",
//                   boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
//                   border: `1px solid ${statusCfg.border}`,
//                 }}
//               >
//                 {/* ── CLICKABLE WRAPPER TO GO TO DETAILS ── */}
//                 <div
//                   onClick={() => navigate(`/orders/${order._id}`)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {/* Header */}
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom:
//                         order.status === "pendingPayment" ? "12px" : "16px",
//                       paddingBottom: "12px",
//                       borderBottom: "1px dashed #e2e8f0",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "#1e293b",
//                           fontSize: "13px",
//                           fontWeight: "bold",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         SN: {order.orderSn}
//                       </span>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // Stops card from navigating when copying
//                           copyToClipboard(order.orderSn);
//                         }}
//                         style={{
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                           padding: 0,
//                           color: "#9ca3af",
//                           display: "flex",
//                         }}
//                       >
//                         <Copy size={14} />
//                       </button>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           backgroundColor: statusCfg.bg,
//                           color: statusCfg.color,
//                           padding: "4px 10px",
//                           borderRadius: "20px",
//                           fontSize: "11px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {statusCfg.label}
//                       </span>
//                       <ChevronRight size={16} color="#cbd5e1" />
//                     </div>
//                   </div>

//                   {/* ── NEW: LIVE COUNTDOWN ALERT ── */}
//                   {order.status === "pendingPayment" &&
//                     order.pickupDeadline && (
//                       <div
//                         style={{
//                           marginBottom: "16px",
//                           backgroundColor: "#fffbeb",
//                           padding: "10px 14px",
//                           borderRadius: "8px",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           border: "1px dashed #fde68a",
//                         }}
//                       >
//                         <Clock size={16} color="#d97706" />
//                         <span
//                           style={{
//                             fontSize: "13px",
//                             color: "#b45309",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Time left to pickup:{" "}
//                           <span
//                             style={{
//                               fontFamily: "monospace",
//                               fontSize: "14px",
//                               marginLeft: "4px",
//                             }}
//                           >
//                             <Countdown deadline={order.pickupDeadline} />
//                           </span>
//                         </span>
//                       </div>
//                     )}

//                   {/* Products */}
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "12px",
//                       marginBottom: "16px",
//                     }}
//                   >
//                     {order.products.map((item, idx) => (
//                       <div
//                         key={idx}
//                         style={{
//                           display: "flex",
//                           gap: "12px",
//                           alignItems: "center",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "60px",
//                             height: "60px",
//                             borderRadius: "8px",
//                             backgroundColor: "#f8fafc",
//                             overflow: "hidden",
//                             flexShrink: 0,
//                             border: "1px solid #f1f5f9",
//                           }}
//                         >
//                           {item.image ? (
//                             <img
//                               src={item.image}
//                               alt="product"
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           ) : (
//                             <PackageX color="#cbd5e1" />
//                           )}
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <p
//                             style={{
//                               margin: "0 0 4px 0",
//                               fontSize: "13px",
//                               color: "#1e293b",
//                               fontWeight: "600",
//                               display: "-webkit-box",
//                               WebkitLineClamp: 2,
//                               WebkitBoxOrient: "vertical",
//                               overflow: "hidden",
//                             }}
//                           >
//                             {item.title}
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: "12px",
//                               color: "#64748b",
//                             }}
//                           >
//                             Qty: {item.quantity} ×{" "}
//                             <span style={{ fontFamily: "monospace" }}>
//                               ${item.price.toFixed(2)}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>{" "}
//                 {/* <-- Closes the clickable navigation wrapper */}
//                 {/* Financial Summary */}
//                 <div
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     padding: "12px",
//                     borderRadius: "12px",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom:
//                       order.status === "pendingPayment" ? "16px" : "0",
//                   }}
//                 >
//                   <div>
//                     <p
//                       style={{
//                         margin: "0 0 2px 0",
//                         fontSize: "11px",
//                         color: "#64748b",
//                       }}
//                     >
//                       Order Cost (Deducted)
//                     </p>
//                     <p
//                       style={{
//                         margin: 0,
//                         fontSize: "16px",
//                         color: "#1e293b",
//                         fontWeight: "900",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       ${order.totalCost?.toFixed(2)}
//                     </p>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <p
//                       style={{
//                         margin: "0 0 2px 0",
//                         fontSize: "11px",
//                         color: "#64748b",
//                       }}
//                     >
//                       Estimated Commission
//                     </p>
//                     <p
//                       style={{
//                         margin: 0,
//                         fontSize: "16px",
//                         color: "#10b981",
//                         fontWeight: "900",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       +${order.earnings?.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//                 {/* Action Button (Crucial Logic) */}
//                 {order.status === "pendingPayment" && (
//                   <button
//                     onClick={() => pickupMutation.mutate(order._id)}
//                     disabled={pickupMutation.isPending}
//                     style={{
//                       width: "100%",
//                       padding: "14px",
//                       borderRadius: "12px",
//                       fontSize: "14px",
//                       fontWeight: "bold",
//                       color: "#fff",
//                       border: "none",
//                       cursor: pickupMutation.isPending
//                         ? "not-allowed"
//                         : "pointer",
//                       background: pickupMutation.isPending
//                         ? "#cbd5e1"
//                         : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                       boxShadow: pickupMutation.isPending
//                         ? "none"
//                         : "0 4px 15px rgba(240, 45, 101, 0.3)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "8px",
//                       transition: "transform 0.1s",
//                     }}
//                     onMouseDown={(e) =>
//                       (e.currentTarget.style.transform = "scale(0.98)")
//                     }
//                     onMouseUp={(e) =>
//                       (e.currentTarget.style.transform = "scale(1)")
//                     }
//                   >
//                     {pickupMutation.isPending ? (
//                       <Loader2 size={16} className="animate-spin" />
//                     ) : (
//                       <>
//                         <Wallet size={16} /> Pay & Pickup Order
//                       </>
//                     )}
//                   </button>
//                 )}
//                 {order.status === "completed" && (
//                   <div
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       borderRadius: "12px",
//                       backgroundColor: "#ecfdf5",
//                       color: "#059669",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "6px",
//                     }}
//                   >
//                     <CheckCircle2 size={16} /> Commission Paid to Wallet
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

////////////////////// ======================== third latest version (by clauad) ============ ////////////////

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Search,
//   Loader2,
//   PackageX,
//   Copy,
//   Clock,
//   Wallet,
//   CheckCircle2,
//   ChevronRight,
//   ShoppingBag,
// } from "lucide-react";

// const Countdown = ({ deadline }) => {
//   const [timeLeft, setTimeLeft] = useState("");
//   const [urgent, setUrgent] = useState(false);

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
//       setUrgent(h < 2);
//       setTimeLeft(`${h}h ${m}m ${s}s`);
//     };
//     calculateTime();
//     const timer = setInterval(calculateTime, 1000);
//     return () => clearInterval(timer);
//   }, [deadline]);

//   return (
//     <span
//       style={{
//         fontFamily: "monospace",
//         fontWeight: "900",
//         fontSize: "15px",
//         color: urgent ? "#ef4444" : "#d97706",
//         letterSpacing: "0.5px",
//       }}
//     >
//       {timeLeft}
//     </span>
//   );
// };

// const STATUS_MAP = {
//   pendingPayment: {
//     label: "Wait Pickup",
//     color: "#f02d65",
//     bg: "#fff1f2",
//     dot: "#f02d65",
//   },
//   pendingShipment: {
//     label: "Processing",
//     color: "#d97706",
//     bg: "#fef3c7",
//     dot: "#d97706",
//   },
//   shipped: {
//     label: "Shipped",
//     color: "#3b82f6",
//     bg: "#eff6ff",
//     dot: "#3b82f6",
//   },
//   received: {
//     label: "Received",
//     color: "#8b5cf6",
//     bg: "#f5f3ff",
//     dot: "#8b5cf6",
//   },
//   completed: {
//     label: "Completed",
//     color: "#10b981",
//     bg: "#ecfdf5",
//     dot: "#10b981",
//   },
//   cancelled: {
//     label: "Cancelled",
//     color: "#94a3b8",
//     bg: "#f1f5f9",
//     dot: "#94a3b8",
//   },
// };

// const TABS = [
//   { key: "all", label: "All" },
//   { key: "pendingPayment", label: "Wait Pickup" },
//   { key: "pendingShipment", label: "Processing" },
//   { key: "completed", label: "Completed" },
// ];

// export default function Orders() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const { data, isLoading } = useQuery({
//     queryKey: ["myOrders", activeTab],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/orders/my-orders${activeTab !== "all" ? `?status=${activeTab}` : ""}`,
//       );
//       return data;
//     },
//   });

//   const pickupMutation = useMutation({
//     mutationFn: async (orderId) => {
//       const { data } = await API.put(`/orders/${orderId}/pickup`);
//       return data;
//     },
//     onSuccess: () => {
//       toast.success("Order picked up! Cost deducted from wallet.");
//       queryClient.invalidateQueries(["myOrders"]);
//       queryClient.invalidateQueries(["myStore"]);
//     },
//     onError: (err) => {
//       toast.error(
//         err.response?.data?.message || "Failed to pickup. Check balance.",
//       );
//     },
//   });

//   const orders = data?.orders || [];
//   const filtered = searchQuery
//     ? orders.filter(
//         (o) =>
//           o.orderSn.includes(searchQuery) ||
//           o.products[0]?.title
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()),
//       )
//     : orders;

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Copied!");
//   };

//   // Count per tab
//   const counts = {
//     all: orders.length,
//     pendingPayment: orders.filter((o) => o.status === "pendingPayment").length,
//     pendingShipment: orders.filter((o) => o.status === "pendingShipment")
//       .length,
//     completed: orders.filter((o) => o.status === "completed").length,
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8fafc",
//         maxWidth: "620px",
//         margin: "0 auto",
//         paddingBottom: "90px",
//       }}
//     >
//       {/* ── HEADER ── */}
//       <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
//         <div
//           style={{
//             background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
//             padding: "18px 20px 0",
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
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <div
//                 style={{
//                   width: "36px",
//                   height: "36px",
//                   borderRadius: "10px",
//                   background: "rgba(240,45,101,0.15)",
//                   border: "1px solid rgba(240,45,101,0.3)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <ShoppingBag size={18} color="#f02d65" />
//               </div>
//               <div>
//                 <h1
//                   style={{
//                     color: "#fff",
//                     fontSize: "18px",
//                     fontWeight: "800",
//                     margin: 0,
//                     letterSpacing: "-0.3px",
//                   }}
//                 >
//                   My Orders
//                 </h1>
//                 <p
//                   style={{
//                     color: "#64748b",
//                     fontSize: "11px",
//                     margin: 0,
//                     marginTop: "1px",
//                   }}
//                 >
//                   {orders.length} total orders
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ── TABS ── */}
//           <div style={{ display: "flex", gap: "4px" }}>
//             {TABS.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 style={{
//                   flex: 1,
//                   padding: "10px 4px",
//                   fontSize: "12px",
//                   fontWeight: "700",
//                   border: "none",
//                   background: "none",
//                   cursor: "pointer",
//                   color: activeTab === tab.key ? "#f02d65" : "#64748b",
//                   borderBottom:
//                     activeTab === tab.key
//                       ? "2px solid #f02d65"
//                       : "2px solid transparent",
//                   transition: "all 0.2s",
//                   position: "relative",
//                 }}
//               >
//                 {tab.label}
//                 {counts[tab.key] > 0 && (
//                   <span
//                     style={{
//                       marginLeft: "4px",
//                       fontSize: "10px",
//                       background: activeTab === tab.key ? "#f02d65" : "#334155",
//                       color: "#fff",
//                       borderRadius: "10px",
//                       padding: "1px 5px",
//                       fontWeight: "800",
//                     }}
//                   >
//                     {counts[tab.key]}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── SEARCH ── */}
//         <div
//           style={{
//             backgroundColor: "#fff",
//             padding: "12px 16px",
//             borderBottom: "1px solid #f1f5f9",
//           }}
//         >
//           <div style={{ position: "relative" }}>
//             <Search
//               size={15}
//               color="#94a3b8"
//               style={{
//                 position: "absolute",
//                 left: "14px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//               }}
//             />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by order number or product..."
//               style={{
//                 width: "100%",
//                 padding: "11px 14px 11px 38px",
//                 background: "#f8fafc",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "10px",
//                 fontSize: "13px",
//                 color: "#1e293b",
//                 outline: "none",
//                 boxSizing: "border-box",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── ORDER LIST ── */}
//       <div
//         style={{
//           padding: "16px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "12px",
//         }}
//       >
//         {isLoading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               padding: "60px",
//               flexDirection: "column",
//               gap: "12px",
//             }}
//           >
//             <Loader2
//               size={28}
//               color="#f02d65"
//               style={{ animation: "spin 1s linear infinite" }}
//             />
//             <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
//               Loading orders...
//             </p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               background: "#fff",
//               borderRadius: "16px",
//               border: "1px dashed #e2e8f0",
//             }}
//           >
//             <div
//               style={{
//                 width: "64px",
//                 height: "64px",
//                 borderRadius: "50%",
//                 background: "#f8fafc",
//                 border: "1px solid #e2e8f0",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 16px",
//               }}
//             >
//               <PackageX size={28} color="#cbd5e1" />
//             </div>
//             <p
//               style={{
//                 color: "#1e293b",
//                 fontSize: "15px",
//                 fontWeight: "700",
//                 margin: "0 0 6px",
//               }}
//             >
//               No orders here
//             </p>
//             <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
//               {activeTab === "all"
//                 ? "You have no orders yet."
//                 : `No ${STATUS_MAP[activeTab]?.label} orders.`}
//             </p>
//           </div>
//         ) : (
//           filtered.map((order) => {
//             const cfg = STATUS_MAP[order.status] || STATUS_MAP.pendingPayment;
//             const isPending = order.status === "pendingPayment";
//             return (
//               <div
//                 key={order._id}
//                 style={{
//                   background: "#fff",
//                   borderRadius: "14px",
//                   overflow: "hidden",
//                   border: isPending ? "1px solid #fecdd3" : "1px solid #f1f5f9",
//                   boxShadow: isPending
//                     ? "0 4px 20px rgba(240,45,101,0.07)"
//                     : "0 2px 8px rgba(0,0,0,0.04)",
//                 }}
//               >
//                 {/* Status bar top */}
//                 <div
//                   style={{
//                     height: "3px",
//                     background: isPending
//                       ? "linear-gradient(90deg, #f02d65, #ff6b35)"
//                       : cfg.bg,
//                   }}
//                 />

//                 <div style={{ padding: "16px" }}>
//                   {/* ── ORDER HEADER ── */}
//                   <div
//                     onClick={() => navigate(`/orders/${order._id}`)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginBottom: "12px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "6px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#94a3b8",
//                             fontSize: "11px",
//                             fontWeight: "600",
//                           }}
//                         >
//                           SN
//                         </span>
//                         <span
//                           style={{
//                             color: "#1e293b",
//                             fontSize: "12px",
//                             fontWeight: "700",
//                             fontFamily: "monospace",
//                           }}
//                         >
//                           {order.orderSn.slice(-12)}
//                         </span>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             copyToClipboard(order.orderSn);
//                           }}
//                           style={{
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             padding: "2px",
//                             color: "#cbd5e1",
//                             display: "flex",
//                           }}
//                         >
//                           <Copy size={12} />
//                         </button>
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "6px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "5px",
//                             background: cfg.bg,
//                             color: cfg.color,
//                             padding: "4px 10px",
//                             borderRadius: "20px",
//                             fontSize: "11px",
//                             fontWeight: "700",
//                           }}
//                         >
//                           <span
//                             style={{
//                               width: "5px",
//                               height: "5px",
//                               borderRadius: "50%",
//                               background: cfg.dot,
//                               display: "inline-block",
//                             }}
//                           />
//                           {cfg.label}
//                         </span>
//                         <ChevronRight size={14} color="#cbd5e1" />
//                       </div>
//                     </div>

//                     {/* ── COUNTDOWN ── */}
//                     {isPending && order.pickupDeadline && (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           background: "#fffbeb",
//                           border: "1px dashed #fde68a",
//                           borderRadius: "8px",
//                           padding: "8px 12px",
//                           marginBottom: "12px",
//                         }}
//                       >
//                         <Clock size={14} color="#d97706" />
//                         <span
//                           style={{
//                             fontSize: "12px",
//                             color: "#92400e",
//                             fontWeight: "600",
//                           }}
//                         >
//                           Pickup expires in:&nbsp;
//                           <Countdown deadline={order.pickupDeadline} />
//                         </span>
//                       </div>
//                     )}

//                     {/* ── PRODUCTS ── */}
//                     {order.products.slice(0, 2).map((item, idx) => (
//                       <div
//                         key={idx}
//                         style={{
//                           display: "flex",
//                           gap: "10px",
//                           alignItems: "center",
//                           marginBottom: "8px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "48px",
//                             height: "48px",
//                             borderRadius: "8px",
//                             background: "#f8fafc",
//                             border: "1px solid #f1f5f9",
//                             overflow: "hidden",
//                             flexShrink: 0,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           {item.image ? (
//                             <img
//                               src={item.image}
//                               alt=""
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           ) : (
//                             <PackageX size={18} color="#e2e8f0" />
//                           )}
//                         </div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <p
//                             style={{
//                               margin: "0 0 2px",
//                               fontSize: "13px",
//                               fontWeight: "600",
//                               color: "#1e293b",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {item.title}
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: "11px",
//                               color: "#94a3b8",
//                             }}
//                           >
//                             Qty: {item.quantity} ×{" "}
//                             <span style={{ fontFamily: "monospace" }}>
//                               ${item.price?.toFixed(2)}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                     {order.products.length > 2 && (
//                       <p
//                         style={{
//                           fontSize: "11px",
//                           color: "#94a3b8",
//                           margin: "0 0 8px",
//                           fontWeight: "600",
//                         }}
//                       >
//                         +{order.products.length - 2} more items
//                       </p>
//                     )}
//                   </div>

//                   {/* ── FINANCIAL ROW ── */}
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       background: "#f8fafc",
//                       borderRadius: "10px",
//                       padding: "10px 14px",
//                       marginBottom: isPending ? "12px" : "0",
//                       border: "1px solid #f1f5f9",
//                     }}
//                   >
//                     <div>
//                       <p
//                         style={{
//                           margin: "0 0 2px",
//                           fontSize: "10px",
//                           color: "#94a3b8",
//                           fontWeight: "600",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.5px",
//                         }}
//                       >
//                         Cost
//                       </p>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: "16px",
//                           fontWeight: "900",
//                           color: "#1e293b",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         ${order.totalCost?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div style={{ width: "1px", background: "#e2e8f0" }} />
//                     <div style={{ textAlign: "right" }}>
//                       <p
//                         style={{
//                           margin: "0 0 2px",
//                           fontSize: "10px",
//                           color: "#94a3b8",
//                           fontWeight: "600",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.5px",
//                         }}
//                       >
//                         Commission
//                       </p>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: "16px",
//                           fontWeight: "900",
//                           color: "#10b981",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         +${order.earnings?.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* ── ACTION BUTTONS ── */}
//                   {isPending && (
//                     <button
//                       onClick={() => pickupMutation.mutate(order._id)}
//                       disabled={pickupMutation.isPending}
//                       style={{
//                         width: "100%",
//                         padding: "13px",
//                         borderRadius: "10px",
//                         fontSize: "14px",
//                         fontWeight: "700",
//                         color: "#fff",
//                         border: "none",
//                         cursor: pickupMutation.isPending
//                           ? "not-allowed"
//                           : "pointer",
//                         background: pickupMutation.isPending
//                           ? "#e2e8f0"
//                           : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                         boxShadow: pickupMutation.isPending
//                           ? "none"
//                           : "0 4px 14px rgba(240,45,101,0.3)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                         transition: "all 0.2s",
//                       }}
//                     >
//                       {pickupMutation.isPending ? (
//                         <>
//                           <Loader2
//                             size={15}
//                             style={{ animation: "spin 1s linear infinite" }}
//                           />{" "}
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <Wallet size={15} /> Pay & Pickup Order
//                         </>
//                       )}
//                     </button>
//                   )}

//                   {order.status === "completed" && (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "6px",
//                         padding: "10px",
//                         borderRadius: "10px",
//                         background: "#ecfdf5",
//                         color: "#059669",
//                         fontSize: "12px",
//                         fontWeight: "700",
//                       }}
//                     >
//                       <CheckCircle2 size={14} /> Commission paid to wallet
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

////////////////////////// =============================== lates 4 version (by gemeni) ====================/////////////////

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Search,
//   Loader2,
//   PackageX,
//   Copy,
//   Clock,
//   Wallet,
//   CheckCircle2,
//   ChevronRight,
//   ShoppingBag,
// } from "lucide-react";

// const Countdown = ({ deadline }) => {
//   const [timeLeft, setTimeLeft] = useState("");
//   const [urgent, setUrgent] = useState(false);

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
//       setUrgent(h < 2);
//       setTimeLeft(`${h}h ${m}m ${s}s`);
//     };
//     calculateTime();
//     const timer = setInterval(calculateTime, 1000);
//     return () => clearInterval(timer);
//   }, [deadline]);

//   return (
//     <span
//       style={{
//         fontFamily: "monospace",
//         fontWeight: "800",
//         fontSize: "13px",
//         color: urgent ? "#ef4444" : "#d97706",
//         letterSpacing: "0.5px",
//       }}
//     >
//       {timeLeft}
//     </span>
//   );
// };

// const STATUS_MAP = {
//   pendingPayment: {
//     label: "Wait Pickup",
//     color: "#018784",
//     bg: "rgba(1,135,132,0.08)",
//     dot: "#018784",
//   },
//   pendingShipment: {
//     label: "Processing",
//     color: "#d97706",
//     bg: "#fef3c7",
//     dot: "#d97706",
//   },
//   shipped: {
//     label: "Shipped",
//     color: "#3b82f6",
//     bg: "#eff6ff",
//     dot: "#3b82f6",
//   },
//   received: {
//     label: "Received",
//     color: "#8b5cf6",
//     bg: "#f5f3ff",
//     dot: "#8b5cf6",
//   },
//   completed: {
//     label: "Completed",
//     color: "#10b981",
//     bg: "#ecfdf5",
//     dot: "#10b981",
//   },
//   cancelled: {
//     label: "Cancelled",
//     color: "#94a3b8",
//     bg: "#f1f5f9",
//     dot: "#94a3b8",
//   },
// };

// const TABS = [
//   { key: "all", label: "All orders" },
//   { key: "pendingPayment", label: "Waiting for Payment" },
//   { key: "pendingShipment", label: "Awaiting Pickup" },
//   { key: "completed", label: "Completed" },
// ];

// export default function Orders() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const { data, isLoading } = useQuery({
//     queryKey: ["myOrders", activeTab],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/orders/my-orders${activeTab !== "all" ? `?status=${activeTab}` : ""}`,
//       );
//       return data;
//     },
//   });

//   const pickupMutation = useMutation({
//     mutationFn: async (orderId) => {
//       const { data } = await API.put(`/orders/${orderId}/pickup`);
//       return data;
//     },
//     onSuccess: () => {
//       toast.success("Order picked up! Cost deducted from wallet.");
//       queryClient.invalidateQueries(["myOrders"]);
//       queryClient.invalidateQueries(["myStore"]);
//     },
//     onError: (err) => {
//       toast.error(
//         err.response?.data?.message || "Failed to pickup. Check balance.",
//       );
//     },
//   });

//   const orders = data?.orders || [];
//   const filtered = searchQuery
//     ? orders.filter(
//         (o) =>
//           o.orderSn.includes(searchQuery) ||
//           o.products[0]?.title
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()),
//       )
//     : orders;

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Copied!");
//   };

//   const counts = {
//     all: orders.length,
//     pendingPayment: orders.filter((o) => o.status === "pendingPayment").length,
//     pendingShipment: orders.filter((o) => o.status === "pendingShipment")
//       .length,
//     completed: orders.filter((o) => o.status === "completed").length,
//   };

//   return (
//     <div className="min-h-screen w-full relative flex justify-center bg-gray-100 font-sans">
//       <div
//         className="w-full flex flex-col overflow-x-hidden relative"
//         style={{
//           maxWidth: "480px",
//           minHeight: "100vh",
//           paddingBottom: "90px",
//           backgroundColor: "#f8fafc",
//         }}
//       >
//         {/* ════ STICKY HEADER ════ */}
//         <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
//           {/* Top bar — matches Home.jsx top bar exactly */}
//           <div
//             style={{
//               backgroundColor: "#018784",
//               padding: "14px 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <div
//                 style={{
//                   width: "34px",
//                   height: "34px",
//                   borderRadius: "10px",
//                   backgroundColor: "rgba(255,255,255,0.15)",
//                   border: "1px solid rgba(255,255,255,0.2)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <ShoppingBag size={17} color="#fff" strokeWidth={2} />
//               </div>
//               <div>
//                 <h1
//                   style={{
//                     color: "#fff",
//                     fontSize: "16px",
//                     fontWeight: "800",
//                     margin: 0,
//                     letterSpacing: "-0.3px",
//                   }}
//                 >
//                   My Orders
//                 </h1>
//                 <p
//                   style={{
//                     color: "rgba(255,255,255,0.7)",
//                     fontSize: "11px",
//                     margin: 0,
//                   }}
//                 >
//                   {orders.length} total orders
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Tabs — same pill style as Home quick actions tabs */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderBottom: "0.5px solid #e2e8f0",
//               overflowX: "auto",
//               scrollbarWidth: "none",
//               display: "flex",
//               gap: "0",
//             }}
//           >
//             {TABS.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 style={{
//                   flexShrink: 0,
//                   padding: "13px 14px 11px",
//                   fontSize: "12px",
//                   fontWeight: activeTab === tab.key ? "700" : "500",
//                   border: "none",
//                   background: "none",
//                   cursor: "pointer",
//                   color: activeTab === tab.key ? "#018784" : "#64748b",
//                   borderBottom:
//                     activeTab === tab.key
//                       ? "2px solid #018784"
//                       : "2px solid transparent",
//                   transition: "all 0.15s",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {tab.label}
//                 {counts[tab.key] > 0 && (
//                   <span
//                     style={{
//                       fontSize: "10px",
//                       backgroundColor:
//                         activeTab === tab.key ? "#018784" : "#f1f5f9",
//                       color: activeTab === tab.key ? "#fff" : "#64748b",
//                       borderRadius: "10px",
//                       padding: "1px 6px",
//                       fontWeight: "700",
//                     }}
//                   >
//                     {counts[tab.key]}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Search — matches Home.jsx / Distribution search style */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               padding: "10px 14px",
//               borderBottom: "0.5px solid #e2e8f0",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               <Search
//                 size={15}
//                 color="#94a3b8"
//                 style={{
//                   position: "absolute",
//                   left: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   pointerEvents: "none",
//                 }}
//               />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search by order number or product..."
//                 style={{
//                   width: "100%",
//                   padding: "9px 12px 9px 34px",
//                   backgroundColor: "#f8fafc",
//                   border: "0.5px solid #e2e8f0",
//                   borderRadius: "8px",
//                   fontSize: "13px",
//                   color: "#0f172a",
//                   outline: "none",
//                   boxSizing: "border-box",
//                   transition: "all 0.15s",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#018784";
//                   e.target.style.backgroundColor = "#fff";
//                   e.target.style.boxShadow = "0 0 0 3px rgba(1,135,132,0.08)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "#e2e8f0";
//                   e.target.style.backgroundColor = "#f8fafc";
//                   e.target.style.boxShadow = "none";
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ════ ORDER LIST ════ */}
//         <div
//           style={{
//             padding: "12px 12px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "10px",
//           }}
//         >
//           {isLoading ? (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: "60px",
//                 flexDirection: "column",
//                 gap: "12px",
//               }}
//             >
//               <Loader2 size={28} color="#018784" className="animate-spin" />
//               <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
//                 Loading orders...
//               </p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "60px 20px",
//                 backgroundColor: "#fff",
//                 borderRadius: "16px",
//                 border: "1px solid #e2e8f0",
//                 boxShadow:
//                   "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
//               }}
//             >
//               <div
//                 style={{
//                   width: "56px",
//                   height: "56px",
//                   borderRadius: "14px",
//                   backgroundColor: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   margin: "0 auto 14px",
//                 }}
//               >
//                 <PackageX size={24} color="#cbd5e1" />
//               </div>
//               <p
//                 style={{
//                   color: "#0f172a",
//                   fontSize: "14px",
//                   fontWeight: "700",
//                   margin: "0 0 4px",
//                   letterSpacing: "-0.2px",
//                 }}
//               >
//                 No orders here
//               </p>
//               <p
//                 style={{
//                   color: "#94a3b8",
//                   fontSize: "12px",
//                   margin: 0,
//                   fontWeight: "500",
//                 }}
//               >
//                 {activeTab === "all"
//                   ? "You have no orders yet."
//                   : `No ${STATUS_MAP[activeTab]?.label} orders.`}
//               </p>
//             </div>
//           ) : (
//             filtered.map((order) => {
//               const cfg = STATUS_MAP[order.status] || STATUS_MAP.pendingPayment;
//               const isPending = order.status === "pendingPayment";

//               return (
//                 <div
//                   key={order._id}
//                   style={{
//                     backgroundColor: "#fff",
//                     borderRadius: "16px",
//                     overflow: "hidden",
//                     border: "1px solid #e2e8f0",
//                     boxShadow:
//                       "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
//                   }}
//                 >
//                   {/* ── Order Header row — matches demo "..." + status layout ── */}
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "12px 14px 5px",
//                       borderBottom: "0.5px solid #f1f5f9",
//                     }}
//                   >
//                     {/* Order SN */}
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "#94a3b8",
//                           fontSize: "11px",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Order No.
//                       </span>
//                       <span
//                         style={{
//                           color: "#0f172a",
//                           fontSize: "11px",
//                           fontWeight: "700",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         {order.orderSn.slice(-12)}
//                       </span>
//                       <button
//                         onClick={() => copyToClipboard(order.orderSn)}
//                         style={{
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                           padding: "2px",
//                           color: "#cbd5e1",
//                           display: "flex",
//                         }}
//                       >
//                         <Copy size={11} />
//                       </button>
//                     </div>

//                     {/* Status badge */}
//                     <span
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: "4px",
//                         backgroundColor: cfg.bg,
//                         color: cfg.color,
//                         padding: "4px 10px",
//                         borderRadius: "20px",
//                         fontSize: "11px",
//                         fontWeight: "700",
//                       }}
//                     >
//                       <span
//                         style={{
//                           width: "5px",
//                           height: "5px",
//                           borderRadius: "50%",
//                           backgroundColor: cfg.dot,
//                           display: "inline-block",
//                           flexShrink: 0,
//                         }}
//                       />
//                       {cfg.label}
//                     </span>
//                   </div>

//                   {/* ── Order Body — clickable to detail ── */}
//                   <div
//                     onClick={() => navigate(`/orders/${order._id}`)}
//                     style={{ padding: "12px 14px", cursor: "pointer" }}
//                   >
//                     {/* Countdown — matches demo "Order timeout" banner */}
//                     {isPending && order.pickupDeadline && (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           backgroundColor: "#fffbeb",
//                           border: "1px solid #fde68a",
//                           borderRadius: "8px",
//                           padding: "8px 10px",
//                           marginBottom: "10px",
//                         }}
//                       >
//                         <Clock size={13} color="#d97706" />
//                         <span
//                           style={{
//                             fontSize: "11px",
//                             color: "#92400e",
//                             fontWeight: "600",
//                           }}
//                         >
//                           Order timeout:&nbsp;
//                           <Countdown deadline={order.pickupDeadline} />
//                         </span>
//                       </div>
//                     )}

//                     {/* Products — matches demo product row layout */}
//                     {order.products.slice(0, 2).map((item, idx) => (
//                       <div
//                         key={idx}
//                         style={{
//                           display: "flex",
//                           gap: "10px",
//                           alignItems: "center",
//                           marginBottom:
//                             idx < order.products.slice(0, 2).length - 1
//                               ? "8px"
//                               : "0",
//                         }}
//                       >
//                         {/* Product image */}
//                         <div
//                           style={{
//                             width: "64px",
//                             height: "64px",
//                             borderRadius: "10px",
//                             backgroundColor: "#f8fafc",
//                             border: "1px solid #e2e8f0",
//                             overflow: "hidden",
//                             flexShrink: 0,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           {item.image ? (
//                             <img
//                               src={item.image}
//                               alt=""
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           ) : (
//                             <PackageX size={20} color="#e2e8f0" />
//                           )}
//                         </div>

//                         {/* Product info — matches demo title + order number + items + price layout */}
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <p
//                             style={{
//                               margin: "0 0 3px",
//                               fontSize: "13px",
//                               fontWeight: "700",
//                               color: "#0f172a",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                               letterSpacing: "-0.2px",
//                             }}
//                           >
//                             {item.title}
//                           </p>
//                           <p
//                             style={{
//                               margin: "0 0 2px",
//                               fontSize: "11px",
//                               color: "#94a3b8",
//                               fontWeight: "500",
//                             }}
//                           >
//                             {new Date(order.createdAt).toLocaleString()}
//                           </p>
//                           <div
//                             style={{
//                               display: "flex",
//                               gap: "10px",
//                               alignItems: "center",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontSize: "11px",
//                                 color: "#64748b",
//                                 fontWeight: "500",
//                               }}
//                             >
//                               Items {item.quantity}
//                             </span>
//                             <span
//                               style={{
//                                 fontSize: "11px",
//                                 color: "#64748b",
//                                 fontWeight: "500",
//                               }}
//                             >
//                               ×{" "}
//                               <span
//                                 style={{
//                                   fontFamily: "monospace",
//                                   color: "#0f172a",
//                                   fontWeight: "700",
//                                 }}
//                               >
//                                 ${item.price?.toFixed(2)}
//                               </span>
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {order.products.length > 2 && (
//                       <p
//                         style={{
//                           fontSize: "11px",
//                           color: "#94a3b8",
//                           margin: "6px 0 0",
//                           fontWeight: "600",
//                         }}
//                       >
//                         +{order.products.length - 2} more items
//                       </p>
//                     )}
//                   </div>

//                   {/* ── Financial row — matches demo "Total Cost + Earnings" layout ── */}
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       margin: "0 14px 12px",
//                       backgroundColor: "#f8fafc",
//                       border: "1px solid #e2e8f0",
//                       borderRadius: "10px",
//                       padding: "10px 14px",
//                     }}
//                   >
//                     <div>
//                       <p
//                         style={{
//                           margin: "0 0 2px",
//                           fontSize: "10px",
//                           color: "#94a3b8",
//                           fontWeight: "600",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.4px",
//                         }}
//                       >
//                         Total Cost
//                       </p>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: "15px",
//                           fontWeight: "800",
//                           color: "#0f172a",
//                           fontFamily: "monospace",
//                           letterSpacing: "-0.3px",
//                         }}
//                       >
//                         ${order.totalCost?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div
//                       style={{
//                         width: "0.5px",
//                         height: "28px",
//                         backgroundColor: "#e2e8f0",
//                       }}
//                     />
//                     <div style={{ textAlign: "right" }}>
//                       <p
//                         style={{
//                           margin: "0 0 2px",
//                           fontSize: "10px",
//                           color: "#94a3b8",
//                           fontWeight: "600",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.4px",
//                         }}
//                       >
//                         Earnings
//                       </p>
//                       <p
//                         style={{
//                           margin: 0,
//                           fontSize: "15px",
//                           fontWeight: "800",
//                           color: "#018784",
//                           fontFamily: "monospace",
//                           letterSpacing: "-0.3px",
//                         }}
//                       >
//                         +${order.earnings?.toFixed(2)}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => navigate(`/orders/${order._id}`)}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "3px",
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         color: "#94a3b8",
//                         fontSize: "11px",
//                         fontWeight: "600",
//                         padding: 0,
//                       }}
//                     >
//                       Details <ChevronRight size={13} />
//                     </button>
//                   </div>

//                   {/* ── Action Button — matches demo "Click to Pickup" button ── */}
//                   {isPending && (
//                     <div style={{ padding: "0 14px 14px" }}>
//                       <button
//                         onClick={() => pickupMutation.mutate(order._id)}
//                         disabled={pickupMutation.isPending}
//                         style={{
//                           width: "100%",
//                           padding: "12px",
//                           borderRadius: "10px",
//                           fontSize: "13px",
//                           fontWeight: "700",
//                           color: "#fff",
//                           border: "none",
//                           cursor: pickupMutation.isPending
//                             ? "not-allowed"
//                             : "pointer",
//                           backgroundColor: pickupMutation.isPending
//                             ? "#e2e8f0"
//                             : "#018784",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: "8px",
//                           transition: "all 0.15s",
//                           letterSpacing: "-0.2px",
//                         }}
//                         onMouseDown={(e) =>
//                           (e.currentTarget.style.transform = "scale(0.98)")
//                         }
//                         onMouseUp={(e) =>
//                           (e.currentTarget.style.transform = "scale(1)")
//                         }
//                       >
//                         {pickupMutation.isPending ? (
//                           <>
//                             <Loader2 size={14} className="animate-spin" />{" "}
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             <Wallet size={14} /> Click to Pickup
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   )}

//                   {order.status === "completed" && (
//                     <div style={{ padding: "0 14px 14px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: "6px",
//                           padding: "10px",
//                           borderRadius: "10px",
//                           backgroundColor: "rgba(1,135,132,0.06)",
//                           border: "1px solid rgba(1,135,132,0.1)",
//                           color: "#018784",
//                           fontSize: "12px",
//                           fontWeight: "700",
//                         }}
//                       >
//                         <CheckCircle2 size={13} /> Commission paid to wallet
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>

//         <BottomNav />
//       </div>
//     </div>
//   );
// }

///////////////////// ====================== latest 5 version (be gemeni) =========================///////////////////////

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import {
  Search,
  Loader2,
  PackageX,
  Copy,
  Clock,
  Wallet,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const Countdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const distance = end - now;
      if (distance < 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setUrgent(h < 2);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <span
      style={{
        fontFamily: "monospace",
        fontWeight: "800",
        fontSize: "13px",
        color: urgent ? "#ef4444" : "#d97706",
      }}
    >
      {timeLeft}
    </span>
  );
};

const STATUS_MAP = {
  pendingPayment: {
    label: "Wait Pickup",
    color: "#018784",
    bg: "rgba(1,135,132,0.08)",
    dot: "#018784",
  },
  pendingShipment: {
    label: "Processing",
    color: "#d97706",
    bg: "#fef3c7",
    dot: "#d97706",
  },
  shipped: {
    label: "Shipped",
    color: "#3b82f6",
    bg: "#eff6ff",
    dot: "#3b82f6",
  },
  received: {
    label: "Received",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    dot: "#8b5cf6",
  },
  completed: {
    label: "Completed",
    color: "#10b981",
    bg: "#ecfdf5",
    dot: "#10b981",
  },
  cancelled: {
    label: "Cancelled",
    color: "#94a3b8",
    bg: "#f1f5f9",
    dot: "#94a3b8",
  },
};

const TABS = [
  { key: "all", label: "All orders" },
  { key: "pendingPayment", label: "Waiting for Payment" },
  { key: "pendingShipment", label: "Awaiting Pickup" },
  { key: "completed", label: "Completed" },
];

export default function Orders() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["myOrders", activeTab],
    queryFn: async () => {
      const { data } = await API.get(
        `/orders/my-orders${activeTab !== "all" ? `?status=${activeTab}` : ""}`,
      );
      return data;
    },
  });

  const pickupMutation = useMutation({
    mutationFn: async (orderId) => {
      const { data } = await API.put(`/orders/${orderId}/pickup`);
      return data;
    },
    onSuccess: () => {
      toast.success("Order picked up! Cost deducted from wallet.");
      queryClient.invalidateQueries(["myOrders"]);
      queryClient.invalidateQueries(["myStore"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to pickup. Check balance.",
      );
    },
  });

  const orders = data?.orders || [];
  const filtered = searchQuery
    ? orders.filter(
        (o) =>
          o.orderSn.includes(searchQuery) ||
          o.products[0]?.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : orders;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const counts = {
    all: orders.length,
    pendingPayment: orders.filter((o) => o.status === "pendingPayment").length,
    pendingShipment: orders.filter((o) => o.status === "pendingShipment")
      .length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100 font-sans">
      <div
        className="w-full flex flex-col overflow-x-hidden relative"
        style={{
          maxWidth: "480px",
          minHeight: "100vh",
          paddingBottom: "90px",
          backgroundColor: "#f8fafc",
        }}
      >
        {/* ════ STICKY HEADER ════ */}
        <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
          {/* Top bar */}
          <div
            style={{
              backgroundColor: "#018784",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={17} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <h1
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "800",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                My Orders
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "11px",
                  margin: 0,
                }}
              >
                {orders.length} total orders
              </p>
            </div>
          </div>

          {/* Tabs — scrollable, underline style */}
          <div
            style={{
              backgroundColor: "#fff",
              borderBottom: "0.5px solid #e2e8f0",
              overflowX: "auto",
              scrollbarWidth: "none",
              display: "flex",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flexShrink: 0,
                  padding: "12px 14px 10px",
                  fontSize: "12px",
                  fontWeight: activeTab === tab.key ? "700" : "500",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: activeTab === tab.key ? "#018784" : "#64748b",
                  borderBottom:
                    activeTab === tab.key
                      ? "2px solid #018784"
                      : "2px solid transparent",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      backgroundColor:
                        activeTab === tab.key ? "#018784" : "#f1f5f9",
                      color: activeTab === tab.key ? "#fff" : "#64748b",
                      borderRadius: "10px",
                      padding: "1px 6px",
                      fontWeight: "700",
                    }}
                  >
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "10px 14px",
              borderBottom: "0.5px solid #e2e8f0",
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={15}
                color="#94a3b8"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number or product..."
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 34px",
                  backgroundColor: "#f8fafc",
                  border: "0.5px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#018784";
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(1,135,132,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* ════ ORDER LIST ════ */}
        <div
          style={{
            padding: "12px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Loader2 size={28} color="#018784" className="animate-spin" />
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                Loading orders...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <PackageX size={24} color="#cbd5e1" />
              </div>
              <p
                style={{
                  color: "#0f172a",
                  fontSize: "14px",
                  fontWeight: "700",
                  margin: "0 0 4px",
                  letterSpacing: "-0.2px",
                }}
              >
                No orders here
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "12px",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                {activeTab === "all"
                  ? "You have no orders yet."
                  : `No ${STATUS_MAP[activeTab]?.label} orders.`}
              </p>
            </div>
          ) : (
            filtered.map((order) => {
              const cfg = STATUS_MAP[order.status] || STATUS_MAP.pendingPayment;
              const isPending = order.status === "pendingPayment";

              return (
                <div
                  key={order._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* ── ROW 1: Order number + status — exactly like demo top row ── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 14px 10px",
                      borderBottom: "0.5px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "11px",
                          fontWeight: "500",
                        }}
                      >
                        Order Number:
                      </span>
                      <span
                        style={{
                          color: "#0f172a",
                          fontSize: "11px",
                          fontWeight: "700",
                          fontFamily: "monospace",
                        }}
                      >
                        {order.orderSn.slice(-16)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(order.orderSn)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "#cbd5e1",
                          display: "flex",
                        }}
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: cfg.bg,
                        color: cfg.color,
                        padding: "3px 9px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: cfg.dot,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {cfg.label}
                    </span>
                  </div>

                  {/* ── ROW 2: countdown if pending ── */}
                  {isPending && order.pickupDeadline && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        backgroundColor: "#fffbeb",
                        borderBottom: "0.5px solid #fde68a",
                        padding: "8px 14px",
                      }}
                    >
                      <Clock size={13} color="#d97706" />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#92400e",
                          fontWeight: "600",
                        }}
                      >
                        Order timeout:&nbsp;
                        <Countdown deadline={order.pickupDeadline} />
                      </span>
                    </div>
                  )}

                  {/* ── ROW 3: BIG image LEFT + product details RIGHT — exact demo layout ── */}
                  <div
                    onClick={() => navigate(`/orders/${order._id}`)}
                    style={{
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {order.products.slice(0, 2).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Large product image — matches demo tall-ish square image */}
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            flexShrink: 0,
                            borderRadius: "10px",
                            overflow: "hidden",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <PackageX size={22} color="#e2e8f0" />
                          )}
                        </div>

                        {/* Right column: title → order SN → date → items × price */}
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "#0f172a",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: "1.4",
                              letterSpacing: "-0.2px",
                            }}
                          >
                            {item.title}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "10px",
                              color: "#94a3b8",
                              fontWeight: "500",
                              fontFamily: "monospace",
                            }}
                          >
                            {order.orderSn}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "10px",
                              color: "#94a3b8",
                              fontWeight: "500",
                            }}
                          >
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginTop: "2px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                fontWeight: "600",
                              }}
                            >
                              Items&nbsp;{item.quantity}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                fontWeight: "500",
                              }}
                            >
                              Total Cost&nbsp;
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  color: "#0f172a",
                                  fontWeight: "800",
                                }}
                              >
                                ${order.totalCost?.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "1px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                fontWeight: "500",
                              }}
                            >
                              Selling Price&nbsp;
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  color: "#0f172a",
                                  fontWeight: "800",
                                }}
                              >
                                ${item.price?.toFixed(2)}
                              </span>
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                fontWeight: "500",
                                marginLeft: "8px",
                              }}
                            >
                              Earnings&nbsp;
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  color: "#018784",
                                  fontWeight: "800",
                                }}
                              >
                                ${order.earnings?.toFixed(2)}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {order.products.length > 2 && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          margin: 0,
                          fontWeight: "600",
                        }}
                      >
                        +{order.products.length - 2} more items
                      </p>
                    )}
                  </div>

                  {/* ── ROW 4: Details link — matches demo "Details" text link ── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      padding: "0 14px 10px",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#018784",
                        fontSize: "12px",
                        fontWeight: "700",
                        padding: 0,
                      }}
                    >
                      Details <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* ── ROW 5: Pickup button — full width like demo ── */}
                  {isPending && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <button
                        onClick={() => pickupMutation.mutate(order._id)}
                        disabled={pickupMutation.isPending}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#fff",
                          border: "none",
                          cursor: pickupMutation.isPending
                            ? "not-allowed"
                            : "pointer",
                          backgroundColor: pickupMutation.isPending
                            ? "#e2e8f0"
                            : "#018784",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          transition: "all 0.15s",
                        }}
                        onMouseDown={(e) =>
                          (e.currentTarget.style.transform = "scale(0.98)")
                        }
                        onMouseUp={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        {pickupMutation.isPending ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wallet size={14} /> Click to Pickup
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {order.status === "completed" && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "10px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(1,135,132,0.06)",
                          border: "1px solid rgba(1,135,132,0.1)",
                          color: "#018784",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        <CheckCircle2 size={13} /> Commission paid to wallet
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
