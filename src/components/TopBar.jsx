import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const TopBar = ({
  title,
  showBack = true,
  rightElement = null,
  backgroundColor = "#018784",
  textColor = "#ffffff",
  showDot = false,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4"
      style={{
        backgroundColor,
        borderBottom: "0.5px solid rgba(255,255,255,0.15)",
        height: "54px",
      }}
    >
      {/* Left: back + title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "6px",
        }}
      >
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              border: "0.5px solid rgba(255,255,255,0.3)",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")
            }
          >
            <ChevronLeft size={16} color="#ffffff" strokeWidth={2.2} />
          </button>
        )}
        <span style={{ fontSize: "15px", fontWeight: "500", color: textColor }}>
          {title}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {rightElement ??
          (showDot && (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default TopBar;
