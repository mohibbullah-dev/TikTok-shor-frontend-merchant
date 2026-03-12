// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { loginSuccess } from "../../store/authSlice";
// import API from "../../api/axios";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await API.post("/auth/login", formData);

//       console.log("data: ", data);
//       // Only allow merchant role on this app
//       console.log("data: ", data?.user?.role);

//       if (data?.user?.role !== "merchant") {
//         toast.error("This app is for merchants only");
//         setLoading(false);
//         return;
//       }

//       // Save to Redux store
//       dispatch(
//         loginSuccess({
//           user: {
//             _id: data?.user?._id,
//             username: data?.user?.username,
//             email: data?.user?.email,
//             role: data?.user?.role,
//             avatar: data?.user?.avatar,
//             nickname: data?.user?.nickname,
//           },
//           token: data?.token,
//           merchant: data?.user?.merchant,
//         }),
//       );

//       toast.success("Welcome back!");
//       navigate("/");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
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
//       {/* Top Wave Section */}
//       <div className="flex flex-col items-center justify-center pt-16 pb-8">
//         {/* Logo Circle */}
//         <div
//           className="w-24 h-24 bg-white rounded-full flex items-center
//           justify-center shadow-2xl mb-4"
//         >
//           <span className="text-4xl">🛍️</span>
//         </div>

//         {/* App Name */}
//         <h1 className="text-white text-2xl font-bold tracking-wide">
//           TikTok Shop
//         </h1>
//         <p className="text-white/80 text-sm mt-1">Merchant Center</p>
//       </div>

//       {/* White Card */}
//       <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6">
//         <h2 className="text-gray-800 text-xl font-bold mb-1">
//           Welcome Back 👋
//         </h2>
//         <p className="text-gray-400 text-sm mb-8">
//           Sign in to your merchant account
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Field */}
//           <div>
//             <label className="text-gray-600 text-sm font-medium mb-2 block">
//               Email Address
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 ✉️
//               </span>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200
//                   rounded-xl text-gray-800 text-sm outline-none
//                   focus:border-pink-400 focus:bg-white transition-all"
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div>
//             <label className="text-gray-600 text-sm font-medium mb-2 block">
//               Password
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 🔒
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200
//                   rounded-xl text-gray-800 text-sm outline-none
//                   focus:border-pink-400 focus:bg-white transition-all"
//               />
//               {/* Show/Hide Password */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2
//                   text-gray-400 text-lg"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-4 rounded-xl text-white font-bold text-base
//               shadow-lg active:scale-95 transition-all disabled:opacity-70"
//             style={{
//               background: loading
//                 ? "#ccc"
//                 : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//             }}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8H4z"
//                   />
//                 </svg>
//                 Signing in...
//               </span>
//             ) : (
//               "LOGIN"
//             )}
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-3">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-gray-400 text-xs">OR</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           {/* Register Link */}
//           <p className="text-center text-gray-500 text-sm">
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="font-bold"
//               style={{ color: "#f02d65" }}
//             >
//               Register Now
//             </Link>
//           </p>
//         </form>

//         {/* Demo hint */}
//         <div className="mt-8 p-3 bg-pink-50 rounded-xl border border-pink-100">
//           <p className="text-xs text-pink-400 text-center">
//             🔑 Need an invitation code to register
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

/////////////////=========================== latest version (by gemeni) =======================///////////////
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { loginSuccess } from "../../store/authSlice";
// import API from "../../api/axios";
// import {
//   ShoppingBag,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   Loader2,
//   KeyRound,
// } from "lucide-react";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await API.post("/auth/login", formData);

//       if (data?.user?.role !== "merchant") {
//         toast.error("This app is for merchants only");
//         setLoading(false);
//         return;
//       }

//       dispatch(
//         loginSuccess({
//           user: {
//             _id: data?.user?._id,
//             username: data?.user?.username,
//             email: data?.user?.email,
//             role: data?.user?.role,
//             avatar: data?.user?.avatar,
//             nickname: data?.user?.nickname,
//           },
//           token: data?.token,
//           merchant: {
//             // ✅ correctly mapped
//             merchantId: data?.user?.merchantId,
//             storeName: data?.user?.storeName,
//             storeLogo: data?.user?.storeLogo,
//             balance: data?.user?.balance,
//             vipLevel: data?.user?.vipLevel,
//             status: data?.user?.status,
//           },
//         }),
//       );

