import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios"; // Adjust path to your axios instance if needed
import { Mail, Key, Lock, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // UI State
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Phase 1: Request the OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      setIsLoading(true);
      const { data } = await API.post("/auth/forgot-password", { email });
      toast.success(data.message || "Verification code sent!");
      setStep(2); // Move to OTP screen
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: Verify OTP and Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6)
      return toast.error("Please enter the 6-digit code");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      setIsLoading(true);
      const { data } = await API.put("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(data.message || "Password reset successful!");
      navigate("/login"); // Send them back to login!
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1
            ? "Enter your email to receive a 6-digit reset code."
            : `We sent a code to ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {/* ─── PHASE 1: EMAIL FORM ─── */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label
                  className="text-gray-600 font-medium block"
                  style={{ fontSize: "13px", marginBottom: "8px" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="text-gray-400 absolute top-1/2 -translate-y-1/2"
                    style={{ left: "16px" }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchant@example.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 outline-none transition-all"
                    style={{
                      padding: "14px 14px 14px 44px",
                      borderRadius: "12px",
                      fontSize: "14px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff6b35";
                      e.target.style.backgroundColor = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "16px",
                  marginTop: "4px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                  gap: "8px",
                }}
                className="w-full text-white font-bold border-none flex items-center justify-center transition-transform"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {/* ─── PHASE 2: OTP & NEW PASSWORD FORM ─── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label
                  className="text-gray-600 font-medium block"
                  style={{ fontSize: "13px", marginBottom: "8px" }}
                >
                  6-Digit Code
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key
                      size={18}
                      className="text-gray-400 absolute top-1/2 -translate-y-1/2"
                      style={{ left: "16px" }}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 outline-none transition-all"
                    style={{
                      padding: "14px 14px 14px 44px",
                      borderRadius: "12px",
                      fontSize: "14px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff6b35";
                      e.target.style.backgroundColor = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-gray-600 font-medium block"
                  style={{ fontSize: "13px", marginBottom: "8px" }}
                >
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      size={18}
                      className="text-gray-400 absolute top-1/2 -translate-y-1/2"
                      style={{ left: "16px" }}
                    />
                  </div>
                  {/* <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="text-gray-400 absolute top-1/2 -translate-y-1/2"
                    style={{ left: "16px" }}
                  /> */}
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 outline-none transition-all"
                    style={{
                      padding: "14px 14px 14px 44px",
                      borderRadius: "12px",
                      fontSize: "14px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff6b35";
                      e.target.style.backgroundColor = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                  style={{ right: "16px", padding: 0 }}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Resetting..." : "Confirm New Password"}
                </button> */}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "16px",
                    marginTop: "4px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                    gap: "8px",
                  }}
                  className="w-full text-white font-bold border-none flex items-center justify-center transition-transform"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-bold hover:opacity-80 transition-opacity"
                  style={{
                    fontSize: "13px",
                    color: "#f02d65",
                    textDecoration: "none",
                  }}
                >
                  Need a new code? Go back
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-500"
              //   className="font-bold hover:opacity-80 transition-opacity"
              style={{
                fontSize: "13px",
                color: "#f02d65",
                textDecoration: "none",
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
