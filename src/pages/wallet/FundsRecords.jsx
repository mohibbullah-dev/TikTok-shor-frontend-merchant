import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import moment from "moment";

const FundsRecords = () => {
  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get("filter") || "all";
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const filters = [
    { key: "all", label: "All Records" },
    { key: "recharge", label: "Recharge" },
    { key: "withdrawal", label: "Withdrawal" },
    { key: "orderPayment", label: "Order Payment" },
    { key: "orderCompleted", label: "Order Profit" },
    { key: "signInBonus", label: "Sign-in Bonus" },
    { key: "vipUpgrade", label: "VIP Upgrade" },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["myTransactions", activeFilter],
    queryFn: async () => {
      const type = activeFilter === "all" ? "" : activeFilter;
      const { data } = await API.get(
        `/transactions/my-records?${type ? `type=${type}` : ""}&limit=100`,
      );
      return data;
    },
  });

  const transactions = data?.transactions || [];

  const getTypeIcon = (type) => {
    const icons = {
      recharge: "💳",
      withdrawal: "💸",
      orderPayment: "📦",
      orderCompleted: "✅",
      signInBonus: "🎁",
      vipUpgrade: "👑",
      adminAdd: "➕",
      adminDeduct: "➖",
    };
    return icons[type] || "💰";
  };

  const getTypeLabel = (type) => {
    const labels = {
      recharge: "Recharge",
      withdrawal: "Withdrawal",
      orderPayment: "Order Payment",
      orderCompleted: "Order Profit",
      signInBonus: "Sign-in Bonus",
      vipUpgrade: "VIP Upgrade",
      adminAdd: "Admin Credit",
      adminDeduct: "Admin Deduct",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const debitTypes = [
      "withdrawal",
      "orderPayment",
      "vipUpgrade",
      "adminDeduct",
    ];
    return debitTypes.includes(type) ? "#ef4444" : "#22c55e";
  };

  const activeFilterLabel =
    filters.find((f) => f.key === activeFilter)?.label || "All Records";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar
        title="Fund Records"
        rightElement={
          <button
            onClick={() => setShowFilterSheet(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#fff0f3" }}
          >
            <span style={{ color: "#f02d65" }}>⊞</span>
          </button>
        }
      />

      {/* Active filter badge */}
      {activeFilter !== "all" && (
        <div className="mx-4 mt-3 flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium
            text-white flex items-center gap-1.5"
            style={{ background: "#f02d65" }}
          >
            {activeFilterLabel}
            <button onClick={() => setActiveFilter("all")}>×</button>
          </span>
        </div>
      )}

      {/* Transaction List */}
      <div className="p-4 space-y-2">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 animate-pulse h-16"
            />
          ))
        ) : transactions.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">📊</span>
            <p className="text-gray-500 mt-4 font-medium">No records found</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white rounded-2xl p-4 shadow-sm
                flex items-center gap-3"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl bg-gray-50
                flex items-center justify-center text-xl flex-shrink-0
                border border-gray-100"
              >
                {getTypeIcon(tx.type)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 text-sm font-medium">
                  {getTypeLabel(tx.type)}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {moment(tx.createdAt).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>

              {/* Amount + Balance */}
              <div className="text-right flex-shrink-0">
                <p
                  className="font-bold text-base"
                  style={{ color: getTypeColor(tx.type) }}
                >
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </p>
                <p className="text-gray-300 text-[10px] mt-0.5">
                  Bal: ${tx.balanceAfter?.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end
          justify-center"
          onClick={() => setShowFilterSheet(false)}
        >
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-800 font-bold text-base">
                Filter Records
              </h3>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex
                  items-center justify-center text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setActiveFilter(filter.key);
                    setShowFilterSheet(false);
                  }}
                  className="w-full flex items-center justify-between
                    py-3 px-4 rounded-xl transition-all"
                  style={{
                    background:
                      activeFilter === filter.key ? "#fff0f3" : "#f9fafb",
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        activeFilter === filter.key ? "#f02d65" : "#4b5563",
                    }}
                  >
                    {filter.label}
                  </span>
                  {activeFilter === filter.key && (
                    <span style={{ color: "#f02d65" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsRecords;
