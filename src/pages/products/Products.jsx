//////////////////////// ======================== version 1 (by gemeni) ====================== ///////////////////////

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Loader2,
//   PackageOpen,
//   Plus,
//   Store,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// export default function Products() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState("active");

//   const tabs = [
//     { key: "active", label: "On Shelf" },
//     { key: "inactive", label: "Off Shelf" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["myProducts"],
//     queryFn: async () => {
//       const { data } = await API.get("/products/my-products");
//       return data;
//     },
//   });

//   const toggleMutation = useMutation({
//     mutationFn: async (productId) => {
//       const { data } = await API.put(`/products/${productId}/toggle`);
//       return data;
//     },
//     onSuccess: (res) => {
//       toast.success(res.message);
//       queryClient.invalidateQueries(["myProducts"]);
//     },
//     onError: () => toast.error("Failed to update status"),
//   });

//   const products = data?.products || [];
//   const filtered =
//     activeTab === "active"
//       ? products.filter((p) => p.isActive)
//       : products.filter((p) => !p.isActive);

//   return (
//     <div
//       className="min-h-screen bg-gray-50 flex flex-col relative"
//       style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "90px" }}
//     >
//       {/* ── STICKY HEADER ── */}
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
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <Store size={22} color="#fff" />
//             <h1
//               style={{
//                 color: "#fff",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//                 margin: 0,
//               }}
//             >
//               My Store
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/distribution")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               backgroundColor: "rgba(255,255,255,0.2)",
//               border: "1px solid rgba(255,255,255,0.3)",
//               borderRadius: "20px",
//               padding: "6px 12px",
//               color: "#fff",
//               fontSize: "12px",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//           >
//             <Plus size={14} /> Get Products
//           </button>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 flex: 1,
//                 padding: "14px 0",
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
//               {tab.label} (
//               {
//                 products.filter((p) =>
//                   tab.key === "active" ? p.isActive : !p.isActive,
//                 ).length
//               }
//               )
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── PRODUCT GRID ── */}
//       <div style={{ padding: "16px" }}>
//         {isLoading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "40px 0",
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
//             <PackageOpen
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
//               Store is Empty
//             </p>
//             <p
//               style={{
//                 color: "#64748b",
//                 fontSize: "13px",
//                 margin: "0 0 20px 0",
//               }}
//             >
//               You haven't added any products to your shelf yet.
//             </p>
//             <button
//               onClick={() => navigate("/distribution")}
//               style={{
//                 background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                 color: "#fff",
//                 border: "none",
//                 padding: "12px 24px",
//                 borderRadius: "12px",
//                 fontWeight: "bold",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)",
//               }}
//             >
//               Go to Distribution Center
//             </button>
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "12px",
//             }}
//           >
//             {filtered.map((product) => (
//               <div
//                 key={product._id}
//                 style={{
//                   backgroundColor: "#fff",
//                   borderRadius: "16px",
//                   overflow: "hidden",
//                   boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div
//                   style={{
//                     height: "140px",
//                     backgroundColor: "#f8fafc",
//                     position: "relative",
//                   }}
//                 >
//                   {product.image ? (
//                     <img
//                       src={product.image}
//                       alt={product.title}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <PackageOpen size={32} color="#cbd5e1" />
//                     </div>
//                   )}
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "8px",
//                       left: "8px",
//                       backgroundColor: product.isActive ? "#10b981" : "#64748b",
//                       color: "#fff",
//                       padding: "4px 8px",
//                       borderRadius: "12px",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "4px",
//                     }}
//                   >
//                     {product.isActive ? (
//                       <CheckCircle2 size={12} />
//                     ) : (
//                       <XCircle size={12} />
//                     )}
//                     {product.isActive ? "ON SHELF" : "OFF SHELF"}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     padding: "12px",
//                     flex: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "#1e293b",
//                       fontSize: "13px",
//                       fontWeight: "600",
//                       margin: "0 0 12px 0",
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                       lineHeight: "1.4",
//                       minHeight: "36px",
//                     }}
//                   >
//                     {product.title}
//                   </p>

