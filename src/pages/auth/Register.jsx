///////////////////// ================== lates version (by memeni) =====================///////////////////////////
// import { useState } from "react";
// import { useNavigate, Link, useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Eye,
//   EyeOff,
//   Store,
//   Hash,
//   ArrowLeft,
//   Loader2,
//   ClipboardCheck,
// } from "lucide-react";

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
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [step, setStep] = useState(1);
//   const [searchParams] = useSearchParams();

//   // Auto-fill invitation code if it exists in the URL
//   useState(() => {
//     const code = searchParams.get("code");
//     if (code) {
//       setFormData((prev) => ({ ...prev, invitationCode: code }));
//     }
//   }, [searchParams]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNextStep = () => {
//     if (!formData.username || !formData.email || !formData.password) {
//       toast.error("Please fill in all required fields");
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

//   const inputStyle = {
//     width: "100%",
//     padding: "14px 14px 14px 44px",
//     backgroundColor: "#f9fafb",
//     border: "1px solid #e5e7eb",
//     borderRadius: "12px",
//     fontSize: "14px",
//     color: "#1f2937",
//     outline: "none",
//     transition: "all 0.2s",
//   };
//   const iconStyle = {
//     position: "absolute",
//     left: "16px",
//     top: "50%",
//     transform: "translateY(-50%)",
//   };
//   const labelStyle = {
//     color: "#4b5563",
//     fontSize: "13px",
//     fontWeight: "600",
//     marginBottom: "8px",
//     display: "block",
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col relative bg-gray-50"
//       style={{ margin: "0 auto", maxWidth: "620px" }}
//     >
//       {/* ── Header ── */}
//       <div
//         className="flex flex-col"
//         style={{
//           background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           paddingBottom: "20px",
//         }}
//       >
//         <div
//           className="flex items-center"
//           style={{ padding: "40px 24px 20px 24px" }}
//         >
//           <button
//             onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
//             className="flex items-center justify-center border-none cursor-pointer"
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "rgba(255,255,255,0.2)",
//               borderRadius: "50%",
//               marginRight: "16px",
//               padding: 0,
//             }}
//           >
//             <ArrowLeft size={20} color="#fff" />
//           </button>
//           <div>
//             <h1
//               className="font-bold text-white"
//               style={{ fontSize: "20px", margin: 0 }}
//             >
//               Create Account
//             </h1>
//             <p
//               className="text-white"
//               style={{ fontSize: "13px", opacity: 0.8, margin: "2px 0 0 0" }}
//             >
//               Step {step} of 2
//             </p>
//           </div>
//         </div>

//         {/* ── Progress Bar ── */}
//         <div style={{ padding: "0 24px" }}>
//           <div
//             style={{
//               height: "6px",
//               backgroundColor: "rgba(255,255,255,0.3)",
//               borderRadius: "10px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               className="bg-white"
//               style={{
//                 height: "100%",
//                 borderRadius: "10px",
//                 width: step === 1 ? "50%" : "100%",
//                 transition: "width 0.4s ease-in-out",
//               }}
//             />
//           </div>
//         </div>
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
//         {step === 1 ? (
//           <>
//             <h2
//               className="text-gray-800 font-bold"
//               style={{ fontSize: "20px", margin: "0 0 24px 0" }}
//             >
//               Account Information
//             </h2>

//             <div className="flex flex-col" style={{ gap: "16px" }}>
//               <div>
//                 <label style={labelStyle}>Username</label>
//                 <div className="relative">
//                   <User size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     placeholder="Enter username"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Email Address</label>
//                 <div className="relative">
//                   <Mail size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter email"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Mobile Number</label>
//                 <div className="relative">
//                   <Phone
//                     size={18}
//                     className="text-gray-400"
//                     style={iconStyle}
//                   />
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     placeholder="Enter mobile number"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Password</label>
//                 <div className="relative">
//                   <Lock size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Min 6 characters"
//                     style={{ ...inputStyle, paddingRight: "44px" }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute bg-transparent border-none cursor-pointer text-gray-400"
//                     style={{
//                       right: "16px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       padding: 0,
//                     }}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Confirm Password</label>
//                 <div className="relative">
//                   <Lock size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Repeat your password"
//                     style={{ ...inputStyle, paddingRight: "44px" }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute bg-transparent border-none cursor-pointer text-gray-400"
//                     style={{
//                       right: "16px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       padding: 0,
//                     }}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleNextStep}
//                 className="w-full text-white font-bold border-none transition-transform"
//                 style={{
//                   padding: "16px",
//                   marginTop: "16px",
//                   borderRadius: "12px",
//                   fontSize: "15px",
//                   boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
//                   cursor: "pointer",
//                   background:
//                     "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                 }}
//                 onMouseDown={(e) =>
//                   (e.currentTarget.style.transform = "scale(0.98)")
//                 }
//                 onMouseUp={(e) =>
//                   (e.currentTarget.style.transform = "scale(1)")
//                 }
//               >
//                 NEXT STEP →
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h2
//               className="text-gray-800 font-bold"
//               style={{ fontSize: "20px", margin: "0 0 24px 0" }}
//             >
//               Store Information
//             </h2>

