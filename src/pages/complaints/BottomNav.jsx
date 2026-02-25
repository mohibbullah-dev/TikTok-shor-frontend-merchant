import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/products", icon: "🛍️", label: "Products" },
    { path: "/orders", icon: "📋", label: "Orders" },
    { path: "/profile", icon: "👤", label: "Me" },
  ];

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
      max-w-[480px] bg-white border-t border-gray-100 z-50
      shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center gap-0.5 py-1 px-4
                transition-all active:scale-90"
            >
              {/* Icon */}
              <span
                className={`text-2xl transition-all ${
                  isActive ? "scale-110" : "opacity-60"
                }`}
              >
                {tab.icon}
              </span>

              {/* Label */}
              <span
                className={`text-[10px] font-medium transition-all ${
                  isActive ? "font-bold" : "text-gray-400"
                }`}
                style={{ color: isActive ? "#f02d65" : "" }}
              >
                {tab.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: "#f02d65" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
