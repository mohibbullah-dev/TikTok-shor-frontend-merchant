import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const VipUpgrade = () => {
  const { merchant } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [paymentPassword, setPaymentPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const currentLevel = merchant?.vipLevel || 0;

  const vipColors = {
    0: "#888888",
    1: "#cd7f32",
    2: "#aaaaaa",
    3: "#ffd700",
    4: "#00bcd4",
    5: "#9c27b0",
    6: "#f02d65",
  };

  const vipIcons = {
    0: "🥉",
    1: "🥈",
    2: "🥇",
    3: "💛",
    4: "💎",
    5: "💜",
    6: "👑",
  };

  // Fetch VIP levels
  const { data: levels } = useQuery({
    queryKey: ["vipLevels"],
    queryFn: async () => {
      const { data } = await API.get("/vip/levels");
      return data;
    },
  });

  // Apply upgrade mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.post("/vip/apply", {
        requestedLevel: selectedLevel.level,
        paymentPassword,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("VIP upgrade request submitted!");
      queryClient.invalidateQueries(["myStore"]);
      setShowModal(false);
      setPaymentPassword("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed");
    },
  });

  const handleApply = (level) => {
    setSelectedLevel(level);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!paymentPassword || paymentPassword.length !== 6) {
      toast.error("Enter 6-digit payment password");
      return;
    }
    applyMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopBar title="VIP Upgrade" />

      {/* Current VIP Card */}
      <div
        className="mx-4 mt-4 rounded-2xl p-5 shadow-lg text-white"
        style={{
          background: `linear-gradient(135deg,
          ${vipColors[currentLevel]}, ${vipColors[currentLevel]}99)`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">{vipIcons[currentLevel]}</span>
          <div>
            <p className="text-white/70 text-xs">Current Level</p>
            <p className="text-2xl font-bold">VIP {currentLevel}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/70 text-xs">Profit Rate</p>
            <p className="text-2xl font-bold">
              {(
                levels?.find((l) => l.level === currentLevel)?.rate * 100 || 15
              ).toFixed(0)}
              %
            </p>
          </div>
        </div>
        <div className="mt-3 bg-white/20 rounded-xl p-2 text-center">
          <p className="text-white/80 text-xs">
            Balance: ${(merchant?.balance || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* VIP Levels List */}
      <div className="mx-4 mt-4 space-y-3">
        <p className="text-gray-500 text-xs font-medium px-1">
          AVAILABLE UPGRADES
        </p>

        {levels?.map((level) => {
          const isCurrentLevel = level.level === currentLevel;
          const isLowerLevel = level.level < currentLevel;
          const canAfford = (merchant?.balance || 0) >= level.price;
          const profitRate = (level.rate * 100).toFixed(0);

          return (
            <div
              key={level.level}
              className={`bg-white rounded-2xl p-4 shadow-sm
                border-2 transition-all ${
                  isCurrentLevel ? "border-pink-200" : "border-transparent"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* VIP Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center
                  justify-center text-2xl shadow-sm"
                  style={{ background: `${vipColors[level.level]}20` }}
                >
                  {vipIcons[level.level]}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800">VIP {level.level}</p>
                    {isCurrentLevel && (
                      <span
                        className="text-[10px] px-2 py-0.5
                        rounded-full text-white font-bold"
                        style={{ background: vipColors[level.level] }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-green-500 text-sm font-bold">
                      {profitRate}% profit
                    </span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-gray-400 text-xs">
                      ${level.price.toLocaleString()} required
                    </span>
                  </div>
                </div>

                {/* Action */}
                {!isCurrentLevel && !isLowerLevel && (
                  <button
                    onClick={() => handleApply(level)}
                    disabled={!canAfford}
                    className="px-4 py-2 rounded-xl text-white text-xs
                      font-bold transition-all active:scale-95
                      disabled:opacity-50"
                    style={{
                      background: canAfford
                        ? `linear-gradient(135deg,
                            ${vipColors[level.level]},
                            ${vipColors[level.level]}99)`
                        : "#d1d5db",
                    }}
                  >
                    {canAfford ? "Upgrade" : "Insufficient"}
                  </button>
                )}

                {isLowerLevel && (
                  <span className="text-gray-300 text-xs">✓ Done</span>
                )}
              </div>

              {/* Progress bar for current */}
              {isCurrentLevel && (
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full w-full"
                      style={{
                        background: vipColors[currentLevel],
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade Confirmation Modal */}
      {showModal && selectedLevel && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end
          justify-center"
        >
          <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6">
            <div className="text-center mb-5">
              <span className="text-5xl">{vipIcons[selectedLevel.level]}</span>
              <h3 className="text-gray-800 font-bold text-lg mt-3">
                Upgrade to VIP {selectedLevel.level}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Profit rate: {(selectedLevel.rate * 100).toFixed(0)}%
              </p>
            </div>

            {/* Cost */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Upgrade Fee</span>
                <span className="font-bold text-red-400">
                  -${selectedLevel.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-500 text-sm">Your Balance</span>
                <span className="font-bold text-gray-700">
                  ${(merchant?.balance || 0).toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">After Upgrade</span>
                <span className="font-bold text-green-500">
                  ${((merchant?.balance || 0) - selectedLevel.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Password */}
            <div className="mb-5">
              <label
                className="text-gray-600 text-sm font-medium
                mb-2 block"
              >
                Enter Payment Password
              </label>
              <input
                type="password"
                value={paymentPassword}
                onChange={(e) => setPaymentPassword(e.target.value)}
                placeholder="••••••"
                maxLength={6}
                className="w-full px-4 py-3.5 bg-gray-50 border-2
                  border-gray-200 rounded-xl text-center text-xl
                  tracking-widest font-bold outline-none
                  focus:border-pink-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPaymentPassword("");
                }}
                className="flex-1 py-3.5 rounded-xl border-2
                  border-gray-200 text-gray-500 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={applyMutation.isPending}
                className="flex-1 py-3.5 rounded-xl text-white
                  font-bold disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg,
                    ${vipColors[selectedLevel.level]},
                    ${vipColors[selectedLevel.level]}99)`,
                }}
              >
                {applyMutation.isPending ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VipUpgrade;