//             <form
//               onSubmit={handleSubmit}
//               className="flex flex-col"
//               style={{ gap: "16px" }}
//             >
//               <div>
//                 <label style={labelStyle}>Store Name</label>
//                 <div className="relative">
//                   <Store
//                     size={18}
//                     className="text-gray-400"
//                     style={iconStyle}
//                   />
//                   <input
//                     type="text"
//                     name="storeName"
//                     value={formData.storeName}
//                     onChange={handleChange}
//                     placeholder="Enter your store name"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Invitation Code</label>
//                 <div className="relative">
//                   <Hash size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type="text"
//                     name="invitationCode"
//                     value={formData.invitationCode}
//                     onChange={handleChange}
//                     placeholder="6-digit code"
//                     maxLength={6}
//                     className="tracking-widest font-bold text-center uppercase"
//                     style={{
//                       ...inputStyle,
//                       paddingLeft: "14px",
//                       fontSize: "18px",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#ff6b35";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//                 <p
//                   className="text-center text-gray-400"
//                   style={{ fontSize: "12px", margin: "8px 0 0 0" }}
//                 >
//                   * Ask your Merchant Admin for this code
//                 </p>
//               </div>

//               {/* Summary Box */}
//               <div
//                 className="bg-orange-50 border border-orange-100 border-dashed"
//                 style={{
//                   marginTop: "16px",
//                   padding: "16px",
//                   borderRadius: "12px",
//                 }}
//               >
//                 <p
//                   className="text-orange-600 font-bold flex items-center"
//                   style={{ fontSize: "13px", gap: "6px", margin: "0 0 12px 0" }}
//                 >
//                   <ClipboardCheck size={16} /> Registration Summary
//                 </p>
//                 <p
//                   className="text-gray-600"
//                   style={{ fontSize: "13px", margin: "0 0 6px 0" }}
//                 >
//                   <strong>User:</strong> {formData.username}
//                 </p>
//                 <p
//                   className="text-gray-600"
//                   style={{ fontSize: "13px", margin: "0 0 6px 0" }}
//                 >
//                   <strong>Email:</strong> {formData.email}
//                 </p>
//                 <p
//                   className="text-gray-600"
//                   style={{ fontSize: "13px", margin: "0" }}
//                 >
//                   <strong>Mobile:</strong> {formData.mobile || "N/A"}
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full text-white font-bold border-none flex items-center justify-center transition-transform"
//                 style={{
//                   padding: "16px",
//                   marginTop: "16px",
//                   borderRadius: "12px",
//                   fontSize: "15px",
//                   boxShadow: "0 4px 14px rgba(255, 107, 53, 0.3)",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   background: loading
//                     ? "#d1d5db"
//                     : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//                   gap: "8px",
//                 }}
//                 onMouseDown={(e) =>
//                   (e.currentTarget.style.transform = "scale(0.98)")
//                 }
//                 onMouseUp={(e) =>
//                   (e.currentTarget.style.transform = "scale(1)")
//                 }
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" /> Creating...
//                   </>
//                 ) : (
//                   "CREATE ACCOUNT"
//                 )}
//               </button>
//             </form>
//           </>
//         )}

//         <p
//           className="text-center text-gray-500"
//           style={{ fontSize: "14px", margin: "24px 0 0 0" }}
//         >
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-bold"
//             style={{ color: "#f02d65", textDecoration: "none" }}
//           >
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

//////////////////////////// ======================= second version (by client requist) ================= //////////////////

// import { useState } from "react";
// import { useNavigate, Link, useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Eye,
//   EyeOff,
//   Store,
//   Hash,
//   ArrowLeft,
//   Loader2,
//   ClipboardCheck,
// } from "lucide-react";

// const Register = () => {
//   const navigate = useNavigate();

