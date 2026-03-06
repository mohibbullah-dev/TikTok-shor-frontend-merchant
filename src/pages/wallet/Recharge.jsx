// import { useNavigate } from 'react-router-dom'
// import TopBar from '../../components/TopBar'
// import { useSelector } from 'react-redux'

// const Recharge = () => {
//   const navigate = useNavigate()
//   const { merchant } = useSelector(state => state.auth)

//   const methods = [
//     {
//       id: 'usdt',
//       icon: '₮',
//       iconBg: '#26a17b',
//       title: 'USDT Recharge',
//       subtitle: 'TRC20 / ERC20 Network',
//       tag: 'Recommended',
//       tagColor: '#22c55e',
//       path: '/recharge/wallet?type=usdt'
//     },
//     {
//       id: 'bank',
//       icon: '🏦',
//       iconBg: '#3b82f6',
//       title: 'Bank Transfer',
//       subtitle: 'Local bank deposit',
//       tag: 'Manual',
//       tagColor: '#f59e0b',
//       path: '/recharge/wallet?type=bank'
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <TopBar title="Recharge" />

//       {/* Balance Card */}
//       <div className="mx-4 mt-4 rounded-2xl p-5 shadow-lg"
//         style={{
//           background: 'linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)'
//         }}
//       >
//         <p className="text-white/70 text-xs mb-1">Current Balance</p>
//         <p className="text-white text-3xl font-bold">
//           ${(merchant?.balance || 0).toFixed(2)}
//         </p>
//         <p className="text-white/60 text-xs mt-1">
//           Pending: ${(merchant?.pendingAmount || 0).toFixed(2)}
//         </p>
//       </div>

//       {/* Methods */}
//       <div className="mx-4 mt-6">
//         <p className="text-gray-500 text-xs font-medium mb-3 px-1">
//           SELECT RECHARGE METHOD
//         </p>
//         <div className="space-y-3">
//           {methods.map((method) => (
//             <button
//               key={method.id}
//               onClick={() => navigate(method.path)}
//               className="w-full bg-white rounded-2xl p-4 shadow-sm
//                 flex items-center gap-4 active:scale-[0.98]
//                 transition-all text-left"
//             >
//               {/* Icon */}
//               <div className="w-12 h-12 rounded-xl flex items-center
//                 justify-center text-white text-xl font-bold flex-shrink-0"
//                 style={{ background: method.iconBg }}
//               >
//                 {method.icon}
//               </div>

//               {/* Info */}
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <p className="text-gray-800 font-bold text-sm">
//                     {method.title}
//                   </p>
//                   <span className="text-[10px] px-2 py-0.5 rounded-full
//                     text-white font-medium"
//                     style={{ background: method.tagColor }}
//                   >
//                     {method.tag}
//                   </span>
//                 </div>
//                 <p className="text-gray-400 text-xs mt-0.5">
//                   {method.subtitle}
//                 </p>
//               </div>

//               {/* Arrow */}
//               <span className="text-gray-300 text-lg">›</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Info Box */}
//       <div className="mx-4 mt-6 p-4 bg-yellow-50 rounded-2xl
//         border border-yellow-100">
//         <p className="text-yellow-700 text-xs font-bold mb-2">
//           ⚠️ Important Notes:
//         </p>
//         <ul className="space-y-1">
//           {[
//             'Minimum recharge amount: $100',
//             'Upload clear screenshot as proof',
//             'Processing time: 5-30 minutes',
//             'Contact support if not received after 1 hour'
//           ].map((note, i) => (
//             <li key={i} className="text-yellow-600 text-xs flex gap-1.5">
//               <span>•</span>
//               <span>{note}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* History link */}
//       <div className="mx-4 mt-4">
//         <button
//           onClick={() => navigate('/funds?filter=recharge')}
//           className="w-full bg-white rounded-2xl p-4 shadow-sm
//             flex items-center justify-between active:scale-[0.98]
//             transition-all"
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-xl">📋</span>
//             <span className="text-gray-700 text-sm font-medium">
//               Recharge History
//             </span>
//           </div>
//           <span className="text-gray-300 text-lg">›</span>
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Recharge

