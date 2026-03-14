// src/components/layout/Header.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PlaceSelector from "@/components/ui/PlaceSelector";
import YearSelector from "@/components/ui/YearSelector";
import MetricSelector from "@/components/ui/MetricSelector";
import InfoTooltip from "@/components/ui/tooltip/InfoTooltip";
import ViewToggle from "@/components/layout/ViewToggle";
import NavPill from "@/components/ui/NavPill";
import { PLACES } from "@/constants/places";

export default function Header({
  place,
  setPlace,
  year,
  setYear,
  metric,
  setMetric,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const viewMode = location.pathname === "/insights" ? "insights" : "feed";

  const SHOW_VIEW_TOGGLE = false;

function handleBack() {
  const pathname = location.pathname;

  const isPlacePage = PLACES.some(
    (p) => pathname === `/${p.slug}`
  );

  const isInsights = pathname === "/insights";

  if (isPlacePage || isInsights) {
    navigate("/");
    return;
  }

  navigate(-1);
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
          {/* Desktop centered view toggle stays*/}
          {SHOW_VIEW_TOGGLE && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <ViewToggle />
          </div>)}

          {/* LEFT: back + place */}
          <div className="flex items-center gap-3 min-w-0">
            <NavPill onClick={handleBack} ariaLabel="Back" variant="icon">
              <ArrowLeft className="w-5 h-5" />
            </NavPill>

            <div className="flex items-center justify-center">
            <PlaceSelector 
              place={place} 
              setPlace={setPlace} 
              className="mx-auto" />
            </div>
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
<div className="pb-4 md:hidden grid grid-cols-[1fr_auto_1fr] items-center">
  {/* LEFT: spacer */}
  <div />

  {/* CENTER: toggle or empty placeholder */}
  <div className="flex justify-center">
    {SHOW_VIEW_TOGGLE ? <ViewToggle /> : null}
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




 
