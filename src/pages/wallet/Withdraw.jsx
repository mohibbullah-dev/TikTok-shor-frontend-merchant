// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const Withdraw = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { merchant } = useSelector((state) => state.auth);

//   const [method, setMethod] = useState("blockchain");
//   const [formData, setFormData] = useState({
//     extractPrice: "",
//     accountName: "",
//     bankCardNumber: "",
//     bankName: "",
//     network: "USDT-TRC20",
//     walletAddress: "",
//     paymentPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const withdrawMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.post("/withdrawal", {
//         extractPrice: Number(formData.extractPrice),
//         extractType: method,
//         accountName: formData.accountName,
//         bankCardNumber: formData.bankCardNumber,
//         bankName: formData.bankName,
//         network: formData.network,
//         walletAddress: formData.walletAddress,
//         paymentPassword: formData.paymentPassword,
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Withdrawal request submitted!");
//       queryClient.invalidateQueries(["myStore"]);
//       navigate("/funds");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Withdrawal failed");
//     },
//   });

//   const handleSubmit = () => {
//     if (!formData.extractPrice || Number(formData.extractPrice) <= 0) {
//       toast.error("Enter valid amount");
//       return;
//     }
//     if (Number(formData.extractPrice) > (merchant?.balance || 0)) {
//       toast.error("Insufficient balance");
//       return;
//     }
//     if (!formData.paymentPassword) {
//       toast.error("Enter payment password");
//       return;
//     }
//     if (method === "blockchain" && !formData.walletAddress) {
//       toast.error("Enter wallet address");
//       return;
//     }
//     if (method === "bankCard" && !formData.bankCardNumber) {
//       toast.error("Enter bank card number");
//       return;
//     }
//     withdrawMutation.mutate();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-36">
//       <TopBar title="Withdraw" />

//       {/* Balance Card */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-gray-400 text-xs">Available Balance</p>
//             <p
//               className="text-2xl font-bold mt-0.5"
//               style={{ color: "#f02d65" }}
//             >
//               ${(merchant?.balance || 0).toFixed(2)}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-gray-400 text-xs">Total Profit</p>
//             <p className="text-green-500 font-bold text-lg">
//               ${(merchant?.totalProfit || 0).toFixed(2)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Method Selection */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 font-bold text-sm mb-3">
//           Withdrawal Method
//         </p>
//         <div className="flex gap-3">
//           {[
//             {
//               key: "blockchain",
//               icon: "₮",
//               label: "USDT",
//               iconBg: "#26a17b",
//             },
//             {
//               key: "bankCard",
//               icon: "🏦",
//               label: "Bank Card",
//               iconBg: "#3b82f6",
//             },
//           ].map((m) => (
//             <button
//               key={m.key}
//               onClick={() => setMethod(m.key)}
//               className="flex-1 py-3 rounded-xl border-2 flex items-center
//                 justify-center gap-2 transition-all font-medium text-sm"
//               style={{
//                 borderColor: method === m.key ? "#f02d65" : "#f3f4f6",
//                 background: method === m.key ? "#fff0f3" : "#f9fafb",
//                 color: method === m.key ? "#f02d65" : "#6b7280",
//               }}
//             >
//               <span>{m.icon}</span>
//               <span>{m.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Amount */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 font-bold text-sm mb-3">
//           Withdrawal Amount
//         </p>
//         <div className="relative">
//           <span
//             className="absolute left-4 top-1/2 -translate-y-1/2
//             text-gray-400 font-bold"
//           >
//             $
//           </span>
//           <input
//             type="number"
//             name="extractPrice"
//             value={formData.extractPrice}
//             onChange={handleChange}
//             placeholder="Enter amount"
//             className="w-full pl-8 pr-24 py-3.5 bg-gray-50 border-2
//               border-gray-200 rounded-xl text-sm font-bold outline-none
//               focus:border-pink-400 transition-all"
//           />
//           <button
//             onClick={() =>
//               setFormData({
//                 ...formData,
//                 extractPrice: String(merchant?.balance || 0),
//               })
//             }
//             className="absolute right-3 top-1/2 -translate-y-1/2
//               text-xs font-bold px-3 py-1.5 rounded-lg text-white"
//             style={{ background: "#f02d65" }}
//           >
//             All
//           </button>
//         </div>
//         <p className="text-gray-400 text-xs mt-2">
//           Available: ${(merchant?.balance || 0).toFixed(2)}
//         </p>
//       </div>

//       {/* Account Details */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
//         <p className="text-gray-700 font-bold text-sm mb-3">
//           {method === "blockchain" ? "Wallet Details" : "Bank Details"}
//         </p>

