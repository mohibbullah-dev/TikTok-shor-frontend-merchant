import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import moment from "moment";

const Complaint = () => {
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    orderSn: "",
    content: "",
    images: [],
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myComplaints"],
    queryFn: async () => {
      const { data } = await API.get("/complaints/my-complaints");
      return data;
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (formData.images.length >= 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=general", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.post("/complaints", formData);
      return data;
    },
    onSuccess: () => {
      toast.success("Complaint submitted successfully!");
      setShowForm(false);
      setFormData({ orderSn: "", content: "", images: [] });
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Submission failed");
    },
  });

  const handleSubmit = () => {
    if (!formData.orderSn) {
      toast.error("Enter order serial number");
      return;
    }
    if (!formData.content) {
      toast.error("Describe your complaint");
      return;
    }
    submitMutation.mutate();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      resolved: "#22c55e",
      rejected: "#ef4444",
    };
    return colors[status] || "#888";
  };

  const complaints = data || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopBar
        title="Complaints"
        rightElement={
          <button
            onClick={() => setShowForm(true)}
            className="w-8 h-8 rounded-lg flex items-center
              justify-center text-white text-lg font-bold"
            style={{ background: "#f02d65" }}
          >
            +
          </button>
        }
      />

      {/* Complaints List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl animate-pulse h-24" />
          ))
        ) : complaints.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🚨</span>
            <p className="text-gray-500 mt-4 font-medium">
              No complaints submitted
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2.5 rounded-xl text-white
                text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #f02d65, #ff6b35)",
              }}
            >
              + Submit Complaint
            </button>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-700 text-sm font-bold">
                    Order: #{complaint.orderSn?.slice(-10)}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {moment(complaint.createdAt).format("YYYY-MM-DD HH:mm")}
                  </p>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full
                  text-white font-medium"
                  style={{
                    background: getStatusColor(complaint.status),
                  }}
                >
                  {complaint.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2">
                {complaint.content}
              </p>

              {/* Images */}
              {complaint.images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {complaint.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover
                        border border-gray-100"
                    />
                  ))}
                </div>
              )}

              {/* Resolution */}
              {complaint.resolution && (
                <div
                  className="mt-3 p-3 bg-green-50 rounded-xl
                  border border-green-100"
                >
                  <p className="text-green-600 text-xs font-bold mb-1">
                    Admin Resolution:
                  </p>
                  <p className="text-green-600 text-xs">
                    {complaint.resolution}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex
          items-end justify-center"
        >
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl
            max-h-[90vh] flex flex-col"
          >
            <div
              className="flex items-center justify-between p-5
              border-b border-gray-100"
            >
              <h3 className="font-bold text-gray-800">Submit Complaint</h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex
                  items-center justify-center text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Order SN */}
              <div>
                <label
                  className="text-gray-600 text-sm font-medium
                  mb-1.5 block"
                >
                  Order Serial Number *
                </label>
                <input
                  type="text"
                  name="orderSn"
                  value={formData.orderSn}
                  onChange={handleChange}
                  placeholder="Enter full order number"
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400 font-mono"
                />
              </div>

              {/* Content */}
              <div>
                <label
                  className="text-gray-600 text-sm font-medium
                  mb-1.5 block"
                >
                  Complaint Description *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="text-gray-600 text-sm font-medium
                  mb-1.5 block"
                >
                  Evidence Images (max 3)
                </label>
                <div className="flex gap-2 flex-wrap">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, j) => j !== i),
                          }))
                        }
                        className="absolute -top-2 -right-2 w-6 h-6
                          bg-red-500 rounded-full text-white text-xs
                          flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 3 && (
                    <label
                      className="w-20 h-20 border-2 border-dashed
                      border-gray-200 rounded-xl flex flex-col items-center
                      justify-center cursor-pointer bg-gray-50"
                    >
                      {uploading ? (
                        <svg
                          className="animate-spin h-5 w-5"
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
                      ) : (
                        <>
                          <span className="text-2xl">📸</span>
                          <span className="text-gray-400 text-[10px] mt-1">
                            Add photo
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full py-4 rounded-xl text-white font-bold
                  disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                }}
              >
                {submitMutation.isPending
                  ? "Submitting..."
                  : "SUBMIT COMPLAINT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;
