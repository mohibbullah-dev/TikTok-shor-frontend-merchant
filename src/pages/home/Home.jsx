/////////////////////////// ==================  offer section added in homepage /////////////// =================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { updateMerchant } from "../../store/authSlice";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  Store,
  Star,
  Headset,
  Wallet,
  Landmark,
  Gem,
  Settings,
  CalendarCheck,
  Loader2,
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);
  const [expanded, setExpanded] = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // ── Queries ─────────────────────────────────────────────────
  const { data: storeData, isLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: async () => {
      const { data } = await API.get("/merchants/my-store");
      return data;
    },
  });

  useEffect(() => {
    if (storeData) dispatch(updateMerchant(storeData));
  }, [storeData]);

  const { data: financeData } = useQuery({
    queryKey: ["financeSummary"],
    queryFn: async () => {
      const { data } = await API.get("/transactions/financial-statements");
      return data;
    },
  });

  const { data: faqData } = useQuery({
    queryKey: ["faqHome"],
    queryFn: async () => {
      const { data } = await API.get("/questions");
      return data;
    },
  });

  const { data: offerData } = useQuery({
    queryKey: ["activeOffer"],
    queryFn: async () => {
      const { data } = await API.get("/offers/active");
      return data.offer || null;
    },
    refetchInterval: 60000,
  });

  // ── Countdown timer ──────────────────────────────────────────
  useEffect(() => {
    if (!offerData) return;
    const tick = () => {
      const diff = new Date(offerData.endTime) - new Date();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offerData]);

  // ── Derived ──────────────────────────────────────────────────
  const store = storeData || merchant;
  const todayStats = financeData?.statements?.[0];

  const chartData = financeData?.statements
    ? [...(financeData.statements || [])]
        .slice(0, 7)
        .reverse()
        .map((s) => ({
          date: s._id ? s._id.slice(5) : "",
          sales: parseFloat(s.totalSales) || 0,
        }))
    : [];

  const topQuestions = faqData
    ? faqData.filter((q) => q.isActive !== false).slice(0, 5)
    : [];

  const actions = [
    {
      label: "Recharge",
      path: "/recharge",
      icon: <Wallet size={28} color="#f02d65" strokeWidth={1.5} />,
      bg: "#fff1f2",
    },
    {
      label: "Withdraw",
      path: "/withdraw",
      icon: <Landmark size={28} color="#ff6b35" strokeWidth={1.5} />,
      bg: "#fff7ed",
    },
    {
      label: "VIP Upgrade",
      path: "/vip",
      icon: <Gem size={28} color="#8b5cf6" strokeWidth={1.5} />,
      bg: "#f5f3ff",
    },
    {
      label: "Support",
      path: "/chat",
      icon: <Headset size={28} color="#0ea5e9" strokeWidth={1.5} />,
      bg: "#f0f9ff",
    },
    {
      label: "Settings",
      path: "/profile",
      icon: <Settings size={28} color="#64748b" strokeWidth={1.5} />,
      bg: "#f8fafc",
    },
    {
      label: "Attendance",
      path: "/calendar",
      icon: <CalendarCheck size={28} color="#10b981" strokeWidth={1.5} />,
      bg: "#ecfdf5",
    },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-rose-500" />
      </div>
    );

  const showOffer = offerData && !offerDismissed;

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: "90px" }}>
      {/* ════════ STICKY TOP BAR ════════ */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 15px rgba(240,45,101,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            <ShoppingBag size={18} color="#f02d65" strokeWidth={2.5} />
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "0.5px",
            }}
          >
            TikTok Shop
          </span>
        </div>
        <button
          onClick={() => navigate("/chat")}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Headset size={18} color="#fff" />
        </button>
      </div>

      {/* ════════ HERO SECTION ════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          padding: "24px 20px 60px 20px",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.4)",
            }}
          >
            {store?.storeLogo ? (
              <img
                src={store.storeLogo}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Store size={30} color="#f02d65" />
            )}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {store?.storeName || user?.username}
              </h2>
              <span
                style={{ paddingLeft: "3px", paddingRight: "3px" }}
                className="bg-white rounded-xl text-[#F3395C]"
              >
                vip
                {store?.vipLevel && (
                  <span
                    style={{
                      backgroundColor: "#fbbf24",
                      color: "#78350f",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px",
                      marginLeft: "2px",
                    }}
                  >
                    <Gem size={10} /> VIP {store.vipLevel}
                  </span>
                )}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={24}
                  fill={
                    i <= Math.round(store?.starRating || 0)
                      ? "#ffffff"
                      : "rgba(255,255,255,0.5)"
                  }
                  color={
                    i <= Math.round(store?.starRating || 0)
                      ? "#FBBF24"
                      : "transparent"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════ OFFER BANNER ════════ */}
      {showOffer && (
        <div
          style={{
            padding: "12px 16px 0 16px",
            position: "relative",
            zIndex: 5,
          }}
        >
          <style>{`@keyframes shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }`}</style>
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              boxShadow: "0 8px 32px rgba(240,45,101,0.35)",
              position: "relative",
            }}
          >
            {/* Glowing orbs */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(240,45,101,0.4) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-10px",
                left: "30px",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ padding: "16px 20px", position: "relative" }}>
              {/* Badge row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      backgroundColor: "#f02d65",
                      borderRadius: "6px",
                      padding: "3px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Zap size={11} color="#fff" fill="#fff" />
                    <span
                      style={{
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: "900",
                        letterSpacing: "1px",
                      }}
                    >
                      {offerData.badgeText || "LIMITED OFFER"}
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: "6px",
                      padding: "3px 10px",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <span
                      style={{
                        color: "#fbbf24",
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                      }}
                    >
                      ⏱ {timeLeft}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setOfferDismissed(true)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={13} color="rgba(255,255,255,0.7)" />
                </button>
              </div>

              {/* Content row: text + image + bonus pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "900",
                      margin: "0 0 4px 0",
                      lineHeight: "1.2",
                    }}
                  >
                    {offerData.title}
                  </h3>
                  {offerData.description && (
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "12px",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      {offerData.description}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                  }}
                >
                  {/* Banner image thumbnail */}
                  {offerData.bannerImage && (
                    <img
                      src={offerData.bannerImage}
                      alt="offer"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {/* Bonus pill */}
                  {offerData.discountPercent > 0 && (
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f02d65, #ff6b35)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 15px rgba(240,45,101,0.5)",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "18px",
                          fontWeight: "900",
                          lineHeight: "1",
                        }}
                      >
                        +{offerData.discountPercent}%
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "9px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        BONUS
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shimmer bar */}
              <div
                style={{
                  marginTop: "12px",
                  height: "3px",
                  borderRadius: "2px",
                  background:
                    "linear-gradient(90deg, #f02d65, #ff6b35, #fbbf24, #f02d65)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ════════ FINANCIAL CARD ════════ */}
      <div
        style={{
          padding: "0 16px",
          marginTop: showOffer ? "16px" : "-40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ShieldCheck size={20} color="#10b981" /> Financial Overview
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#f02d65",
                background: "rgba(240,45,101,0.1)",
                border: "none",
                padding: "4px 10px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              {expanded ? "Less" : "More"}
              <ChevronDown
                size={14}
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </button>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontWeight: "600",
                }}
              >
                Total Sales
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  color: "#1e293b",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(store?.totalSales || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ width: "1px", backgroundColor: "#f1f5f9" }} />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontWeight: "600",
                }}
              >
                Total Profit
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  color: "#f02d65",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(store?.totalProfit || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: expanded ? "14px" : "0",
            }}
          >
            {[
              { label: "Today's Orders", val: todayStats?.totalOrders ?? 0 },
              {
                label: "Today's Sales",
                val: `$${(todayStats?.totalSales || 0).toFixed(2)}`,
              },
              {
                label: "Today's Profit",
                val: `$${(todayStats?.totalProfit || 0).toFixed(2)}`,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: "#F3375E",
                  borderRadius: "10px",
                  padding: "12px 8px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    margin: "0 0 4px 0",
                    fontFamily: "monospace",
                  }}
                >
                  {s.val}
                </p>
                <p
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: "1.2",
                    fontWeight: "500",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {expanded && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
              }}
            >
              {[
                { label: "Visitors Today", val: store?.visitorsToday ?? 0 },
                { label: "Last 7 Days", val: store?.visitors7Days ?? 0 },
                { label: "Last 30 Days", val: store?.visitors30Days ?? 0 },
                { label: "Followers", val: store?.followers ?? 0 },
                { label: "Rating", val: `${store?.positiveRatingRate ?? 0}%` },
                { label: "Credit Score", val: store?.creditScore ?? 100 },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: "10px",
                    padding: "12px 8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#334155",
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: "0 0 2px 0",
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      margin: 0,
                      lineHeight: "1.2",
                      fontWeight: "500",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════ QUICK ACTIONS ════════ */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "16px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  backgroundColor: a.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {a.icon}
              </div>
              <span
                style={{
                  color: "#4b5563",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ════════ SALES CHART ════════ */}
      <div style={{ padding: "0 16px 16px 16px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          }}
        >
          <p
            style={{
              color: "#1f2937",
              fontWeight: "bold",
              fontSize: "20px",
              margin: "0 0 20px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <TrendingUp size={18} color="#f02d65" /> Performance Curve
          </p>
          <div style={{ height: "200px", width: "100%", marginLeft: "-10px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="url(#colorUv)"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#f02d65",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#f02d65",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f02d65" />
                    <stop offset="100%" stopColor="#ff6b35" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ════════ FAQ LIST ════════ */}
      {topQuestions.length > 0 && (
        <div style={{ padding: "0 16px 24px 16px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
          >
            <p
              style={{
                color: "#1f2937",
                fontWeight: "bold",
                fontSize: "20px",
                margin: "0 0 12px 0",
              }}
            >
              Platform Guidelines
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {topQuestions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => navigate(`/faq/${q._id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    background: "none",
                    border: "none",
                    borderBottom:
                      idx !== topQuestions.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "16px",
                      fontWeight: "500",
                      textAlign: "left",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      paddingRight: "16px",
                    }}
                  >
                    {q.title}
                  </span>
                  <ChevronRight
                    size={18}
                    color="#cbd5e1"
                    style={{ flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate("/faq")}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "12px",
                border: "1px solid #f1f5f9",
                borderRadius: "12px",
                background: "none",
                color: "#f02d65",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View All Guides
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
