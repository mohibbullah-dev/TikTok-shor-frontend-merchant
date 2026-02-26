import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await API.get(`/products/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar title="Product Detail" />
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopBar title="Product Detail" />

      {/* Product Image */}
      <div className="h-64 bg-gray-100 overflow-hidden">
        {product?.image ? (
          <img
            src={product.image}
            alt={product?.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mx-4 -mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-base leading-snug">
          {product?.title}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Category: {product?.category}
        </p>
        <div className="flex gap-4 mt-3">
          <div>
            <p className="text-gray-400 text-xs">Selling Price</p>
            <p className="font-bold text-lg" style={{ color: "#f02d65" }}>
              ${product?.sellingPrice?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Your Profit</p>
            <p className="font-bold text-lg text-green-500">
              +${product?.profit?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Stock</p>
            <p className="font-bold text-lg text-gray-700">
              {product?.stock || "999+"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-sm mb-3">Product Stats</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Views", value: product?.views || 0, icon: "👁️" },
            { label: "Sales", value: product?.sales || 0, icon: "📦" },
            {
              label: "Recommended",
              value: product?.isRecommended ? "Yes" : "No",
              icon: "⭐",
            },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-xl">{stat.icon}</span>
              <p className="font-bold text-gray-700 text-sm mt-1">
                {stat.value}
              </p>
              <p className="text-gray-400 text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {product?.description && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-700 font-bold text-sm mb-2">Description</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
