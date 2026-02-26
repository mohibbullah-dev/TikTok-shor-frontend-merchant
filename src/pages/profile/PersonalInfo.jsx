import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    nickname: user?.nickname || "",
    mobile: user?.mobile || "",
    avatar: user?.avatar || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=avatars", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, avatar: data.url }));
      toast.success("Avatar uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.put("/auth/update-profile", formData);
      return data;
    },
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          user: { ...user, ...data.user },
          token: localStorage.getItem("token"),
          merchant: null,
        }),
      );
      toast.success("Profile updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Personal Info" />

      {/* Avatar Upload */}
      <div className="flex flex-col items-center py-8">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full overflow-hidden
            border-4 shadow-lg bg-gray-100 flex items-center
            justify-center"
            style={{ borderColor: "#f02d65" }}
          >
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>

          {/* Upload button */}
          <label
            className="absolute bottom-0 right-0 w-8 h-8
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
              <span className="text-sm">📷</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Tap camera to change avatar
        </p>
      </div>

      {/* Form */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          {
            label: "Username",
            value: user?.username,
            editable: false,
          },
          {
            label: "Nickname",
            name: "nickname",
            value: formData.nickname,
            placeholder: "Enter nickname",
            editable: true,
          },
          {
            label: "Email",
            value: user?.email,
            editable: false,
          },
          {
            label: "Mobile",
            name: "mobile",
            value: formData.mobile,
            placeholder: "Enter mobile number",
            editable: true,
          },
        ].map((field, i) => (
          <div
            key={i}
            className="flex items-center px-4 py-3.5 border-b
              border-gray-50 last:border-0"
          >
            <p className="text-gray-400 text-sm w-24 flex-shrink-0">
              {field.label}
            </p>
            {field.editable ? (
              <input
                type="text"
                name={field.name}
                value={field.value}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="flex-1 text-sm text-gray-700 outline-none
                  text-right bg-transparent"
              />
            ) : (
              <p className="flex-1 text-sm text-gray-400 text-right">
                {field.value || "Not set"}
              </p>
            )}
            <span className="text-gray-200 ml-2">›</span>
          </div>
        ))}
      </div>

      {/* Merchant ID - readonly */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Merchant ID</p>
          <p className="text-gray-700 font-bold">
            {useSelector((s) => s.auth.merchant)?.merchantId || "N/A"}
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mx-4 mt-6">
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

export default PersonalInfo;
