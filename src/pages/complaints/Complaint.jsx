// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";
// import moment from "moment";

// const Complaint = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [formData, setFormData] = useState({
//     orderSn: "",
//     content: "",
//     images: [],
//   });

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["myComplaints"],
//     queryFn: async () => {
//       const { data } = await API.get("/complaints/my-complaints");
//       return data;
//     },
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (formData.images.length >= 3) {
//       toast.error("Maximum 3 images allowed");
//       return;
//     }

//     setUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const { data } = await API.post("/upload/single?folder=general", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, data.url],
//       }));
//       toast.success("Image uploaded!");
//     } catch {
//       toast.error("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const submitMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.post("/complaints", formData);
//       return data;
//     },
//     onSuccess: () => {
//       toast.success("Complaint submitted successfully!");
//       setShowForm(false);
//       setFormData({ orderSn: "", content: "", images: [] });
//       refetch();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Submission failed");
//     },
//   });

//   const handleSubmit = () => {
//     if (!formData.orderSn) {
//       toast.error("Enter order serial number");
//       return;
//     }
//     if (!formData.content) {
//       toast.error("Describe your complaint");
//       return;
//     }
//     submitMutation.mutate();
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "#f59e0b",
//       processing: "#3b82f6",
//       resolved: "#22c55e",
//       rejected: "#ef4444",
//     };
//     return colors[status] || "#888";
//   };

//   const complaints = data || [];

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <TopBar
//         title="Complaints"
//         rightElement={
//           <button
//             onClick={() => setShowForm(true)}
//             className="w-8 h-8 rounded-lg flex items-center
//               justify-center text-white text-lg font-bold"
//             style={{ background: "#f02d65" }}
//           >
//             +
//           </button>
//         }
//       />

//       {/* Complaints List */}
//       <div className="p-4 space-y-3">
//         {isLoading ? (
//           [...Array(3)].map((_, i) => (
//             <div key={i} className="bg-white rounded-2xl animate-pulse h-24" />
//           ))
//         ) : complaints.length === 0 ? (
//           <div className="text-center py-20">
//             <span className="text-6xl">🚨</span>
//             <p className="text-gray-500 mt-4 font-medium">
//               No complaints submitted
//             </p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="mt-4 px-6 py-2.5 rounded-xl text-white
//                 text-sm font-bold"
//               style={{
//                 background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//               }}
//             >
//               + Submit Complaint
//             </button>
//           </div>
//         ) : (
//           complaints.map((complaint) => (
//             <div
//               key={complaint._id}
//               className="bg-white rounded-2xl p-4 shadow-sm"
//             >
//               <div className="flex items-start justify-between mb-2">
//                 <div>
//                   <p className="text-gray-700 text-sm font-bold">
//                     Order: #{complaint.orderSn?.slice(-10)}
//                   </p>
//                   <p className="text-gray-400 text-xs mt-0.5">
//                     {moment(complaint.createdAt).format("YYYY-MM-DD HH:mm")}
//                   </p>
//                 </div>
//                 <span
//                   className="text-xs px-2.5 py-1 rounded-full
//                   text-white font-medium"
//                   style={{
//                     background: getStatusColor(complaint.status),
//                   }}
//                 >
//                   {complaint.status}
//                 </span>
//               </div>

//               <p className="text-gray-500 text-sm line-clamp-2">
//                 {complaint.content}
//               </p>

//               {/* Images */}
//               {complaint.images?.length > 0 && (
//                 <div className="flex gap-2 mt-3">
//                   {complaint.images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       alt=""
//                       className="w-14 h-14 rounded-lg object-cover
//                         border border-gray-100"
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Resolution */}
//               {complaint.resolution && (
//                 <div
//                   className="mt-3 p-3 bg-green-50 rounded-xl
//                   border border-green-100"
//                 >
//                   <p className="text-green-600 text-xs font-bold mb-1">
//                     Admin Resolution:
//                   </p>
//                   <p className="text-green-600 text-xs">
//                     {complaint.resolution}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//       {/* Submit Form Modal */}
//       {showForm && (
//         <div
//           className="fixed inset-0 bg-black/50 z-50 flex
//           items-end justify-center"
//         >
//           <div
//             className="bg-white w-full max-w-[480px] rounded-t-3xl
//             max-h-[90vh] flex flex-col"
//           >
//             <div
//               className="flex items-center justify-between p-5
//               border-b border-gray-100"
//             >
//               <h3 className="font-bold text-gray-800">Submit Complaint</h3>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="w-8 h-8 bg-gray-100 rounded-full flex
//                   items-center justify-center text-gray-500"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-5 space-y-4">
//               {/* Order SN */}
//               <div>
//                 <label
//                   className="text-gray-600 text-sm font-medium
//                   mb-1.5 block"
//                 >
//                   Order Serial Number *
//                 </label>
//                 <input
//                   type="text"
//                   name="orderSn"
//                   value={formData.orderSn}
//                   onChange={handleChange}
//                   placeholder="Enter full order number"
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400 font-mono"
//                 />
//               </div>