//   // 🛑 FUNCTIONALITY UNTOUCHED
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
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [step, setStep] = useState(1);
//   const [searchParams] = useSearchParams();

//   useState(() => {
//     const code = searchParams.get("code");
//     if (code) {
//       setFormData((prev) => ({ ...prev, invitationCode: code }));
//     }
//   }, [searchParams]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNextStep = () => {
//     if (!formData.username || !formData.email || !formData.password) {
//       toast.error("Please fill in all required fields");
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

//   // 🎨 UI CSS Variables
//   const inputStyle = {
//     width: "100%",
//     padding: "14px 14px 14px 44px",
//     backgroundColor: "#f9fafb",
//     border: "1px solid #e5e7eb",
//     borderRadius: "12px",
//     fontSize: "14px",
//     color: "#121212", // TikTok Dark
//     outline: "none",
//     transition: "all 0.2s",
//   };

//   const iconStyle = {
//     position: "absolute",
//     left: "16px",
//     top: "50%",
//     transform: "translateY(-50%)",
//   };

//   const labelStyle = {
//     color: "#121212", // TikTok Dark
//     fontSize: "13px",
//     fontWeight: "600",
//     marginBottom: "8px",
//     display: "block",
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col relative bg-white shadow-2xl"
//       style={{ margin: "0 auto", maxWidth: "480px", overflow: "hidden" }} // Reduced width for 100% Mobile App feel
//     >
//       {/* ── Background Image Overlay ── */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundImage: "url('/bg_image.jpg')", // Ensure this is in your public folder
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           opacity: 0.08, // Very low opacity so inputs are readable
//           zIndex: 0,
//           pointerEvents: "none",
//         }}
//       />

//       {/* ── Header (TikTok Dark: #121212) ── */}
//       <div
//         className="flex flex-col relative z-10"
//         style={{
//           backgroundColor: "#121212",
//           paddingBottom: "45px", // Extra padding for the overlapping logo
//         }}
//       >
//         <div
//           className="flex items-center"
//           style={{ padding: "40px 24px 20px 24px" }}
//         >
//           <button
//             onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
//             className="flex items-center justify-center border-none cursor-pointer"
//             style={{
//               width: "40px",
//               height: "40px",
//               backgroundColor: "rgba(255,255,255,0.1)",
//               borderRadius: "50%",
//               marginRight: "16px",
//               padding: 0,
//             }}
//           >
//             <ArrowLeft size={20} color="#fff" />
//           </button>
//           <div>
//             <h1
//               className="font-bold text-white tracking-wide"
//               style={{ fontSize: "20px", margin: 0 }}
//             >
//               Create Account
//             </h1>
//             <p
//               style={{
//                 color: "#018784",
//                 fontSize: "13px",
//                 fontWeight: "bold",
//                 margin: "2px 0 0 0",
//               }} // TikTok Teal
//             >
//               Step {step} of 2
//             </p>
//           </div>
//         </div>

//         {/* ── Progress Bar ── */}
//         <div style={{ padding: "0 24px" }}>
//           <div
//             style={{
//               height: "6px",
//               backgroundColor: "rgba(255,255,255,0.15)",
//               borderRadius: "10px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 height: "100%",
//                 borderRadius: "10px",
//                 backgroundColor: "#E81155", // TikTok Red
//                 width: step === 1 ? "50%" : "100%",
//                 transition: "width 0.4s ease-in-out",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── Overlapping App Logo ── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginTop: "-40px",
//           position: "relative",
//           zIndex: 20,
//         }}
//       >
//         <img
//           src="/logo.jfif" // Ensure this is in your public folder
//           alt="TikTok Shop Logo"
//           style={{
//             width: "80px",
//             height: "80px",
//             borderRadius: "20px",
//             border: "4px solid #fff",
//             boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//             backgroundColor: "#121212",
//             objectFit: "cover",
//           }}
//         />
//       </div>

