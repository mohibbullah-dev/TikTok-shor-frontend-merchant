// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const VipUpgrade = () => {
//   const { merchant } = useSelector((state) => state.auth);
//   const queryClient = useQueryClient();
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [paymentPassword, setPaymentPassword] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const currentLevel = merchant?.vipLevel || 0;

//   const vipColors = {
//     0: "#888888",
//     1: "#cd7f32",
//     2: "#aaaaaa",
//     3: "#ffd700",
//     4: "#00bcd4",
//     5: "#9c27b0",
//     6: "#f02d65",
//   };

//   const vipIcons = {
//     0: "🥉",
//     1: "🥈",
//     2: "🥇",
//     3: "💛",
//     4: "💎",
//     5: "💜",
//     6: "👑",
//   };

//   // Fetch VIP levels
//   const { data: levels } = useQuery({
//     queryKey: ["vipLevels"],
//     queryFn: async () => {
//       const { data } = await API.get("/vip/levels");
//       return data;
//     },
//   });

//   // Apply upgrade mutation
//   const applyMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.post("/vip/apply", {
//         requestedLevel: selectedLevel.level,
//         paymentPassword,
//       });
//       return data;
//     },
//     onSuccess: () => {
//       toast.success("VIP upgrade request submitted!");
//       queryClient.invalidateQueries(["myStore"]);
//       setShowModal(false);
//       setPaymentPassword("");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed");
//     },
//   });

//   const handleApply = (level) => {
//     setSelectedLevel(level);
//     setShowModal(true);
//   };

//   const handleConfirm = () => {
//     if (!paymentPassword || paymentPassword.length !== 6) {
//       toast.error("Enter 6-digit payment password");
//       return;
//     }
//     applyMutation.mutate();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <TopBar title="VIP Upgrade" />

//       {/* Current VIP Card */}
//       <div
//         className="mx-4 mt-4 rounded-2xl p-5 shadow-lg text-white"
//         style={{
//           background: `linear-gradient(135deg,
//           ${vipColors[currentLevel]}, ${vipColors[currentLevel]}99)`,
//         }}
//       >
//         <div className="flex items-center gap-3">
//           <span className="text-4xl">{vipIcons[currentLevel]}</span>
//           <div>
//             <p className="text-white/70 text-xs">Current Level</p>
//             <p className="text-2xl font-bold">VIP {currentLevel}</p>
//           </div>
//           <div className="ml-auto text-right">
//             <p className="text-white/70 text-xs">Profit Rate</p>
//             <p className="text-2xl font-bold">
//               {(
//                 levels?.find((l) => l.level === currentLevel)?.rate * 100 || 15
//               ).toFixed(0)}
//               %
//             </p>
//           </div>
//         </div>
//         <div className="mt-3 bg-white/20 rounded-xl p-2 text-center">
//           <p className="text-white/80 text-xs">
//             Balance: ${(merchant?.balance || 0).toFixed(2)}
//           </p>
//         </div>
//       </div>

//       {/* VIP Levels List */}
//       <div className="mx-4 mt-4 space-y-3">
//         <p className="text-gray-500 text-xs font-medium px-1">
//           AVAILABLE UPGRADES
//         </p>

//         {levels?.map((level) => {
//           const isCurrentLevel = level.level === currentLevel;
//           const isLowerLevel = level.level < currentLevel;
//           const canAfford = (merchant?.balance || 0) >= level.price;
//           const profitRate = (level.rate * 100).toFixed(0);

//           return (
//             <div
//               key={level.level}
//               className={`bg-white rounded-2xl p-4 shadow-sm
//                 border-2 transition-all ${
//                   isCurrentLevel ? "border-pink-200" : "border-transparent"
//                 }`}
//             >
//               <div className="flex items-center gap-3">
//                 {/* VIP Icon */}
//                 <div
//                   className="w-12 h-12 rounded-xl flex items-center
//                   justify-center text-2xl shadow-sm"
//                   style={{ background: `${vipColors[level.level]}20` }}
//                 >
//                   {vipIcons[level.level]}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <p className="font-bold text-gray-800">VIP {level.level}</p>
//                     {isCurrentLevel && (
//                       <span
//                         className="text-[10px] px-2 py-0.5
//                         rounded-full text-white font-bold"
//                         style={{ background: vipColors[level.level] }}
//                       >
//                         Current
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-3 mt-0.5">
//                     <span className="text-green-500 text-sm font-bold">
//                       {profitRate}% profit
//                     </span>
//                     <span className="text-gray-300 text-xs">•</span>
//                     <span className="text-gray-400 text-xs">
//                       ${level.price.toLocaleString()} required
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action */}
//                 {!isCurrentLevel && !isLowerLevel && (
//                   <button
//                     onClick={() => handleApply(level)}
//                     disabled={!canAfford}
//                     className="px-4 py-2 rounded-xl text-white text-xs
//                       font-bold transition-all active:scale-95
//                       disabled:opacity-50"
//                     style={{
//                       background: canAfford
//                         ? `linear-gradient(135deg,
//                             ${vipColors[level.level]},
//                             ${vipColors[level.level]}99)`
//                         : "#d1d5db",
//                     }}
//                   >
//                     {canAfford ? "Upgrade" : "Insufficient"}
//                   </button>
//                 )}