////////////////////// ===================== latest version (by gemeni) ========================= ////////////////////////

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Copy, UploadCloud, Loader2, Info, Wallet } from "lucide-react";

export default function Recharge() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("TRC20");
  const [proofImage, setProofImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch system settings to get Wallet Addresses dynamically
  const { data: settings } = useQuery({
    queryKey: ["systemSettings"],
    queryFn: async () => {
      const { data } = await API.get("/settings");
      return data;
    },
  });

  const walletAddress =
    network === "TRC20"
      ? settings?.usdtTrc20Address || "TY2x... (Waiting for Admin)"
      : settings?.usdtErc20Address || "0x71C... (Waiting for Admin)";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied!");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await API.post("/upload/single?folder=recharge", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProofImage(data.url);
      toast.success("Proof uploaded successfully");
    } catch {
      toast.error("Failed to upload proof");
    } finally {
      setUploading(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!amount || amount < (settings?.minRechargeAmount || 10))
        throw new Error(
          `Minimum recharge is $${settings?.minRechargeAmount || 10}`,
        );
      if (!proofImage)
        throw new Error("Please upload a transaction screenshot");

      const { data } = await API.post("/recharges", {
        amount: Number(amount),
        network,
        proofImage,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Recharge submitted! Waiting for admin approval.");
      navigate("/profile");
    },
    onError: (err) => toast.error(err.message || "Failed to submit recharge"),
  });

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Deposit Funds"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

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
            backgroundColor: "#fff1f2",
            border: "1px dashed #fecdd3",
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            gap: "12px",
          }}
        >
          <Info
            size={20}
            color="#e11d48"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <p
            style={{
              color: "#be123c",
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Please ensure you transfer to the exact network address shown below.
            Minimum deposit is{" "}
            <strong>${settings?.minRechargeAmount || 10} USDT</strong>.
          </p>
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
          <label
            style={{
              display: "block",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Recharge Amount (USDT)
          </label>
          <div style={{ position: "relative" }}>
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
              placeholder={`Min ${settings?.minRechargeAmount || 10}`}
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
        </div>

        {/* Network & Address */}
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
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Select Network
          </label>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            {["TRC20", "ERC20"].map((net) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border:
                    network === net ? "2px solid #f02d65" : "2px solid #e2e8f0",
                  backgroundColor: network === net ? "#fff1f2" : "#fff",
                  color: network === net ? "#f02d65" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                USDT - {net}
              </button>
            ))}
          </div>

          <label
            style={{
              display: "block",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Platform Deposit Address
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "12px 16px",
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: "13px",
                color: "#1e293b",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {walletAddress}
            </span>
            <button
              onClick={copyToClipboard}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                marginLeft: "12px",
                color: "#f02d65",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Copy size={18} />
              <span style={{ fontSize: "10px", fontWeight: "bold" }}>Copy</span>
            </button>
          </div>
        </div>

        {/* Proof Upload */}
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
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Upload Payment Screenshot
          </label>
          <div
            style={{
              position: "relative",
              border: "2px dashed #cbd5e1",
              borderRadius: "12px",
              padding: "30px",
              textAlign: "center",
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {uploading ? (
              <Loader2
                size={32}
                color="#f02d65"
                className="animate-spin mx-auto"
              />
            ) : proofImage ? (
              <img
                src={proofImage}
                alt="proof"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.8,
                }}
              />
            ) : (
              <>
                <UploadCloud
                  size={32}
                  color="#94a3b8"
                  style={{ margin: "0 auto 8px auto" }}
                />
                <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
                  Tap to upload screenshot
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending || uploading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#fff",
            border: "none",
            cursor: submitMutation.isPending ? "not-allowed" : "pointer",
            background: submitMutation.isPending
              ? "#cbd5e1"
              : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
            boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyCenter: "center",
            gap: "8px",
            marginTop: "10px",
          }}
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
              <Wallet size={18} /> Confirm Recharge
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
