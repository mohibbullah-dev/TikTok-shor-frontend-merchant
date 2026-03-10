import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const REASON_TYPES = [
  "Out of Stock",
  "Wrong Item Shipped",
  "Item Damaged",
  "Merchant Cancelled",
  "Customer Request",
  "Other",
];

export default function RefundRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    orderSn: searchParams.get("orderSn") || "",
    reasonType: REASON_TYPES[0],
    explanation: "",
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!form.orderSn.trim()) throw new Error("Order number is required");
      const { data } = await API.post("/refunds", form);
      return data;
    },
    onSuccess: () => {
      toast.success(
        "Refund request submitted. Support will review it shortly.",
      );
      navigate("/orders");
    },
    onError: (err) =>
      toast.error(
        err.message || err.response?.data?.message || "Submission failed",
      ),
  });

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Request Refund"
        backgroundColor="#fff"
        textColor="text-gray-800"
        showBack={true}
      />

      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Warning banner */}
        <div
          style={{
            backgroundColor: "#fff7ed",
            border: "1px dashed #fed7aa",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex",
            gap: "10px",
          }}
        >
          <AlertTriangle
            size={18}
            color="#f97316"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <p
            style={{
              color: "#9a3412",
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            Refunds deduct <strong>5 Credit Score points</strong>. Only submit
            if necessary. You can only submit one refund per order.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Order Number <span style={{ color: "#f02d65" }}>*</span>
            </label>
            <input
              type="text"
              value={form.orderSn}
              onChange={(e) => setForm({ ...form, orderSn: e.target.value })}
              placeholder="e.g., ORD-20240101-00001"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#f97316")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Reason <span style={{ color: "#f02d65" }}>*</span>
            </label>
            <select
              value={form.reasonType}
              onChange={(e) => setForm({ ...form, reasonType: e.target.value })}
              style={{ ...inputStyle, backgroundColor: "#f8fafc" }}
            >
              {REASON_TYPES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Explanation (Optional)
            </label>
            <textarea
              value={form.explanation}
              onChange={(e) =>
                setForm({ ...form, explanation: e.target.value })
              }
              placeholder="Describe the issue in detail..."
              rows={5}
              style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
              onFocus={(e) => (e.target.style.borderColor = "#f97316")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>
        </div>

        <button
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending || !form.orderSn.trim()}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#fff",
            border: "none",
            cursor:
              submitMutation.isPending || !form.orderSn
                ? "not-allowed"
                : "pointer",
            background:
              submitMutation.isPending || !form.orderSn
                ? "#cbd5e1"
                : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {submitMutation.isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Send size={18} /> Submit Refund Request
            </>
          )}
        </button>
      </div>
    </div>
  );
}