//         <div className="space-y-3">
//           {method === "blockchain" ? (
//             <>
//               {/* Network */}
//               <div>
//                 <label className="text-gray-500 text-xs mb-1.5 block">
//                   Network
//                 </label>
//                 <select
//                   name="network"
//                   value={formData.network}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400"
//                 >
//                   <option value="USDT-TRC20">USDT - TRC20</option>
//                   <option value="USDT-ERC20">USDT - ERC20</option>
//                   <option value="USDT-BEP20">USDT - BEP20</option>
//                 </select>
//               </div>

//               {/* Wallet Address */}
//               <div>
//                 <label className="text-gray-500 text-xs mb-1.5 block">
//                   Wallet Address
//                 </label>
//                 <input
//                   type="text"
//                   name="walletAddress"
//                   value={formData.walletAddress}
//                   onChange={handleChange}
//                   placeholder="Enter your wallet address"
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400 font-mono"
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Account Name */}
//               <div>
//                 <label className="text-gray-500 text-xs mb-1.5 block">
//                   Account Name
//                 </label>
//                 <input
//                   type="text"
//                   name="accountName"
//                   value={formData.accountName}
//                   onChange={handleChange}
//                   placeholder="Full name on account"
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400"
//                 />
//               </div>

//               {/* Bank Name */}
//               <div>
//                 <label className="text-gray-500 text-xs mb-1.5 block">
//                   Bank Name
//                 </label>
//                 <input
//                   type="text"
//                   name="bankName"
//                   value={formData.bankName}
//                   onChange={handleChange}
//                   placeholder="Enter bank name"
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400"
//                 />
//               </div>

//               {/* Card Number */}
//               <div>
//                 <label className="text-gray-500 text-xs mb-1.5 block">
//                   Card Number
//                 </label>
//                 <input
//                   type="text"
//                   name="bankCardNumber"
//                   value={formData.bankCardNumber}
//                   onChange={handleChange}
//                   placeholder="Enter bank card number"
//                   className="w-full px-4 py-3 bg-gray-50 border-2
//                     border-gray-200 rounded-xl text-sm outline-none
//                     focus:border-pink-400 font-mono tracking-widest"
//                 />
//               </div>
//             </>
//           )}

//           {/* Payment Password */}
//           <div>
//             <label className="text-gray-500 text-xs mb-1.5 block">
//               Payment Password (6-digit PIN)
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="paymentPassword"
//                 value={formData.paymentPassword}
//                 onChange={handleChange}
//                 placeholder="••••••"
//                 maxLength={6}
//                 className="w-full px-4 pr-12 py-3 bg-gray-50 border-2
//                   border-gray-200 rounded-xl text-sm outline-none
//                   focus:border-pink-400 tracking-widest font-bold
//                   text-center text-lg"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2
//                   text-gray-400"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Warning */}
//       <div
//         className="mx-4 mt-4 p-4 bg-orange-50 rounded-2xl
//         border border-orange-100"
//       >
//         <p className="text-orange-600 text-xs font-bold mb-1">
//           ⚠️ Please Note:
//         </p>
//         <ul className="space-y-1">
//           {[
//             "Amount is deducted immediately after submission",
//             "Processing time: up to 3 business days",
//             "Double-check your wallet/bank details",
//             "Contact support for any issues",
//           ].map((note, i) => (
//             <li key={i} className="text-orange-500 text-xs flex gap-1.5">
//               <span>•</span>
//               <span>{note}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Submit */}
//       <div
//         className="fixed bottom-0 left-1/2 -translate-x-1/2
//         w-full max-w-[480px] bg-white border-t border-gray-100 p-4"
//       >
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-gray-500 text-sm">Withdraw Amount:</span>
//           <span className="font-bold text-lg" style={{ color: "#f02d65" }}>
//             $
//             {formData.extractPrice
//               ? Number(formData.extractPrice).toFixed(2)
//               : "0.00"}
//           </span>
//         </div>
//         <button
//           onClick={handleSubmit}
//           disabled={withdrawMutation.isPending}
//           className="w-full py-4 rounded-xl text-white font-bold
//             text-base shadow-lg active:scale-95 transition-all
//             disabled:opacity-60"
//           style={{
//             background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
//           }}
//         >
//           {withdrawMutation.isPending ? "Processing..." : "SUBMIT WITHDRAWAL"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Withdraw;

//////////////////////// =========================== latest version (by gemeni) ============================///////////////////

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Landmark, ArrowRightCircle, Loader2, Info } from "lucide-react";

