// src/components/layout/Header.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import YearSelector from "@/components/ui/YearSelector";
import MetricSelector from "@/components/ui/MetricSelector";
import InfoTooltip from "@/components/ui/tooltip/InfoTooltip";
import ViewToggle from "@/components/layout/ViewToggle";

export default function Header({
  placeName,
  year,
  setYear,
  metric,
  setMetric,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const viewMode = location.pathname === "/insights" ? "insights" : "feed";

  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  const years = [{ year: 2024 }, { year: 2025 }, { year: 2026 }];

  const metricControl = (
    <MetricSelector
      selected={metric}
      onChange={setMetric}
      disabled={viewMode === "insights"}
      subtle={viewMode === "insights"}
    />
  );

  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/10">
      {/* Outer wrapper */}
      <div className="max-w-[1200px] mx-auto px-4">
        {/* =========================
            ROW A — Context Bar
           ========================= */}
        <div className="py-4 flex items-center justify-between relative">
          {/* Desktop centered view toggle stays */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <ViewToggle />
          </div>

          {/* LEFT: back + place */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleBack} className="header-btn">
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Place title: NOT interactive */}
            <h1 className="text-xl font-semibold tracking-tight truncate">
              {placeName}
            </h1>
          </div>

          {/* RIGHT: Year selector now available on mobile too */}
          <div className="flex items-center gap-3">
            <YearSelector
              years={years}
              selectedYear={year}
              onYearChange={setYear}
              compact
            />

            {/* Desktop-only metric selector stays in header row */}
            <div className="hidden md:block">
              {viewMode === "insights" ? (
                <InfoTooltip
                  content="In Insights, metrics are viewed together rather than individually."
                  maxWidth="260px"
                  hideIcon
                >
                  {metricControl}
                </InfoTooltip>
              ) : (
                metricControl
              )}
            </div>
          </div>
        </div>

        {/* =========================
            ROW B — Mobile Controls
          ========================= */}
        <div className="pb-4 md:hidden grid grid-cols-[72px_auto_72px] items-center">
          {/* LEFT: spacer (reserved lane) */}
          <div />

          {/* CENTER: toggle */}
          <div className="flex justify-center">
            <ViewToggle />
          </div>

          {/* RIGHT: metric selector (Feed only) */}
          <div className="flex justify-end">
            {viewMode === "feed" ? metricControl : <div />}
          </div>
      </div>
      </div>
    </header>
  );
}




 
