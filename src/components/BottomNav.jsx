import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    {
      path: "/",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill={active ? "#f02d65" : "none"}
          stroke={active ? "#f02d65" : "#666"}
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      label: "Home",
    },
    {
      path: "/products",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke={active ? "#f02d65" : "#666"}
          strokeWidth="2"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
      label: "Product",
    },
    {
      path: "/chat",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke={active ? "#f02d65" : "#666"}
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      label: "Customer Service",
    },
    {
      path: "/orders",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke={active ? "#f02d65" : "#666"}
          strokeWidth="2"
        >
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      label: "Order",
    },
    {
      path: "/profile",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke={active ? "#f02d65" : "#666"}
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: "My",
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2
      w-full max-w-[480px] bg-white border-t border-gray-100
      z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around py-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center gap-0.5
                py-1.5 px-2 transition-all active:scale-90 flex-1"
            >
              {tab.icon(isActive)}
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#f02d65" : "#666" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
