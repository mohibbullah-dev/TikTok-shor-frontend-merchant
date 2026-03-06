// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import TopBar from "../../components/TopBar";

// const Orders = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all");

//   const tabs = [
//     { key: "all", label: "All" },
//     { key: "pendingPayment", label: "Pickup" },
//     { key: "pendingShipment", label: "Processing" },
//     { key: "shipped", label: "Shipped" },
//     { key: "completed", label: "Done" },
//   ];

//   // Fetch orders based on active tab
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["myOrders", activeTab],
//     queryFn: async () => {
//       const status = activeTab === "all" ? "" : activeTab;
//       const { data } = await API.get(
//         `/orders/my-orders?${status ? `status=${status}` : ""}&limit=50`,
//       );
//       return data;
//     },
//   });

//   const orders = data?.orders || [];

//   // Status display helpers
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

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Top Bar */}
//       <TopBar title="My Orders" showBack={false} />

//       {/* ── TABS ── */}
//       <div className="bg-white sticky top-[52px] z-30 shadow-sm">
//         <div className="flex overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className="flex-shrink-0 px-4 py-3 text-sm font-medium
//                 transition-all relative whitespace-nowrap"
//               style={{
//                 color: activeTab === tab.key ? "#f02d65" : "#9ca3af",
//               }}
//             >
//               {tab.label}
//               {/* Active underline */}
//               {activeTab === tab.key && (
//                 <div
//                   className="absolute bottom-0 left-1/2 -translate-x-1/2
//                   w-6 h-0.5 rounded-full"
//                   style={{ background: "#f02d65" }}
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── ORDER LIST ── */}
//       <div className="p-4 space-y-3">
//         {isLoading ? (
//           // Loading skeleton
//           [...Array(3)].map((_, i) => (
//             <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
//               <div className="flex gap-3">
//                 <div className="w-16 h-16 bg-gray-200 rounded-xl" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-3 bg-gray-200 rounded w-3/4" />
//                   <div className="h-3 bg-gray-200 rounded w-1/2" />
//                   <div className="h-3 bg-gray-200 rounded w-1/4" />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : orders.length === 0 ? (
//           // Empty state
//           <div
//             className="flex flex-col items-center justify-center
//             py-20 text-center"
//           >
//             <span className="text-6xl mb-4">📭</span>
//             <p className="text-gray-500 font-medium">No orders found</p>
//             <p className="text-gray-300 text-sm mt-1">
//               {activeTab === "all"
//                 ? "Orders will appear here when dispatched"
//                 : `No ${getStatusLabel(activeTab)} orders`}
//             </p>
//           </div>
//         ) : (
//           orders.map((order) => (
//             <button
//               key={order._id}
//               onClick={() => navigate(`/orders/${order._id}`)}
//               className="w-full bg-white rounded-2xl p-4 shadow-sm
//                 active:shadow-md active:scale-[0.99] transition-all text-left"
//             >
//               {/* Order Header */}
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-gray-400 text-[11px]">
//                   Order #{order.orderSn?.slice(-10)}
//                 </p>
//                 <span
//                   className="text-[11px] px-2.5 py-1 rounded-full
//                     font-medium text-white"
//                   style={{ background: getStatusColor(order.status) }}
//                 >
//                   {getStatusLabel(order.status)}
//                 </span>
//               </div>

//               {/* Products */}
//               <div className="flex gap-3">
//                 {/* Product images - show max 3 */}
//                 <div className="flex -space-x-2">
//                   {order.products?.slice(0, 3).map((product, i) => (
//                     <div
//                       key={i}
//                       className="w-14 h-14 rounded-xl overflow-hidden
//                         border-2 border-white shadow-sm bg-pink-50
//                         flex items-center justify-center"
//                       style={{ zIndex: 3 - i }}
//                     >
//                       {product.image ? (
//                         <img
//                           src={product.image}
//                           alt=""
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-xl">📦</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order info */}
//                 <div className="flex-1 min-w-0">
//                   <p
//                     className="text-gray-700 text-sm font-medium
//                     line-clamp-1"
//                   >
//                     {order.products?.[0]?.title}
//                     {order.products?.length > 1 &&
//                       ` + ${order.products.length - 1} more`}
//                   </p>
//                   <p className="text-gray-400 text-xs mt-0.5">
//                     {order.products?.reduce((sum, p) => sum + p.quantity, 0)}{" "}
//                     items • {order.buyerName}
//                   </p>
//                   <p className="text-gray-300 text-[10px] mt-0.5">
//                     {new Date(order.createdAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>

//               {/* Divider */}
//               <div className="h-px bg-gray-100 my-3" />

//               {/* Footer: amounts + action */}
//               <div className="flex items-center justify-between">
//                 <div className="flex gap-4">
//                   <div>
//                     <p className="text-[10px] text-gray-400">Payment</p>
//                     <p className="text-sm font-bold text-red-400">
//                       -${order.totalCost?.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-[10px] text-gray-400">Earnings</p>
//                     <p className="text-sm font-bold text-green-500">
//                       +${order.earnings?.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Pickup button for pending orders */}
//                 {order.status === "pendingPayment" && (
//                   <div
//                     className="px-4 py-2 rounded-xl text-white text-xs
//                       font-bold shadow-sm"
//                     style={{
//                       background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//                     }}
//                   >
//                     PICKUP →
//                   </div>
//                 )}

