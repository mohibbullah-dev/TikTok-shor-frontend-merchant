// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import API from "../../api/axios";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     mobile: "",
//     storeName: "",
//     invitationCode: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [step, setStep] = useState(1);
//   // Step 1: Basic info
//   // Step 2: Store info + invitation code

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Validate step 1
//   const handleNextStep = () => {
//     if (!formData.username || !formData.email || !formData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }
//     setStep(2);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.storeName || !formData.invitationCode) {
//       toast.error("Store name and invitation code are required");
//       return;
//     }

//     setLoading(true);
//     try {
//       await API.post("/auth/register", {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         mobile: formData.mobile,
//         storeName: formData.storeName,
//         invitationCode: formData.invitationCode,
//       });

//       toast.success("Registration successful! Please login.");
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col"
//       style={{
//         background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//       }}
//     >
//       {/* Header */}
//       <div className="flex items-center px-6 pt-12 pb-6">
//         <button
//           onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
//           className="w-10 h-10 bg-white/20 rounded-full flex items-center
//             justify-center text-white mr-4"
//         >
//           ←
//         </button>
//         <div>
//           <h1 className="text-white text-xl font-bold">Create Account</h1>
//           <p className="text-white/70 text-xs">Step {step} of 2</p>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="px-6 mb-6">
//         <div className="h-1.5 bg-white/30 rounded-full">
//           <div
//             className="h-1.5 bg-white rounded-full transition-all duration-500"
//             style={{ width: step === 1 ? "50%" : "100%" }}
//           />
//         </div>
//       </div>

//       {/* White Card */}
//       <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6">
//         {step === 1 ? (
//           <>
//             <h2 className="text-gray-800 text-lg font-bold mb-6">
//               Account Information
//             </h2>

//             <div className="space-y-4">
//               {/* Username */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   placeholder="Enter username"
//                   className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
//                     rounded-xl text-sm outline-none focus:border-pink-400
//                     focus:bg-white transition-all"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter email"
//                   className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
//                     rounded-xl text-sm outline-none focus:border-pink-400
//                     focus:bg-white transition-all"
//                 />
//               </div>

//               {/* Mobile */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   placeholder="Enter mobile number"
//                   className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
//                     rounded-xl text-sm outline-none focus:border-pink-400
//                     focus:bg-white transition-all"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Min 6 characters"
//                     className="w-full px-4 pr-12 py-3.5 bg-gray-50 border
//                       border-gray-200 rounded-xl text-sm outline-none
//                       focus:border-pink-400 focus:bg-white transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//                   >
//                     {showPassword ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Repeat your password"
//                   className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
//                     rounded-xl text-sm outline-none focus:border-pink-400
//                     focus:bg-white transition-all"
//                 />
//               </div>

//               {/* Next Button */}
//               <button
//                 type="button"
//                 onClick={handleNextStep}
//                 className="w-full py-4 rounded-xl text-white font-bold
//                   text-base shadow-lg active:scale-95 transition-all mt-2"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                 }}
//               >
//                 NEXT STEP →
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h2 className="text-gray-800 text-lg font-bold mb-6">
//               Store Information
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Store Name */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Store Name
//                 </label>
//                 <input
//                   type="text"
//                   name="storeName"
//                   value={formData.storeName}
//                   onChange={handleChange}
//                   placeholder="Enter your store name"
//                   className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
//                     rounded-xl text-sm outline-none focus:border-pink-400
//                     focus:bg-white transition-all"
//                 />
//               </div>

//               {/* Invitation Code */}
//               <div>
//                 <label className="text-gray-600 text-sm font-medium mb-1.5 block">
//                   Invitation Code
//                 </label>
//                 <input
//                   type="text"
//                   name="invitationCode"
//                   value={formData.invitationCode}
//                   onChange={handleChange}
//                   placeholder="Enter 6-digit invitation code"
//                   maxLength={6}
//                   className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
//                     rounded-xl text-sm outline-none focus:border-pink-400
//                     focus:bg-white transition-all tracking-widest
//                     font-bold text-center text-lg"
//                 />
//                 <p className="text-xs text-gray-400 mt-1.5">
//                   * Get this code from your Merchant Admin
//                 </p>
//               </div>

//               {/* Info Box */}
//               <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
//                 <p className="text-xs text-pink-500 font-medium mb-1">
//                   📋 Registration Summary:
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Username: {formData.username}
//                 </p>
//                 <p className="text-xs text-gray-500">Email: {formData.email}</p>
//                 <p className="text-xs text-gray-500">
//                   Mobile: {formData.mobile || "Not provided"}
//                 </p>
//               </div>

//               {/* Register Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 rounded-xl text-white font-bold
//                   text-base shadow-lg active:scale-95 transition-all
//                   disabled:opacity-70"
//                 style={{
//                   background: loading
//                     ? "#ccc"
//                     : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                 }}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg
//                       className="animate-spin h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8H4z"
//                       />
//                     </svg>
//                     Creating Account...
//                   </span>
//                 ) : (
//                   "CREATE ACCOUNT"
//                 )}
//               </button>

//               {/* Login Link */}
//               <p className="text-center text-gray-500 text-sm">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="font-bold"
//                   style={{ color: "#f02d65" }}
//                 >
//                   Login
//                 </Link>
//               </p>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Register;

