/// /components/insights/WaterBalanceLiteCard.jsx

import { buildWaterBalanceLite } from "@/data/insights/buildWaterBalanceLite";
import { buildMonthlyWaterBalanceLite } from "@/data/insights/buildMonthlyWaterBalanceLite";
import { selectAnnualClimateSummary } from "@/data/insights/selectAnnualClimateSummary";

import InfoTooltip from "@/components/ui/tooltip/InfoTooltip";
import WaterBalanceLiteChart from "@/components/insights/WaterBalanceLiteChart";

function getWaterBalanceMessage(classification) {
  switch (classification) {
    case "deficit":
      return "Rainfall was low relative to warmth, suggesting drier conditions.";

    case "surplus":
      return "Rainfall was high relative to warmth, suggesting wetter conditions.";

    case "balanced":
    default:
      return "Rainfall broadly kept pace with temperature, suggesting balanced conditions.";
  }
}

const WATER_BALANCE_LITE_INFO = (
  <>
    <p className="mb-2">
      The <strong>water-balance-lite index</strong> shows how wet or dry each
      month feels in ecological terms. It compares rainfall with temperature-driven moisture loss to indicate
      whether a month is in surplus (more water entering the system) or deficit
      (more water being lost).
    </p>
  </>
);

export default function WaterBalanceLiteCard({ climateData, year }) {
  const summary = selectAnnualClimateSummary(climateData, year);

  const result = buildWaterBalanceLite(
    summary.hasData
      ? {
          rainfallTotal: summary.rainfallTotal,
          meanTemperature: summary.meanTemperature,
        }
      : null
  );

  const monthlyData = buildMonthlyWaterBalanceLite(climateData, year);

  return (
    <div className="rounded-2xl bg-[#161616] p-5 space-y-4">
      {result.hasData ? (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-3xl font-medium capitalize text-left leading-none">
              {result.classification}
            </div>

            <p className="text-sm opacity-70 text-left max-w-xl leading-snug">
              {getWaterBalanceMessage(result.classification)}
            </p>
          </div>

          <div className="shrink-0 pt-0.5">
            <InfoTooltip content={WATER_BALANCE_LITE_INFO} />
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="text-3xl font-medium text-left leading-none">—</div>
          <div className="shrink-0 pt-0.5">
            <InfoTooltip content={WATER_BALANCE_LITE_INFO} />
          </div>
        </div>
      )}

      {monthlyData.length > 0 ? (
        <WaterBalanceLiteChart data={monthlyData} year={year} />
      ) : (
        <p className="text-sm opacity-70">
          Monthly water-balance data is not available yet.
        </p>
      )}
    </div>
  );
}
