// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "react-router-dom";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";
// import moment from "moment";

// const FundsRecords = () => {
//   const [searchParams] = useSearchParams();
//   const defaultFilter = searchParams.get("filter") || "all";
//   const [activeFilter, setActiveFilter] = useState(defaultFilter);
//   const [showFilterSheet, setShowFilterSheet] = useState(false);

//   const filters = [
//     { key: "all", label: "All Records" },
//     { key: "recharge", label: "Recharge" },
//     { key: "withdrawal", label: "Withdrawal" },
//     { key: "orderPayment", label: "Order Payment" },
//     { key: "orderCompleted", label: "Order Profit" },
//     { key: "signInBonus", label: "Sign-in Bonus" },
//     { key: "vipUpgrade", label: "VIP Upgrade" },
//   ];

//   const { data, isLoading } = useQuery({
//     queryKey: ["myTransactions", activeFilter],
//     queryFn: async () => {
//       const type = activeFilter === "all" ? "" : activeFilter;
//       const { data } = await API.get(
//         `/transactions/my-records?${type ? `type=${type}` : ""}&limit=100`,
//       );
//       return data;
//     },
//   });

//   const transactions = data?.transactions || [];

//   const getTypeIcon = (type) => {
//     const icons = {
//       recharge: "💳",
//       withdrawal: "💸",
//       orderPayment: "📦",
//       orderCompleted: "✅",
//       signInBonus: "🎁",
//       vipUpgrade: "👑",
//       adminAdd: "➕",
//       adminDeduct: "➖",
//     };
//     return icons[type] || "💰";
//   };

//   const getTypeLabel = (type) => {
//     const labels = {
//       recharge: "Recharge",
//       withdrawal: "Withdrawal",
//       orderPayment: "Order Payment",
//       orderCompleted: "Order Profit",
//       signInBonus: "Sign-in Bonus",
//       vipUpgrade: "VIP Upgrade",
//       adminAdd: "Admin Credit",
//       adminDeduct: "Admin Deduct",
//     };
//     return labels[type] || type;
//   };

//   const getTypeColor = (type) => {
//     const debitTypes = [
//       "withdrawal",
//       "orderPayment",
//       "vipUpgrade",
//       "adminDeduct",
//     ];
//     return debitTypes.includes(type) ? "#ef4444" : "#22c55e";
//   };

//   const activeFilterLabel =
//     filters.find((f) => f.key === activeFilter)?.label || "All Records";

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       <TopBar
//         title="Fund Records"
//         rightElement={
//           <button
//             onClick={() => setShowFilterSheet(true)}
//             className="w-8 h-8 rounded-lg flex items-center justify-center"
//             style={{ background: "#fff0f3" }}
//           >
//             <span style={{ color: "#f02d65" }}>⊞</span>
//           </button>
//         }
//       />

//       {/* Active filter badge */}
//       {activeFilter !== "all" && (
//         <div className="mx-4 mt-3 flex items-center gap-2">
//           <span
//             className="px-3 py-1 rounded-full text-xs font-medium
//             text-white flex items-center gap-1.5"
//             style={{ background: "#f02d65" }}
//           >
//             {activeFilterLabel}
//             <button onClick={() => setActiveFilter("all")}>×</button>
//           </span>
//         </div>
//       )}

//       {/* Transaction List */}
//       <div className="p-4 space-y-2">
//         {isLoading ? (
//           [...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl p-4 animate-pulse h-16"
//             />
//           ))
//         ) : transactions.length === 0 ? (
//           <div className="text-center py-20">
//             <span className="text-6xl">📊</span>
//             <p className="text-gray-500 mt-4 font-medium">No records found</p>
//           </div>
//         ) : (
//           transactions.map((tx) => (
//             <div
//               key={tx._id}
//               className="bg-white rounded-2xl p-4 shadow-sm
//                 flex items-center gap-3"
//             >
//               {/* Icon */}
//               <div
//                 className="w-11 h-11 rounded-xl bg-gray-50
//                 flex items-center justify-center text-xl flex-shrink-0
//                 border border-gray-100"
//               >
//                 {getTypeIcon(tx.type)}
//               </div>

//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-gray-700 text-sm font-medium">
//                   {getTypeLabel(tx.type)}
//                 </p>
//                 <p className="text-gray-400 text-xs mt-0.5">
//                   {moment(tx.createdAt).format("YYYY-MM-DD HH:mm")}
//                 </p>
//               </div>

//               {/* Amount + Balance */}
//               <div className="text-right flex-shrink-0">
//                 <p
//                   className="font-bold text-base"
//                   style={{ color: getTypeColor(tx.type) }}
//                 >
//                   {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
//                 </p>
//                 <p className="text-gray-300 text-[10px] mt-0.5">
//                   Bal: ${tx.balanceAfter?.toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Filter Bottom Sheet */}
//       {showFilterSheet && (
//         <div
//           className="fixed inset-0 bg-black/50 z-50 flex items-end
//           justify-center"
//           onClick={() => setShowFilterSheet(false)}
//         >
//           <div
//             className="bg-white w-full max-w-[480px] rounded-t-3xl p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-gray-800 font-bold text-base">
//                 Filter Records
//               </h3>
//               <button
//                 onClick={() => setShowFilterSheet(false)}
//                 className="w-8 h-8 bg-gray-100 rounded-full flex
//                   items-center justify-center text-gray-500"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="space-y-2">
//               {filters.map((filter) => (
//                 <button
//                   key={filter.key}
//                   onClick={() => {
//                     setActiveFilter(filter.key);
//                     setShowFilterSheet(false);
//                   }}
//                   className="w-full flex items-center justify-between
//                     py-3 px-4 rounded-xl transition-all"
//                   style={{
//                     background:
//                       activeFilter === filter.key ? "#fff0f3" : "#f9fafb",
//                   }}
//                 >
//                   <span
//                     className="text-sm font-medium"
//                     style={{
//                       color:
//                         activeFilter === filter.key ? "#f02d65" : "#4b5563",
//                     }}
//                   >
//                     {filter.label}
//                   </span>
//                   {activeFilter === filter.key && (
//                     <span style={{ color: "#f02d65" }}>✓</span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FundsRecords;