//                 {isLowerLevel && (
//                   <span className="text-gray-300 text-xs">✓ Done</span>
//                 )}
//               </div>

//               {/* Progress bar for current */}
//               {isCurrentLevel && (
//                 <div className="mt-3">
//                   <div className="h-1.5 bg-gray-100 rounded-full">
//                     <div
//                       className="h-full rounded-full w-full"
//                       style={{
//                         background: vipColors[currentLevel],
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Upgrade Confirmation Modal */}
//       {showModal && selectedLevel && (
//         <div
//           className="fixed inset-0 bg-black/50 z-50 flex items-end
//           justify-center"
//         >
//           <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6">
//             <div className="text-center mb-5">
//               <span className="text-5xl">{vipIcons[selectedLevel.level]}</span>
//               <h3 className="text-gray-800 font-bold text-lg mt-3">
//                 Upgrade to VIP {selectedLevel.level}
//               </h3>
//               <p className="text-gray-400 text-sm mt-1">
//                 Profit rate: {(selectedLevel.rate * 100).toFixed(0)}%
//               </p>
//             </div>

//             {/* Cost */}
//             <div className="bg-gray-50 rounded-2xl p-4 mb-5">
//               <div className="flex justify-between">
//                 <span className="text-gray-500 text-sm">Upgrade Fee</span>
//                 <span className="font-bold text-red-400">
//                   -${selectedLevel.price.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between mt-2">
//                 <span className="text-gray-500 text-sm">Your Balance</span>
//                 <span className="font-bold text-gray-700">
//                   ${(merchant?.balance || 0).toFixed(2)}
//                 </span>
//               </div>
//               <div className="h-px bg-gray-200 my-2" />
//               <div className="flex justify-between">
//                 <span className="text-gray-500 text-sm">After Upgrade</span>
//                 <span className="font-bold text-green-500">
//                   ${((merchant?.balance || 0) - selectedLevel.price).toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             {/* Payment Password */}
//             <div className="mb-5">
//               <label
//                 className="text-gray-600 text-sm font-medium
//                 mb-2 block"
//               >
//                 Enter Payment Password
//               </label>
//               <input
//                 type="password"
//                 value={paymentPassword}
//                 onChange={(e) => setPaymentPassword(e.target.value)}
//                 placeholder="••••••"
//                 maxLength={6}
//                 className="w-full px-4 py-3.5 bg-gray-50 border-2
//                   border-gray-200 rounded-xl text-center text-xl
//                   tracking-widest font-bold outline-none
//                   focus:border-pink-400"
//               />
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setPaymentPassword("");
//                 }}
//                 className="flex-1 py-3.5 rounded-xl border-2
//                   border-gray-200 text-gray-500 font-bold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 disabled={applyMutation.isPending}
//                 className="flex-1 py-3.5 rounded-xl text-white
//                   font-bold disabled:opacity-60"
//                 style={{
//                   background: `linear-gradient(135deg,
//                     ${vipColors[selectedLevel.level]},
//                     ${vipColors[selectedLevel.level]}99)`,
//                 }}
//               >
//                 {applyMutation.isPending ? "Submitting..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VipUpgrade;

////////////////////// ========================= latest version (by gemeni) =========================///////////////////

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";
// import { Crown, Star, ArrowUpCircle, CheckCircle2, Lock, Loader2 } from "lucide-react";

// export default function VipUpgrade() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { merchant } = useSelector((s) => s.auth);
//   const currentVip = merchant?.vipLevel || 0;

//   const [selectedTier, setSelectedTier] = useState(currentVip + 1);

//   // VIP Logic extracted from your backend
//   const vipTiers = [
//     { level: 0, rate: 15, name: "Standard", color: "#64748b", bg: "#f1f5f9" },
//     { level: 1, rate: 20, name: "Bronze", color: "#d97706", bg: "#fef3c7" },
//     { level: 2, rate: 25, name: "Silver", color: "#94a3b8", bg: "#f8fafc" },
//     { level: 3, rate: 27, name: "Gold", color: "#eab308", bg: "#fef08a" },
//     { level: 4, rate: 33, name: "Platinum", color: "#06b6d4", bg: "#ccfbf1" },
//     { level: 5, rate: 38, name: "Diamond", color: "#8b5cf6", bg: "#f3e8ff" },
//     { level: 6, rate: 43, name: "Crown", color: "#f02d65", bg: "#fff1f2" },
//   ];

