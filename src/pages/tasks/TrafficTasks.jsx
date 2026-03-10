import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import {
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const STATUS_MAP = {
  inProgress: {
    label: "In Progress",
    color: "#3b82f6",
    bg: "#eff6ff",
    icon: TrendingUp,
  },
  executionCompleted: {
    label: "Completed",
    color: "#10b981",
    bg: "#ecfdf5",
    icon: CheckCircle2,
  },
  ended: { label: "Ended", color: "#6b7280", bg: "#f3f4f6", icon: XCircle },
};

export default function TrafficTasks() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["myTrafficTasks"],
    queryFn: async () => {
      const { data } = await API.get("/traffic-tasks/my-tasks");
      return data;
    },
  });

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ margin: "0 auto", maxWidth: "620px" }}
    >
      <TopBar
        title="Traffic Tasks"
        backgroundColor="#1e293b"
        textColor="text-white"
        showBack={true}
      />

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Info Banner */}
        <div
          style={{
            backgroundColor: "#eff6ff",
            border: "1px dashed #bfdbfe",
            borderRadius: "12px",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              color: "#1e40af",
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            Traffic tasks are assigned by your platform manager. They boost your
            store visibility and attract more orders. Complete them within the
            deadline to maintain your credit score.
          </p>
        </div>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px",
            }}
          >
            <Loader2 size={28} className="animate-spin text-rose-500" />
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <TrendingUp
              size={48}
              color="#cbd5e1"
              style={{ margin: "0 auto 16px auto" }}
            />
            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              No traffic tasks assigned
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "8px" }}>
              Your manager will assign tasks when needed.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const st = STATUS_MAP[task.status] || STATUS_MAP.ended;
            const StatusIcon = st.icon;
            const progressPct =
              task.traffic > 0
                ? Math.min(
                    100,
                    Math.round((task.completedTraffic / task.traffic) * 100),
                  )
                : 0;

            return (
              <div
                key={task._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header row */}
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
                      fontSize: "12px",
                      color: "#64748b",
                      fontFamily: "monospace",
                      backgroundColor: "#f1f5f9",
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    #{task._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: st.bg,
                      color: st.color,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <StatusIcon size={13} /> {st.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                        fontWeight: "600",
                      }}
                    >
                      Traffic Progress
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: st.color,
                      }}
                    >
                      {progressPct}%
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#f1f5f9",
                      borderRadius: "8px",
                      height: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPct}%`,
                        backgroundColor: st.color,
                        borderRadius: "8px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "6px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {task.completedTraffic.toLocaleString()} completed
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {task.traffic.toLocaleString()} target
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "12px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        margin: "0 0 2px 0",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      Duration
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#1e293b",
                        margin: 0,
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Clock size={13} color="#94a3b8" />{" "}
                      {task.executionDuration} min
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        margin: "0 0 2px 0",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      Start Time
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#1e293b",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {task.startExecutionTime
                        ? new Date(task.startExecutionTime).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>

                {task.taskInformation && (
                  <div
                    style={{
                      marginTop: "12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      padding: "10px 12px",
                    }}
                  >
                    <p
                      style={{ fontSize: "12px", color: "#64748b", margin: 0 }}
                    >
                      {task.taskInformation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
