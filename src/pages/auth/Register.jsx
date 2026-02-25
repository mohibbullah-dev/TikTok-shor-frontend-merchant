import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";

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
  const [step, setStep] = useState(1);
  // Step 1: Basic info
  // Step 2: Store info + invitation code

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate step 1
  const handleNextStep = () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center px-6 pt-12 pb-6">
        <button
          onClick={() => (step === 2 ? setStep(1) : navigate("/login"))}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center
            justify-center text-white mr-4"
        >
          ←
        </button>
        <div>
          <h1 className="text-white text-xl font-bold">Create Account</h1>
          <p className="text-white/70 text-xs">Step {step} of 2</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-6">
        <div className="h-1.5 bg-white/30 rounded-full">
          <div
            className="h-1.5 bg-white rounded-full transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {/* White Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6">
        {step === 1 ? (
          <>
            <h2 className="text-gray-800 text-lg font-bold mb-6">
              Account Information
            </h2>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
                    rounded-xl text-sm outline-none focus:border-pink-400
                    focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
                    rounded-xl text-sm outline-none focus:border-pink-400
                    focus:bg-white transition-all"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
                    rounded-xl text-sm outline-none focus:border-pink-400
                    focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full px-4 pr-12 py-3.5 bg-gray-50 border
                      border-gray-200 rounded-xl text-sm outline-none
                      focus:border-pink-400 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
                    rounded-xl text-sm outline-none focus:border-pink-400
                    focus:bg-white transition-all"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-4 rounded-xl text-white font-bold
                  text-base shadow-lg active:scale-95 transition-all mt-2"
                style={{
                  background:
                    "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                }}
              >
                NEXT STEP →
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-gray-800 text-lg font-bold mb-6">
              Store Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Store Name */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
                    rounded-xl text-sm outline-none focus:border-pink-400
                    focus:bg-white transition-all"
                />
              </div>

              {/* Invitation Code */}
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Invitation Code
                </label>
                <input
                  type="text"
                  name="invitationCode"
                  value={formData.invitationCode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit invitation code"
                  maxLength={6}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200
                    rounded-xl text-sm outline-none focus:border-pink-400
                    focus:bg-white transition-all tracking-widest
                    font-bold text-center text-lg"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  * Get this code from your Merchant Admin
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-xs text-pink-500 font-medium mb-1">
                  📋 Registration Summary:
                </p>
                <p className="text-xs text-gray-500">
                  Username: {formData.username}
                </p>
                <p className="text-xs text-gray-500">Email: {formData.email}</p>
                <p className="text-xs text-gray-500">
                  Mobile: {formData.mobile || "Not provided"}
                </p>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold
                  text-base shadow-lg active:scale-95 transition-all
                  disabled:opacity-70"
                style={{
                  background: loading
                    ? "#ccc"
                    : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Creating Account...
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold"
                  style={{ color: "#f02d65" }}
                >
                  Login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
