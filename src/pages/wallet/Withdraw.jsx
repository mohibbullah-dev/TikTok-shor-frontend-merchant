import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const Withdraw = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { merchant } = useSelector((state) => state.auth);

  const [method, setMethod] = useState("blockchain");
  const [formData, setFormData] = useState({
    extractPrice: "",
    accountName: "",
    bankCardNumber: "",
    bankName: "",
    network: "USDT-TRC20",
    walletAddress: "",
    paymentPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.post("/withdrawal", {
        extractPrice: Number(formData.extractPrice),
        extractType: method,
        accountName: formData.accountName,
        bankCardNumber: formData.bankCardNumber,
        bankName: formData.bankName,
        network: formData.network,
        walletAddress: formData.walletAddress,
        paymentPassword: formData.paymentPassword,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Withdrawal request submitted!");
      queryClient.invalidateQueries(["myStore"]);
      navigate("/funds");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    },
  });

  const handleSubmit = () => {
    if (!formData.extractPrice || Number(formData.extractPrice) <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    if (Number(formData.extractPrice) > (merchant?.balance || 0)) {
      toast.error("Insufficient balance");
      return;
    }
    if (!formData.paymentPassword) {
      toast.error("Enter payment password");
      return;
    }
    if (method === "blockchain" && !formData.walletAddress) {
      toast.error("Enter wallet address");
      return;
    }
    if (method === "bankCard" && !formData.bankCardNumber) {
      toast.error("Enter bank card number");
      return;
    }
    withdrawMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      <TopBar title="Withdraw" />

      {/* Balance Card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Available Balance</p>
            <p
              className="text-2xl font-bold mt-0.5"
              style={{ color: "#f02d65" }}
            >
              ${(merchant?.balance || 0).toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Total Profit</p>
            <p className="text-green-500 font-bold text-lg">
              ${(merchant?.totalProfit || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Method Selection */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-sm mb-3">
          Withdrawal Method
        </p>
        <div className="flex gap-3">
          {[
            {
              key: "blockchain",
              icon: "₮",
              label: "USDT",
              iconBg: "#26a17b",
            },
            {
              key: "bankCard",
              icon: "🏦",
              label: "Bank Card",
              iconBg: "#3b82f6",
            },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMethod(m.key)}
              className="flex-1 py-3 rounded-xl border-2 flex items-center
                justify-center gap-2 transition-all font-medium text-sm"
              style={{
                borderColor: method === m.key ? "#f02d65" : "#f3f4f6",
                background: method === m.key ? "#fff0f3" : "#f9fafb",
                color: method === m.key ? "#f02d65" : "#6b7280",
              }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-sm mb-3">
          Withdrawal Amount
        </p>
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-400 font-bold"
          >
            $
          </span>
          <input
            type="number"
            name="extractPrice"
            value={formData.extractPrice}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full pl-8 pr-24 py-3.5 bg-gray-50 border-2
              border-gray-200 rounded-xl text-sm font-bold outline-none
              focus:border-pink-400 transition-all"
          />
          <button
            onClick={() =>
              setFormData({
                ...formData,
                extractPrice: String(merchant?.balance || 0),
              })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-xs font-bold px-3 py-1.5 rounded-lg text-white"
            style={{ background: "#f02d65" }}
          >
            All
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Available: ${(merchant?.balance || 0).toFixed(2)}
        </p>
      </div>

      {/* Account Details */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-sm mb-3">
          {method === "blockchain" ? "Wallet Details" : "Bank Details"}
        </p>

        <div className="space-y-3">
          {method === "blockchain" ? (
            <>
              {/* Network */}
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">
                  Network
                </label>
                <select
                  name="network"
                  value={formData.network}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400"
                >
                  <option value="USDT-TRC20">USDT - TRC20</option>
                  <option value="USDT-ERC20">USDT - ERC20</option>
                  <option value="USDT-BEP20">USDT - BEP20</option>
                </select>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">
                  Wallet Address
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="Enter your wallet address"
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400 font-mono"
                />
              </div>
            </>
          ) : (
            <>
              {/* Account Name */}
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Full name on account"
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="text-gray-500 text-xs mb-1.5 block">
                  Card Number
                </label>
                <input
                  type="text"
                  name="bankCardNumber"
                  value={formData.bankCardNumber}
                  onChange={handleChange}
                  placeholder="Enter bank card number"
                  className="w-full px-4 py-3 bg-gray-50 border-2
                    border-gray-200 rounded-xl text-sm outline-none
                    focus:border-pink-400 font-mono tracking-widest"
                />
              </div>
            </>
          )}

          {/* Payment Password */}
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">
              Payment Password (6-digit PIN)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="paymentPassword"
                value={formData.paymentPassword}
                onChange={handleChange}
                placeholder="••••••"
                maxLength={6}
                className="w-full px-4 pr-12 py-3 bg-gray-50 border-2
                  border-gray-200 rounded-xl text-sm outline-none
                  focus:border-pink-400 tracking-widest font-bold
                  text-center text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div
        className="mx-4 mt-4 p-4 bg-orange-50 rounded-2xl
        border border-orange-100"
      >
        <p className="text-orange-600 text-xs font-bold mb-1">
          ⚠️ Please Note:
        </p>
        <ul className="space-y-1">
          {[
            "Amount is deducted immediately after submission",
            "Processing time: up to 3 business days",
            "Double-check your wallet/bank details",
            "Contact support for any issues",
          ].map((note, i) => (
            <li key={i} className="text-orange-500 text-xs flex gap-1.5">
              <span>•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Submit */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[480px] bg-white border-t border-gray-100 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-sm">Withdraw Amount:</span>
          <span className="font-bold text-lg" style={{ color: "#f02d65" }}>
            $
            {formData.extractPrice
              ? Number(formData.extractPrice).toFixed(2)
              : "0.00"}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={withdrawMutation.isPending}
          className="w-full py-4 rounded-xl text-white font-bold
            text-base shadow-lg active:scale-95 transition-all
            disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          }}
        >
          {withdrawMutation.isPending ? "Processing..." : "SUBMIT WITHDRAWAL"}
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
