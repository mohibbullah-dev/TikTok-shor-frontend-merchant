import { useEffect } from "react";
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

// ─── Helpers ──────────────────────────────────────────────────
const statusLabel = (s) =>
  ({
    pendingPayment: "Pending Pickup",
    pendingShipment: "Processing",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
  })[s] || s;
const statusColor = (s) =>
  ({
    pendingPayment: "#f59e0b",
    pendingShipment: "#3b82f6",
    shipped: "#8b5cf6",
    completed: "#22c55e",
    cancelled: "#ef4444",
  })[s] || "#888";
const vipPalette = {
  0: "#9ca3af",
  1: "#cd7f32",
  2: "#aaa",
  3: "#f59e0b",
  4: "#06b6d4",
  5: "#9c27b0",
  6: "#f02d65",
};

// ─── Shared section card ──────────────────────────────────────
// title shown INSIDE the card header, like every professional app
const Section = ({ title, topRight, children, noPad = false }) => (
  <div
    className="bg-white rounded-2xl overflow-hidden"
    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
  >
    {/* Card header */}
    {title && (
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <p className="text-gray-800 text-sm font-bold">{title}</p>
        {topRight}
      </div>
    )}
    {/* Divider only when there's a title */}
    {title && <div className="h-px bg-gray-100" />}
    {/* Body */}
    <div className={noPad ? "" : "p-4"}>{children}</div>
  </div>
);

