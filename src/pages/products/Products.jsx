// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import BottomNav from "../../components/BottomNav";
// import TopBar from "../../components/TopBar";

// const Products = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState("all");

//   const tabs = [
//     { key: "all", label: "All" },
//     { key: "active", label: "On Shelf" },
//     { key: "inactive", label: "Off Shelf" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["myProducts", activeTab],
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
//     onSuccess: () => {
//       toast.success("Product status updated!");
//       queryClient.invalidateQueries(["myProducts"]);
//     },
//     onError: () => toast.error("Failed to update"),
//   });

//   const products = data?.products || [];
//   const filtered =
//     activeTab === "all"
//       ? products
//       : activeTab === "active"
//         ? products.filter((p) => p.isActive)
//         : products.filter((p) => !p.isActive);

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       <TopBar
//         title="My Products"
//         showBack={false}
//         rightElement={
//           <button
//             onClick={() => navigate("/distribution")}
//             className="w-8 h-8 rounded-lg flex items-center
//               justify-center text-white text-lg font-bold"
//             style={{ background: "#f02d65" }}
//           >
//             +
//           </button>
//         }
//       />

//       {/* Tabs */}
//       <div className="bg-white sticky top-[52px] z-30 shadow-sm">
//         <div className="flex">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className="flex-1 py-3 text-sm font-medium
//                 transition-all relative"
//               style={{
//                 color: activeTab === tab.key ? "#f02d65" : "#9ca3af",
//               }}
//             >
//               {tab.label}
//               {activeTab === tab.key && (
//                 <div
//                   className="absolute bottom-0 left-1/2
//                   -translate-x-1/2 w-6 h-0.5 rounded-full"
//                   style={{ background: "#f02d65" }}
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="p-4">
//         {isLoading ? (
//           <div className="grid grid-cols-2 gap-3">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl
//                 animate-pulse h-52"
//               />
//             ))}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div
//             className="flex flex-col items-center justify-center
//             py-20 text-center"
//           >
//             <span className="text-6xl mb-4">🛍️</span>
//             <p className="text-gray-500 font-medium">No products yet</p>
//             <p className="text-gray-300 text-sm mt-1">
//               Add products from Distribution Center
//             </p>
//             <button
//               onClick={() => navigate("/distribution")}
//               className="mt-4 px-6 py-2.5 rounded-xl text-white
//                 text-sm font-bold"
//               style={{
//                 background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//               }}
//             >
//               + Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-3">
//             {filtered.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white rounded-2xl shadow-sm overflow-hidden"
//               >
//                 {/* Image */}
//                 <div
//                   className="relative h-36 bg-gray-100 cursor-pointer"
//                   onClick={() => navigate(`/products/${product._id}`)}
//                 >
//                   {product.image ? (
//                     <img
//                       src={product.image}
//                       alt={product.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div
//                       className="w-full h-full flex items-center
//                       justify-center"
//                     >
//                       <span className="text-4xl">📦</span>
//                     </div>
//                   )}
//                   {/* Status badge */}
//                   <div
//                     className={`absolute top-2 right-2 px-2 py-0.5
//                     rounded-full text-[10px] font-bold text-white ${
//                       product.isActive ? "bg-green-500" : "bg-gray-400"
//                     }`}
//                   >
//                     {product.isActive ? "On" : "Off"}
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="p-3">
//                   <p
//                     className="text-gray-700 text-xs font-medium
//                     line-clamp-2 leading-snug mb-2"
//                   >
//                     {product.title}
//                   </p>
//                   <div className="flex justify-between items-center mb-2">
//                     <span
//                       className="text-xs font-bold"
//                       style={{ color: "#f02d65" }}
//                     >
//                       ${product.sellingPrice?.toFixed(2)}
//                     </span>
//                     <span className="text-green-500 text-xs font-bold">
//                       +${product.profit?.toFixed(2)}
//                     </span>
//                   </div>
//                   {/* Toggle button */}
//                   <button
//                     onClick={() => toggleMutation.mutate(product._id)}
//                     disabled={toggleMutation.isPending}
//                     className={`w-full py-1.5 rounded-lg text-xs
//                       font-bold transition-all ${
//                         product.isActive
//                           ? "bg-red-50 text-red-400 border border-red-100"
//                           : "bg-green-50 text-green-500 border border-green-100"
//                       }`}
//                   >
//                     {product.isActive ? "Take Off Shelf" : "Put On Shelf"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default Products;

//////////////////////// ======================== version (by gemeni) ====================== ///////////////////////

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import {
  Loader2,
  PackageOpen,
  Plus,
  Store,
  CheckCircle2,
  XCircle,
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
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "90px" }}
    >
      {/* ── STICKY HEADER ── */}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Store size={22} color="#fff" />
            <h1
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              My Store
            </h1>
          </div>
          <button
            onClick={() => navigate("/distribution")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "20px",
              padding: "6px 12px",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Get Products
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "14px 0",
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
              {tab.label} (
              {
                products.filter((p) =>
                  tab.key === "active" ? p.isActive : !p.isActive,
                ).length
              }
              )
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div style={{ padding: "16px" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0",
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
            <PackageOpen
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
              Store is Empty
            </p>
            <p
              style={{
                color: "#64748b",
                fontSize: "13px",
                margin: "0 0 20px 0",
              }}
            >
              You haven't added any products to your shelf yet.
            </p>
            <button
              onClick={() => navigate("/distribution")}
              style={{
                background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)",
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
              gap: "12px",
            }}
          >
            {filtered.map((product) => (
              <div
                key={product._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: "140px",
                    backgroundColor: "#f8fafc",
                    position: "relative",
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
                      <PackageOpen size={32} color="#cbd5e1" />
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: product.isActive ? "#10b981" : "#64748b",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {product.isActive ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {product.isActive ? "ON SHELF" : "OFF SHELF"}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      color: "#1e293b",
                      fontSize: "13px",
                      fontWeight: "600",
                      margin: "0 0 12px 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                      minHeight: "36px",
                    }}
                  >
                    {product.title}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        backgroundColor: "#f8fafc",
                        padding: "8px",
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#64748b",
                            fontSize: "10px",
                            margin: "0 0 2px 0",
                          }}
                        >
                          Price
                        </p>
                        <p
                          style={{
                            color: "#1e293b",
                            fontSize: "13px",
                            fontWeight: "bold",
                            margin: 0,
                            fontFamily: "monospace",
                          }}
                        >
                          ${product.sellingPrice?.toFixed(2)}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            color: "#64748b",
                            fontSize: "10px",
                            margin: "0 0 2px 0",
                          }}
                        >
                          Profit
                        </p>
                        <p
                          style={{
                            color: "#10b981",
                            fontSize: "13px",
                            fontWeight: "bold",
                            margin: 0,
                            fontFamily: "monospace",
                          }}
                        >
                          +${product.profit?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMutation.mutate(product._id)}
                      disabled={toggleMutation.isPending}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        border: "none",
                        transition: "all 0.2s",
                        backgroundColor: product.isActive
                          ? "#fff1f2"
                          : "#f0fdf4",
                        color: product.isActive ? "#f02d65" : "#10b981",
                      }}
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.95)")
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
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
