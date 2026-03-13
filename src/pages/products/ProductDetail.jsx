// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { data: product, isLoading } = useQuery({
//     queryKey: ["product", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <TopBar title="Product Detail" />
//         <div className="p-4 space-y-3">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="bg-white rounded-2xl animate-pulse h-32" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <TopBar title="Product Detail" />

//       {/* Product Image */}
//       <div className="h-64 bg-gray-100 overflow-hidden">
//         {product?.image ? (
//           <img
//             src={product.image}
//             alt={product?.title}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <span className="text-6xl">📦</span>
//           </div>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="mx-4 -mt-4 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 font-bold text-base leading-snug">
//           {product?.title}
//         </p>
//         <p className="text-gray-400 text-xs mt-1">
//           Category: {product?.category}
//         </p>
//         <div className="flex gap-4 mt-3">
//           <div>
//             <p className="text-gray-400 text-xs">Selling Price</p>
//             <p className="font-bold text-lg" style={{ color: "#f02d65" }}>
//               ${product.salesPrice?.toFixed(2)}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-400 text-xs">Your Profit</p>
//             <p className="font-bold text-lg text-green-500">
//               +${product?.profit?.toFixed(2)}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-400 text-xs">Stock</p>
//             <p className="font-bold text-lg text-gray-700">
//               {product?.stock || "999+"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 font-bold text-sm mb-3">Product Stats</p>
//         <div className="grid grid-cols-3 gap-3">
//           {[
//             { label: "Views", value: product?.views || 0, icon: "👁️" },
//             { label: "Sales", value: product?.sales || 0, icon: "📦" },
//             {
//               label: "Recommended",
//               value: product?.isRecommended ? "Yes" : "No",
//               icon: "⭐",
//             },
//           ].map((stat, i) => (
//             <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
//               <span className="text-xl">{stat.icon}</span>
//               <p className="font-bold text-gray-700 text-sm mt-1">
//                 {stat.value}
//               </p>
//               <p className="text-gray-400 text-[10px]">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Description */}
//       {product?.description && (
//         <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//           <p className="text-gray-700 font-bold text-sm mb-2">Description</p>
//           <p className="text-gray-500 text-sm leading-relaxed">
//             {product.description}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetail;

//////////////////////// ========================== latest version 3 (by gemeni) =======================///////////////////

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Star, Package, Eye, Tag } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await API.get(`/products/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-[#f8fafc] font-sans"
        style={{ maxWidth: "480px", margin: "0 auto" }}
      >
        <TopBar
          title="Product Detail"
          backgroundColor="#ffffff"
          textColor="#0f172a"
        />
        <div className="p-5 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl animate-pulse h-32 border border-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8fafc] pb-10 font-sans relative"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <TopBar
          title="Product Detail"
          backgroundColor="#ffffff"
          textColor="#0f172a"
        />
      </div>

      {/* Product Image */}
      <div className="h-72 bg-white overflow-hidden relative border-b border-slate-200">
        {product?.image ? (
          <img
            src={product.image}
            alt={product?.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <Package size={48} className="text-slate-300" />
          </div>
        )}
      </div>

      {/* Product Info Card */}
      <div className="mx-5 -mt-6 relative z-10 bg-white rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-200">
        <p className="text-[#0f172a] font-extrabold text-[17px] leading-snug tracking-tight">
          {product?.title}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <Tag size={12} className="text-[#64748b]" />
          <p className="text-[#64748b] text-[12px] font-medium">
            {product?.category}
          </p>
        </div>

        <div className="flex gap-6 mt-5 bg-[#f8fafc] p-3 rounded-lg border border-slate-100">
          <div>
            <p className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-1">
              Selling Price
            </p>
            <p className="font-extrabold text-[20px] text-[#0f172a]">
              ${product.salesPrice?.toFixed(2)}
            </p>
          </div>
          <div className="w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-1">
              Your Profit
            </p>
            <p className="font-extrabold text-[20px] text-[#018784]">
              +${product?.profit?.toFixed(2)}
            </p>
          </div>
          <div className="w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-1">
              Stock
            </p>
            <p className="font-extrabold text-[16px] text-[#0f172a] mt-1">
              {product?.stock || "999+"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 mt-4 bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-200">
        <p className="text-[#0f172a] font-extrabold text-[15px] mb-4 tracking-tight">
          Product Stats
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Views",
              value: product?.views || 0,
              icon: <Eye size={18} className="text-[#018784]" />,
            },
            {
              label: "Sales",
              value: product?.sales || 0,
              icon: <Package size={18} className="text-[#018784]" />,
            },
            {
              label: "Recommended",
              value: product?.isRecommended ? "Yes" : "No",
              icon: (
                <Star
                  size={18}
                  className={
                    product?.isRecommended ? "text-[#ea580c]" : "text-[#018784]"
                  }
                  fill={product?.isRecommended ? "#ea580c" : "none"}
                />
              ),
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#f8fafc] rounded-lg p-3 text-center border border-slate-100 flex flex-col items-center"
            >
              <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 mb-2">
                {stat.icon}
              </div>
              <p className="font-extrabold text-[#0f172a] text-[15px] leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-[#64748b] text-[10px] font-semibold tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {product?.description && (
        <div className="mx-5 mt-4 bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-200">
          <p className="text-[#0f172a] font-extrabold text-[15px] mb-3 tracking-tight">
            Description
          </p>
          <p className="text-[#475569] text-[13px] leading-relaxed font-medium">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
