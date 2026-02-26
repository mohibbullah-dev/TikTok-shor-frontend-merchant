import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const Settings = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentFundsPassword: "",
    newFundsPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      await API.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
    },
    onSuccess: () => {
      toast.success("Login password changed!");
      setActiveForm(null);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        currentFundsPassword: "",
        newFundsPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed");
    },
  });

  const changeFundsMutation = useMutation({
    mutationFn: async () => {
      await API.put("/auth/change-funds-password", {
        currentPassword: formData.currentFundsPassword,
        newPassword: formData.newFundsPassword,
      });
    },
    onSuccess: () => {
      toast.success("Funds password changed!");
      setActiveForm(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed");
    },
  });

  const handleChangePassword = () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Fill in all fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Min 6 characters");
      return;
    }
    changePasswordMutation.mutate();
  };

  const handleChangeFunds = () => {
    if (!formData.newFundsPassword || formData.newFundsPassword.length !== 6) {
      toast.error("Funds password must be 6 digits");
      return;
    }
    changeFundsMutation.mutate();
  };

  const settingItems = [
    {
      icon: "🔐",
      label: "Change Login Password",
      sub: "Update your account password",
      key: "password",
    },
    {
      icon: "💳",
      label: "Change Funds Password",
      sub: "Update your 6-digit PIN",
      key: "funds",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Settings" />

      <div className="mx-4 mt-4 space-y-3">
        {settingItems.map((item) => (
          <div key={item.key}>
            <button
              onClick={() =>
                setActiveForm(activeForm === item.key ? null : item.key)
              }
              className="w-full bg-white rounded-2xl p-4 shadow-sm
                flex items-center gap-3 active:bg-gray-50 transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl bg-pink-50
                flex items-center justify-center text-xl"
              >
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-700 text-sm font-medium">
                  {item.label}
                </p>
                <p className="text-gray-400 text-xs">{item.sub}</p>
              </div>
              <span
                className="text-gray-300 transition-transform"
                style={{
                  transform: activeForm === item.key ? "rotate(90deg)" : "none",
                }}
              >
                ›
              </span>
            </button>

            {/* Expanded Form */}
            {activeForm === item.key && (
              <div
                className="bg-white rounded-2xl p-4 shadow-sm
                mt-2 space-y-3"
              >
                {item.key === "password" ? (
                  <>
                    {[
                      {
                        name: "currentPassword",
                        placeholder: "Current password",
                        label: "Current Password",
                      },
                      {
                        name: "newPassword",
                        placeholder: "New password (min 6 chars)",
                        label: "New Password",
                      },
                      {
                        name: "confirmPassword",
                        placeholder: "Confirm new password",
                        label: "Confirm Password",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="text-gray-500 text-xs mb-1 block">
                          {field.label}
                        </label>
                        <input
                          type="password"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 bg-gray-50 border-2
                            border-gray-200 rounded-xl text-sm outline-none
                            focus:border-pink-400"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                      className="w-full py-3 rounded-xl text-white
                        font-bold text-sm disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                      }}
                    >
                      {changePasswordMutation.isPending
                        ? "Saving..."
                        : "Update Password"}
                    </button>
                  </>
                ) : (
                  <>
                    {[
                      {
                        name: "currentFundsPassword",
                        placeholder: "Current 6-digit PIN",
                        label: "Current Funds Password",
                      },
                      {
                        name: "newFundsPassword",
                        placeholder: "New 6-digit PIN",
                        label: "New Funds Password",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="text-gray-500 text-xs mb-1 block">
                          {field.label}
                        </label>
                        <input
                          type="password"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          maxLength={6}
                          className="w-full px-4 py-3 bg-gray-50 border-2
                            border-gray-200 rounded-xl text-sm outline-none
                            focus:border-pink-400 text-center tracking-widest
                            font-bold text-lg"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleChangeFunds}
                      disabled={changeFundsMutation.isPending}
                      className="w-full py-3 rounded-xl text-white
                        font-bold text-sm disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                      }}
                    >
                      {changeFundsMutation.isPending
                        ? "Saving..."
                        : "Update Funds Password"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
