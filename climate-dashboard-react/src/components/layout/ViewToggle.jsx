import { useNavigate, useLocation } from "react-router-dom";

export default function ViewToggle() {
  const navigate = useNavigate();
  const location = useLocation();

  const isInsights = location.pathname === "/insights";

  return (
    <div
      className="
        relative flex items-center
        rounded-full border border-white/40
        h-10 w-[260px]
        overflow-hidden
      "
    >
      {/* Sliding background */}
      <div
        className={`
          absolute top-0 h-full w-1/2
          bg-white/20
          rounded-full
          transition-transform duration-200
          ${isInsights ? "translate-x-full" : "translate-x-0"}
        `}
      />

      <button
        onClick={() => navigate(-1)}
        className={`
          relative z-10 w-1/2 h-full
          text-sm font-medium
          transition-opacity
          ${isInsights ? "opacity-50" : "opacity-100"}
        `}
      >
        Feed
      </button>

      <button
        onClick={() => navigate("/insights")}
        className={`
          relative z-10 w-1/2 h-full
          text-sm font-medium
          transition-opacity
          ${isInsights ? "opacity-100" : "opacity-50"}
        `}
      >
        Insights
      </button>
    </div>
  );
}