//       {/* ── White Form Card ── */}
//       <div
//         className="flex-1 flex flex-col relative z-10"
//         style={{
//           padding: "24px 24px 40px 24px",
//           backgroundColor: "rgba(255,255,255,0.85)", // Slight transparency to let bg show through
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         {step === 1 ? (
//           <>
//             <h2
//               className="font-extrabold text-center"
//               style={{
//                 fontSize: "22px",
//                 margin: "0 0 24px 0",
//                 color: "#121212",
//               }}
//             >
//               Merchant Details
//             </h2>

//             <div className="flex flex-col" style={{ gap: "16px" }}>
//               <div>
//                 <label style={labelStyle}>Username</label>
//                 <div className="relative">
//                   <User size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     placeholder="Enter username"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784"; // TikTok Teal
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Email Address</label>
//                 <div className="relative">
//                   <Mail size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter email"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Mobile Number</label>
//                 <div className="relative">
//                   <Phone
//                     size={18}
//                     className="text-gray-400"
//                     style={iconStyle}
//                   />
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     placeholder="Enter mobile number"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Password</label>
//                 <div className="relative">
//                   <Lock size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Min 6 characters"
//                     style={{ ...inputStyle, paddingRight: "44px" }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute bg-transparent border-none cursor-pointer text-gray-400"
//                     style={{
//                       right: "16px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       padding: 0,
//                     }}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Confirm Password</label>
//                 <div className="relative">
//                   <Lock size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Repeat your password"
//                     style={{ ...inputStyle, paddingRight: "44px" }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute bg-transparent border-none cursor-pointer text-gray-400"
//                     style={{
//                       right: "16px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       padding: 0,
//                     }}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleNextStep}
//                 className="w-full text-white font-bold border-none transition-transform"
//                 style={{
//                   padding: "16px",
//                   marginTop: "16px",
//                   borderRadius: "12px",
//                   fontSize: "15px",
//                   backgroundColor: "#E81155", // TikTok Red
//                   boxShadow: "0 6px 16px rgba(232, 17, 85, 0.25)",
//                   cursor: "pointer",
//                 }}
//                 onMouseDown={(e) =>
//                   (e.currentTarget.style.transform = "scale(0.98)")
//                 }
//                 onMouseUp={(e) =>
//                   (e.currentTarget.style.transform = "scale(1)")
//                 }
//               >
//                 NEXT STEP →
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h2
//               className="font-extrabold text-center"
//               style={{
//                 fontSize: "22px",
//                 margin: "0 0 24px 0",
//                 color: "#121212",
//               }}
//             >
//               Store Information
//             </h2>

//             <form
//               onSubmit={handleSubmit}
//               className="flex flex-col"
//               style={{ gap: "16px" }}
//             >
//               <div>
//                 <label style={labelStyle}>Store Name</label>
//                 <div className="relative">
//                   <Store
//                     size={18}
//                     className="text-gray-400"
//                     style={iconStyle}
//                   />
//                   <input
//                     type="text"
//                     name="storeName"
//                     value={formData.storeName}
//                     onChange={handleChange}
//                     placeholder="Enter your store name"
//                     style={inputStyle}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label style={labelStyle}>Invitation Code</label>
//                 <div className="relative">
//                   <Hash size={18} className="text-gray-400" style={iconStyle} />
//                   <input
//                     type="text"
//                     name="invitationCode"
//                     value={formData.invitationCode}
//                     onChange={handleChange}
//                     placeholder="6-digit code"
//                     maxLength={6}
//                     className="tracking-widest font-bold text-center uppercase"
//                     style={{
//                       ...inputStyle,
//                       paddingLeft: "14px",
//                       fontSize: "18px",
//                       color: "#E81155", // Making the code stand out in Red
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "#018784";
//                       e.target.style.backgroundColor = "#fff";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e5e7eb";
//                       e.target.style.backgroundColor = "#f9fafb";
//                     }}
//                   />
//                 </div>
//                 <p
//                   className="text-center text-gray-400"
//                   style={{ fontSize: "12px", margin: "8px 0 0 0" }}
//                 >
//                   * Ask your Merchant Admin for this code
//                 </p>
//               </div>

//               {/* ── Summary Box (TikTok Teal Theme) ── */}
//               <div
//                 style={{
//                   marginTop: "16px",
//                   padding: "16px",
//                   borderRadius: "12px",
//                   backgroundColor: "rgba(1, 135, 132, 0.05)",
//                   border: "1px dashed #018784",
//                 }}
//               >
//                 <p
//                   className="font-bold flex items-center"
//                   style={{
//                     color: "#018784",
//                     fontSize: "14px",
//                     gap: "6px",
//                     margin: "0 0 12px 0",
//                   }}
//                 >
//                   <ClipboardCheck size={18} /> Registration Summary
//                 </p>
//                 <p
//                   style={{
//                     color: "#121212",
//                     fontSize: "13px",
//                     margin: "0 0 6px 0",
//                   }}
//                 >
//                   <strong>User:</strong> {formData.username}
//                 </p>
//                 <p
//                   style={{
//                     color: "#121212",
//                     fontSize: "13px",
//                     margin: "0 0 6px 0",
//                   }}
//                 >
//                   <strong>Email:</strong> {formData.email}
//                 </p>
//                 <p style={{ color: "#121212", fontSize: "13px", margin: "0" }}>
//                   <strong>Mobile:</strong> {formData.mobile || "N/A"}
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full text-white font-bold border-none flex items-center justify-center transition-transform"
//                 style={{
//                   padding: "16px",
//                   marginTop: "16px",
//                   borderRadius: "12px",
//                   fontSize: "15px",
//                   backgroundColor: loading ? "#d1d5db" : "#E81155", // TikTok Red
//                   boxShadow: loading
//                     ? "none"
//                     : "0 6px 16px rgba(232, 17, 85, 0.25)",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   gap: "8px",
//                 }}
//                 onMouseDown={(e) =>
//                   !loading && (e.currentTarget.style.transform = "scale(0.98)")
//                 }
//                 onMouseUp={(e) =>
//                   !loading && (e.currentTarget.style.transform = "scale(1)")
//                 }
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" /> Creating...
//                   </>
//                 ) : (
//                   "CREATE ACCOUNT"
//                 )}
//               </button>
//             </form>
//           </>
//         )}

//         <p
//           className="text-center"
//           style={{ color: "#121212", fontSize: "14px", margin: "30px 0 0 0" }}
//         >
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-extrabold hover:underline"
//             style={{ color: "#E81155", textDecoration: "none" }} // TikTok Red
//           >
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

///////////////////////////// ================================ latest version (by gemeni with 2 fields adintion) =======================///////////////////
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
  FileImage,
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

  // 🎨 UI CSS Variables
  const inputStyle = {
    width: "100%",
    padding: "12px 14px 12px 42px",
    backgroundColor: "rgba(255,255,255,0.85)", // ✅ Semi-transparent so bg image shows
    border: "1px solid rgba(229,231,235,0.8)",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#121212",
    outline: "none",
    transition: "all 0.2s",
  };

  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
  };

  const labelStyle = {
    color: "#121212",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100">
      <div
        className="w-full flex flex-col relative bg-white shadow-2xl overflow-hidden"
        style={{
          maxWidth: "480px",
          minHeight: "100vh",
          margin: "0px",
          padding: "0px",
        }}
      >
        {/* ✅ BACKGROUND IMAGE - 100% visible */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/bg_image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* ── Header (TikTok Dark: #121212) ── */}
        <div
          className="flex flex-col relative z-10"
          style={{
            backgroundColor: "#121212",
            paddingBottom: "40px",
          }}
        >
          <div
            className="flex items-center"
            style={{ padding: "30px 20px 15px 20px" }}
          >
            <button
              onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                marginRight: "12px",
                padding: 0,
              }}
            >
              <ArrowLeft size={18} color="#fff" />
            </button>
            <div>
              <h1
                className="font-bold text-white tracking-wide"
                style={{ fontSize: "18px", margin: 0 }}
              >
                Create Account
              </h1>
              <p
                style={{
                  color: "#018784",
                  fontSize: "12px",
                  fontWeight: "bold",
                  margin: "2px 0 0 0",
                }}
              >
                Step {step} of 2
              </p>
            </div>
          </div>

          {/* ── Progress Bar ── */}
          <div style={{ padding: "0 20px" }}>
            <div
              style={{
                height: "5px",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "10px",
                  backgroundColor: "#E81155",
                  width: step === 1 ? "50%" : "100%",
                  transition: "width 0.4s ease-in-out",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Overlapping App Logo ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-35px",
            position: "relative",
            zIndex: 20,
          }}
        >
          <img
            src="/logo_2.png"
            alt="TikTok Shop Logo"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "18px",
              border: "3px solid #fff",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#121212",
              objectFit: "cover",
            }}
          />
        </div>

        {/* ✅ FULLY TRANSPARENT FORM AREA - background image 100% visible */}
        <div
          className="flex-1 flex flex-col relative z-10"
          style={{
            padding: "20px 20px 40px 20px",
            backgroundColor: "transparent", // ✅ CHANGED: fully transparent
            backdropFilter: "none", // ✅ CHANGED: no blur blocking bg
          }}
        >
          {step === 1 ? (
            <>
              <h2
                className="font-extrabold text-center"
                style={{
                  fontSize: "20px",
                  margin: "0 0 20px 0",
                  color: "#121212",
                }}
              >
                Merchant Details
              </h2>

              <div className="flex flex-col" style={{ gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Username</label>
                  <div className="relative">
                    <User
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <div className="relative">
                    <Phone
                      size={16}
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
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>NID / Passport (Front)</label>
                  <div
                    className="relative overflow-hidden transition-all"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(229,231,235,0.8)",
                      borderRadius: "10px",
                    }}
                  >
                    <FileImage
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
                    <input
                      type="file"
                      name="nidFront"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px 10px 42px",
                        fontSize: "13px",
                        color: "#4b5563",
                        outline: "none",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>NID / Passport (Back)</label>
                  <div
                    className="relative overflow-hidden transition-all"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(229,231,235,0.8)",
                      borderRadius: "10px",
                    }}
                  >
                    <FileImage
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
                    <input
                      type="file"
                      name="nidBack"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px 10px 42px",
                        fontSize: "13px",
                        color: "#4b5563",
                        outline: "none",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Password</label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      style={{ ...inputStyle, paddingRight: "40px" }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                      style={{
                        right: "14px",
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
                    <Lock
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      style={{ ...inputStyle, paddingRight: "40px" }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                      style={{
                        right: "14px",
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
                  className="w-full text-white font-bold border-none transition-transform mt-2"
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    backgroundColor: "#E81155",
                    boxShadow: "0 6px 16px rgba(232, 17, 85, 0.25)",
                    cursor: "pointer",
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
                className="font-extrabold text-center"
                style={{
                  fontSize: "20px",
                  margin: "0 0 20px 0",
                  color: "#121212",
                }}
              >
                Store Information
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col"
                style={{ gap: "14px" }}
              >
                <div>
                  <label style={labelStyle}>Store Name</label>
                  <div className="relative">
                    <Store
                      size={16}
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
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Invitation Code</label>
                  <div className="relative">
                    <Hash
                      size={16}
                      className="text-gray-400"
                      style={iconStyle}
                    />
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
                        fontSize: "16px",
                        color: "#E81155",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#018784";
                        e.target.style.backgroundColor = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(229,231,235,0.8)";
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.85)";
                      }}
                    />
                  </div>
                  <p
                    className="text-center text-gray-400"
                    style={{ fontSize: "11px", margin: "6px 0 0 0" }}
                  >
                    * Ask your Merchant Admin for this code
                  </p>
                </div>

                {/* ── Summary Box ── */}
                <div
                  style={{
                    marginTop: "10px",
                    padding: "16px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.85)", // ✅ Semi-transparent
                    border: "1px dashed #018784",
                  }}
                >
                  <p
                    className="font-bold flex items-center"
                    style={{
                      color: "#018784",
                      fontSize: "13px",
                      gap: "6px",
                      margin: "0 0 10px 0",
                    }}
                  >
                    <ClipboardCheck size={16} /> Registration Summary
                  </p>
                  <p
                    style={{
                      color: "#121212",
                      fontSize: "12px",
                      margin: "0 0 6px 0",
                    }}
                  >
                    <strong>User:</strong> {formData.username}
                  </p>
                  <p
                    style={{
                      color: "#121212",
                      fontSize: "12px",
                      margin: "0 0 6px 0",
                    }}
                  >
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p
                    style={{
                      color: "#121212",
                      fontSize: "12px",
                      margin: "0 0 6px 0",
                    }}
                  >
                    <strong>NID Front:</strong>{" "}
                    {formData.nidFront?.name || "Missing"}
                  </p>
                  <p
                    style={{ color: "#121212", fontSize: "12px", margin: "0" }}
                  >
                    <strong>NID Back:</strong>{" "}
                    {formData.nidBack?.name || "Missing"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold border-none flex items-center justify-center transition-transform mt-2"
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    backgroundColor: loading ? "#d1d5db" : "#E81155",
                    boxShadow: loading
                      ? "none"
                      : "0 6px 16px rgba(232, 17, 85, 0.25)",
                    cursor: loading ? "not-allowed" : "pointer",
                    gap: "8px",
                  }}
                  onMouseDown={(e) =>
                    !loading &&
                    (e.currentTarget.style.transform = "scale(0.98)")
                  }
                  onMouseUp={(e) =>
                    !loading && (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Creating...
                    </>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>
              </form>
            </>
          )}

          <p
            className="text-center"
            style={{ color: "#121212", fontSize: "13px", marginTop: "24px" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-extrabold hover:underline"
              style={{ color: "#E81155", textDecoration: "none" }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