///////////////////// ======================= latest version (by gemeni) ======================== /////////////////

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import {
  Wallet,
  Landmark,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export default function FundsRecords() {
  const [activeTab, setActiveTab] = useState("recharge");

  // Fetch Recharges
  const { data: rechargeData, isLoading: loadingRecharges } = useQuery({
    queryKey: ["myRecharges"],
    queryFn: async () => {
      const { data } = await API.get("/recharges/my-recharges");
      return data;
    },
  });

  // Fetch Withdrawals
  const { data: withdrawData, isLoading: loadingWithdraws } = useQuery({
    queryKey: ["myWithdrawals"],
    queryFn: async () => {
      const { data } = await API.get("/withdrawals/my-withdrawals");
      return data;
    },
  });

  const getStatusConfig = (status) => {
    const map = {
      pending: {
        icon: <Clock size={14} />,
        color: "#d97706",
        bg: "#fef3c7",
        text: "Pending Review",
      },
      approved: {
        icon: <CheckCircle2 size={14} />,
        color: "#10b981",
        bg: "#ecfdf5",
        text: "Approved",
      },
      rejected: {
        icon: <XCircle size={14} />,
        color: "#e11d48",
        bg: "#fff1f2",
        text: "Rejected",
      },
    };
    return map[status] || map.pending;
  };

  const records =
    activeTab === "recharge"
      ? rechargeData?.recharges || []
      : withdrawData?.withdrawals || [];
  const isLoading =
    activeTab === "recharge" ? loadingRecharges : loadingWithdraws;

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Fund Records"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#fff",
          padding: "0 16px",
          borderBottom: "1px solid #f1f5f9",
          position: "sticky",
          top: "52px",
          zIndex: 40,
        }}
      >
        <button
          onClick={() => setActiveTab("recharge")}
          style={{
            flex: 1,
            padding: "16px 0",
            fontSize: "14px",
            fontWeight: "bold",
            border: "none",
            background: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            color: activeTab === "recharge" ? "#f02d65" : "#64748b",
            borderBottom:
              activeTab === "recharge"
                ? "2px solid #f02d65"
                : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyCenter: "center",
            gap: "8px",
          }}
        >
          <Wallet size={16} /> Recharges
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          style={{
            flex: 1,
            padding: "16px 0",
            fontSize: "14px",
            fontWeight: "bold",
            border: "none",
            background: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            color: activeTab === "withdraw" ? "#f02d65" : "#64748b",
            borderBottom:
              activeTab === "withdraw"
                ? "2px solid #f02d65"
                : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyCenter: "center",
            gap: "8px",
          }}
        >
          <Landmark size={16} /> Withdrawals
        </button>
      </div>

      {/* ── Record List ── */}
      <div
        style={{
          padding: "16px",
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
        ) : records.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              {activeTab === "recharge" ? (
                <Wallet size={32} color="#cbd5e1" />
              ) : (
                <Landmark size={32} color="#cbd5e1" />
              )}
            </div>
            <p
              style={{
                color: "#1e293b",
                fontSize: "15px",
                fontWeight: "bold",
                margin: "0 0 4px 0",
              }}
            >
              No Records Found
            </p>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              You have no {activeTab} history yet.
            </p>
          </div>
        ) : (
          records.map((record) => {
            const status = getStatusConfig(record.status);
            const isRecharge = activeTab === "recharge";

            return (
              <div
                key={record._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        backgroundColor: isRecharge ? "#ecfdf5" : "#fff7ed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isRecharge ? (
                        <ArrowDownRight size={20} color="#10b981" />
                      ) : (
                        <ArrowUpRight size={20} color="#d97706" />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#1e293b",
                          fontSize: "14px",
                          fontWeight: "bold",
                          margin: "0 0 2px 0",
                        }}
                      >
                        {isRecharge ? "Deposit (USDT)" : "Cashout (USDT)"}
                      </p>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "11px",
                          margin: 0,
                        }}
                      >
                        {new Date(record.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        color: isRecharge ? "#10b981" : "#1e293b",
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {isRecharge ? "+" : ""}${record.amount?.toFixed(2)}
                    </p>
                    <span
                      style={{
                        backgroundColor: status.bg,
                        color: status.color,
                        padding: "4px 8px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {status.icon} {status.text}
                    </span>
                  </div>
                </div>

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
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      Network
                    </span>
                    <span
                      style={{
                        color: "#1e293b",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {record.network || "TRC20"}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#64748b", fontSize: "11px" }}>
                      System ID
                    </span>
                    <span
                      style={{
                        color: "#1e293b",
                        fontSize: "11px",
                        fontFamily: "monospace",
                      }}
                    >
                      {record._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