// ─── Tooltip for chart ────────────────────────────────────────
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white px-3 py-2 rounded-xl text-xs"
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
    >
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-bold text-gray-800">${payload[0].value.toFixed(2)}</p>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);

  // ── Queries ────────────────────────────────────────────────
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

  const { data: ordersData } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const { data } = await API.get("/orders/my-orders?limit=5");
      return data;
    },
  });

  const { data: noticesData } = useQuery({
    queryKey: ["unreadNotices"],
    queryFn: async () => {
      const { data } = await API.get("/notices/my-notices?type=unread");
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

  // ── Derived ────────────────────────────────────────────────
  const store = storeData || merchant;
  const unreadCount = noticesData?.total || 0;
  const todayStats = financeData?.statements?.[0];
  const vipLvl = store?.vipLevel || 0;

  // chart: last 7 days oldest→newest
  const chartData = financeData?.statements
    ? [...(financeData.statements || [])]
        .slice(0, 7)
        .reverse()
        .map((s) => ({
          date: s._id ? s._id.slice(5) : "",
          profit: parseFloat(s.totalProfit) || 0,
        }))
    : [];

  // FAQ: one row per category
  const faqCategories = faqData
    ? [...new Map(faqData.map((q) => [q.category, q.category])).values()]
    : [];

  const actions = [
    { emoji: "💳", label: "Recharge", path: "/recharge" },
    { emoji: "💸", label: "Withdraw", path: "/withdraw" },
    { emoji: "👑", label: "VIP", path: "/vip" },
    { emoji: "📅", label: "Sign In", path: "/calendar" },
    { emoji: "🛍️", label: "Products", path: "/products" },
    { emoji: "📊", label: "Finance", path: "/finance" },
    { emoji: "📢", label: "Notices", path: "/messages" },
    { emoji: "❓", label: "Help", path: "/faq" },
  ];

  // ── Loading ────────────────────────────────────────────────
  if (isLoading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f2f3f7" }}
      >
        <svg
          className="animate-spin h-9 w-9"
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
      </div>
    );

  return (
    <div className="min-h-screen pb-28" style={{ background: "#f2f3f7" }}>
      {/* ══════════════════════════════════════════════════
          HERO — gradient header, rounded bottom corners
      ══════════════════════════════════════════════════ */}
      <div
        className="px-4 pt-11 pb-6"
        style={{
          background: "linear-gradient(145deg, #f02d65 0%, #ff6035 100%)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        {/* Row 1: avatar / name / action icons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Avatar + VIP badge */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-white/70 overflow-hidden bg-white/30 flex items-center justify-center">
                {store?.storeLogo ? (
                  <img
                    src={store.storeLogo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">🏪</span>
                )}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center"
                style={{
                  background: vipPalette[vipLvl],
                  fontSize: 7,
                  color: "white",
                  fontWeight: 800,
                }}
              >
                {vipLvl}
              </div>
            </div>
            {/* Store name + meta */}
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                {store?.storeName || user?.username}
              </p>
              <p className="text-white/60 text-[10px] mt-0.5">
                VIP{vipLvl} &nbsp;·&nbsp; ID: {store?.merchantId}
              </p>
            </div>
          </div>

          {/* Bell + Chat */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/messages")}
              className="relative w-8 h-8 rounded-full bg-white/25 flex items-center justify-center active:bg-white/40"
            >
              <span className="text-base">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 bg-yellow-400 rounded-full text-[8px] font-bold text-white flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center active:bg-white/40"
            >
              <span className="text-base">💬</span>
            </button>
          </div>
        </div>

        {/* Row 2: balance */}
        <p className="text-white/60 text-[11px] mb-0.5">Available Balance</p>
        <p
          className="text-white font-extrabold mb-0.5"
          style={{ fontSize: 32, letterSpacing: -1, lineHeight: 1 }}
        >
          ${(store?.balance || 0).toFixed(2)}
        </p>
        <p className="text-white/50 text-[11px] mb-4">
          Pending: ${(store?.pendingAmount || 0).toFixed(2)}
          &nbsp;·&nbsp; Total Profit: ${(store?.totalProfit || 0).toFixed(2)}
        </p>

        {/* Row 3: action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/recharge")}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm active:opacity-80"
            style={{ background: "rgba(255,255,255,0.95)", color: "#f02d65" }}
          >
            + Recharge
          </button>
          <button
            onClick={() => navigate("/withdraw")}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white border border-white/40 active:opacity-80"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PAGE BODY — consistent 12px gap between cards
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 px-4 pt-4">
        {/* ── TODAY'S PERFORMANCE ── */}
        <Section title="Today's Performance" noPad>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              {
                emoji: "📦",
                val: todayStats?.totalOrders ?? 0,
                label: "Orders",
                color: "#3b82f6",
              },
              {
                emoji: "💰",
                val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
                label: "Sales",
                color: "#22c55e",
              },
              {
                emoji: "📈",
                val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
                label: "Profit",
                color: "#f02d65",
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-4 gap-1">
                <span className="text-[26px] leading-none">{s.emoji}</span>
                <p
                  className="font-bold text-[15px] leading-none mt-1"
                  style={{ color: s.color }}
                >
                  {s.val}
                </p>
                <p className="text-gray-400 text-[11px]">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── QUICK ACTIONS ── */}
        <Section title="Quick Actions">
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-1.5 active:opacity-50 transition-opacity"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "#fdf2f5",
                    border: "1.5px solid #fce7ec",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{a.emoji}</span>
                </div>
                <span className="text-gray-500 text-[10px] font-medium text-center leading-tight">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── STORE HEALTH ── */}
        <Section title="Store Health">
          {/* Stars */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  style={{
                    color:
                      i <= Math.floor(store?.starRating || 5)
                        ? "#f59e0b"
                        : "#e5e7eb",
                    fontSize: 20,
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500 text-xs font-semibold">
              {(store?.starRating || 0).toFixed(1)} / 5.0
            </span>
          </div>
          {/* Credit bar */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-gray-500 text-xs">Credit Score</span>
            <span
              className="text-xs font-bold"
              style={{
                color:
                  (store?.creditScore || 100) >= 80 ? "#22c55e" : "#ef4444",
              }}
            >
              {store?.creditScore || 100} / 100
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${store?.creditScore || 100}%`,
                background:
                  (store?.creditScore || 100) >= 80
                    ? "linear-gradient(90deg,#22c55e,#86efac)"
                    : "linear-gradient(90deg,#ef4444,#fca5a5)",
              }}
            />
          </div>
        </Section>

        {/* ── RECENT ORDERS ── */}
        <Section
          title="Recent Orders"
          noPad
          topRight={
            <button
              onClick={() => navigate("/orders")}
              className="text-xs font-semibold"
              style={{ color: "#f02d65" }}
            >
              View All →
            </button>
          }
        >
          {!ordersData?.orders?.length ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <span className="text-4xl">📭</span>
              <p className="text-gray-400 text-sm">No orders yet</p>
              <p className="text-gray-300 text-xs">
                Orders appear when dispatched
              </p>
            </div>
          ) : (
            ordersData.orders.map((order, i) => (
              <button
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 text-left transition-colors ${
                  i < ordersData.orders.length - 1
                    ? "border-b border-gray-50"
                    : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {order.products?.[0]?.image ? (
                    <img
                      src={order.products[0].image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-xs font-semibold line-clamp-1">
                    {order.products?.[0]?.title || "Product"}
                    {order.products?.length > 1 &&
                      ` +${order.products.length - 1}`}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-0.5">
                    #{order.orderSn?.slice(-8)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold"
                    style={{ background: statusColor(order.status) }}
                  >
                    {statusLabel(order.status)}
                  </span>
                  <span className="text-xs font-bold text-green-500">
                    +${order.earnings?.toFixed(2)}
                  </span>
                </div>
              </button>
            ))
          )}
        </Section>

        {/* ── SALES DATA CURVE ── */}
        <Section title="Sales Data Curve">
          {chartData.length === 0 ? (
            /* Empty state: flat line exactly like demo */
            <div className="relative" style={{ height: 148 }}>
              {/* Y-axis numbers */}
              <div className="absolute left-0 top-0 bottom-5 w-5 flex flex-col justify-between">
                {["1", "0.8", "0.6", "0.4", "0.2", "0"].map((v) => (
                  <span
                    key={v}
                    className="text-[9px] text-gray-300 leading-none"
                  >
                    {v}
                  </span>
                ))}
              </div>
              {/* Horizontal grid lines */}
              <div className="absolute left-6 right-0 top-0 bottom-5 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full border-t border-gray-100" />
                ))}
              </div>
              {/* Flat data line */}
              <div
                className="absolute left-6 right-0 bottom-5"
                style={{ borderTop: "2px solid #93c5fd" }}
              />
              {/* Dots on line */}
              <div className="absolute left-6 right-0 bottom-[17px] flex justify-between px-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-blue-300" />
                ))}
              </div>
              {/* X-axis dates */}
              <div className="absolute left-6 right-0 bottom-0 flex justify-between">
                {[
                  "02-09",
                  "02-11",
                  "02-13",
                  "02-15",
                  "02-17",
                  "02-19",
                  "02-21",
                ].map((d) => (
                  <span key={d} className="text-[8px] text-gray-300">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={148}>
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -24, bottom: 4 }}
              >
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#f02d65"
                  strokeWidth={2}
                  dot={{ fill: "#f02d65", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Section>

        {/* ── DAILY SIGN-IN BANNER ── */}
        <button
          onClick={() => navigate("/calendar")}
          className="w-full rounded-2xl p-4 flex items-center gap-3 active:opacity-80 transition-all"
          style={{
            background: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)",
            boxShadow: "0 4px 14px rgba(124,58,237,0.30)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎁</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-bold text-sm">Daily Sign-In Reward</p>
            <p className="text-white/60 text-xs mt-0.5">
              Sign in every day and earn $15 bonus!
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 flex-shrink-0">
            <span className="text-white text-xs font-bold">Claim →</span>
          </div>
        </button>

        {/* ── FAQ — category list like demo ── */}
        <Section title="Frequently Asked Questions" noPad>
          {faqCategories.length > 0
            ? faqCategories.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => navigate("/faq")}
                  className={`w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-50 text-left ${
                    i < faqCategories.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <span className="text-gray-700 text-sm">{cat}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))
            : // Skeleton rows while loading
              [...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3.5 ${i < 6 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="h-3 bg-gray-100 rounded-md w-44 animate-pulse" />
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ))}
        </Section>

        {/* bottom spacer */}
        <div className="h-2" />
      </div>

      <BottomNav />
    </div>
  );
}
