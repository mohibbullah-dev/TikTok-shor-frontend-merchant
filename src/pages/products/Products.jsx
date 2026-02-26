import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import TopBar from "../../components/TopBar";

const Products = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "On Shelf" },
    { key: "inactive", label: "Off Shelf" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["myProducts", activeTab],
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
    onSuccess: () => {
      toast.success("Product status updated!");
      queryClient.invalidateQueries(["myProducts"]);
    },
    onError: () => toast.error("Failed to update"),
  });

  const products = data?.products || [];
  const filtered =
    activeTab === "all"
      ? products
      : activeTab === "active"
        ? products.filter((p) => p.isActive)
        : products.filter((p) => !p.isActive);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar
        title="My Products"
        showBack={false}
        rightElement={
          <button
            onClick={() => navigate("/distribution")}
            className="w-8 h-8 rounded-lg flex items-center
              justify-center text-white text-lg font-bold"
            style={{ background: "#f02d65" }}
          >
            +
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white sticky top-[52px] z-30 shadow-sm">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 text-sm font-medium
                transition-all relative"
              style={{
                color: activeTab === tab.key ? "#f02d65" : "#9ca3af",
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 left-1/2
                  -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ background: "#f02d65" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl
                animate-pulse h-52"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center
            py-20 text-center"
          >
            <span className="text-6xl mb-4">🛍️</span>
            <p className="text-gray-500 font-medium">No products yet</p>
            <p className="text-gray-300 text-sm mt-1">
              Add products from Distribution Center
            </p>
            <button
              onClick={() => navigate("/distribution")}
              className="mt-4 px-6 py-2.5 rounded-xl text-white
                text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #f02d65, #ff6b35)",
              }}
            >
              + Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Image */}
                <div
                  className="relative h-36 bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
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
                  {/* Status badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-0.5
                    rounded-full text-[10px] font-bold text-white ${
                      product.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {product.isActive ? "On" : "Off"}
                  </div>
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
                    <span className="text-green-500 text-xs font-bold">
                      +${product.profit?.toFixed(2)}
                    </span>
                  </div>
                  {/* Toggle button */}
                  <button
                    onClick={() => toggleMutation.mutate(product._id)}
                    disabled={toggleMutation.isPending}
                    className={`w-full py-1.5 rounded-lg text-xs
                      font-bold transition-all ${
                        product.isActive
                          ? "bg-red-50 text-red-400 border border-red-100"
                          : "bg-green-50 text-green-500 border border-green-100"
                      }`}
                  >
                    {product.isActive ? "Take Off Shelf" : "Put On Shelf"}
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
};

export default Products;