//                 {order.status === "completed" && (
//                   <div
//                     className="px-3 py-1.5 rounded-xl text-xs
//                     font-bold text-green-500 bg-green-50 border
//                     border-green-100"
//                   >
//                     ✓ Profit Received
//                   </div>
//                 )}
//               </div>
//             </button>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default Orders;

//////////////////// ==================latest versio (gemeni)============================= ////////////////////////////////////
import { useState } from "react";
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
} from "lucide-react";

export default function Orders() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { key: "all", label: "All" },
    { key: "pendingPayment", label: "Wait Pickup" },
    { key: "pendingShipment", label: "Processing" },
    { key: "completed", label: "Completed" },
  ];

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
    onSuccess: (res) => {
      toast.success("Order picked up! Cost deducted from wallet.");
      queryClient.invalidateQueries(["myOrders"]);
      queryClient.invalidateQueries(["myStore"]); // Refresh wallet
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to pickup order. Check balance.",
      );
    },
  });

  const orders = data?.orders || [];
  const filtered = searchQuery
    ? orders.filter(
        (o) =>
          o.orderSn.includes(searchQuery) ||
          o.products[0]?.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : orders;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusConfig = (status) => {
    const map = {
      pendingPayment: {
        label: "Waiting for Pickup",
        color: "#f02d65",
        bg: "#fff1f2",
        border: "#fecdd3",
      },
      pendingShipment: {
        label: "Pending Shipment",
        color: "#d97706",
        bg: "#fef3c7",
        border: "#fde68a",
      },
      shipped: {
        label: "Shipped",
        color: "#3b82f6",
        bg: "#eff6ff",
        border: "#bfdbfe",
      },
      received: {
        label: "Received",
        color: "#8b5cf6",
        bg: "#f5f3ff",
        border: "#ddd6fe",
      },
      completed: {
        label: "Completed",
        color: "#10b981",
        bg: "#ecfdf5",
        border: "#a7f3d0",
      },
      cancelled: {
        label: "Cancelled",
        color: "#64748b",
        bg: "#f1f5f9",
        border: "#e2e8f0",
      },
    };
    return map[status] || map.pendingPayment;
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "90px" }}
    >
      {/* ── STICKY TOP BAR ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            Order Processing
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            borderBottom: "1px solid #f1f5f9",
          }}
          className="custom-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0,
                padding: "14px 20px",
                fontSize: "14px",
                fontWeight: "bold",
                border: "none",
                background: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                color: activeTab === tab.key ? "#f02d65" : "#64748b",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #f02d65"
                    : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              color="#9ca3af"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order number..."
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#1e293b",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── ORDER LIST ── */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <Loader2 size={32} className="animate-spin text-rose-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <PackageX
              size={48}
              color="#cbd5e1"
              style={{ margin: "0 auto 16px auto" }}
            />
            <p
              style={{
                color: "#1e293b",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "0 0 8px 0",
              }}
            >
              No Orders Found
            </p>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              You have no orders in this status.
            </p>
          </div>
        ) : (
          filtered.map((order) => {
            const statusCfg = getStatusConfig(order.status);
            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                  border: `1px solid ${statusCfg.border}`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: "1px dashed #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1e293b",
                        fontSize: "13px",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                      }}
                    >
                      SN: {order.orderSn}
                    </span>
                    <button
                      onClick={() => copyToClipboard(order.orderSn)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "#9ca3af",
                        display: "flex",
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <span
                    style={{
                      backgroundColor: statusCfg.bg,
                      color: statusCfg.color,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                {/* Products */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          backgroundColor: "#f8fafc",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="product"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <PackageX color="#cbd5e1" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "13px",
                            color: "#1e293b",
                            fontWeight: "600",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.title}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          Qty: {item.quantity} ×{" "}
                          <span style={{ fontFamily: "monospace" }}>
                            ${item.price.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "12px",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom:
                      order.status === "pendingPayment" ? "16px" : "0",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px 0",
                        fontSize: "11px",
                        color: "#64748b",
                      }}
                    >
                      Order Cost (Deducted)
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: "#1e293b",
                        fontWeight: "900",
                        fontFamily: "monospace",
                      }}
                    >
                      ${order.totalCost?.toFixed(2)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        margin: "0 0 2px 0",
                        fontSize: "11px",
                        color: "#64748b",
                      }}
                    >
                      Estimated Commission
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: "#10b981",
                        fontWeight: "900",
                        fontFamily: "monospace",
                      }}
                    >
                      +${order.earnings?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Action Button (Crucial Logic) */}
                {order.status === "pendingPayment" && (
                  <button
                    onClick={() => pickupMutation.mutate(order._id)}
                    disabled={pickupMutation.isPending}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#fff",
                      border: "none",
                      cursor: pickupMutation.isPending
                        ? "not-allowed"
                        : "pointer",
                      background: pickupMutation.isPending
                        ? "#cbd5e1"
                        : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                      boxShadow: pickupMutation.isPending
                        ? "none"
                        : "0 4px 15px rgba(240, 45, 101, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "transform 0.1s",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.98)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {pickupMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Wallet size={16} /> Pay & Pickup Order
                      </>
                    )}
                  </button>
                )}

                {order.status === "completed" && (
                  <div
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      backgroundColor: "#ecfdf5",
                      color: "#059669",
                      fontSize: "12px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <CheckCircle2 size={16} /> Commission Paid to Wallet
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
