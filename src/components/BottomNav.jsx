// import { Link, useLocation } from "react-router-dom";
// import { Home, Package, Headset, ListOrdered, CircleUser } from "lucide-react";

// const BottomNav = () => {
//   const location = useLocation();

//   const tabs = [
//     { path: "/", icon: Home, label: "Home" },
//     { path: "/products", icon: Package, label: "Product" },
//     { path: "/chat", icon: Headset, label: "Support" },
//     { path: "/orders", icon: ListOrdered, label: "Order" },
//     { path: "/profile", icon: CircleUser, label: "My" },
//   ];

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 0,
//         left: "50%",
//         transform: "translateX(-50%)",
//         width: "100%",
//         maxWidth: "670px",
//         backgroundColor: "rgba(255, 255, 255, 0.95)",
//         backdropFilter: "blur(10px)",
//         borderTop: "1px solid #f3f4f6",
//         zIndex: 50,
//         boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.07)",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-around",
//           padding: "8px 0",
//           paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
//         }}
//       >
//         {tabs.map((tab) => {
//           const isActive = location.pathname === tab.path;
//           const Icon = tab.icon;
//           return (
//             <Link
//               key={tab.path}
//               to={tab.path}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 flex: 1,
//                 textDecoration: "none",
//                 transition: "transform 0.1s",
//               }}
//               onMouseDown={(e) =>
//                 (e.currentTarget.style.transform = "scale(0.9)")
//               }
//               onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             >
//               <div
//                 style={{
//                   padding: "6px 0px",
//                   borderRadius: "20px",
//                   backgroundColor: isActive ? "#fff1f2" : "transparent",
//                   marginBottom: "0px",
//                   transition: "background-color 0.2s",
//                 }}
//               >
//                 <Icon
//                   size={26}
//                   color={isActive ? "#f02d65" : "#9ca3af"}
//                   strokeWidth={isActive ? 2.5 : 2}
//                 />
//               </div>
//               <span
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: isActive ? "bold" : "600",
//                   color: isActive ? "#f02d65" : "#9ca3af",
//                 }}
//               >
//                 {tab.label}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BottomNav;

////////////////////// ======================== latest version of BottonNav ==========================///////////////////

import { Link, useLocation } from "react-router-dom";
import { Home, Package, Headset, ListOrdered, CircleUser } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/products", icon: Package, label: "Product" },
    { path: "/chat", icon: Headset, label: "Support" },
    { path: "/orders", icon: ListOrdered, label: "Order" },
    { path: "/profile", icon: CircleUser, label: "My" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px", // ✅ MATCHED TO THE APP'S MAX-WIDTH (was 670px)
        // backgroundColor: "rgba(255, 255, 255, 0.98)", // Solid, clean
        // backgroundColor: "#018784",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(226, 232, 240, 0.8)", // Slate border to match top-nav
        zIndex: 50,
        // Removed heavy shadow, replaced with a subtle upward SaaS shadow
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "8px 0px",
          paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
        }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                textDecoration: "none",
                transition: "all 0.2s ease-in-out",
                opacity: isActive ? 1 : 0.8, // Slight fade for inactive items
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.92)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  padding: "10px 10px", // Pill shape for the active icon
                  borderRadius: "16px",
                  backgroundColor: isActive
                    ? "rgba(1, 135, 132, 0.1)"
                    : "transparent", // TikTok Teal faint background
                  marginBottom: "4px",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  size={22}
                  color={isActive ? "#018784" : "#64748b"} // Teal vs Slate
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? "#018784" : "#64748b",
                  letterSpacing: "0.2px",
                }}
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
