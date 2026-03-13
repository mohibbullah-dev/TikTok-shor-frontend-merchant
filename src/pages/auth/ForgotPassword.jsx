import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios"; // Adjust path to your axios instance if needed
import { ArrowLeft, Loader2, ChevronDown, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // 🛑 FUNCTIONALITY UNTOUCHED
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Added Language State (Visual only, matches Login/Register)
  const [language, setLanguage] = useState("US English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const languages = ["US English", "Bangla", "Hindi"];

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

  // 🎨 UI CSS Variables (Exactly matching Login.jsx)
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#121212",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100">
      <div
        className="w-full flex flex-col bg-white overflow-x-hidden relative"
        style={{ maxWidth: "480px", minHeight: "100vh", padding: "18px" }}
      >
        {/* ── Official Top Navigation Bar ── */}
        <div className="flex justify-between items-center px-5 py-4 relative z-20">
          <div className="flex items-center gap-3">
            <img
              src="/demo_logo.png"
              alt="TikTok Shop"
              className="h-10 object-contain"
            />
            <div className="w-[1px] h-4 bg-gray-300"></div>
          </div>

          <div className="relative">
            <div
              className="text-[13px] text-[#018784] font-medium cursor-pointer flex items-center gap-1"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {language}{" "}
              <span className="text-[9px]">
                <ChevronDown />
              </span>
            </div>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                    style={{
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    }}
                    className="px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Centered Hero Illustration ── */}
        <div className="flex flex-col items-center justify-center mt-10 mb-8">
          <img
            src="/bg_image.png"
            alt="Hero Illustration"
            className="w-40 h-40 object-contain mb-4"
          />
          <h1 className="text-[22px] font-bold text-[#121212]">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-[13px] text-gray-500 mt-2 px-6 text-center">
            {step === 1
              ? "Enter your email address to receive a 6-digit verification code."
              : `We sent a verification code to ${email}`}
          </p>
        </div>

        {/* ── Form Container ── */}
        <div className="px-6 pb-12 w-full max-w-[400px] mx-auto">
          {/* ─── PHASE 1: EMAIL FORM ─── */}
          {step === 1 && (
            <form
              onSubmit={handleRequestOtp}
              className="flex flex-col"
              style={{ gap: "18px" }}
            >
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-semibold border-none flex items-center justify-center transition-opacity mt-4"
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "15px",
                  backgroundColor: isLoading ? "#d1d5db" : "#018784", // Official TikTok Teal
                  cursor: isLoading ? "not-allowed" : "pointer",
                  gap: "8px",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </form>
          )}

          {/* ─── PHASE 2: OTP & NEW PASSWORD FORM ─── */}
          {step === 2 && (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col"
              style={{ gap: "18px" }}
            >
              <div>
                <label style={labelStyle}>6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter verification code"
                  style={{ ...inputStyle, letterSpacing: "2px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    onFocus={(e) => (e.target.style.borderColor = "#018784")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-semibold border-none flex items-center justify-center transition-opacity"
                  style={{
                    padding: "12px",
                    borderRadius: "4px",
                    fontSize: "15px",
                    backgroundColor: isLoading ? "#d1d5db" : "#018784",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    gap: "8px",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Resetting...
                    </>
                  ) : (
                    "Confirm New Password"
                  )}
                </button>

                <div className="text-center mt-2">
                  <span
                    onClick={() => setStep(1)}
                    className="text-[14px] hover:text-[#018784] font-medium cursor-pointer transition-colors"
                  >
                    Need a new code? Go back
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* ── Back to Login Link ── */}
          <div
            style={{ marginTop: "24px" }}
            className="flex items-center justify-center mt-6 text-[13px] gap-1 text-gray-500"
          >
            <Link
              to="/login"
              className="text-[14px] hover:text-[#018784] font-medium cursor-pointer transition-colors flex items-center"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
