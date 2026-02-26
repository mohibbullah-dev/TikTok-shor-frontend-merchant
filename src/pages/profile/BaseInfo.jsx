import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { updateMerchant } from "../../store/authSlice";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const BaseInfo = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { merchant } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    storeName: merchant?.storeName || "",
    storePhone: merchant?.storePhone || "",
    storeAddress: merchant?.storeAddress || "",
    storeIntroduction: merchant?.storeIntroduction || "",
    welcomeMessage: merchant?.welcomeMessage || "",
  });
  const [uploading, setUploading] = useState(false);
  const [logo, setLogo] = useState(merchant?.storeLogo || "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=logos", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLogo(data.url);
      toast.success("Logo uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.put("/merchants/my-store", {
        ...formData,
        storeLogo: logo,
      });
      return data;
    },
    onSuccess: (data) => {
      dispatch(updateMerchant(data.merchant));
      queryClient.invalidateQueries(["myStore"]);
      toast.success("Store info updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopBar title="Basic Info" />

      {/* Logo Upload */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden
            border-4 shadow-lg bg-gray-100 flex items-center
            justify-center"
            style={{ borderColor: "#f02d65" }}
          >
            {logo ? (
              <img
                src={logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🏪</span>
            )}
          </div>
          <label
            className="absolute -bottom-2 -right-2 w-8 h-8
            rounded-full flex items-center justify-center
            text-white shadow-md cursor-pointer"
            style={{ background: "#f02d65" }}
          >
            {uploading ? (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <span>📷</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-gray-400 text-xs mt-3">Store Logo</p>
      </div>

      {/* Form */}
      <div className="mx-4 space-y-3">
        {[
          {
            label: "Store Name",
            name: "storeName",
            placeholder: "Enter store name",
            type: "text",
          },
          {
            label: "Store Phone",
            name: "storePhone",
            placeholder: "Enter store phone",
            type: "tel",
          },
          {
            label: "Store Address",
            name: "storeAddress",
            placeholder: "Enter store address",
            type: "text",
          },
        ].map((field) => (
          <div
            key={field.name}
            className="bg-white rounded-2xl
            p-4 shadow-sm"
          >
            <label className="text-gray-400 text-xs mb-1.5 block">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full text-gray-700 text-sm outline-none
                bg-transparent"
            />
          </div>
        ))}

        {/* Store Introduction */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-gray-400 text-xs mb-1.5 block">
            Store Introduction
          </label>
          <textarea
            name="storeIntroduction"
            value={formData.storeIntroduction}
            onChange={handleChange}
            placeholder="Write something about your store..."
            rows={3}
            className="w-full text-gray-700 text-sm outline-none
              bg-transparent resize-none"
          />
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-gray-400 text-xs mb-1.5 block">
            Welcome Message
          </label>
          <textarea
            name="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={handleChange}
            placeholder="Welcome message for customers..."
            rows={2}
            className="w-full text-gray-700 text-sm outline-none
              bg-transparent resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[480px] bg-white border-t border-gray-100 p-4"
      >
        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          className="w-full py-4 rounded-xl text-white font-bold
            text-base shadow-lg active:scale-95 transition-all
            disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          }}
        >
          {updateMutation.isPending ? "Saving..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
};

export default BaseInfo;