//               {/* Content */}
//               <div>
//                 <label
//                   className="text-gray-600 text-sm font-medium
//                   mb-1.5 block"
//                 >
//                   Complaint Description *
//                 </label>
//                 <textarea
//                   name="content"
//                   value={formData.content}
//                   onChange={handleChange}
//                   placeholder="Describe your issue in detail..."
//                   rows={4}
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400 resize-none"
//                 />
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label
//                   className="text-gray-600 text-sm font-medium
//                   mb-1.5 block"
//                 >
//                   Evidence Images (max 3)
//                 </label>
//                 <div className="flex gap-2 flex-wrap">
//                   {formData.images.map((img, i) => (
//                     <div key={i} className="relative">
//                       <img
//                         src={img}
//                         alt=""
//                         className="w-20 h-20 rounded-xl object-cover"
//                       />
//                       <button
//                         onClick={() =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             images: prev.images.filter((_, j) => j !== i),
//                           }))
//                         }
//                         className="absolute -top-2 -right-2 w-6 h-6
//                           bg-red-500 rounded-full text-white text-xs
//                           flex items-center justify-center"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}

//                   {formData.images.length < 3 && (
//                     <label
//                       className="w-20 h-20 border-2 border-dashed
//                       border-gray-200 rounded-xl flex flex-col items-center
//                       justify-center cursor-pointer bg-gray-50"
//                     >
//                       {uploading ? (
//                         <svg
//                           className="animate-spin h-5 w-5"
//                           style={{ color: "#f02d65" }}
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           />
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v8H4z"
//                           />
//                         </svg>
//                       ) : (
//                         <>
//                           <span className="text-2xl">📸</span>
//                           <span className="text-gray-400 text-[10px] mt-1">
//                             Add photo
//                           </span>
//                         </>
//                       )}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                       />
//                     </label>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 border-t border-gray-100">
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitMutation.isPending}
//                 className="w-full py-4 rounded-xl text-white font-bold
//                   disabled:opacity-60"
//                 style={{
//                   background: "linear-gradient(135deg, #f02d65, #ff6b35)",
//                 }}
//               >
//                 {submitMutation.isPending
//                   ? "Submitting..."
//                   : "SUBMIT COMPLAINT"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Complaint;

/////////////// =============================== latest version (by gemeni)  =========================== ////////////////////

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import {
  AlertCircle,
  UploadCloud,
  Loader2,
  Send,
  MessageSquareWarning,
} from "lucide-react";

export default function Complaint() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    orderSn: "",
    content: "",
    images: [], // Storing as array to handle multiple if needed, or single
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=complaints", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      toast.success("Image attached!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!formData.orderSn || !formData.content)
        // was: title
        throw new Error("Please fill in all required fields");
      const { data } = await API.post("/complaints", formData);
      return data;
    },
    onSuccess: () => {
      toast.success(
        "Complaint submitted successfully. Support will review it shortly.",
      );
      navigate("/profile");
    },
    onError: (err) =>
      toast.error(
        err.message || err.response?.data?.message || "Submission failed",
      ),
  });

  const inputStyle = {
    width: "100%",
    padding: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Submit Complaint"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#eff6ff",
            border: "1px dashed #bfdbfe",
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            gap: "12px",
          }}
        >
          <MessageSquareWarning
            size={20}
            color="#3b82f6"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <p
            style={{
              color: "#1e40af",
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Our support team typically responds within 24 hours. Please provide
            as much detail as possible to help us resolve your issue quickly.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Subject <span style={{ color: "#f02d65" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.orderSn}
              onChange={(e) =>
                setFormData({ ...formData, orderSn: e.target.value })
              }
              placeholder="e.g., ORD-20240101-00001"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Details <span style={{ color: "#f02d65" }}>*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Please describe your problem in detail..."
              rows={6}
              style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
              onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Attachments (Optional)
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <img
                    src={img}
                    alt="attachment"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      color: "#fff",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {formData.images.length < 3 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    backgroundColor: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    gap: "4px",
                  }}
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  ) : (
                    <>
                      <UploadCloud size={20} color="#94a3b8" />
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          fontWeight: "bold",
                        }}
                      >
                        Upload
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>

        <button
          onClick={() => submitMutation.mutate()}
          disabled={
            submitMutation.isPending ||
            !formData.orderSn || // was: title
            !formData.content ||
            uploading
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#fff",
            border: "none",
            cursor:
              submitMutation.isPending || !formData.title || !formData.content
                ? "not-allowed"
                : "pointer",
            background:
              submitMutation.isPending || !formData.title || !formData.content
                ? "#cbd5e1"
                : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            boxShadow: "0 4px 15px rgba(30, 41, 59, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "10px",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {submitMutation.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Send size={18} /> Submit Ticket
            </>
          )}
        </button>
      </div>
    </div>
  );
}
