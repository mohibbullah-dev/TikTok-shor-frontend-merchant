import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import TopBar from "../../components/TopBar";

const Orders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "All" },
    { key: "pendingPayment", label: "Pickup" },
    { key: "pendingShipment", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "completed", label: "Done" },
  ];

  // Fetch orders based on active tab
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myOrders", activeTab],
    queryFn: async () => {
      const status = activeTab === "all" ? "" : activeTab;
      const { data } = await API.get(
        `/orders/my-orders?${status ? `status=${status}` : ""}&limit=50`,
      );
      return data;
    },
  });

  const orders = data?.orders || [];

  // Status display helpers
  const getStatusLabel = (status) => {
    const labels = {
      pendingPayment: "Pending Pickup",
      pendingShipment: "Processing",
      shipped: "Shipped",
      received: "Received",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pendingPayment: "#f59e0b",
      pendingShipment: "#3b82f6",
      shipped: "#8b5cf6",
      received: "#06b6d4",
      completed: "#22c55e",
      cancelled: "#ef4444",
    };
    return colors[status] || "#888";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <TopBar title="My Orders" showBack={false} />

      {/* ── TABS ── */}
      <div className="bg-white sticky top-[52px] z-30 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-4 py-3 text-sm font-medium
                transition-all relative whitespace-nowrap"
              style={{
                color: activeTab === tab.key ? "#f02d65" : "#9ca3af",
              }}
            >
              {tab.label}
              {/* Active underline */}
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2
                  w-6 h-0.5 rounded-full"
                  style={{ background: "#f02d65" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── ORDER LIST ── */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          // Empty state
          <div
            className="flex flex-col items-center justify-center
            py-20 text-center"
          >
            <span className="text-6xl mb-4">📭</span>
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-300 text-sm mt-1">
              {activeTab === "all"
                ? "Orders will appear here when dispatched"
                : `No ${getStatusLabel(activeTab)} orders`}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <button
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm
                active:shadow-md active:scale-[0.99] transition-all text-left"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-[11px]">
                  Order #{order.orderSn?.slice(-10)}
                </p>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full
                    font-medium text-white"
                  style={{ background: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Products */}
              <div className="flex gap-3">
                {/* Product images - show max 3 */}
                <div className="flex -space-x-2">
                  {order.products?.slice(0, 3).map((product, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-xl overflow-hidden
                        border-2 border-white shadow-sm bg-pink-50
                        flex items-center justify-center"
                      style={{ zIndex: 3 - i }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-gray-700 text-sm font-medium
                    line-clamp-1"
                  >
                    {order.products?.[0]?.title}
                    {order.products?.length > 1 &&
                      ` + ${order.products.length - 1} more`}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {order.products?.reduce((sum, p) => sum + p.quantity, 0)}{" "}
                    items • {order.buyerName}
                  </p>
                  <p className="text-gray-300 text-[10px] mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-3" />

              {/* Footer: amounts + action */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400">Payment</p>
                    <p className="text-sm font-bold text-red-400">
                      -${order.totalCost?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Earnings</p>
                    <p className="text-sm font-bold text-green-500">
                      +${order.earnings?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Pickup button for pending orders */}
                {order.status === "pendingPayment" && (
                  <div
                    className="px-4 py-2 rounded-xl text-white text-xs
                      font-bold shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                    }}
                  >
                    PICKUP →
                  </div>
                )}

                {order.status === "completed" && (
                  <div
                    className="px-3 py-1.5 rounded-xl text-xs
                    font-bold text-green-500 bg-green-50 border
                    border-green-100"
                  >
                    ✓ Profit Received
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;