//                   <div style={{ marginTop: "auto" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginBottom: "12px",
//                         backgroundColor: "#f8fafc",
//                         padding: "8px",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       <div>
//                         <p
//                           style={{
//                             color: "#64748b",
//                             fontSize: "10px",
//                             margin: "0 0 2px 0",
//                           }}
//                         >
//                           Price
//                         </p>
//                         <p
//                           style={{
//                             color: "#1e293b",
//                             fontSize: "13px",
//                             fontWeight: "bold",
//                             margin: 0,
//                             fontFamily: "monospace",
//                           }}
//                         >
//                           ${product.salesPrice?.toFixed(2)}
//                         </p>
//                       </div>
//                       <div style={{ textAlign: "right" }}>
//                         <p
//                           style={{
//                             color: "#64748b",
//                             fontSize: "10px",
//                             margin: "0 0 2px 0",
//                           }}
//                         >
//                           Profit
//                         </p>
//                         <p
//                           style={{
//                             color: "#10b981",
//                             fontSize: "13px",
//                             fontWeight: "bold",
//                             margin: 0,
//                             fontFamily: "monospace",
//                           }}
//                         >
//                           +${product.profit?.toFixed(2)}
//                         </p>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => toggleMutation.mutate(product._id)}
//                       disabled={toggleMutation.isPending}
//                       style={{
//                         width: "100%",
//                         padding: "10px",
//                         borderRadius: "10px",
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                         cursor: "pointer",
//                         border: "none",
//                         transition: "all 0.2s",
//                         backgroundColor: product.isActive
//                           ? "#fff1f2"
//                           : "#f0fdf4",
//                         color: product.isActive ? "#f02d65" : "#10b981",
//                       }}
//                       onMouseDown={(e) =>
//                         (e.currentTarget.style.transform = "scale(0.95)")
//                       }
//                       onMouseUp={(e) =>
//                         (e.currentTarget.style.transform = "scale(1)")
//                       }
//                     >
//                       {toggleMutation.isPending ? (
//                         <Loader2 size={14} className="animate-spin mx-auto" />
//                       ) : product.isActive ? (
//                         "Take Off Shelf"
//                       ) : (
//                         "Put On Shelf"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

