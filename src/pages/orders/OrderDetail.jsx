import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPickupModal, setShowPickupModal] = useState(false);

  // Fetch order detail
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await API.get(`/orders/${id}`);
      return data;
    },
  });

  // Pickup mutation
  const pickupMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.put(`/orders/${id}/pickup`);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Order picked up successfully!");
      queryClient.invalidateQueries(["order", id]);
      queryClient.invalidateQueries(["myOrders"]);
      queryClient.invalidateQueries(["myStore"]);
      setShowPickupModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Pickup failed");
      setShowPickupModal(false);
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="Order Detail" />
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 animate-pulse h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center
        justify-center"
      >
        <div className="text-center">
          <span className="text-5xl">❌</span>
          <p className="text-gray-500 mt-3">Order not found</p>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 px-6 py-2 rounded-xl text-white text-sm font-bold"
            style={{ background: "#f02d65" }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Bar */}
      <TopBar
        title="Order Detail"
        rightElement={
          <span
            className="text-[11px] px-2 py-1 rounded-full text-white font-medium"
            style={{ background: getStatusColor(order.status) }}
          >
            {getStatusLabel(order.status)}
          </span>
        }
      />

      {/* ── ORDER NUMBER ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs">Order Number</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(order.orderSn);
              toast.success("Copied!");
            }}
            className="text-xs font-medium"
            style={{ color: "#f02d65" }}
          >
            Copy
          </button>
        </div>
        <p className="text-gray-700 text-sm font-bold mt-1 tracking-wide">
          {order.orderSn}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {new Date(order.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* ── PRODUCTS ── */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 text-sm font-bold mb-3">
          Products ({order.products?.length})
        </p>
        <div className="space-y-3">
          {order.products?.map((product, i) => (
            <div key={i} className="flex gap-3">
              {/* Image */}
              <div
                className="w-16 h-16 rounded-xl overflow-hidden
                bg-pink-50 flex items-center justify-center flex-shrink-0
                border border-pink-100"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-gray-700 text-sm font-medium
                  line-clamp-2 leading-snug"
                >
                  {product.title}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-gray-400 text-xs">×{product.quantity}</p>
                  <p className="text-gray-700 text-sm font-bold">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BUYER INFO ── */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 text-sm font-bold mb-3">
          Buyer Information
        </p>
        <div className="space-y-2.5">
          {[
            { icon: "👤", label: "Buyer", value: order.buyerName },
            { icon: "📞", label: "Phone", value: order.phoneNumber },
            {
              icon: "📍",
              label: "Address",
              value: order.shippingAddress,
            },
            { icon: "🌍", label: "Country", value: order.country },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-base w-5 flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <p className="text-gray-400 text-[10px]">{item.label}</p>
                <p className="text-gray-700 text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FINANCIAL SUMMARY ── */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 text-sm font-bold mb-3">
          Financial Summary
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Payment</span>
            <span className="text-red-400 font-bold">
              -${order.totalCost?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Selling Price</span>
            <span className="text-gray-600 font-medium">
              ${order.sellingPrice?.toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-sm font-bold">
              Total Earnings
            </span>
            <span className="text-green-500 font-bold text-lg">
              +${order.earnings?.toFixed(2)}
            </span>
          </div>
          {order.profitConfirmed && (
            <div
              className="flex items-center gap-2 mt-2 p-2
              bg-green-50 rounded-xl"
            >
              <span className="text-green-500">✓</span>
              <span className="text-green-600 text-xs font-medium">
                Profit confirmed by admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── LOGISTICS TIMELINE ── */}
      {order.logisticsInfo && order.logisticsInfo.length > 0 && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-700 text-sm font-bold">
              Logistics Timeline
            </p>
            {order.trackingNumber && (
              <p className="text-gray-400 text-[10px]">
                TN: {order.trackingNumber?.slice(-8)}
              </p>
            )}
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[7px] top-2 bottom-2
              w-0.5 bg-gray-100"
            />

            <div className="space-y-4">
              {[...order.logisticsInfo].reverse().map((log, i) => (
                <div key={i} className="flex gap-3 relative">
                  {/* Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0
                    mt-0.5 border-2 z-10 ${
                      i === 0
                        ? "border-pink-500 bg-pink-500"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm leading-snug ${
                        i === 0
                          ? "font-bold text-gray-800"
                          : "text-gray-400 text-xs"
                      }`}
                    >
                      {log.status}
                    </p>
                    <p className="text-gray-300 text-[10px] mt-0.5">
                      {new Date(log.time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NO LOGISTICS YET ── */}
      {(!order.logisticsInfo || order.logisticsInfo.length === 0) &&
        order.status !== "pendingPayment" && (
          <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-700 text-sm font-bold mb-2">Logistics</p>
            <p className="text-gray-400 text-sm text-center py-4">
              - No logistics information available -
            </p>
          </div>
        )}

      {/* ── PICKUP BUTTON ── */}
      {order.status === "pendingPayment" && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-[480px] bg-white border-t border-gray-100
          p-4 shadow-lg z-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Cost to pickup:</span>
            <span className="text-red-400 font-bold text-lg">
              ${order.totalCost?.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowPickupModal(true)}
            className="w-full py-4 rounded-xl text-white font-bold
              text-base shadow-lg active:scale-95 transition-all"
            style={{
              background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
            }}
          >
            CLICK TO PICKUP 📦
          </button>
        </div>
      )}

      {/* ── PICKUP CONFIRMATION MODAL ── */}
      {showPickupModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end
          justify-center"
        >
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl
            p-6 animate-slide-up"
          >
            <div className="text-center mb-6">
              <span className="text-5xl">📦</span>
              <h3 className="text-gray-800 font-bold text-lg mt-3">
                Confirm Pickup
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                This will deduct from your wallet balance
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Order Cost</span>
                <span className="text-red-400 font-bold">
                  -${order.totalCost?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Expected Profit</span>
                <span className="text-green-500 font-bold">
                  +${order.earnings?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPickupModal(false)}
                className="flex-1 py-3.5 rounded-xl border-2
                  border-gray-200 text-gray-500 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => pickupMutation.mutate()}
                disabled={pickupMutation.isPending}
                className="flex-1 py-3.5 rounded-xl text-white
                  font-bold shadow-lg active:scale-95 transition-all
                  disabled:opacity-70"
                style={{
                  background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                }}
              >
                {pickupMutation.isPending ? "Processing..." : "Confirm Pickup"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
