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

const Distribution = () => {
  const dispatch = useDispatch();
  const { selectedProducts } = useSelector((state) => state.cart);
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

  // Single distribute
  const distributeMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await API.post(`/products/${productId}/distribute`);
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

  // Bulk distribute
  const bulkMutation = useMutation({
    mutationFn: async () => {
      const productIds = selectedProducts.map((p) => p._id);
      const { data } = await API.post("/products/distribute-bulk", {
        productIds,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data.distributed} products added to your store!`);
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
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopBar title="Distribution Center" />

      {/* Search */}
      <div className="mx-4 mt-4">
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-400"
          >
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-white border-2
              border-gray-100 rounded-xl text-sm outline-none
              focus:border-pink-400 shadow-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div
        className="mt-3 px-4 flex gap-2 overflow-x-auto
        pb-1 scrollbar-hide"
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs
              font-bold transition-all whitespace-nowrap"
            style={{
              background:
                activeCategory === cat.key
                  ? "linear-gradient(135deg, #f02d65, #ff6b35)"
                  : "white",
              color: activeCategory === cat.key ? "white" : "#6b7280",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl
                animate-pulse h-56"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🔍</span>
            <p className="text-gray-400 mt-3">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => {
              const selected = isSelected(product._id);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm
                    overflow-hidden transition-all"
                  style={{
                    border: selected
                      ? "2px solid #f02d65"
                      : "2px solid transparent",
                  }}
                >
                  {/* Image + Select */}
                  <div className="relative h-36 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center
                        justify-center"
                      >
                        <span className="text-4xl">📦</span>
                      </div>
                    )}

                    {/* Select checkbox */}
                    <button
                      onClick={() =>
                        selected
                          ? dispatch(removeProduct(product._id))
                          : dispatch(addProduct(product))
                      }
                      className="absolute top-2 left-2 w-6 h-6
                        rounded-full border-2 flex items-center
                        justify-center transition-all"
                      style={{
                        background: selected ? "#f02d65" : "white",
                        borderColor: selected ? "#f02d65" : "#d1d5db",
                      }}
                    >
                      {selected && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>

                    {/* Hot badge */}
                    {product.isRecommended && (
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5
                        rounded-full text-[10px] font-bold text-white"
                        style={{ background: "#f02d65" }}
                      >
                        HOT
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p
                      className="text-gray-700 text-xs font-medium
                      line-clamp-2 leading-snug mb-2"
                    >
                      {product.title}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#f02d65" }}
                      >
                        ${product.sellingPrice?.toFixed(2)}
                      </span>
                      <span className="text-green-500 text-xs">
                        +${product.profit?.toFixed(2)}
                      </span>
                    </div>

                    {/* Distribute button */}
                    <button
                      onClick={() => distributeMutation.mutate(product._id)}
                      disabled={distributeMutation.isPending}
                      className="w-full py-1.5 rounded-lg text-xs
                        font-bold text-white transition-all
                        active:scale-95 disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                      }}
                    >
                      + Distribute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Bulk Bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[480px] bg-white border-t border-gray-100
        p-4 shadow-lg z-40"
      >
        <div className="flex items-center gap-3">
          {/* Select All */}
          <button onClick={handleSelectAll} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center
              justify-center transition-all"
              style={{
                background:
                  selectedProducts.length === filtered.length &&
                  filtered.length > 0
                    ? "#f02d65"
                    : "white",
                borderColor:
                  selectedProducts.length === filtered.length &&
                  filtered.length > 0
                    ? "#f02d65"
                    : "#d1d5db",
              }}
            >
              {selectedProducts.length === filtered.length &&
                filtered.length > 0 && (
                  <span className="text-white text-xs">✓</span>
                )}
            </div>
            <span className="text-gray-500 text-sm">All</span>
          </button>

          <p className="text-gray-400 text-sm flex-1">
            {selectedProducts.length > 0
              ? `${selectedProducts.length} selected`
              : "Select products"}
          </p>

          {/* Bulk Distribute */}
          <button
            onClick={() => bulkMutation.mutate()}
            disabled={selectedProducts.length === 0 || bulkMutation.isPending}
            className="px-5 py-2.5 rounded-xl text-white text-sm
              font-bold transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #f02d65, #ff6b35)",
            }}
          >
            {bulkMutation.isPending
              ? "Adding..."
              : `Distribute (${selectedProducts.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Distribution;
