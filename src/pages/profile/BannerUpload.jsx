import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { updateMerchant } from "../../store/authSlice";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const BannerUpload = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { merchant } = useSelector((state) => state.auth);

  const [banners, setBanners] = useState(merchant?.banners || ["", "", ""]);
  const [uploading, setUploading] = useState(null);

  const handleBannerUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(index);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=banners", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newBanners = [...banners];
      newBanners[index] = data.url;
      setBanners(newBanners);
      toast.success(`Banner ${index + 1} uploaded!`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const removeBanner = (index) => {
    const newBanners = [...banners];
    newBanners[index] = "";
    setBanners(newBanners);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.put("/merchants/my-store/banners", {
        banners: banners.filter((b) => b !== ""),
      });
      return data;
    },
    onSuccess: (data) => {
      dispatch(updateMerchant(data.merchant));
      queryClient.invalidateQueries(["myStore"]);
      toast.success("Banners saved!");
    },
    onError: () => toast.error("Save failed"),
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopBar title="Banner Settings" />

      <div
        className="mx-4 mt-4 p-3 bg-blue-50 rounded-xl
        border border-blue-100"
      >
        <p className="text-blue-600 text-xs">
          📐 Recommended size: 1920×300 pixels (16:3 ratio)
        </p>
      </div>

      <div className="mx-4 mt-4 space-y-4">
        {banners.map((banner, index) => (
          <div key={index}>
            <p className="text-gray-500 text-xs font-medium mb-2">
              Banner {index + 1}
            </p>

            {banner ? (
              <div className="relative">
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-28 object-cover rounded-2xl
                    shadow-sm"
                />
                <button
                  onClick={() => removeBanner(index)}
                  className="absolute top-2 right-2 w-8 h-8
                    bg-red-500 rounded-full text-white flex items-center
                    justify-center shadow-md text-sm"
                >
                  ×
                </button>
                <div
                  className="absolute bottom-2 left-2 px-2 py-1
                  bg-black/40 rounded-lg"
                >
                  <p className="text-white text-[10px]">Banner {index + 1}</p>
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div
                  className="h-28 border-2 border-dashed
                  border-gray-200 rounded-2xl flex flex-col items-center
                  justify-center bg-white active:bg-gray-50 transition-all"
                >
                  {uploading === index ? (
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="animate-spin h-6 w-6"
                        style={{ color: "#f02d65" }}
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
                      <p className="text-gray-400 text-xs">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl mb-1">🖼️</span>
                      <p className="text-gray-400 text-sm">
                        Tap to upload banner
                      </p>
                      <p className="text-gray-300 text-xs">
                        1920×300 recommended
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerUpload(e, index)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[480px] bg-white border-t border-gray-100 p-4"
      >
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || banners.every((b) => b === "")}
          className="w-full py-4 rounded-xl text-white font-bold
            text-base shadow-lg active:scale-95 transition-all
            disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          }}
        >
          {saveMutation.isPending ? "Saving..." : "SAVE BANNERS"}
        </button>
      </div>
    </div>
  );
};

export default BannerUpload;
