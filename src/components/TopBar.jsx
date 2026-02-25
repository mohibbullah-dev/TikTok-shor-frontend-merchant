import { useNavigate } from "react-router-dom";

const TopBar = ({
  title,
  showBack = true,
  rightElement = null,
  backgroundColor = "white",
  textColor = "text-gray-800",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`sticky top-0 z-40 flex items-center justify-between
      px-4 py-3.5 shadow-sm`}
      style={{ backgroundColor }}
    >
      {/* Left: Back Button */}
      <div className="w-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center
              rounded-full bg-gray-100 active:bg-gray-200 transition-all"
          >
            <span className="text-gray-600 text-lg">←</span>
          </button>
        )}
      </div>

      {/* Center: Title */}
      <h1 className={`text-base font-bold ${textColor} flex-1 text-center`}>
        {title}
      </h1>

      {/* Right: Optional element */}
      <div className="w-10 flex justify-end">{rightElement}</div>
    </div>
  );
};

export default TopBar;