//       toast.success("Welcome back!");
//       navigate("/");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col bg-gray-50 relative"
//       style={{ margin: "0 auto", maxWidth: "620px" }}
//     >
//       {/* ── Top Header / Logo Section ── */}
//       <div
//         className="flex flex-col items-center justify-center text-white"
//         style={{
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           padding: "60px 20px 40px 20px",
//         }}
//       >
//         <div
//           className="bg-white rounded-full flex items-center justify-center shadow-lg"
//           style={{ width: "80px", height: "80px", marginBottom: "16px" }}
//         >
//           <ShoppingBag size={36} color="#f02d65" />
//         </div>
//         <h1
//           className="font-bold tracking-wide"
//           style={{ fontSize: "24px", margin: 0 }}
//         >
//           TikTok Shop
//         </h1>
//         <p
//           className="opacity-90"
//           style={{ fontSize: "14px", marginTop: "4px", margin: 0 }}
//         >
//           Merchant Center
//         </p>
//       </div>

//       {/* ── White Card ── */}
//       <div
//         className="bg-white flex-1 flex flex-col"
//         style={{
//           padding: "32px 24px",
//           marginTop: "-20px",
//           borderTopLeftRadius: "24px",
//           borderTopRightRadius: "24px",
//           boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
//         }}
//       >
//         <h2
//           className="text-gray-800 font-bold"
//           style={{ fontSize: "22px", margin: "0 0 4px 0" }}
//         >
//           Welcome Back 👋
//         </h2>
//         <p
//           className="text-gray-400"
//           style={{
//             fontSize: "14px",
//             marginBottom: "32px",
//             margin: "0 0 32px 0",
//           }}
//         >
//           Sign in to your merchant account
//         </p>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col"
//           style={{ gap: "20px" }}
//         >
//           {/* Email Field */}
//           <div>
//             <label
//               className="text-gray-600 font-medium block"
//               style={{ fontSize: "13px", marginBottom: "8px" }}
//             >
//               Email Address
//             </label>
//             <div className="relative">
//               <Mail
//                 size={18}
//                 className="text-gray-400 absolute top-1/2 -translate-y-1/2"
//                 style={{ left: "16px" }}
//               />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="w-full bg-gray-50 border border-gray-200 text-gray-800 outline-none transition-all"
//                 style={{
//                   padding: "14px 14px 14px 44px",
//                   borderRadius: "12px",
//                   fontSize: "14px",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#ff6b35";
//                   e.target.style.backgroundColor = "#fff";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "#e5e7eb";
//                   e.target.style.backgroundColor = "#f9fafb";
//                 }}
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div>
//             <label
//               className="text-gray-600 font-medium block"
//               style={{ fontSize: "13px", marginBottom: "8px" }}
//             >
//               Password
//             </label>
//             <div className="relative">
//               <Lock
//                 size={18}
//                 className="text-gray-400 absolute top-1/2 -translate-y-1/2"
//                 style={{ left: "16px" }}
//               />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className="w-full bg-gray-50 border border-gray-200 text-gray-800 outline-none transition-all"
//                 style={{
//                   padding: "14px 44px 14px 44px",
//                   borderRadius: "12px",
//                   fontSize: "14px",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#ff6b35";
//                   e.target.style.backgroundColor = "#fff";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "#e5e7eb";
//                   e.target.style.backgroundColor = "#f9fafb";
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
//                 style={{ right: "16px", padding: 0 }}
//               >
//                 {showPassword ? (
//                   <EyeOff size={18} color="#9ca3af" />
//                 ) : (
//                   <Eye size={18} color="#9ca3af" />
//                 )}
//               </button>
//             </div>
//             {/* ✅ NEW: Forgot Password Link */}
//             <div className="flex justify-end" style={{ marginTop: "10px" }}>
//               <Link
//                 to="/forgot-password"
//                 className="font-bold hover:opacity-80 transition-opacity"
//                 style={{
//                   fontSize: "13px",
//                   color: "#f02d65",
//                   textDecoration: "none",
//                 }}
//               >
//                 Forgot Password?
//               </Link>
//             </div>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full text-white font-bold border-none flex items-center justify-center transition-transform"
//             style={{
//               padding: "16px",
//               marginTop: "4px",
//               borderRadius: "12px",
//               fontSize: "15px",
//               boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
//               cursor: loading ? "not-allowed" : "pointer",
//               background: loading
//                 ? "#d1d5db"
//                 : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//               gap: "8px",
//             }}
//             onMouseDown={(e) =>
//               (e.currentTarget.style.transform = "scale(0.98)")
//             }
//             onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" /> Signing in...
//               </>
//             ) : (
//               "LOGIN"
//             )}
//           </button>

//           {/* Divider */}
//           <div
//             className="flex items-center"
//             style={{ gap: "12px", marginTop: "12px", marginBottom: "12px" }}
//           >
//             <div className="flex-1 bg-gray-100" style={{ height: "1px" }} />
//             <span
//               className="text-gray-300 font-bold"
//               style={{ fontSize: "12px" }}
//             >
//               OR
//             </span>
//             <div className="flex-1 bg-gray-100" style={{ height: "1px" }} />
//           </div>

