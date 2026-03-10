//////////////////// ============================ latest version (by gemeni) =================== ////////////////////////

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Lock, Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";

export default function Settings() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords do not match");
      }
      if (formData.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      const { data } = await API.put("/auth/change-password", {
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err) =>
      toast.error(
        err.message ||
          err.response?.data?.message ||
          "Failed to change password",
      ),
  });

  const inputStyle = {
    width: "100%",
    padding: "16px 44px 16px 44px",
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
        title="Account Settings"
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
        <div
          style={{
            backgroundColor: "#fff1f2",
            border: "1px dashed #fecdd3",
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            gap: "12px",
          }}
        >
          <ShieldAlert size={20} color="#e11d48" style={{ flexShrink: 0 }} />
          <p
            style={{
              color: "#be123c",
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            For your security, please use a strong password and never share it
            with anyone.
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
                display: "block",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Current Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
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
                type={showPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#9ca3af",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
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
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Min 6 characters"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
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
              Confirm New Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
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
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat new password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => passwordMutation.mutate()}
          disabled={
            passwordMutation.isPending ||
            !formData.oldPassword ||
            !formData.newPassword
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
              passwordMutation.isPending || !formData.oldPassword
                ? "not-allowed"
                : "pointer",
            background:
              passwordMutation.isPending || !formData.oldPassword
                ? "#cbd5e1"
                : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            boxShadow: "0 4px 15px rgba(30, 41, 59, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {passwordMutation.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
}
