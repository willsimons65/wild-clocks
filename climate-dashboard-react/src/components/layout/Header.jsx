// src/components/layout/Header.jsx

import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const viewMode = location.pathname === "/insights" ? "insights" : "feed";

  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  const years = [{ year: 2024 }, { year: 2025 }, { year: 2026 }];

  // ✅ DEFINE ONCE — BEFORE RETURN
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
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between relative">

        {/* CENTER VIEW TOGGLE (desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <ViewToggle />
        </div>

        {/* LEFT */}
        <div className="flex items-center gap-3 relative">
          <button onClick={handleBack} className="header-btn">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-1">
            {placeName}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  mobileOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </h1>

          {/* MOBILE YEAR DROPDOWN */}
          {mobileOpen && (
            <div className="absolute top-12 left-10 w-32 bg-[#2A2A2A] border border-white/10 rounded-xl shadow-xl md:hidden">
              {years.map(({ year: y }) => (
                <button
                  key={y}
                  className={`w-full text-left px-4 py-2 text-white
                    hover:bg-white/10
                    ${y === year ? "bg-white/10" : ""}
                  `}
                  onClick={() => {
                    setYear(y);
                    setMobileOpen(false);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT (desktop only) */}
        <div className="hidden md:flex items-center gap-3">
          <YearSelector
            years={years}
            selectedYear={year}
            onYearChange={setYear}
          />

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
    </header>
  );
}





 