//   const applyMutation = useMutation({
//     mutationFn: async (targetLevel) => {
//       // Calls your Admin's Level Applications endpoint
//       const { data } = await API.post("/merchants/level-application", { targetLevel });
//       return data;
//     },
//     onSuccess: () => {
//       toast.success("VIP Upgrade Application Submitted!");
//       queryClient.invalidateQueries(["myStore"]);
//       navigate("/profile");
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Application failed. You may already have one pending.");
//     },
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col relative" style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "40px" }}>
//       <TopBar title="VIP Privileges" backgroundColor="#1e293b" textColor="text-white" showBack={true} />

//       {/* ════════════ HERO BANNER ════════════ */}
//       <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "30px 20px 60px 20px", borderBottomLeftRadius: "32px", borderBottomRightRadius: "32px", position: "relative", overflow: "hidden" }}>

//         {/* Glow Effect */}
//         <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(240,45,101,0.4) 0%, transparent 70%)" }}></div>

//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
//           <div>
//             <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 4px 0", fontWeight: "600" }}>Current Status</p>
//             <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: "900", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
//               VIP {currentVip} <Crown size={24} color="#fbbf24" />
//             </h2>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 4px 0", fontWeight: "600" }}>Commission Rate</p>
//             <p style={{ color: "#10b981", fontSize: "24px", fontWeight: "900", margin: 0 }}>
//               {vipTiers[currentVip]?.rate || 15}%
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ════════════ TIER SELECTION ════════════ */}
//       <div style={{ padding: "0 16px", marginTop: "-40px", position: "relative", zIndex: 10 }}>
//         <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", marginBottom: "20px" }}>

//           <h3 style={{ color: "#1e293b", fontSize: "16px", fontWeight: "bold", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "6px" }}>
//             <Star size={18} color="#f02d65" /> Select Upgrade Tier
//           </h3>

//           <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             {vipTiers.map((tier) => {
//               const isCurrent = tier.level === currentVip;
//               const isLocked = tier.level < currentVip;
//               const isSelected = selectedTier === tier.level && !isCurrent && !isLocked;

//               return (
//                 <button
//                   key={tier.level}
//                   onClick={() => !isCurrent && !isLocked && setSelectedTier(tier.level)}
//                   disabled={isCurrent || isLocked}
//                   style={{
//                     display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "16px", border: "2px solid", cursor: (isCurrent || isLocked) ? "default" : "pointer", transition: "all 0.2s",
//                     backgroundColor: isCurrent ? tier.bg : isSelected ? "#fff1f2" : "#f8fafc",
//                     borderColor: isCurrent ? tier.color : isSelected ? "#f02d65" : "transparent",
//                     opacity: isLocked ? 0.6 : 1
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                     <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: isCurrent ? "#fff" : tier.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <Crown size={20} color={tier.color} />
//                     </div>
//                     <div style={{ textAlign: "left" }}>
//                       <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: "bold", margin: "0 0 2px 0" }}>VIP {tier.level} - {tier.name}</p>
//                       <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>Earn {tier.rate}% Commission</p>
//                     </div>
//                   </div>

//                   <div>
//                     {isCurrent ? (
//                       <span style={{ backgroundColor: "#fff", color: tier.color, padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
//                         <CheckCircle2 size={14} /> Current
//                       </span>
//                     ) : isLocked ? (
//                       <Lock size={20} color="#cbd5e1" />
//                     ) : (
//                       <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: isSelected ? "6px solid #f02d65" : "2px solid #cbd5e1", backgroundColor: "#fff", transition: "all 0.2s" }} />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//         </div>

//         {/* ════════════ ACTION BUTTON ════════════ */}
//         <button
//           onClick={() => applyMutation.mutate(selectedTier)}
//           disabled={selectedTier <= currentVip || applyMutation.isPending}
//           style={{ width: "100%", padding: "16px", borderRadius: "16px", fontSize: "16px", fontWeight: "bold", color: "#fff", border: "none", cursor: (selectedTier <= currentVip || applyMutation.isPending) ? "not-allowed" : "pointer", background: (selectedTier <= currentVip || applyMutation.isPending) ? "#cbd5e1" : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)", boxShadow: (selectedTier <= currentVip || applyMutation.isPending) ? "none" : "0 4px 20px rgba(240, 45, 101, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.1s" }}
//           onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
//           onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
//         >
//           {applyMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <><ArrowUpCircle size={20} /> Apply for VIP {selectedTier}</>}
//         </button>

