///////////////////////////// ================================ latest version (by gemeni with 2 fields adintion) =======================///////////////////
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  FileImage,
  ClipboardCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  // 🛑 FUNCTIONALITY UNTOUCHED
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    storeName: "",
    invitationCode: "",
    nidFront: null,
    nidBack: null,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();

  useState(() => {
    const code = searchParams.get("code");
    if (code) {
      setFormData((prev) => ({ ...prev, invitationCode: code }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleNextStep = () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!formData.nidFront || !formData.nidBack) {
      toast.error("Please upload both front and back of your NID/Passport");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.storeName || !formData.invitationCode) {
      toast.error("Store name and invitation code are required");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("mobile", formData.mobile);
      submitData.append("storeName", formData.storeName);
      submitData.append("invitationCode", formData.invitationCode);
      submitData.append("nidFront", formData.nidFront);
      submitData.append("nidBack", formData.nidBack);

      await API.post("/auth/register", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 UI CSS Variables (Matched to Official App Screenshot)
  const inputStyle = {
    width: "100%",
    padding: "12px 14px", // No more heavy left padding (removed icons)
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px", // Softer, smaller border radius like the official app
    fontSize: "14px",
    color: "#121212",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  };

  return (
    // ── Outer Desktop Wrapper ──
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100">
      {/* ── Inner Mobile App Container ── */}
      <div
        className="w-full flex flex-col bg-white overflow-x-hidden"
        style={{ maxWidth: "480px", minHeight: "100vh" }}
      >
        {/* ── Official TikTok Shop Header ── */}
        <div className="flex justify-between items-center p-5">
          <div className="font-extrabold text-[18px] tracking-tight flex items-center">
            {step === 2 && (
              <ArrowLeft
                size={20}
                className="mr-3 cursor-pointer text-gray-800"
                onClick={() => setStep(1)}
              />
            )}
            <span className="text-[#121212]">
              <span className="text-[#E81155]">TikTok</span> Shop
            </span>
          </div>
          <div className="text-[13px] text-[#018784] font-medium cursor-pointer">
            US English <span className="text-[10px] ml-0.5">▼</span>
          </div>
        </div>

        {/* ── Centered Hero Illustration ── */}
        <div className="flex flex-col items-center justify-center mt-2 mb-6">
          {/* Ensure this image points to the exact graphic you uploaded */}
          <img
            src="/bg_image.jpg"
            alt="Hero Illustration"
            className="w-36 h-36 object-contain mb-3"
          />
          <h1 className="text-[24px] font-bold text-[#121212]">
            {step === 1 ? "Create Account" : "Store Info"}
          </h1>
          <p className="text-[13px] text-gray-400 mt-1">Step {step} of 2</p>
        </div>

        {/* ── Form Container ── */}
        <div className="px-6 pb-10">
          {step === 1 ? (
            <div className="flex flex-col" style={{ gap: "16px" }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <div className="flex justify-end mb-1 mt(-20px)">
                  {/* Official link placement */}
                  <span className="text-[12px] text-[#018784] font-medium absolute right-6 -mt-6 cursor-pointer">
                    Register with Phone
                  </span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Mobile Number</label>
                <div className="relative flex">
                  {/* Fake Country Code Box to match design */}
                  <div className="flex items-center justify-center px-3 border border-r-0 border-[#e5e7eb] rounded-l-[6px] bg-gray-50 text-[14px] text-gray-600">
                    CN +86{" "}
                    <span className="text-[10px] ml-1 text-gray-400">▼</span>
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    style={{
                      ...inputStyle,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#018784")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>NID / Passport (Front)</label>
                <div className="relative border border-[#e5e7eb] rounded-[6px] overflow-hidden transition-all focus-within:border-[#018784]">
                  <FileImage
                    size={16}
                    className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="file"
                    name="nidFront"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 36px",
                      fontSize: "13px",
                      color: "#4b5563",
                      outline: "none",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>NID / Passport (Back)</label>
                <div className="relative border border-[#e5e7eb] rounded-[6px] overflow-hidden transition-all focus-within:border-[#018784]">
                  <FileImage
                    size={16}
                    className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="file"
                    name="nidBack"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 36px",
                      fontSize: "13px",
                      color: "#4b5563",
                      outline: "none",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    onFocus={(e) => (e.target.style.borderColor = "#018784")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full text-white font-bold border-none mt-4 transition-colors"
                style={{
                  padding: "14px",
                  borderRadius: "6px",
                  fontSize: "15px",
                  backgroundColor: "#018784", // EXACT TIKTOK TEAL FROM SCREENSHOT
                  cursor: "pointer",
                }}
              >
                Next Step
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ gap: "16px" }}
            >
              <div>
                <label style={labelStyle}>Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Invitation Code</label>
                <input
                  type="text"
                  name="invitationCode"
                  value={formData.invitationCode}
                  onChange={handleChange}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="tracking-widest font-bold uppercase"
                  style={{ ...inputStyle, color: "#018784", fontSize: "16px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <p
                  className="text-gray-400"
                  style={{ fontSize: "11px", margin: "6px 0 0 4px" }}
                >
                  * Required field. Provided by admin.
                </p>
              </div>

              {/* ── Minimal Summary Box ── */}
              <div
                style={{
                  marginTop: "8px",
                  padding: "16px",
                  borderRadius: "6px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p
                  className="font-bold flex items-center"
                  style={{
                    color: "#121212",
                    fontSize: "13px",
                    gap: "6px",
                    margin: "0 0 10px 0",
                  }}
                >
                  <ClipboardCheck size={16} className="text-[#018784]" />{" "}
                  Summary
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <strong>User:</strong> {formData.username}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 4px 0",
                  }}
                >
                  <strong>Email:</strong> {formData.email}
                </p>
                <p style={{ color: "#4b5563", fontSize: "13px", margin: "0" }}>
                  <strong>IDs attached:</strong>{" "}
                  {formData.nidFront && formData.nidBack ? "Yes" : "No"}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold border-none flex items-center justify-center transition-colors mt-4"
                style={{
                  padding: "14px",
                  borderRadius: "6px",
                  fontSize: "15px",
                  backgroundColor: loading ? "#d1d5db" : "#018784", // EXACT TIKTOK TEAL
                  cursor: loading ? "not-allowed" : "pointer",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          {/* ── Official Link Formatting ── */}
          <div className="flex items-center justify-center mt-8 text-[13px] text-gray-500">
            Don't have an account yet?{" "}
            <Link
              to="/login"
              className="font-medium ml-1"
              style={{ color: "#018784", textDecoration: "none" }} // TikTok Teal Link
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