//////////////////////// ======================== version 2 (by gemeni) ====================== ///////////////////////

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import {
//   Loader2,
//   PackageOpen,
//   Plus,
//   Store,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// export default function Products() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState("active");

//   const tabs = [
//     { key: "active", label: "On Shelf" },
//     { key: "inactive", label: "Off Shelf" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["myProducts"],
//     queryFn: async () => {
//       const { data } = await API.get("/products/my-products");
//       return data;
//     },
//   });

//   const toggleMutation = useMutation({
//     mutationFn: async (productId) => {
//       const { data } = await API.put(`/products/${productId}/toggle`);
//       return data;
//     },
//     onSuccess: (res) => {
//       toast.success(res.message);
//       queryClient.invalidateQueries(["myProducts"]);
//     },
//     onError: () => toast.error("Failed to update status"),
//   });

//   const products = data?.products || [];
//   const filtered =
//     activeTab === "active"
//       ? products.filter((p) => p.isActive)
//       : products.filter((p) => !p.isActive);

//   return (
//     <div
//       className="min-h-screen flex flex-col relative bg-[#f8fafc] font-sans"
//       style={{ margin: "0 auto", maxWidth: "480px", paddingBottom: "90px" }}
//     >
//       {/* ── STICKY HEADER ── */}
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 40,
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           backdropFilter: "blur(8px)",
//           borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
//         }}
//       >
//         <div
//           style={{
//             padding: "16px 20px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <div
//               style={{
//                 padding: "6px",
//                 backgroundColor: "#f1f5f9",
//                 borderRadius: "8px",
//               }}
//             >
//               <Store size={20} color="#018784" />
//             </div>
//             <h1
//               style={{
//                 color: "#0f172a",
//                 fontSize: "18px",
//                 fontWeight: "800",
//                 margin: 0,
//                 letterSpacing: "-0.3px",
//               }}
//             >
//               My Store
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate("/distribution")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               backgroundColor: "rgba(1,135,132,0.1)",
//               border: "1px solid rgba(1,135,132,0.2)",
//               borderRadius: "20px",
//               padding: "6px 12px",
//               color: "#018784",
//               fontSize: "12px",
//               fontWeight: "700",
//               cursor: "pointer",
//               transition: "all 0.2s",
//             }}
//             onMouseOver={(e) =>
//               (e.currentTarget.style.backgroundColor = "rgba(1,135,132,0.15)")
//             }
//             onMouseOut={(e) =>
//               (e.currentTarget.style.backgroundColor = "rgba(1,135,132,0.1)")
//             }
//           >
//             <Plus size={14} strokeWidth={2.5} /> Get Products
//           </button>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 flex: 1,
//                 padding: "14px 0",
//                 fontSize: "14px",
//                 fontWeight: activeTab === tab.key ? "700" : "600",
//                 border: "none",
//                 background: "none",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 color: activeTab === tab.key ? "#018784" : "#64748b",
//                 borderBottom:
//                   activeTab === tab.key
//                     ? "2px solid #018784"
//                     : "2px solid transparent",
//               }}
//             >
//               {tab.label} (
//               {
//                 products.filter((p) =>
//                   tab.key === "active" ? p.isActive : !p.isActive,
//                 ).length
//               }
//               )
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── PRODUCT GRID ── */}
//       <div style={{ padding: "16px 20px" }}>
//         {isLoading ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "40px 0",
//             }}
//           >
//             <Loader2 size={32} className="animate-spin text-[#018784]" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               backgroundColor: "#ffffff",
//               borderRadius: "16px",
//               border: "1px dashed #cbd5e1",
//             }}
//           >
//             <PackageOpen
//               size={48}
//               color="#cbd5e1"
//               style={{ margin: "0 auto 16px auto" }}
//             />
//             <p
//               style={{
//                 color: "#0f172a",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 margin: "0 0 8px 0",
//               }}
//             >
//               Store is Empty
//             </p>
//             <p
//               style={{
//                 color: "#64748b",
//                 fontSize: "13px",
//                 margin: "0 0 20px 0",
//               }}
//             >
//               You haven't added any products to your shelf yet.
//             </p>
//             <button
//               onClick={() => navigate("/distribution")}
//               style={{
//                 background: "#018784",
//                 color: "#fff",
//                 border: "none",
//                 padding: "12px 24px",
//                 borderRadius: "10px",
//                 fontWeight: "700",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//               }}
//             >
//               Go to Distribution Center
//             </button>
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "12px",
//             }}
//           >
//             {filtered.map((product) => (
//               <div
//                 key={product._id}
//                 style={{
//                   backgroundColor: "#ffffff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   boxShadow:
//                     "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
//                   border: "1px solid #e2e8f0",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div
//                   style={{
//                     height: "140px",
//                     backgroundColor: "#f8fafc",
//                     position: "relative",
//                   }}
//                 >
//                   {product.image ? (
//                     <img
//                       src={product.image}
//                       alt={product.title}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <PackageOpen size={32} color="#cbd5e1" />
//                     </div>
//                   )}
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "8px",
//                       left: "8px",
//                       backgroundColor: product.isActive ? "#10b981" : "#64748b",
//                       color: "#fff",
//                       padding: "4px 8px",
//                       borderRadius: "12px",
//                       fontSize: "9px",
//                       fontWeight: "800",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "4px",
//                       letterSpacing: "0.5px",
//                     }}
//                   >
//                     {product.isActive ? (
//                       <CheckCircle2 size={10} />
//                     ) : (
//                       <XCircle size={10} />
//                     )}
//                     {product.isActive ? "ON SHELF" : "OFF SHELF"}
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     padding: "12px",
//                     flex: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "#0f172a",
//                       fontSize: "13px",
//                       fontWeight: "700",
//                       margin: "0 0 12px 0",
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                       lineHeight: "1.4",
//                       height: "36px",
//                     }}
//                   >
//                     {product.title}
//                   </p>

