// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addProduct,
//   removeProduct,
//   selectAll,
//   clearCart,
// } from "../../store/cartSlice";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const Distribution = () => {
//   const dispatch = useDispatch();
//   const { selectedProducts } = useSelector((state) => state.cart);
//   const queryClient = useQueryClient();

//   const [activeCategory, setActiveCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const categories = [
//     { key: "all", label: "All" },
//     { key: "Hot Selling", label: "🔥 Hot" },
//     { key: "Computer accessories", label: "💻 Computer" },
//     { key: "Home cabinets", label: "🏠 Home" },
//     { key: "Health Products", label: "💊 Health" },
//     { key: "Men's", label: "👔 Men" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["distributionProducts", activeCategory],
//     queryFn: async () => {
//       const cat = activeCategory === "all" ? "" : activeCategory;
//       const { data } = await API.get(
//         `/products/distribution${cat ? `?category=${encodeURIComponent(cat)}` : ""}`,
//       );
//       return data;
//     },
//   });

//   // Single distribute
//   const distributeMutation = useMutation({
//     mutationFn: async (productId) => {
//       const { data } = await API.post(`/products/${productId}/distribute`);
//       return data;
//     },
//     onSuccess: () => {
//       toast.success("Product added to your store!");
//       queryClient.invalidateQueries(["myProducts"]);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Already in your store");
//     },
//   });

//   // Bulk distribute
//   const bulkMutation = useMutation({
//     mutationFn: async () => {
//       const productIds = selectedProducts.map((p) => p._id);
//       const { data } = await API.post("/products/distribute-bulk", {
//         productIds,
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success(`${data.distributed} products added to your store!`);
//       queryClient.invalidateQueries(["myProducts"]);
//       dispatch(clearCart());
//     },
//     onError: () => toast.error("Bulk distribute failed"),
//   });

//   const products = data?.products || [];
//   const filtered = searchQuery
//     ? products.filter((p) =>
//         p.title.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     : products;

//   const isSelected = (id) => selectedProducts.some((p) => p._id === id);

//   const handleSelectAll = () => {
//     if (selectedProducts.length === filtered.length) {
//       dispatch(clearCart());
//     } else {
//       dispatch(selectAll(filtered));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-32">
//       <TopBar title="Distribution Center" />

//       {/* Search */}
//       <div className="mx-4 mt-4">
//         <div className="relative">
//           <span
//             className="absolute left-4 top-1/2 -translate-y-1/2
//             text-gray-400"
//           >
//             🔍
//           </span>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search products..."
//             className="w-full pl-10 pr-4 py-3 bg-white border-2
//               border-gray-100 rounded-xl text-sm outline-none
//               focus:border-pink-400 shadow-sm"
//           />
//         </div>
//       </div>

//       {/* Categories */}
//       <div
//         className="mt-3 px-4 flex gap-2 overflow-x-auto
//         pb-1 scrollbar-hide"
//       >
//         {categories.map((cat) => (
//           <button
//             key={cat.key}
//             onClick={() => setActiveCategory(cat.key)}
//             className="flex-shrink-0 px-4 py-2 rounded-xl text-xs
//               font-bold transition-all whitespace-nowrap"
//             style={{
//               background:
//                 activeCategory === cat.key
//                   ? "linear-gradient(135deg, #f02d65, #ff6b35)"
//                   : "white",
//               color: activeCategory === cat.key ? "white" : "#6b7280",
//               boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//             }}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div className="p-4">
//         {isLoading ? (
//           <div className="grid grid-cols-2 gap-3">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl
//                 animate-pulse h-56"
//               />
//             ))}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-16">
//             <span className="text-5xl">🔍</span>
//             <p className="text-gray-400 mt-3">No products found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-3">
//             {filtered.map((product) => {
//               const selected = isSelected(product._id);
//               return (
//                 <div
//                   key={product._id}
//                   className="bg-white rounded-2xl shadow-sm
//                     overflow-hidden transition-all"
//                   style={{
//                     border: selected
//                       ? "2px solid #f02d65"
//                       : "2px solid transparent",
//                   }}
//                 >
//                   {/* Image + Select */}
//                   <div className="relative h-36 bg-gray-100">
//                     {product.image ? (
//                       <img
//                         src={product.image}
//                         alt={product.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div
//                         className="w-full h-full flex items-center
//                         justify-center"
//                       >
//                         <span className="text-4xl">📦</span>
//                       </div>
//                     )}

//                     {/* Select checkbox */}
//                     <button
//                       onClick={() =>
//                         selected
//                           ? dispatch(removeProduct(product._id))
//                           : dispatch(addProduct(product))
//                       }
//                       className="absolute top-2 left-2 w-6 h-6
//                         rounded-full border-2 flex items-center
//                         justify-center transition-all"
//                       style={{
//                         background: selected ? "#f02d65" : "white",
//                         borderColor: selected ? "#f02d65" : "#d1d5db",
//                       }}
//                     >
//                       {selected && (
//                         <span className="text-white text-xs">✓</span>
//                       )}
//                     </button>