//       </div>
//     </div>
//   );
// }

////////////////////////////////// ======================= revision version (by claud io) =========================== ////////////////////

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Crown, Loader2, Lock, CheckCircle, ArrowRight } from "lucide-react";

export default function VipUpgrade() {
  const queryClient = useQueryClient();
  const { user, merchant } = useSelector((s) => s.auth);
  const currentLevel = merchant?.vipLevel ?? 0;

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [paymentPassword, setPaymentPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: levels = [], isLoading } = useQuery({
    queryKey: ["vipLevels"],
    queryFn: async () => {
      const { data } = await API.get("/vip/levels");
      return data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.post("/vip/apply", {
        requestedLevel: selectedLevel.level,
        paymentPassword,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("VIP upgrade request submitted! Awaiting admin approval.");
      queryClient.invalidateQueries(["vipLevels"]);
      setShowModal(false);
      setPaymentPassword("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Application failed"),
  });

  const openApply = (lvl) => {
    setSelectedLevel(lvl);
    setPaymentPassword("");
    setShowModal(true);
  };

  const vipColors = [
    "#64748b",
    "#cd7f32",
    "#9ca3af",
    "#eab308",
    "#e5e7eb",
    "#3b82f6",
    "#7c3aed",
  ];
  const vipNames = [
    "Basic",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Crown",
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="VIP Privileges"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      {/* Current Level Card */}
      <div style={{ padding: "20px 16px 0 16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "24px",
            borderRadius: "20px",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px 0",
              fontSize: "12px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Current VIP Level
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Crown
              size={32}
              color={vipColors[currentLevel]}
              fill={vipColors[currentLevel]}
            />
            <div>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "900" }}>
                VIP {currentLevel} — {vipNames[currentLevel]}
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "#94a3b8",
                }}
              >
                Commission Rate:{" "}
                {(
                  (levels.find((l) => l.level === currentLevel)?.rate || 0.15) *
                  100
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Tier List */}
      <div
        style={{
          padding: "0 16px 40px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <Loader2 size={32} className="animate-spin text-rose-500" />
          </div>
        ) : (
          levels.map((lvl) => {
            const isCurrentLevel = lvl.level === currentLevel;
            const isLocked = lvl.level <= currentLevel;
            const canApply = lvl.level > currentLevel;

            return (
              <div
                key={lvl._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  boxShadow: isCurrentLevel
                    ? "0 0 0 2px #f02d65"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: isLocked ? "#f1f5f9" : "#fff1f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${vipColors[lvl.level] || "#e2e8f0"}`,
                    }}
                  >
                    <Crown
                      size={20}
                      color={vipColors[lvl.level]}
                      fill={isLocked ? vipColors[lvl.level] : "none"}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    >
                      VIP {lvl.level} — {lvl.nameEn}
                      {isCurrentLevel && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "10px",
                            backgroundColor: "#f02d65",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          CURRENT
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      Rate: <strong>{(lvl.rate * 100).toFixed(0)}%</strong> ·
                      Cost: <strong>${lvl.price.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

                {isLocked ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#94a3b8",
                    }}
                  >
                    <CheckCircle size={18} color="#10b981" fill="#10b981" />
                  </div>
                ) : (
                  <button
                    onClick={() => openApply(lvl)}
                    style={{
                      background:
                        "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Apply <ArrowRight size={14} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Apply Modal */}
      {showModal && selectedLevel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15,23,42,0.6)",
            }}
            onClick={() => setShowModal(false)}
          />
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "28px",
              width: "100%",
              maxWidth: "380px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: "18px",
                fontWeight: "900",
                color: "#1e293b",
              }}
            >
              Apply for VIP {selectedLevel.level}
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              {selectedLevel.nameEn} — ${selectedLevel.price.toLocaleString()}{" "}
              will be deducted upon admin approval
            </p>

            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  Commission Rate
                </span>
                <span
                  style={{
                    color: "#10b981",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {(selectedLevel.rate * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  Upgrade Cost
                </span>
                <span
                  style={{
                    color: "#e11d48",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  ${selectedLevel.price.toLocaleString()}
                </span>
              </div>
            </div>

            <label
              style={{
                display: "block",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Payment Password
            </label>
            <input
              type="password"
              value={paymentPassword}
              onChange={(e) => setPaymentPassword(e.target.value)}
              placeholder="Enter payment password"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                fontFamily: "monospace",
                letterSpacing: "4px",
                outline: "none",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending || !paymentPassword}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: !paymentPassword
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: !paymentPassword ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {applyMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
