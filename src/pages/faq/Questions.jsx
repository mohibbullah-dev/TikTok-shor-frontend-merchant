import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import {
  HelpCircle,
  ChevronRight,
  Search,
  Loader2,
  BookOpen,
} from "lucide-react";

export default function Questions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: questions, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data } = await API.get("/questions");
      return data;
    },
  });

  // const filtered = (questions || []).filter(
  //   (q) =>
  //     q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     q.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  const filtered = (questions || []).filter(
    (q) =>
      q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      {/* ── Sticky Top Bar & Header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <TopBar
          title="Help Center"
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
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides and FAQs..."
              style={{
                width: "100%",
                padding: "14px 16px 14px 44px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                fontSize: "14px",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── FAQ List ── */}
      <div
        style={{
          padding: "16px",
          marginTop: "-16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              color: "#1e293b",
              fontSize: "15px",
              fontWeight: "bold",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BookOpen size={18} color="#f02d65" /> Platform Guidelines
          </p>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "40px 0",
              }}
            >
              <Loader2 size={24} className="animate-spin text-rose-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <HelpCircle
                size={40}
                color="#cbd5e1"
                style={{ margin: "0 auto 12px auto" }}
              />
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                No matching questions found.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filtered.map((item, idx) => (
                <button
                  key={item._id}
                  onClick={() => navigate(`/faq/${item._id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    background: "none",
                    border: "none",
                    borderBottom:
                      idx !== filtered.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ flex: 1, paddingRight: "16px" }}>
                    {item.category && (
                      <span
                        style={{
                          color: "#f02d65",
                          fontSize: "10px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          margin: "0 0 4px 0",
                          display: "block",
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                    <span
                      style={{
                        color: "#1e293b",
                        fontSize: "14px",
                        fontWeight: "600",
                        lineHeight: "1.4",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    color="#cbd5e1"
                    style={{ flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