//                     {/* Hot badge */}
//                     {product.isRecommended && (
//                       <div
//                         className="absolute top-2 right-2 px-2 py-0.5
//                         rounded-full text-[10px] font-bold text-white"
//                         style={{ background: "#f02d65" }}
//                       >
//                         HOT
//                       </div>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div className="p-3">
//                     <p
//                       className="text-gray-700 text-xs font-medium
//                       line-clamp-2 leading-snug mb-2"
//                     >
//                       {product.title}
//                     </p>
//                     <div className="flex justify-between items-center mb-2">
//                       <span
//                         className="text-xs font-bold"
//                         style={{ color: "#f02d65" }}
//                       >
//                         ${product.sellingPrice?.toFixed(2)}
//                       </span>
//                       <span className="text-green-500 text-xs">
//                         +${product.profit?.toFixed(2)}
//                       </span>
//                     </div>

//                     {/* Distribute button */}
//                     <button
//                       onClick={() => distributeMutation.mutate(product._id)}
//                       disabled={distributeMutation.isPending}
//                       className="w-full py-1.5 rounded-lg text-xs
//                         font-bold text-white transition-all
//                         active:scale-95 disabled:opacity-60"
//                       style={{
//                         background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//                       }}
//                     >
//                       + Distribute
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Bottom Bulk Bar */}
//       <div
//         className="fixed bottom-0 left-1/2 -translate-x-1/2
//         w-full max-w-[480px] bg-white border-t border-gray-100
//         p-4 shadow-lg z-40"
//       >
//         <div className="flex items-center gap-3">
//           {/* Select All */}
//           <button onClick={handleSelectAll} className="flex items-center gap-2">
//             <div
//               className="w-6 h-6 rounded-full border-2 flex items-center
//               justify-center transition-all"
//               style={{
//                 background:
//                   selectedProducts.length === filtered.length &&
//                   filtered.length > 0
//                     ? "#f02d65"
//                     : "white",
//                 borderColor:
//                   selectedProducts.length === filtered.length &&
//                   filtered.length > 0
//                     ? "#f02d65"
//                     : "#d1d5db",
//               }}
//             >
//               {selectedProducts.length === filtered.length &&
//                 filtered.length > 0 && (
//                   <span className="text-white text-xs">✓</span>
//                 )}
//             </div>
//             <span className="text-gray-500 text-sm">All</span>
//           </button>

//           <p className="text-gray-400 text-sm flex-1">
//             {selectedProducts.length > 0
//               ? `${selectedProducts.length} selected`
//               : "Select products"}
//           </p>

//           {/* Bulk Distribute */}
//           <button
//             onClick={() => bulkMutation.mutate()}
//             disabled={selectedProducts.length === 0 || bulkMutation.isPending}
//             className="px-5 py-2.5 rounded-xl text-white text-sm
//               font-bold transition-all active:scale-95 disabled:opacity-40"
//             style={{
//               background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//             }}
//           >
//             {bulkMutation.isPending
//               ? "Adding..."
//               : `Distribute (${selectedProducts.length})`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Distribution;

////////////////// ============================= latest version (by gemeni) ==========================///////////////////
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  removeProduct,
  selectAll,
  clearCart,
} from "../../store/cartSlice";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Search, Loader2, Package, Check, Flame } from "lucide-react";

