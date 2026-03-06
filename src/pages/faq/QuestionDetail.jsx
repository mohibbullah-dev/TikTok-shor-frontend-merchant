import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { Loader2, FileText, Calendar } from "lucide-react";

export default function QuestionDetail() {
  const { id } = useParams();

  const { data: question, isLoading } = useQuery({
    queryKey: ["faq", id],
    queryFn: async () => {
      const { data } = await API.get(`/questions/${id}`);
      return data;
    },
  });

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col relative"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Article Details"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      <div style={{ padding: "20px 16px" }}>
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
        ) : !question ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <FileText
              size={48}
              color="#cbd5e1"
              style={{ margin: "0 auto 16px auto" }}
            />
            <p
              style={{ color: "#64748b", fontSize: "15px", fontWeight: "bold" }}
            >
              Article not found
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 15px rgba(0,0,0,0.03)",
            }}
          >
            {question.category && (
              <span
                style={{
                  backgroundColor: "#fff1f2",
                  color: "#f02d65",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {question.category}
              </span>
            )}

            <h1
              style={{
                color: "#1e293b",
                fontSize: "20px",
                fontWeight: "bold",
                margin: "16px 0 12px 0",
                lineHeight: "1.4",
              }}
            >
              {/* FIXED: Uses question.title instead of question.question */}
              {question.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                margin: "0 0 24px 0",
                paddingBottom: "20px",
                borderBottom: "1px dashed #e2e8f0",
              }}
            >
              <Calendar size={14} color="#94a3b8" />
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                Updated{" "}
                {new Date(
                  question.createdAt || Date.now(),
                ).toLocaleDateString()}
              </span>
            </div>

            <div
              style={{
                color: "#475569",
                fontSize: "14px",
                lineHeight: "1.8",
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
