import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginSuccess } from "../../store/authSlice";
import API from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);

      // Only allow merchant role on this app
      if (data.role !== "merchant") {
        toast.error("This app is for merchants only");
        setLoading(false);
        return;
      }

      // Save to Redux store
      dispatch(
        loginSuccess({
          user: {
            _id: data._id,
            username: data.username,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
            nickname: data.nickname,
          },
          token: data.token,
          merchant: data.merchant,
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
      }}
    >
      {/* Top Wave Section */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8">
        {/* Logo Circle */}
        <div
          className="w-24 h-24 bg-white rounded-full flex items-center
          justify-center shadow-2xl mb-4"
        >
          <span className="text-4xl">🛍️</span>
        </div>

        {/* App Name */}
        <h1 className="text-white text-2xl font-bold tracking-wide">
          TikTok Shop
        </h1>
        <p className="text-white/80 text-sm mt-1">Merchant Center</p>
      </div>

      {/* White Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6">
        <h2 className="text-gray-800 text-xl font-bold mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Sign in to your merchant account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-gray-600 text-sm font-medium mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200
                  rounded-xl text-gray-800 text-sm outline-none
                  focus:border-pink-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-600 text-sm font-medium mb-2 block">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200
                  rounded-xl text-gray-800 text-sm outline-none
                  focus:border-pink-400 focus:bg-white transition-all"
              />
              {/* Show/Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400 text-lg"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-white font-bold text-base
              shadow-lg active:scale-95 transition-all disabled:opacity-70"
            style={{
              background: loading
                ? "#ccc"
                : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                Signing in...
              </span>
            ) : (
              "LOGIN"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold"
              style={{ color: "#f02d65" }}
            >
              Register Now
            </Link>
          </p>
        </form>

        {/* Demo hint */}
        <div className="mt-8 p-3 bg-pink-50 rounded-xl border border-pink-100">
          <p className="text-xs text-pink-400 text-center">
            🔑 Need an invitation code to register
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
