import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateMerchant } from "../../store/authSlice";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((state) => state.auth);

  // ─────────────────────────────────────────
  // Fetch merchant store data
  // ─────────────────────────────────────────
  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: async () => {
      const { data } = await API.get("/merchants/my-store");
      return data;
    },
    onSuccess: (data) => {
      dispatch(updateMerchant(data));
    },
  });

  // ─────────────────────────────────────────
  // Fetch today's financial summary
  // ─────────────────────────────────────────
  const { data: financeData } = useQuery({
    queryKey: ["financeSummary"],
    queryFn: async () => {
      const { data } = await API.get("/transactions/financial-statements");
      return data;
    },
  });

  // ─────────────────────────────────────────
  // Fetch recent orders (latest 3)
  // ─────────────────────────────────────────
  const { data: ordersData } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const { data } = await API.get("/orders/my-orders?limit=3");
      return data;
    },
  });

  // ─────────────────────────────────────────
  // Fetch unread notices count
  // ─────────────────────────────────────────
  const { data: noticesData } = useQuery({
    queryKey: ["unreadNotices"],
    queryFn: async () => {
      const { data } = await API.get("/notices/my-notices?type=unread");
      return data;
    },
  });

  const store = storeData || merchant;
  const unreadCount = noticesData?.total || 0;
  const todayStatement = financeData?.statements?.[0];

  // VIP level colors
  const vipColors = {
    0: "#888",
    1: "#cd7f32",
    2: "#aaa",
    3: "#ffd700",
    4: "#00bcd4",
    5: "#9c27b0",
    6: "#f02d65",
  };

  // Order status label
  const getStatusLabel = (status) => {
    const labels = {
      pendingPayment: "Pending Pickup",
      pendingShipment: "Processing",
      shipped: "Shipped",
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
      completed: "#22c55e",
      cancelled: "#ef4444",
    };
    return colors[status] || "#888";
  };

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-10 w-10"
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
          <p className="text-gray-400 text-sm">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── TOP BAR ── */}
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center
        justify-between"
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
        }}
      >
        {/* Store info */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full bg-white/30 overflow-hidden
            flex items-center justify-center border-2 border-white/50"
          >
            {store?.storeLogo ? (
              <img
                src={store.storeLogo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-lg">🏪</span>
            )}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">
              {store?.storeName || user?.username}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full
                font-bold text-white"
                style={{
                  background: vipColors[store?.vipLevel || 0],
                }}
              >
                VIP{store?.vipLevel || 0}
              </span>
              <span className="text-white/70 text-[10px]">
                ID: {store?.merchantId}
              </span>
            </div>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button onClick={() => navigate("/messages")} className="relative">
            <span className="text-white text-xl">🔔</span>
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4
                bg-yellow-400 rounded-full text-[9px] font-bold
                text-white flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {/* Chat */}
          <button onClick={() => navigate("/chat")}>
            <span className="text-white text-xl">💬</span>
          </button>
        </div>
      </div>

      {/* ── BALANCE CARD ── */}
      <div
        className="mx-4 -mt-0 rounded-2xl p-5 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
        }}
      >
        <p className="text-white/70 text-xs mb-1">Available Balance</p>
        <p className="text-white text-3xl font-bold tracking-tight">
          ${(store?.balance || 0).toFixed(2)}
        </p>

        {/* Pending amount */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-white/60 text-xs">
            Pending: ${(store?.pendingAmount || 0).toFixed(2)}
          </span>
          <span className="text-white/40 text-xs">•</span>
          <span className="text-white/60 text-xs">
            Total Profit: ${(store?.totalProfit || 0).toFixed(2)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/recharge")}
            className="flex-1 py-2.5 bg-white rounded-xl font-bold text-sm
              active:scale-95 transition-all shadow-sm"
            style={{ color: "#f02d65" }}
          >
            + Recharge
          </button>
          <button
            onClick={() => navigate("/withdraw")}
            className="flex-1 py-2.5 bg-white/20 rounded-xl font-bold
              text-sm text-white active:scale-95 transition-all
              border border-white/30"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* ── TODAY'S STATS ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-500 text-xs font-medium mb-3">
          Today's Performance
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Orders",
              value: todayStatement?.totalOrders || 0,
              icon: "📦",
              color: "#3b82f6",
            },
            {
              label: "Sales",
              value: `$${(todayStatement?.totalProfit || 0).toFixed(0)}`,
              icon: "💰",
              color: "#22c55e",
            },
            {
              label: "Profit",
              value: `$${(todayStatement?.totalProfit || 0).toFixed(0)}`,
              icon: "📈",
              color: "#f02d65",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3
              bg-gray-50 rounded-xl"
            >
              <span className="text-2xl mb-1">{stat.icon}</span>
              <p className="font-bold text-base" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-gray-400 text-[11px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-500 text-xs font-medium mb-3">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: "💳", label: "Recharge", path: "/recharge" },
            { icon: "💸", label: "Withdraw", path: "/withdraw" },
            { icon: "👑", label: "VIP", path: "/vip" },
            { icon: "📅", label: "Sign In", path: "/calendar" },
            { icon: "🛍️", label: "Products", path: "/products" },
            { icon: "📊", label: "Finance", path: "/finance" },
            { icon: "📢", label: "Notices", path: "/messages" },
            { icon: "❓", label: "Help", path: "/faq" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-1.5
                active:scale-90 transition-all"
            >
              <div
                className="w-12 h-12 bg-pink-50 rounded-xl
                flex items-center justify-center shadow-sm
                border border-pink-100"
              >
                <span className="text-2xl">{action.icon}</span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── STORE CREDIT ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-500 text-xs font-medium">Store Health</p>
          <span className="text-xs text-gray-400">
            ⭐ {(store?.starRating || 0).toFixed(1)}/5.0
          </span>
        </div>

        {/* Credit Score Bar */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Credit Score</span>
          <span
            className="text-xs font-bold"
            style={{
              color: (store?.creditScore || 100) >= 80 ? "#22c55e" : "#ef4444",
            }}
          >
            {store?.creditScore || 100}/100
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${store?.creditScore || 100}%`,
              background:
                (store?.creditScore || 100) >= 80
                  ? "linear-gradient(90deg, #22c55e, #86efac)"
                  : "linear-gradient(90deg, #ef4444, #fca5a5)",
            }}
          />
        </div>
      </div>

      {/* ── RECENT ORDERS ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 text-sm font-bold">Recent Orders</p>
          <button
            onClick={() => navigate("/orders")}
            className="text-xs font-medium"
            style={{ color: "#f02d65" }}
          >
            View All →
          </button>
        </div>

        {ordersData?.orders?.length === 0 || !ordersData ? (
          <div className="text-center py-8">
            <span className="text-4xl">📭</span>
            <p className="text-gray-400 text-sm mt-2">No orders yet</p>
            <p className="text-gray-300 text-xs">
              Orders will appear here when dispatched
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ordersData?.orders?.map((order) => (
              <button
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="w-full flex items-center justify-between
                  p-3 bg-gray-50 rounded-xl active:bg-gray-100
                  transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  {/* Product image */}
                  <div
                    className="w-10 h-10 bg-pink-100 rounded-lg
                    flex items-center justify-center overflow-hidden"
                  >
                    {order.products?.[0]?.image ? (
                      <img
                        src={order.products[0].image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">📦</span>
                    )}
                  </div>
                  <div>
                    <p
                      className="text-gray-700 text-xs font-medium
                      line-clamp-1 max-w-[150px]"
                    >
                      {order.products?.[0]?.title || "Product"}
                      {order.products?.length > 1 &&
                        ` +${order.products.length - 1}`}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-0.5">
                      #{order.orderSn?.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full
                      font-medium text-white"
                    style={{
                      background: getStatusColor(order.status),
                    }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#22c55e" }}
                  >
                    +${order.earnings?.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── ANNOUNCEMENT BANNER ── */}
      <div
        className="mx-4 mt-4 mb-4 p-4 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <p className="text-white font-bold text-sm">Daily Sign-In Reward</p>
            <p className="text-white/70 text-xs">
              Sign in every day and earn $15 bonus!
            </p>
          </div>
          <button
            onClick={() => navigate("/calendar")}
            className="ml-auto bg-white/20 px-3 py-1.5 rounded-lg
              text-white text-xs font-bold border border-white/30
              active:scale-95 transition-all whitespace-nowrap"
          >
            Claim →
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Home;
