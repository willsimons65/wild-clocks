// /components/insights/AnnualBaselineCard.jsx

import InfoTooltip from "@/components/ui/tooltip/InfoTooltip";
import { buildAnnualBaseline } from "@/data/insights/buildAnnualBaseline";
import { classifyBaselineValue } from "@/data/insights/classifyBaselineValue";

function getBaselineEmptyMessage(reason) {
  switch (reason) {
    case "no-rainfall-history":
      return "Rainfall data isn’t available for this location.";

    case "no-historical-baseline":
      return "There isn’t enough historical rainfall data to calculate a long-term average yet.";

    case "selected-year-missing":
      return "This year doesn’t have enough rainfall data yet to compare against the long-term average.";

    case "no-valid-years":
    default:
      return "Not enough rainfall data is available to calculate an annual baseline.";
  }
}

const ANNUAL_BASELINE_INFO = (
  <>
    <p className="mb-2">
      The <strong>annual baseline index</strong> is a long-term measure of how
      wet or dry a place is. It compares how much rain falls in a year with how
      much moisture the atmosphere would remove. Values below 1 indicate
      water-limited environments; values above 1 indicate persistent moisture
      surplus.
    </p>
  </>
);

export default function AnnualBaselineCard({ rainfallData }) {
  const result = buildAnnualBaseline(rainfallData);

  const classification = result.hasData
    ? classifyBaselineValue(result.median)
    : null;

  const Header = (
    <div className="flex items-start justify-between">
      <h2 className="text-sm font-medium opacity-80">Annual baseline index</h2>
      <InfoTooltip content={ANNUAL_BASELINE_INFO} />
    </div>
  );

  return (
    <div className="rounded-2xl bg-[#161616] p-6 space-y-4 relative">
      {Header}

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Classification label */}
        <p className="text-sm opacity-70">
          {result.hasData
            ? classification?.label
            : getBaselineEmptyMessage(result.reason)}
        </p>

        {/* Median index value */}
        <div className="text-4xl md:text-6xl font-medium tracking-tight">
          {!result.hasData ? "—" : result.median.toFixed(2)}
        </div>

        {/* Range across years */}
        {result.hasData && (
          <p className="text-xs opacity-80">
            Range across years: {result.min.toFixed(2)}–{result.max.toFixed(2)}
          </p>
        )}
      </div>

      {/* Description 
      {classification && (
        <p className="text-xs opacity-70">{classification.description}</p>
      )}*/}

      {/* Key section */}
      <div className="pt-4 mt-2 border-t border-white/10">
        <h3 className="text-text-base font-medium opacity-90">
          Key to baseline index
        </h3>

        <div className="mt-3 space-y-3 text-[13px] leading-snug">
          <div>
            <div className="font-medium">
              &lt; 0.60 — <span className="opacity-90">Water-limited</span>
            </div>
            <div className="text-white/55">
              Rainfall is consistently low relative to atmospheric demand.
            </div>
          </div>

          <div>
            <div className="font-medium">
              0.60–0.80 — <span className="opacity-90">Seasonally stressed</span>
            </div>
            <div className="text-white/55">
              Water is usually adequate, but summer moisture stress is common.
            </div>
          </div>

          <div>
            <div className="font-medium">
              0.80–1.00 — <span className="opacity-90">Balanced temperate</span>
            </div>
            <div className="text-white/55">
              Rainfall broadly matches atmospheric demand through most of the
              year.
            </div>
          </div>

          <div>
            <div className="font-medium">
              1.00–1.25 — <span className="opacity-90">Moist temperate</span>
            </div>
            <div className="text-white/55">
              Rainfall regularly exceeds atmospheric demand.
            </div>
          </div>

          <div>
            <div className="font-medium">
              &gt; 1.25 — <span className="opacity-90">Wet / perhumid</span>
            </div>
            <div className="text-white/55">
              Persistent moisture surplus throughout most years.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

