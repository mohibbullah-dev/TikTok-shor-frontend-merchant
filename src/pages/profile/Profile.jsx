import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../../store/authSlice";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((state) => state.auth);

  const vipColors = {
    0: "#888888",
    1: "#cd7f32",
    2: "#aaaaaa",
    3: "#ffd700",
    4: "#00bcd4",
    5: "#9c27b0",
    6: "#f02d65",
  };

  const vipLevel = merchant?.vipLevel || 0;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await API.post("/auth/logout");
    },
    onSuccess: () => {
      dispatch(logout());
      navigate("/login");
    },
    onError: () => {
      // Even if API fails, logout locally
      dispatch(logout());
      navigate("/login");
    },
  });

  const menuItems = [
    {
      section: "Store",
      items: [
        {
          icon: "🏪",
          label: "Basic Info",
          sub: "Store name, logo, address",
          path: "/profile/baseinfo",
        },
        {
          icon: "🖼️",
          label: "Banner Settings",
          sub: "Upload store banners",
          path: "/profile/banners",
        },
        {
          icon: "👑",
          label: "VIP Upgrade",
          sub: `Current: VIP${vipLevel}`,
          path: "/vip",
          badge: `VIP${vipLevel}`,
          badgeColor: vipColors[vipLevel],
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          icon: "💰",
          label: "Fund Records",
          sub: "Transaction history",
          path: "/funds",
        },
        {
          icon: "📊",
          label: "Financial Statements",
          sub: "Daily profit summary",
          path: "/finance",
        },
        {
          icon: "📅",
          label: "Sign-in Calendar",
          sub: "Daily $15 reward",
          path: "/calendar",
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          icon: "👤",
          label: "Personal Info",
          sub: "Name, phone, email",
          path: "/profile/personal",
        },
        {
          icon: "⚙️",
          label: "Settings",
          sub: "Password, security",
          path: "/profile/settings",
        },
        {
          icon: "❓",
          label: "Help & FAQ",
          sub: "Common questions",
          path: "/faq",
        },
        {
          icon: "🌍",
          label: "Language",
          sub: "Change display language",
          path: "/profile/language",
        },
        {
          icon: "📜",
          label: "Complaint",
          sub: "Submit order complaint",
          path: "/complaint",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ── HEADER ── */}
      <div
        className="relative pb-6"
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
        }}
      >
        {/* Top spacing */}
        <div className="h-12" />

        {/* Profile info */}
        <div className="flex flex-col items-center px-4">
          {/* Avatar */}
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full border-4
              border-white shadow-lg overflow-hidden bg-white/20
              flex items-center justify-center"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            {/* VIP badge on avatar */}
            <div
              className="absolute -bottom-1 -right-1 px-2 py-0.5
              rounded-full text-white text-[10px] font-bold shadow-md"
              style={{ background: vipColors[vipLevel] }}
            >
              VIP{vipLevel}
            </div>
          </div>

          {/* Name */}
          <h2 className="text-white text-lg font-bold">
            {merchant?.storeName || user?.username}
          </h2>
          <p className="text-white/70 text-xs mt-0.5">
            @{user?.username} · ID: {merchant?.merchantId}
          </p>

          {/* Stats Row */}
          <div className="flex gap-6 mt-4">
            {[
              {
                label: "Balance",
                value: `$${(merchant?.balance || 0).toFixed(0)}`,
              },
              {
                label: "Profit",
                value: `$${(merchant?.totalProfit || 0).toFixed(0)}`,
              },
              {
                label: "Credit",
                value: merchant?.creditScore || 100,
              },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-white font-bold text-base">{stat.value}</p>
                <p className="text-white/60 text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MENU SECTIONS ── */}
      <div className="px-4 -mt-3 space-y-4">
        {menuItems.map((section) => (
          <div key={section.section}>
            <p className="text-gray-400 text-xs font-medium mb-2 px-1">
              {section.section.toUpperCase()}
            </p>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3.5
                    border-b border-gray-50 last:border-0
                    active:bg-gray-50 transition-all text-left"
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl bg-pink-50
                    flex items-center justify-center text-lg flex-shrink-0"
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      {item.sub}
                    </p>
                  </div>

                  {/* Badge if any */}
                  {item.badge && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full
                      text-white font-bold mr-1"
                      style={{ background: item.badgeColor }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Arrow */}
                  <span className="text-gray-300">›</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full py-4 rounded-2xl font-bold text-sm
            border-2 border-red-100 text-red-400 bg-white
            active:bg-red-50 transition-all"
        >
          {logoutMutation.isPending ? "Logging out..." : "🚪 Logout"}
        </button>

        {/* App version */}
        <p className="text-center text-gray-300 text-xs pb-2">
          TikTok Shop Merchant v1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
