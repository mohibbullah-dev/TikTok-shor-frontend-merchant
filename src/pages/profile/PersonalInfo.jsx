// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useSelector, useDispatch } from "react-redux";
// import { loginSuccess } from "../../store/authSlice";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const PersonalInfo = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     nickname: user?.nickname || "",
//     mobile: user?.mobile || "",
//     avatar: user?.avatar || "",
//   });
//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Upload avatar
//   const handleAvatarUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const { data } = await API.post("/upload/single?folder=avatars", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFormData((prev) => ({ ...prev, avatar: data.url }));
//       toast.success("Avatar uploaded!");
//     } catch {
//       toast.error("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const updateMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.put("/auth/update-profile", formData);
//       return data;
//     },
//     onSuccess: (data) => {
//       dispatch(
//         loginSuccess({
//           user: { ...user, ...data.user },
//           token: localStorage.getItem("token"),
//           merchant: null,
//         }),
//       );
//       toast.success("Profile updated!");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Update failed");
//     },
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <TopBar title="Personal Info" />

//       {/* Avatar Upload */}
//       <div className="flex flex-col items-center py-8">
//         <div className="relative">
//           <div
//             className="w-24 h-24 rounded-full overflow-hidden
//             border-4 shadow-lg bg-gray-100 flex items-center
//             justify-center"
//             style={{ borderColor: "#f02d65" }}
//           >
//             {formData.avatar ? (
//               <img
//                 src={formData.avatar}
//                 alt="avatar"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-4xl">👤</span>
//             )}
//           </div>

//           {/* Upload button */}
//           <label
//             className="absolute bottom-0 right-0 w-8 h-8
//             rounded-full flex items-center justify-center
//             text-white shadow-md cursor-pointer"
//             style={{ background: "#f02d65" }}
//           >
//             {uploading ? (
//               <svg
//                 className="animate-spin h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8H4z"
//                 />
//               </svg>
//             ) : (
//               <span className="text-sm">📷</span>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarUpload}
//               className="hidden"
//             />
//           </label>
//         </div>
//         <p className="text-gray-400 text-xs mt-2">
//           Tap camera to change avatar
//         </p>
//       </div>

//       {/* Form */}
//       <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden">
//         {[
//           {
//             label: "Username",
//             value: user?.username,
//             editable: false,
//           },
//           {
//             label: "Nickname",
//             name: "nickname",
//             value: formData.nickname,
//             placeholder: "Enter nickname",
//             editable: true,
//           },
//           {
//             label: "Email",
//             value: user?.email,
//             editable: false,
//           },
//           {
//             label: "Mobile",
//             name: "mobile",
//             value: formData.mobile,
//             placeholder: "Enter mobile number",
//             editable: true,
//           },
//         ].map((field, i) => (
//           <div
//             key={i}
//             className="flex items-center px-4 py-3.5 border-b
//               border-gray-50 last:border-0"
//           >
//             <p className="text-gray-400 text-sm w-24 flex-shrink-0">
//               {field.label}
//             </p>
//             {field.editable ? (
//               <input
//                 type="text"
//                 name={field.name}
//                 value={field.value}
//                 onChange={handleChange}
//                 placeholder={field.placeholder}
//                 className="flex-1 text-sm text-gray-700 outline-none
//                   text-right bg-transparent"
//               />
//             ) : (
//               <p className="flex-1 text-sm text-gray-400 text-right">
//                 {field.value || "Not set"}
//               </p>
//             )}
//             <span className="text-gray-200 ml-2">›</span>
//           </div>
//         ))}
//       </div>

//       {/* Merchant ID - readonly */}
//       <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
//         <div className="flex justify-between items-center">
//           <p className="text-gray-400 text-sm">Merchant ID</p>
//           <p className="text-gray-700 font-bold">
//             {useSelector((s) => s.auth.merchant)?.merchantId || "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="mx-4 mt-6">
//         <button
//           onClick={() => updateMutation.mutate()}
//           disabled={updateMutation.isPending}
//           className="w-full py-4 rounded-xl text-white font-bold
//             text-base shadow-lg active:scale-95 transition-all
//             disabled:opacity-60"
//           style={{
//             background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           }}
//         >
//           {updateMutation.isPending ? "Saving..." : "SAVE CHANGES"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfo;

/////////////////// ======================= latest version (by gemeni) ==========================///////////////////////

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { updateMerchant } from "../../store/authSlice";
import TopBar from "../../components/TopBar";
import {
  User,
  Phone,
  Store,
  Camera,
  Loader2,
  Save,
  SquarePen,
} from "lucide-react";

export default function PersonalInfo() {
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    storeName: "",
    mobile: "",
    storeLogo: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (merchant) {
      setFormData({
        storeName: merchant.storeName || "",
        mobile: user?.mobile || "",
        storeLogo: merchant.storeLogo || user?.avatar || "",
      });
    }
  }, [merchant, user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=avatars", fd);
      setFormData({ ...formData, storeLogo: data.url });
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      // Assuming you have a route to update profile/merchant details
      // const { data } = await API.put("/merchants/profile", formData);
      const { data } = await API.put("/merchants/my-store", {
        storeName: formData.storeName,
        storeLogo: formData.storeLogo,
        storePhone: formData.mobile,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      if (data.merchant) dispatch(updateMerchant(data.merchant));
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const inputStyle = {
    width: "100%",
    padding: "16px 16px 16px 44px",
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
        title="Personal Information"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      <div
        style={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Avatar Upload */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor: "#e2e8f0",
                border: "4px solid #fff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {uploading ? (
                <Loader2 className="animate-spin text-rose-500" />
              ) : formData.storeLogo ? (
                <img
                  src={formData.storeLogo}
                  alt="Logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Store size={32} color="#94a3b8" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#f02d65",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Camera size={14} color="#fff" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>
            Tap camera to change logo
          </p>
        </div>

        {/* Form Fields */}
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
                display: "block",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Store Name
            </label>
            <div style={{ position: "relative" }}>
              <Store
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
                readOnly
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                style={{
                  ...inputStyle,
                  backgroundColor: "#f1f5f9",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                }}
                // onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
                // onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
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
              Name (Read Only)
            </label>
            <div style={{ position: "relative" }}>
              <User
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
                value={user?.username || ""}
                readOnly
                style={{
                  ...inputStyle,
                  backgroundColor: "#f1f5f9",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                }}
              />
            </div>
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
              Mobile Number
            </label>
            <div style={{ position: "relative" }}>
              <Phone
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
                type="tel"
                value={formData.mobile}
                readOnly
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                style={{
                  ...inputStyle,
                  backgroundColor: "#f1f5f9",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                }}
                // onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
                // onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#fff",
            border: "none",
            cursor: updateMutation.isPending ? "not-allowed" : "pointer",
            background: updateMutation.isPending
              ? "#cbd5e1"
              : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
            boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {updateMutation.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <SquarePen size={18} /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
