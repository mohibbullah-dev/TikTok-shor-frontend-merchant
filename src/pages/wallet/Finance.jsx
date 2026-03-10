// import { useQuery } from "@tanstack/react-query";
// import API from "../../api/axios";
// import TopBar from "../../components/TopBar";

// const Finance = () => {
//   const { data, isLoading } = useQuery({
//     queryKey: ["financialStatements"],
//     queryFn: async () => {
//       const { data } = await API.get("/transactions/financial-statements");
//       return data;
//     },
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       <TopBar title="Financial Statements" />

//       {/* Summary Cards */}
//       <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <p className="text-gray-400 text-xs">Awaiting Amount</p>
//           <p className="text-red-400 font-bold text-xl mt-1">
//             ${(data?.awaitingAmount || 0).toFixed(2)}
//           </p>
//           <p className="text-gray-300 text-[10px] mt-1">Locked in orders</p>
//         </div>
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <p className="text-gray-400 text-xs">Total Profit</p>
//           <p className="text-green-500 font-bold text-xl mt-1">
//             ${(data?.totalProfit || 0).toFixed(2)}
//           </p>
//           <p className="text-gray-300 text-[10px] mt-1">All time earnings</p>
//         </div>
//       </div>

//       {/* Daily Statements */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
//         {/* Header */}
//         <div
//           className="grid grid-cols-3 bg-gray-50 px-4 py-3
//           border-b border-gray-100"
//         >
//           <p className="text-gray-500 text-xs font-bold">Date</p>
//           <p className="text-gray-500 text-xs font-bold text-center">Orders</p>
//           <p className="text-gray-500 text-xs font-bold text-right">Profit</p>
//         </div>

//         {isLoading ? (
//           [...Array(5)].map((_, i) => (
//             <div
//               key={i}
//               className="grid grid-cols-3 px-4 py-3 animate-pulse
//                 border-b border-gray-50"
//             >
//               <div className="h-3 bg-gray-200 rounded w-20" />
//               <div className="h-3 bg-gray-200 rounded w-8 mx-auto" />
//               <div className="h-3 bg-gray-200 rounded w-16 ml-auto" />
//             </div>
//           ))
//         ) : data?.statements?.length === 0 ? (
//           <div className="text-center py-12">
//             <span className="text-5xl">📈</span>
//             <p className="text-gray-400 text-sm mt-3">No financial data yet</p>
//           </div>
//         ) : (
//           data?.statements?.map((stmt, i) => (
//             <div
//               key={i}
//               className="grid grid-cols-3 px-4 py-3.5 border-b
//                 border-gray-50 last:border-0"
//             >
//               <p className="text-gray-600 text-sm">{stmt._id}</p>
//               <p className="text-gray-600 text-sm text-center">
//                 {stmt.totalOrders}
//               </p>
//               <p
//                 className="text-right text-sm font-bold"
//                 style={{
//                   color: stmt.totalProfit > 0 ? "#22c55e" : "#9ca3af",
//                 }}
//               >
//                 ${stmt.totalProfit?.toFixed(2)}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Finance;

////////////////// ======================= latest version (by gemeni) ======================////////////////////

import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import {
  Loader2,
  RefreshCcw,
  Banknote,
  ShoppingCart,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function Finance() {
  // Fetch detailed transaction ledger
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: async () => {
      // Endpoint from your backend generic transaction ledger
      const { data } = await API.get("/transactions/my-records");
      return data.transactions || [];
    },
  });

  const getTransactionInfo = (type, amount) => {
    const isPositive = amount > 0;
    const config = {
      orderPayment: {
        title: "Order Payment",
        icon: <ShoppingCart size={18} color="#e11d48" />,
        bg: "#fff1f2",
      },
      orderCompleted: {
        title: "Order Commission",
        icon: <CheckCircle2 size={18} color="#10b981" />,
        bg: "#ecfdf5",
      },
      rechargeApproved: {
        title: "Deposit Approved",
        icon: <ArrowDownRight size={18} color="#10b981" />,
        bg: "#ecfdf5",
      },
      withdrawalApproved: {
        title: "Cashout Processed",
        icon: <ArrowUpRight size={18} color="#d97706" />,
        bg: "#fff7ed",
      },
      adminAdd: {
        title: "System Adjustment",
        icon: <RefreshCcw size={18} color="#3b82f6" />,
        bg: "#eff6ff",
      },
      adminDeduct: {
        title: "System Deduction",
        icon: <RefreshCcw size={18} color="#64748b" />,
        bg: "#f1f5f9",
      },
    };

    const defaultCfg = isPositive
      ? {
          title: "Income",
          icon: <ArrowDownRight size={18} color="#10b981" />,
          bg: "#ecfdf5",
        }
      : {
          title: "Expense",
          icon: <ArrowUpRight size={18} color="#e11d48" />,
          bg: "#fff1f2",
        };

    return config[type] || defaultCfg;
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      {/* ── Sticky Header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <TopBar
          title="Financial Ledger"
          backgroundColor="#1e293b"
          textColor="text-white"
          showBack={true}
        />
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "16px 20px 24px 20px",
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Banknote size={24} color="#fff" />
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "14px",
                color: "#94a3b8",
              }}
            >
              Transaction History
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Detailed record of all account movements.
            </p>
          </div>
        </div>
      </div>

      {/* ── Transaction List ── */}
      <div
        style={{
          padding: "16px",
          marginTop: "-16px",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
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
        ) : !transactions || transactions.length === 0 ? (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "40px 20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <RefreshCcw
              size={32}
              color="#cbd5e1"
              style={{ margin: "0 auto 12px auto" }}
            />
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              No transactions yet.
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const info = getTransactionInfo(tx.type, tx.amount);
            const isPositive = tx.amount > 0;

            return (
              <div
                key={tx._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: info.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#1e293b",
                        fontSize: "14px",
                        fontWeight: "600",
                        margin: "0 0 2px 0",
                      }}
                    >
                      {info.title}
                    </p>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "11px",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                    {tx.linkedId && (
                      <p
                        style={{
                          color: "#cbd5e1",
                          fontSize: "10px",
                          margin: 0,
                          fontFamily: "monospace",
                        }}
                      >
                        Ref: {tx.linkedId}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      color: isPositive ? "#10b981" : "#e11d48",
                      fontSize: "15px",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {tx.amount.toFixed(2)}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "11px", margin: 0 }}>
                    Bal: ${(tx.balanceAfter || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