//           {/* Register Link */}
//           <p
//             className="text-center text-gray-500"
//             style={{ fontSize: "14px", margin: 0 }}
//           >
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="font-bold"
//               style={{ color: "#f02d65", textDecoration: "none" }}
//             >
//               Register Now
//             </Link>
//           </p>
//         </form>

//         {/* Demo Hint */}
//         <div
//           className="flex items-center justify-center bg-orange-50 border border-orange-100 border-dashed"
//           style={{
//             marginTop: "32px",
//             padding: "12px",
//             borderRadius: "12px",
//             gap: "8px",
//           }}
//         >
//           <KeyRound size={14} className="text-orange-500" />
//           <p
//             className="text-orange-500 font-medium"
//             style={{ fontSize: "12px", margin: 0 }}
//           >
//             Need an invitation code to register
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

///////////////////// ==================== latest version (by gemeni) =======================//////////////////////
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginSuccess } from "../../store/authSlice";
import API from "../../api/axios";
import { Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🛑 FUNCTIONALITY UNTOUCHED
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Added Language State (Visual only, exactly matching Register)
  const [language, setLanguage] = useState("US English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const languages = ["US English", "Bangla", "Hindi"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);

      if (data?.user?.role !== "merchant") {
        toast.error("This app is for merchants only");
        setLoading(false);
        return;
      }

      dispatch(
        loginSuccess({
          user: {
            _id: data?.user?._id,
            username: data?.user?.username,
            email: data?.user?.email,
            role: data?.user?.role,
            avatar: data?.user?.avatar,
            nickname: data?.user?.nickname,
          },
          token: data?.token,
          merchant: {
            merchantId: data?.user?.merchantId,
            storeName: data?.user?.storeName,
            storeLogo: data?.user?.storeLogo,
            balance: data?.user?.balance,
            vipLevel: data?.user?.vipLevel,
            status: data?.user?.status,
          },
        }),
      );

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 UI CSS Variables (Exactly matching the Official App screenshot)
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "4px", // Crisp, small radius just like the demo
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
    // ── Outer Desktop Wrapper ──
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100">
      {/* ── Inner Mobile App Container ── */}
      <div
        className="w-full flex flex-col bg-white overflow-x-hidden relative"
        style={{ maxWidth: "480px", minHeight: "100vh" }}
      >
        {/* ── Official Top Navigation Bar (with Seller Center text) ── */}
        <div className="flex justify-between items-center px-5 py-4 relative z-20">
          <div className="flex items-center gap-3">
            {/* Exactly matching the screenshot logo & text format */}
            <img
              src="/logo_like_demo.jpg"
              alt="TikTok Shop"
              className="h-6 object-contain"
            />
            <div className="w-[1px] h-4 bg-gray-300"></div>
            <span className="text-[15px] font-semibold text-[#121212] tracking-tight">
              Seller Center
            </span>
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
        <div className="flex flex-col items-center justify-center mt-10 mb-8">
          <img
            src="/hero_image_like_demo.jpg"
            alt="Hero Illustration"
            className="w-40 h-40 object-contain mb-4"
          />
          <h1 className="text-[22px] font-bold text-[#121212]">Log in</h1>
        </div>

        {/* ── Form Container ── */}
        <div className="px-6 pb-12 w-full max-w-[400px] mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col"
            style={{ gap: "18px" }}
          >
            {/* Email Field (Visually designed exactly like the demo) */}
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Email Address
                </label>
                {/* Visual link matching the screenshot's top-right layout */}
                <span className="text-[13px] text-[#018784] font-medium cursor-pointer hover:underline">
                  Log in with phone
                </span>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#018784")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Password Field */}
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

            {/* Sub-links exactly matching the screenshot: "Forgot the password? | Log in with Code" */}
            <div className="flex items-center text-[12px] mt-[-6px]">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-gray-800 transition-colors pr-2"
              >
                Forgot the password?
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 pl-2 cursor-pointer hover:text-gray-800 transition-colors">
                Log in with Code
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-medium border-none flex items-center justify-center transition-opacity mt-4"
              style={{
                padding: "13px",
                borderRadius: "4px",
                fontSize: "15px",
                backgroundColor: loading ? "#d1d5db" : "#018784", // Official TikTok Teal
                cursor: loading ? "not-allowed" : "pointer",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* ── Sign Up Link ── */}
          <div className="flex items-center justify-center mt-6 text-[13px] text-gray-600">
            Don't have an account yet?
            <Link
              to="/register"
              className="font-medium ml-1"
              style={{ color: "#018784", textDecoration: "none" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
