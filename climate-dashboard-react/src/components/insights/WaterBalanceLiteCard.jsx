import { useEffect, useState } from "react";

import { buildWaterBalanceLite } from "@/data/insights/buildWaterBalanceLite";
import { buildMonthlyWaterBalanceLite } from "@/data/insights/buildMonthlyWaterBalanceLite";
import { selectAnnualClimateSummary } from "@/data/insights/selectAnnualClimateSummary";

import InfoTooltip from "@/components/ui/tooltip/InfoTooltip";
import WaterBalanceLiteChart from "@/components/insights/WaterBalanceLiteChart";
import WaterBalanceCumulativeChart from "@/components/insights/WaterBalanceCumulativeChart";

function getWaterBalanceMessage(classification) {
  switch (classification) {
    case "deficit":
      return "Rainfall was low relative to moisture loss, suggesting drier conditions.";

    case "surplus":
      return "Rainfall exceeded moisture loss, suggesting wetter conditions.";

    case "balanced":
    default:
      return "Rainfall broadly kept pace with temperature-driven moisture loss, suggesting balanced conditions.";
  }
}

const WATER_BALANCE_LITE_INFO = (
  <>
    <p className="mb-2">
      The <strong>water-balance-lite index</strong> shows how wet or dry conditions are from month to month. 
It compares rainfall with temperature-driven moisture loss to indicate whether the landscape is gaining water (surplus) or losing water (deficit).
    </p>
  </>
);

export default function WaterBalanceLiteCard({ climateData, year }) {
  const [viewMode, setViewMode] = useState("monthly");
  const [displayedViewMode, setDisplayedViewMode] = useState("monthly");
  const [chartVisible, setChartVisible] = useState(true);

  useEffect(() => {
    if (viewMode === displayedViewMode) return;

    setChartVisible(false);

    const timeout = setTimeout(() => {
      setDisplayedViewMode(viewMode);
      setChartVisible(true);
    }, 140);

    return () => clearTimeout(timeout);
  }, [viewMode, displayedViewMode]);

  const summary = selectAnnualClimateSummary(climateData, year);

  const result = buildWaterBalanceLite(
    summary.hasData
      ? {
          rainfallTotal: summary.rainfallTotal,
          meanTemperature: summary.meanTemperature,
        }
      : null
  );

  const monthlySeries = buildMonthlyWaterBalanceLite(climateData, year);

  const cumulativeSeries = monthlySeries.map((d) => ({
    ...d,
    y: d.cumulativeBalance,
  }));

  return (
    <div className="rounded-2xl bg-[#161616] px-5 pt-4 pb-5">
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-full border border-white/15 bg-[#1E1E1E] p-1">
          <button
            type="button"
            onClick={() => setViewMode("monthly")}
            className={`rounded-full px-5 py-1 text-sm font-medium transition ${
              viewMode === "monthly"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setViewMode("yearToDate")}
            className={`rounded-full px-5 py-1 text-sm font-medium transition ${
              viewMode === "yearToDate"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Year-to-date
          </button>
        </div>
      </div>

      {result.hasData ? (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1 flex-1">
            <div className="text-3xl font-medium capitalize text-left leading-none">
              {result.classification}
            </div>

            <p className="text-sm opacity-70 text-left leading-snug whitespace-normal md:whitespace-nowrap">
              {getWaterBalanceMessage(result.classification)}
            </p>
          </div>

          <div className="shrink-0 pt-0.5">
            <InfoTooltip content={WATER_BALANCE_LITE_INFO} />
          </div>
        </div>
      ) : (
        <div className="flex justify-end mb-4">
          <InfoTooltip content={WATER_BALANCE_LITE_INFO} />
        </div>
      )}

      {monthlySeries.length > 0 ? (
        <div
          className={`transition-all duration-200 ${
            chartVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1"
          }`}
        >
          {displayedViewMode === "monthly" ? (
            <WaterBalanceLiteChart data={monthlySeries} year={year} />
          ) : (
            <WaterBalanceCumulativeChart data={cumulativeSeries} year={year} />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-white/70 text-center max-w-md leading-relaxed">
            This year’s water balance is still taking shape.
            The index is calculated month by month from rainfall and temperature,
            so the chart fills in gradually as the year progresses.
          </p>
        </div>
      )}
    </div>
  );
}