//                   <div style={{ marginTop: "auto" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "flex-end",
//                         marginBottom: "12px",
//                         backgroundColor: "#f8fafc",
//                         padding: "8px",
//                         borderRadius: "8px",
//                         border: "1px solid #f1f5f9",
//                       }}
//                     >
//                       <div>
//                         <p
//                           style={{
//                             color: "#64748b",
//                             fontSize: "10px",
//                             margin: "0 0 2px 0",
//                             fontWeight: "600",
//                           }}
//                         >
//                           Price
//                         </p>
//                         <p
//                           style={{
//                             color: "#0f172a",
//                             fontSize: "13px",
//                             fontWeight: "800",
//                             margin: 0,
//                           }}
//                         >
//                           ${product.salesPrice?.toFixed(2)}
//                         </p>
//                       </div>
//                       <div style={{ textAlign: "right" }}>
//                         <p
//                           style={{
//                             color: "#64748b",
//                             fontSize: "10px",
//                             margin: "0 0 2px 0",
//                             fontWeight: "600",
//                           }}
//                         >
//                           Profit
//                         </p>
//                         <p
//                           style={{
//                             color: "#018784",
//                             fontSize: "13px",
//                             fontWeight: "800",
//                             margin: 0,
//                           }}
//                         >
//                           +${product.profit?.toFixed(2)}
//                         </p>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => toggleMutation.mutate(product._id)}
//                       disabled={toggleMutation.isPending}
//                       style={{
//                         width: "100%",
//                         padding: "10px",
//                         borderRadius: "8px",
//                         fontSize: "12px",
//                         fontWeight: "700",
//                         cursor: toggleMutation.isPending
//                           ? "not-allowed"
//                           : "pointer",
//                         border: product.isActive ? "1px solid #e2e8f0" : "none",
//                         transition: "all 0.2s",
//                         backgroundColor: product.isActive
//                           ? "#ffffff" // White for taking off shelf
//                           : "#018784", // Teal for putting on shelf
//                         color: product.isActive ? "#64748b" : "#ffffff",
//                       }}
//                       onMouseDown={(e) =>
//                         (e.currentTarget.style.transform = "scale(0.96)")
//                       }
//                       onMouseUp={(e) =>
//                         (e.currentTarget.style.transform = "scale(1)")
//                       }
//                     >
//                       {toggleMutation.isPending ? (
//                         <Loader2 size={14} className="animate-spin mx-auto" />
//                       ) : product.isActive ? (
//                         "Take Off Shelf"
//                       ) : (
//                         "Put On Shelf"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

