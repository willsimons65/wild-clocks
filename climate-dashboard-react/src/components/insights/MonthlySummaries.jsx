// src/components/insights/MonthlySummaries.jsx

import { MONTH_NAMES } from "@/constants/months";
import TemperatureSummary from "@/components/insights/TemperatureSummary";
import RainfallSummary from "@/components/insights/RainfallSummary";

const SHOW_MONTHLY_SUMMARY_CARDS = false;

export default function MonthlySummaries({ climateData, year, monthIndex }) {
  const monthData = climateData?.years?.[year]?.[monthIndex + 1];

  if (!monthData) {
    return (
      <div className="rounded-2xl bg-[#161616] p-6 text-sm text-white/50">
        No data available for this month.
      </div>
    );
  }

  const { avgMeanTemp, totalRainfall, days } = monthData;

  // keep plumbing alive even when cards are hidden
  void avgMeanTemp;
  void totalRainfall;
  void days;

  if (!SHOW_MONTHLY_SUMMARY_CARDS) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TemperatureSummary
        avgMeanTemp={avgMeanTemp}
        days={days}
        monthLabel={MONTH_NAMES[monthIndex]}
        year={year}
      />

      <RainfallSummary
        totalRainfall={totalRainfall}
        days={days}
        monthLabel={MONTH_NAMES[monthIndex]}
        year={year}
      />
    </div>
  );
}




