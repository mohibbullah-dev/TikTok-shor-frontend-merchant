import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../store/authSlice";
import API from "../../api/axios";
import BottomNav from "../../components/BottomNav";
import {
  Wallet,
  Landmark,
  Copy,
  Settings,
  Users,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  LogOut,
  Gem,
  AlertCircle,
  TrendingUp,
  Lock,
  KeyRound,
  X,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, merchant } = useSelector((s) => s.auth);

  // ─── NEW: Security Modal State ───
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [isPinLoading, setIsPinLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(merchant?.merchantId || user?._id);
    toast.success("Invite Code copied to clipboard!");
  };

  // ─── NEW: Handle PIN Submit ───
  const handleSetPin = async (e) => {
    e.preventDefault();
    if (newPin.length !== 6)
      return toast.error("New PIN must be exactly 6 digits");

    try {
      setIsPinLoading(true);
      const { data } = await API.put("/auth/change-funds-password", {
        currentPassword: currentPin,
        newPassword: newPin,
      });
      toast.success(data.message || "Funds password updated!");
      setIsSecurityModalOpen(false);
      setCurrentPin("");
      setNewPin("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update PIN");
    } finally {
      setIsPinLoading(false);
    }
  };

  const menuGroups = [
    {
      title: "Store Management",
      items: [
        {
          label: "Personal Information",
          icon: <ShieldCheck size={20} color="#3b82f6" />,
          path: "/profile/personal",
        },
        {
          label: "My Team / Affiliates",
          icon: <Users size={20} color="#10b981" />,
          path: "/team",
        },
        {
          label: "Traffic Tasks",
          icon: <TrendingUp size={20} color="#f97316" />,
          path: "/tasks",
        },
        {
          label: "Account Settings",
          icon: <Settings size={20} color="#64748b" />,
          path: "/profile/settings",
        },
      ],
    },
    {
      title: "Support & Security",
      items: [
        // ✅ NEW: Security Settings Button added here
        {
          label: "Security Settings (PIN)",
          icon: <Lock size={20} color="#8b5cf6" />,
          onClick: () => setIsSecurityModalOpen(true),
        },
        {
          label: "Help Center (FAQ)",
          icon: <HelpCircle size={20} color="#f59e0b" />,
          path: "/faq",
        },
        {
          label: "Submit a Complaint",
          icon: <AlertCircle size={20} color="#e11d48" />,
          path: "/complaint",
        },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px", paddingBottom: "100px" }}
    >
      {/* ════════════ SEAMLESS GRADIENT HEADER ════════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          padding: "40px 20px 80px 20px",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#f02d65",
                }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {user?.username || "Merchant"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  backgroundColor: "#fbbf24",
                  color: "#78350f",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Gem size={12} /> VIP {merchant?.vipLevel || 0}
              </span>
              <span
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
              >
                ID: {merchant?.merchantId}
              </span>
            </div>
          </div>
        </div>

        {/* Invite Code Banner */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "11px",
                margin: "0 0 4px 0",
              }}
            >
              My Invitation Code
            </p>
            <p
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              {merchant?.merchantId}
            </p>
          </div>
          <button
            onClick={copyInviteCode}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "#f02d65",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Copy size={14} /> Copy
          </button>
        </div>
      </div>

      {/* ════════════ OVERLAPPING WALLET CARD ════════════ */}
      <div
        style={{
          padding: "0 16px",
          marginTop: "-40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Wallet size={16} color="#94a3b8" /> Available Balance
          </p>
          <p
            style={{
              color: "#1e293b",
              fontSize: "32px",
              fontWeight: "900",
              margin: "0 0 20px 0",
              fontFamily: "monospace",
            }}
          >
            ${(merchant?.balance || 0).toFixed(2)}
          </p>

          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                Pending Amount
              </p>
              <p
                style={{
                  color: "#f59e0b",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(merchant?.pendingAmount || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ width: "1px", backgroundColor: "#f1f5f9" }} />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  margin: "0 0 4px 0",
                }}
              >
                Total Income
              </p>
              <p
                style={{
                  color: "#10b981",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                ${(merchant?.totalIncome || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate("/recharge")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(240, 45, 101, 0.3)",
              }}
            >
              <Wallet size={16} /> Recharge
            </button>
            <button
              onClick={() => navigate("/withdraw")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "#fff1f2",
                color: "#f02d65",
                fontSize: "14px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Landmark size={16} /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ════════════ MENU LISTS ════════════ */}
      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "0 0 12px 12px",
              }}
            >
              {group.title}
            </p>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                overflow: "hidden",
              }}
            >
              {group.items.map((item, i) => (
                <button
                  key={i}
                  // ✅ FIX: Allows the menu to run an onClick OR navigate to a path
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    else navigate(item.path);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    borderBottom:
                      i !== group.items.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
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
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      style={{
                        color: "#1e293b",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight size={18} color="#cbd5e1" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #fee2e2",
            color: "#e11d48",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "10px",
          }}
        >
          <LogOut size={18} /> Secure Logout
        </button>
      </div>

      <BottomNav />

      {/* ════════════ SECURITY PIN MODAL ════════════ */}
      {isSecurityModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "400px",
              padding: "24px",
              position: "relative",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={20} color="#94a3b8" />
            </button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#fef2f2",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <KeyRound size={24} color="#f02d65" />
              </div>
              <h3
                style={{
                  margin: "0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1e293b",
                }}
              >
                Set Funds Password
              </h3>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                  textAlign: "center",
                }}
              >
                This 6-digit PIN is required to safely withdraw your earnings.
              </p>
            </div>

            <form
              onSubmit={handleSetPin}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#475569",
                    marginBottom: "8px",
                  }}
                >
                  Current PIN{" "}
                  <span style={{ color: "#94a3b8", fontWeight: "normal" }}>
                    (Leave blank if not set)
                  </span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={currentPin}
                  onChange={(e) =>
                    setCurrentPin(e.target.value.replace(/\D/g, ""))
                  } // Only allow numbers
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "18px",
                    letterSpacing: "6px",
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                    transition: "all 0.2s",
                  }}
                  placeholder="••••••"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#475569",
                    marginBottom: "8px",
                  }}
                >
                  New 6-Digit PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  minLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    fontSize: "18px",
                    letterSpacing: "6px",
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                    transition: "all 0.2s",
                  }}
                  placeholder="••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isPinLoading || newPin.length !== 6}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  background:
                    newPin.length === 6
                      ? "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)"
                      : "#e2e8f0",
                  color: newPin.length === 6 ? "#fff" : "#94a3b8",
                  fontWeight: "bold",
                  fontSize: "15px",
                  border: "none",
                  marginTop: "8px",
                  cursor: newPin.length === 6 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  boxShadow:
                    newPin.length === 6
                      ? "0 4px 15px rgba(240, 45, 101, 0.3)"
                      : "none",
                }}
              >
                {isPinLoading ? "Saving..." : "Confirm Secure PIN"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