//////////////////////// ====================== latest version 3 (by gemeni) =====================//////////////////////

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import TopBar from "../../components/TopBar";
import {
  Loader2,
  PackageOpen,
  Plus,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

export default function Products() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");

  const tabs = [
    { key: "active", label: "On Shelf" },
    { key: "inactive", label: "Off Shelf" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["myProducts"],
    queryFn: async () => {
      const { data } = await API.get("/products/my-products");
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await API.put(`/products/${productId}/toggle`);
      return data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["myProducts"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const products = data?.products || [];
  const filtered =
    activeTab === "active"
      ? products.filter((p) => p.isActive)
      : products.filter((p) => !p.isActive);

  return (
    <div
      className="min-h-screen flex flex-col relative font-sans"
      style={{
        margin: "0 auto",
        maxWidth: "480px",
        paddingBottom: "90px",
        backgroundColor: "#f1f5f9",
      }}
    >
      {/* ── STICKY HEADER — matches Distribution sticky header style ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <TopBar title="My Store" showBack={true} />

        {/* Tab bar + Get Products button */}
        <div
          style={{
            backgroundColor: "#fff",
            borderBottom: "0.5px solid #e2e8f0",
          }}
        >
          {/* Get Products button row */}
          <div
            style={{
              padding: "8px 14px 0",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => navigate("/distribution")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "#018784",
                border: "none",
                borderRadius: "20px",
                padding: "6px 12px",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseDown={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={13} strokeWidth={2.5} /> Get Products
            </button>
          </div>

          {/* Tabs — matching Distribution category pill style */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              padding: "8px 14px 10px",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
            className="flex items-center justify-between"
          >
            {tabs.map((tab) => {
              const count = products.filter((p) =>
                tab.key === "active" ? p.isActive : !p.isActive,
              ).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    border:
                      activeTab === tab.key ? "none" : "0.5px solid #e2e8f0",
                    background: activeTab === tab.key ? "#018784" : "#f8fafc",
                    color: activeTab === tab.key ? "#ffffff" : "#64748b",
                  }}
                >
                  {tab.label}{" "}
                  <span
                    style={{
                      opacity: 0.75,
                      fontSize: "11px",
                    }}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID — matches Distribution product grid exactly ── */}
      <div style={{ padding: "10px 3.5px" }}>
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  height: "240px",
                  border: "0.5px solid #e2e8f0",
                }}
                className="animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 10px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "0.5px solid #e2e8f0",
              marginTop: "8px",
            }}
          >
            <Package
              size={40}
              color="#cbd5e1"
              style={{ margin: "0 auto 12px auto" }}
            />
            <p
              style={{
                color: "#0f172a",
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 4px 0",
              }}
            >
              Store is Empty
            </p>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                margin: "0 0 20px 0",
              }}
            >
              You haven't added any products to your shelf yet.
            </p>
            <button
              onClick={() => navigate("/distribution")}
              style={{
                background: "#018784",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Go to Distribution Center
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {filtered.map((product) => (
              <div
                key={product._id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "0.5px solid #e2e8f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.15s",
                }}
              >
                {/* Image — same height as Distribution */}
                <div
                  style={{
                    position: "relative",
                    height: "100px",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PackageOpen size={28} color="#cbd5e1" />
                    </div>
                  )}

                  {/* Status badge — matches Distribution HOT badge style */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: product.isActive ? "#018784" : "#94a3b8",
                      color: "#fff",
                      padding: "3px 7px",
                      borderRadius: "10px",
                      fontSize: "9px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    {product.isActive ? (
                      <CheckCircle2 size={9} />
                    ) : (
                      <XCircle size={9} />
                    )}
                    {product.isActive ? "ON SHELF" : "OFF SHELF"}
                  </div>
                </div>

                {/* Info — matches Distribution card info section */}
                <div
                  style={{
                    padding: "4px 4px 4px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: "6px",
                  }}
                >
                  {/* Title */}
                  <p
                    style={{
                      color: "#0f172a",
                      fontSize: "12px",
                      fontWeight: "600",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                      minHeight: "33px",
                    }}
                  >
                    {product.title}
                  </p>

                  {/* Price row — matches Distribution price row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f8fafc",
                      border: "0.5px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "5px 8px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "9px",
                          margin: "0 0 1px 0",
                          fontWeight: "500",
                        }}
                      >
                        Price
                      </p>
                      <span
                        style={{
                          color: "#0f172a",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        ${product.salesPrice?.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "9px",
                          margin: "0 0 1px 0",
                          fontWeight: "500",
                        }}
                      >
                        Profit
                      </p>
                      <span
                        style={{
                          color: "#018784",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        +${product.profit?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Toggle button — matches Distribution "Distribute" button exactly */}
                  <button
                    onClick={() => toggleMutation.mutate(product._id)}
                    disabled={toggleMutation.isPending}
                    style={{
                      width: "100%",
                      padding: "7px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: product.isActive ? "#64748b" : "#fff",
                      border: product.isActive ? "0.5px solid #e2e8f0" : "none",
                      cursor: toggleMutation.isPending
                        ? "not-allowed"
                        : "pointer",
                      background: product.isActive ? "#f8fafc" : "#018784",
                      transition: "transform 0.1s",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.96)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {toggleMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin mx-auto" />
                    ) : product.isActive ? (
                      "Take Off Shelf"
                    ) : (
                      "Put On Shelf"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
