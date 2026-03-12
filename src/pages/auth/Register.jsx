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
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    storeAddress: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    storeName: "",
    invitationCode: "",
    nidFront: null,
    nidBack: null,
  });

  const [countryCode, setCountryCode] = useState("+86");
  const [language, setLanguage] = useState("US English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

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
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [e.target.name]: file });
      const objectUrl = URL.createObjectURL(file);
      if (e.target.name === "nidFront") setPreviewFront(objectUrl);
      if (e.target.name === "nidBack") setPreviewBack(objectUrl);
    }
  };

  const handleNextStep = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.storeAddress ||
      !formData.password ||
      !formData.mobile
    ) {
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
      submitData.append("storeAddress", formData.storeAddress);
      submitData.append("mobile", `${countryCode} ${formData.mobile}`);
      submitData.append("password", formData.password);
      submitData.append("storeName", formData.storeName);
      submitData.append("invitationCode", formData.invitationCode);
      submitData.append("nidFront", formData.nidFront);
      submitData.append("nidBack", formData.nidBack);

      await API.post("/auth/register", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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

  const languages = ["US English", "Bangla", "Hindi"];

  return (
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100">
      <div
        className="w-full flex flex-col bg-white overflow-x-hidden relative"
        style={{ maxWidth: "480px", minHeight: "100vh" }}
      >
        {/* ── Official Top Navigation Bar ── */}
        <div className="flex justify-between items-center px-5 py-4 relative z-20">
          <div className="flex items-center">
            {step === 2 && (
              <ArrowLeft
                size={20}
                className="mr-3 cursor-pointer text-gray-800 hover:text-gray-600"
                onClick={() => setStep(1)}
              />
            )}
            {/* ✅ NEW: Using the exact uploaded logo image */}
            <img
              src="/logo_like_demo.jpg"
              alt="TikTok Shop"
              className="h-6 object-contain" // Adjusted height to match demo top bar
            />
          </div>

          <div className="relative">
            <div
              className="text-[13px] text-[#018784] font-medium cursor-pointer flex items-center gap-1"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {language} <span className="text-[9px]">▼</span>
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
                    className="px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Centered Hero Illustration ── */}
        <div className="flex flex-col items-center justify-center mt-2 mb-6">
          {/* ✅ NEW: Using the exact uploaded hero illustration */}
          <img
            src="/hero_image_like_demo.jpg"
            alt="Hero Illustration"
            className="w-48 h-48 object-contain mb-2" // Slightly larger to match the demo's visual weight
          />
          <h1 className="text-[22px] font-bold text-[#121212]">
            {step === 1 ? "Create Account" : "Store Info"}
          </h1>
          <p className="text-[13px] text-gray-400 mt-1">Step {step} of 2</p>
        </div>

        {/* ── Form Container ── */}
        <div className="px-6 pb-12">
          {step === 1 ? (
            <div className="flex flex-col" style={{ gap: "18px" }}>
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
                <label style={labelStyle}>Physical Address</label>
                <input
                  type="text"
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Phone number</label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 border border-r-0 border-[#e5e7eb] rounded-l-[4px] bg-white text-[14px] text-gray-600 focus:outline-none cursor-pointer appearance-none"
                    style={{ minWidth: "80px", textAlign: "center" }}
                  >
                    <option value="+86">CN +86</option>
                    <option value="+1">US +1</option>
                    <option value="+880">BD +880</option>
                    <option value="+20">EG +20</option>
                  </select>
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
                <label style={labelStyle}>Government ID / Passport</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Front ID Box */}
                  <div className="relative h-24 bg-[#f9fafb] border border-dashed border-[#d1d5db] rounded-[6px] overflow-hidden flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group">
                    {previewFront ? (
                      <>
                        <img
                          src={previewFront}
                          alt="Front ID"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[11px] font-bold">
                            Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FileImage size={20} className="text-gray-400 mb-1" />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Front Side
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      name="nidFront"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Back ID Box */}
                  <div className="relative h-24 bg-[#f9fafb] border border-dashed border-[#d1d5db] rounded-[6px] overflow-hidden flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group">
                    {previewBack ? (
                      <>
                        <img
                          src={previewBack}
                          alt="Back ID"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[11px] font-bold">
                            Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FileImage size={20} className="text-gray-400 mb-1" />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Back Side
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      name="nidBack"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
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
                className="w-full text-white font-semibold border-none mt-2 transition-opacity hover:opacity-90"
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "15px",
                  backgroundColor: "#018784",
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
                  placeholder="6-digit admin code"
                  maxLength={6}
                  className="tracking-widest font-bold uppercase"
                  style={{ ...inputStyle, color: "#018784", fontSize: "16px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

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
                    margin: "0 0 6px 0",
                  }}
                >
                  <strong>User:</strong> {formData.username}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 6px 0",
                  }}
                >
                  <strong>Phone:</strong> {countryCode} {formData.mobile}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 6px 0",
                  }}
                >
                  <strong>Address:</strong> {formData.storeAddress}
                </p>
                <p
                  className="flex items-center text-[#018784] font-medium"
                  style={{ fontSize: "13px", margin: "0" }}
                >
                  <CheckCircle2 size={14} className="mr-1" /> IDs Uploaded
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold border-none flex items-center justify-center transition-opacity mt-2"
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "15px",
                  backgroundColor: loading ? "#d1d5db" : "#018784",
                  cursor: loading ? "not-allowed" : "pointer",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Creating...
                  </>
                ) : (
                  "Register Store"
                )}
              </button>
            </form>
          )}

          <div className="flex items-center justify-center mt-6 text-[13px] text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium ml-1"
              style={{ color: "#018784", textDecoration: "none" }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
