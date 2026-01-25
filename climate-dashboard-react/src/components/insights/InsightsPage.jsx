// src/components/insights/InsightsPage.jsx

import { useState } from "react";
import Header from "@/components/layout/Header";

import MonthlySummaries from "./MonthlySummaries";
import InsightsDivider from "./InsightsDivider";
import MonthComparisonHeader from "./MonthComparisonHeader";
import IndexesSection from "./IndexesSection";

import TemperatureComparisonTable from "@/components/insights/TemperatureComparisonTable";
import RainfallComparisonTable from "@/components/insights/RainfallComparisonTable";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function slugToTitle(slug) {
  return String(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function InsightsPage({
  place,
  year,
  setYear,
  climateData,
}) {
  // Header needs this even though Insights disables it
  const [metric, setMetric] = useState("temperature");

  // Month selection (single source of truth)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const selectedMonthLabel = MONTHS[selectedMonthIndex];

  const selectedMonthData =
  climateData?.years?.[year]?.[selectedMonthIndex + 1] ?? null;

  // Temperature
const avgMaxTemp = selectedMonthData?.avgMaxTemp ?? null;
const avgMinTemp = selectedMonthData?.avgMinTemp ?? null;

// Rainfall
const monthRainfall = selectedMonthData?.totalRainfall ?? null;

// Year-to-date rainfall
const ytdRainfall = Object.values(
  climateData?.years?.[year] ?? {}
)
  .slice(0, selectedMonthIndex + 1)
  .reduce((sum, m) => {
    return Number.isFinite(m?.totalRainfall)
      ? sum + m.totalRainfall
      : sum;
  }, 0);

  // ---- Temperature rows ----
  const tempRows = Object.entries(climateData?.years ?? {})
    .map(([y, months]) => {
      const yearNum = Number(y);
      if (yearNum === year) return null;

      const month = months[selectedMonthIndex + 1]; // 1–12

      if (
        !Number.isFinite(month?.avgMaxTemp) ||
        !Number.isFinite(month?.avgMinTemp)
      ) {
        return null;
      }

      return {
        year: yearNum,
        avgMax: month.avgMaxTemp,
        avgMin: month.avgMinTemp,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.year - a.year);

  // ---- Rainfall rows ----
  const rainRows = Object.entries(climateData?.years ?? {})
    .map(([y, months]) => {
      const yearNum = Number(y);
      if (yearNum === year) return null;

      const month = months[selectedMonthIndex + 1];

      if (!Number.isFinite(month?.totalRainfall)) return null;

      return {
        year: yearNum,
        total: month.totalRainfall,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.year - a.year);

    const placeLabel = slugToTitle(place);

  return (
    <>
      <Header
        placeName={placeLabel}
        year={year}
        setYear={setYear}
        metric={metric}
        setMetric={setMetric}
      />

<main className="max-w-[1200px] mx-auto px-4 py-6">
  {/* Grouped month-comparison section */}
  <section className="space-y-6">
    <MonthComparisonHeader
      monthLabel={selectedMonthLabel}
      year={year}
      monthIndex={selectedMonthIndex}
      onMonthChange={setSelectedMonthIndex}
    />

    {/* Top 2 summary cards */}
    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
      {/* =====================
          TEMPERATURE COLUMN
        ===================== */}
      <div className="space-y-6">
        {/* Temperature summary */}
        <div className="rounded-2xl bg-[#161616] border border-white/10 p-4 space-y-3">
          <h4 className="text-sm font-medium text-white/80">
            Average temperature for {selectedMonthLabel}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-white/50">Average max</div>
              <div className="text-3xl font-semibold text-pink-400">
                {avgMaxTemp != null ? `${avgMaxTemp.toFixed(1)}°C` : "—"}
              </div>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-white/50">Average min</div>
              <div className="text-3xl font-semibold text-blue-400">
                {avgMinTemp != null ? `${avgMinTemp.toFixed(1)}°C` : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Temperature comparison */}
        <TemperatureComparisonTable
          monthLabel={selectedMonthLabel}
          rows={tempRows}
        />
      </div>

      {/* =====================
          RAINFALL COLUMN
        ===================== */}
      <div className="space-y-6">
        {/* Rainfall summary */}
        <div className="rounded-2xl bg-[#161616] border border-white/10 p-4 space-y-3">
          <h4 className="text-sm font-medium text-white/80">
            Total rainfall for {selectedMonthLabel}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-white/50">For the month</div>
              <div className="text-3xl font-semibold text-blue-400">
                {monthRainfall != null ? `${monthRainfall}mm` : "—"}
              </div>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <div className="text-xs text-white/50">
                Year to {selectedMonthLabel}
              </div>
              <div className="text-3xl font-semibold text-teal-400">
                {Number.isFinite(ytdRainfall) ? `${ytdRainfall}mm` : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Rainfall comparison */}
        <RainfallComparisonTable
          monthLabel={selectedMonthLabel}
          rows={rainRows}
        />
      </div>
    </div>
  </section>

  {/* Divider spacing (tight + adjustable) */}
  <div className="my-6">
    <InsightsDivider />
  </div>

  {/* Climate indexes */}
  <div className="space-y-4">
    <IndexesSection climateData={climateData} year={year} />
  </div>
</main>


    </>
  );
}