///////////////////// ================== lates version (by memeni) =====================///////////////////////////
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Store,
  Hash,
  ArrowLeft,
  Loader2,
  ClipboardCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    storeName: "",
    invitationCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();

  // Auto-fill invitation code if it exists in the URL
  useState(() => {
    const code = searchParams.get("code");
    if (code) {
      setFormData((prev) => ({ ...prev, invitationCode: code }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
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
      await API.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        storeName: formData.storeName,
        invitationCode: formData.invitationCode,
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
    padding: "14px 14px 14px 44px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#1f2937",
    outline: "none",
    transition: "all 0.2s",
  };
  const iconStyle = {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  };
  const labelStyle = {
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    display: "block",
  };

  return (
    <div
      className="min-h-screen flex flex-col relative bg-gray-50"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      {/* ── Header ── */}
      <div
        className="flex flex-col"
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          paddingBottom: "20px",
        }}
      >
        <div
          className="flex items-center"
          style={{ padding: "40px 24px 20px 24px" }}
        >
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              marginRight: "16px",
              padding: 0,
            }}
          >
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div>
            <h1
              className="font-bold text-white"
              style={{ fontSize: "20px", margin: 0 }}
            >
              Create Account
            </h1>
            <p
              className="text-white"
              style={{ fontSize: "13px", opacity: 0.8, margin: "2px 0 0 0" }}
            >
              Step {step} of 2
            </p>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div style={{ padding: "0 24px" }}>
          <div
            style={{
              height: "6px",
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              className="bg-white"
              style={{
                height: "100%",
                borderRadius: "10px",
                width: step === 1 ? "50%" : "100%",
                transition: "width 0.4s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── White Card ── */}
      <div
        className="bg-white flex-1 flex flex-col"
        style={{
          padding: "32px 24px",
          marginTop: "-20px",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {step === 1 ? (
          <>
            <h2
              className="text-gray-800 font-bold"
              style={{ fontSize: "20px", margin: "0 0 24px 0" }}
            >
              Account Information
            </h2>

            <div className="flex flex-col" style={{ gap: "16px" }}>
              <div>
                <label style={labelStyle}>Username</label>
                <div className="relative">
                  <User size={18} className="text-gray-400" style={iconStyle} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    style={inputStyle}
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

              <div>
                <label style={labelStyle}>Email Address</label>
                <div className="relative">
                  <Mail size={18} className="text-gray-400" style={iconStyle} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    style={inputStyle}
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

              <div>
                <label style={labelStyle}>Mobile Number</label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="text-gray-400"
                    style={iconStyle}
                  />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    style={inputStyle}
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

              <div>
                <label style={labelStyle}>Password</label>
                <div className="relative">
                  <Lock size={18} className="text-gray-400" style={iconStyle} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff6b35";
                      e.target.style.backgroundColor = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                    style={{
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="text-gray-400" style={iconStyle} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff6b35";
                      e.target.style.backgroundColor = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                    style={{
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full text-white font-bold border-none transition-transform"
                style={{
                  padding: "16px",
                  marginTop: "16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                NEXT STEP →
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              className="text-gray-800 font-bold"
              style={{ fontSize: "20px", margin: "0 0 24px 0" }}
            >
              Store Information
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ gap: "16px" }}
            >
              <div>
                <label style={labelStyle}>Store Name</label>
                <div className="relative">
                  <Store
                    size={18}
                    className="text-gray-400"
                    style={iconStyle}
                  />
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="Enter your store name"
                    style={inputStyle}
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

              <div>
                <label style={labelStyle}>Invitation Code</label>
                <div className="relative">
                  <Hash size={18} className="text-gray-400" style={iconStyle} />
                  <input
                    type="text"
                    name="invitationCode"
                    value={formData.invitationCode}
                    onChange={handleChange}
                    placeholder="6-digit code"
                    maxLength={6}
                    className="tracking-widest font-bold text-center uppercase"
                    style={{
                      ...inputStyle,
                      paddingLeft: "14px",
                      fontSize: "18px",
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
                <p
                  className="text-center text-gray-400"
                  style={{ fontSize: "12px", margin: "8px 0 0 0" }}
                >
                  * Ask your Merchant Admin for this code
                </p>
              </div>

              {/* Summary Box */}
              <div
                className="bg-orange-50 border border-orange-100 border-dashed"
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <p
                  className="text-orange-600 font-bold flex items-center"
                  style={{ fontSize: "13px", gap: "6px", margin: "0 0 12px 0" }}
                >
                  <ClipboardCheck size={16} /> Registration Summary
                </p>
                <p
                  className="text-gray-600"
                  style={{ fontSize: "13px", margin: "0 0 6px 0" }}
                >
                  <strong>User:</strong> {formData.username}
                </p>
                <p
                  className="text-gray-600"
                  style={{ fontSize: "13px", margin: "0 0 6px 0" }}
                >
                  <strong>Email:</strong> {formData.email}
                </p>
                <p
                  className="text-gray-600"
                  style={{ fontSize: "13px", margin: "0" }}
                >
                  <strong>Mobile:</strong> {formData.mobile || "N/A"}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold border-none flex items-center justify-center transition-transform"
                style={{
                  padding: "16px",
                  marginTop: "16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                  gap: "8px",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Creating...
                  </>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>
          </>
        )}

        <p
          className="text-center text-gray-500"
          style={{ fontSize: "14px", margin: "24px 0 0 0" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold"
            style={{ color: "#f02d65", textDecoration: "none" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
