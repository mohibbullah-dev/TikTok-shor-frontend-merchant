import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const Finance = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["financialStatements"],
    queryFn: async () => {
      const { data } = await API.get("/transactions/financial-statements");
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="Financial Statements" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-400 text-xs">Awaiting Amount</p>
          <p className="text-red-400 font-bold text-xl mt-1">
            ${(data?.awaitingAmount || 0).toFixed(2)}
          </p>
          <p className="text-gray-300 text-[10px] mt-1">Locked in orders</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-400 text-xs">Total Profit</p>
          <p className="text-green-500 font-bold text-xl mt-1">
            ${(data?.totalProfit || 0).toFixed(2)}
          </p>
          <p className="text-gray-300 text-[10px] mt-1">All time earnings</p>
        </div>
      </div>

      {/* Daily Statements */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div
          className="grid grid-cols-3 bg-gray-50 px-4 py-3
          border-b border-gray-100"
        >
          <p className="text-gray-500 text-xs font-bold">Date</p>
          <p className="text-gray-500 text-xs font-bold text-center">Orders</p>
          <p className="text-gray-500 text-xs font-bold text-right">Profit</p>
        </div>

        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-3 animate-pulse
                border-b border-gray-50"
            >
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-8 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-16 ml-auto" />
            </div>
          ))
        ) : data?.statements?.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl">📈</span>
            <p className="text-gray-400 text-sm mt-3">No financial data yet</p>
          </div>
        ) : (
          data?.statements?.map((stmt, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-3.5 border-b
                border-gray-50 last:border-0"
            >
              <p className="text-gray-600 text-sm">{stmt._id}</p>
              <p className="text-gray-600 text-sm text-center">
                {stmt.totalOrders}
              </p>
              <p
                className="text-right text-sm font-bold"
                style={{
                  color: stmt.totalProfit > 0 ? "#22c55e" : "#9ca3af",
                }}
              >
                ${stmt.totalProfit?.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Finance;