export default function Withdraw() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { merchant } = useSelector((s) => s.auth);

  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentPassword, setPaymentPassword] = useState("");
  const { data: settings } = useQuery({
    queryKey: ["systemSettings"],
    queryFn: async () => {
      const { data } = await API.get("/settings");
      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!amount || amount < (settings?.minWithdrawalAmount || 30))
        throw new Error(
          `Minimum withdrawal is $${settings?.minWithdrawalAmount || 30}`,
        );
      if (!walletAddress)
        throw new Error("Please enter your receiving wallet address");
      if (amount > merchant.balance)
        throw new Error("Insufficient available balance");

      // AFTER:
      const { data } = await API.post("/withdrawal", {
        // ✅ fix URL too (singular)
        extractPrice: Number(amount),
        extractType: "blockchain", // ✅ required enum field
        walletAddress,
        network: "USDT-TRC20",
        paymentPassword: paymentPassword, // ✅ see BUG 4
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Withdrawal request submitted for review!");
      queryClient.invalidateQueries(["myStore"]); // Refresh wallet immediately
      navigate("/profile");
    },
    onError: (err) => toast.error(err.message || "Withdrawal failed"),
  });

  // Calculate actual receive amount after platform fees
  const feePercent = settings?.withdrawalFeePercent || 0;
  const estimatedFee = Number(amount || 0) * (feePercent / 100);
  const estimatedReceive = Number(amount || 0) - estimatedFee;

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Withdraw Funds"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      {/* ── Top Balance Card ── */}
      <div style={{ padding: "20px 16px 0 16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "24px",
            borderRadius: "20px",
            color: "#fff",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative background shape */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(255,107,53,0.3) 0%, transparent 100%)",
            }}
          />

          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "13px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Landmark size={16} /> Withdrawable Balance
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: "900",
              fontFamily: "monospace",
            }}
          >
            ${(merchant?.balance || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Warning Banner */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px dashed #fde68a",
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            gap: "12px",
          }}
        >
          <Info
            size={20}
            color="#d97706"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p
              style={{
                color: "#b45309",
                fontSize: "13px",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              Withdrawals are processed manually. Please ensure your{" "}
              <strong>USDT TRC20</strong> address is 100% correct.
            </p>
            <p
              style={{
                color: "#b45309",
                fontSize: "12px",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Min. Withdrawal: ${settings?.minWithdrawalAmount || 30} | Fee:{" "}
              {feePercent}%
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label
              style={{ color: "#1e293b", fontSize: "14px", fontWeight: "bold" }}
            >
              Amount to Withdraw
            </label>
            <button
              onClick={() => setAmount(merchant?.balance?.toString() || "")}
              style={{
                background: "none",
                border: "none",
                color: "#f02d65",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Withdraw All
            </button>
          </div>

          <div style={{ position: "relative", marginBottom: "16px" }}>
            <span
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
                color: "#1e293b",
                fontWeight: "bold",
              }}
            >
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: "100%",
                padding: "16px 16px 16px 36px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#1e293b",
                outline: "none",
                fontFamily: "monospace",
              }}
            />
          </div>

          {/* Breakdown calculation */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              border: "1px dashed #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "12px" }}>
                Platform Fee ({feePercent}%)
              </span>
              <span
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                -${estimatedFee.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "6px",
              }}
            >
              <span
                style={{
                  color: "#1e293b",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                You Will Receive
              </span>
              <span
                style={{
                  color: "#10b981",
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                ${estimatedReceive > 0 ? estimatedReceive.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Address Input */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <label
            style={{
              display: "block",
              color: "#1e293b",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Receiving Wallet Address (TRC20)
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Paste your USDT address starting with T..."
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "13px",
              color: "#1e293b",
              outline: "none",
              fontFamily: "monospace",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Payment Password */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <label
            style={{
              display: "block",
              color: "#1e293b",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Payment Password
          </label>
          <input
            type="password"
            value={paymentPassword}
            onChange={(e) => setPaymentPassword(e.target.value)}
            placeholder="Enter your 6-digit payment password"
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#1e293b",
              outline: "none",
              fontFamily: "monospace",
              letterSpacing: "4px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f02d65")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => submitMutation.mutate()}
          disabled={
            submitMutation.isPending ||
            !amount ||
            !walletAddress ||
            !paymentPassword
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#fff",
            border: "none",
            cursor:
              submitMutation.isPending || !amount || !walletAddress
                ? "not-allowed"
                : "pointer",
            background:
              submitMutation.isPending || !amount || !walletAddress
                ? "#cbd5e1"
                : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            boxShadow: "0 4px 15px rgba(30, 41, 59, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyCenter: "center",
            gap: "8px",
            marginTop: "10px",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {submitMutation.isPending ? (
            <Loader2 size={18} className="animate-spin mx-auto" />
          ) : (
            <span
              style={{
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Submit Withdrawal Request <ArrowRightCircle size={18} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