const Distribution = () => {
  const dispatch = useDispatch();
  const { selectedProducts } = useSelector((state) => state.cart);
  console.log("selectedProducts :", selectedProducts);
  const queryClient = useQueryClient();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { key: "all", label: "All" },
    { key: "Hot Selling", label: "🔥 Hot" },
    { key: "Computer accessories", label: "💻 Computer" },
    { key: "Home cabinets", label: "🏠 Home" },
    { key: "Health Products", label: "💊 Health" },
    { key: "Men's", label: "👔 Men" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["distributionProducts", activeCategory],
    queryFn: async () => {
      const cat = activeCategory === "all" ? "" : activeCategory;
      const { data } = await API.get(
        `/products/distribution${cat ? `?category=${encodeURIComponent(cat)}` : ""}`,
      );
      return data;
    },
  });

  const distributeMutation = useMutation({
    mutationFn: async (productId) => {
      // AFTER:
      const { data } = await API.post(`/products/distribute/${productId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Product added to your store!");
      queryClient.invalidateQueries(["myProducts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Already in your store");
    },
  });

  const bulkMutation = useMutation({
    mutationFn: async () => {
      const productIds = selectedProducts.map((p) => p._id);
      const { data } = await API.post("/products/distribute-bulk", {
        productIds,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data.message || "Products distributed successfully"}`);
      queryClient.invalidateQueries(["myProducts"]);
      dispatch(clearCart());
    },
    onError: () => toast.error("Bulk distribute failed"),
  });

  const products = data?.products || [];
  const filtered = searchQuery
    ? products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  const isSelected = (id) => selectedProducts.some((p) => p._id === id);

  const handleSelectAll = () => {
    if (selectedProducts.length === filtered.length) {
      dispatch(clearCart());
    } else {
      dispatch(selectAll(filtered));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "100px" }}
    >
      {/* ── Top Bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <TopBar
          title="Distribution Center"
          backgroundColor="#1e293b"
          textColor="text-white"
          showBack={true}
        />

        {/* ── Search & Categories (Sticky Header Area) ── */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderBottom: "1px solid #f1f5f9",
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Search
              size={18}
              color="#9ca3af"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wholesale products..."
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                color: "#1e293b",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
            className="custom-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  flexShrink: 0,
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    activeCategory === cat.key
                      ? "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)"
                      : "#f1f5f9",
                  color: activeCategory === cat.key ? "#fff" : "#64748b",
                  boxShadow:
                    activeCategory === cat.key
                      ? "0 4px 10px rgba(240, 45, 101, 0.2)"
                      : "none",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div style={{ padding: "16px" }}>
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  height: "240px",
                }}
                className="animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Package
              size={48}
              color="#cbd5e1"
              style={{ margin: "0 auto 16px auto" }}
            />
            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              No products found
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {filtered.map((product) => {
              const selected = isSelected(product._id);
              return (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: selected
                      ? "2px solid #f02d65"
                      : "2px solid transparent",
                    boxShadow: selected
                      ? "0 4px 15px rgba(240, 45, 101, 0.15)"
                      : "0 2px 10px rgba(0,0,0,0.03)",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "150px",
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
                        <Package size={32} color="#cbd5e1" />
                      </div>
                    )}

                    <button
                      onClick={() =>
                        selected
                          ? dispatch(removeProduct(product._id))
                          : dispatch(addProduct(product))
                      }
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: selected ? "none" : "2px solid #cbd5e1",
                        background: selected
                          ? "#f02d65"
                          : "rgba(255,255,255,0.8)",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {selected && (
                        <Check size={14} color="#fff" strokeWidth={3} />
                      )}
                    </button>

                    {product.isRecommended && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: "#f02d65",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "10px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Flame size={10} /> HOT
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "12px" }}>
                    <p
                      style={{
                        color: "#1e293b",
                        fontSize: "12px",
                        fontWeight: "600",
                        margin: "0 0 8px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.4",
                        height: "34px",
                      }}
                    >
                      {product.title}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "10px",
                            margin: "0 0 2px 0",
                          }}
                        >
                          Selling Price
                        </p>
                        <span
                          style={{
                            color: "#f02d65",
                            fontSize: "14px",
                            fontWeight: "bold",
                            fontFamily: "monospace",
                          }}
                        >
                          ${product.salesPrice?.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "10px",
                            margin: "0 0 2px 0",
                          }}
                        >
                          Profit
                        </p>
                        <span
                          style={{
                            color: "#10b981",
                            fontSize: "12px",
                            fontWeight: "bold",
                            fontFamily: "monospace",
                          }}
                        >
                          +${product.profit?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => distributeMutation.mutate(product._id)}
                      disabled={distributeMutation.isPending}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#fff",
                        border: "none",
                        cursor: distributeMutation.isPending
                          ? "not-allowed"
                          : "pointer",
                        background: distributeMutation.isPending
                          ? "#cbd5e1"
                          : "#1e293b",
                        transition: "transform 0.1s",
                      }}
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.95)")
                      }
                      onMouseUp={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      Distribution
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom Bulk Bar ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "620px",
          backgroundColor: "#fff",
          borderTop: "1px solid #e2e8f0",
          padding: "16px 20px",
          zIndex: 50,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handleSelectAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border:
                selectedProducts.length === filtered.length &&
                filtered.length > 0
                  ? "none"
                  : "2px solid #cbd5e1",
              background:
                selectedProducts.length === filtered.length &&
                filtered.length > 0
                  ? "#f02d65"
                  : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedProducts.length === filtered.length &&
              filtered.length > 0 && (
                <Check size={14} color="#fff" strokeWidth={3} />
              )}
          </div>
          <span
            style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}
          >
            All
          </span>
        </button>

        <p
          style={{
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {selectedProducts.length}{" "}
          <span style={{ color: "#94a3b8", fontWeight: "normal" }}>
            Selected
          </span>
        </p>

        <button
          onClick={() => bulkMutation.mutate()}
          disabled={selectedProducts.length === 0 || bulkMutation.isPending}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            border: "none",
            cursor: selectedProducts.length === 0 ? "not-allowed" : "pointer",
            background:
              selectedProducts.length === 0
                ? "#e2e8f0"
                : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
            boxShadow:
              selectedProducts.length === 0
                ? "none"
                : "0 4px 15px rgba(240, 45, 101, 0.3)",
          }}
        >
          {bulkMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Distribute All"
          )}
        </button>
      </div>
    </div>
  );
};

export default Distribution;
