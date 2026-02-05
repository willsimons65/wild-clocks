// src/components/insights/InsightsPage.jsx

import { useState } from "react";
import Header from "@/components/layout/Header";

import MonthComparisonHeader from "./MonthComparisonHeader";
import IndexesSection from "./IndexesSection";
import TemperatureComparisonTable from "@/components/insights/TemperatureComparisonTable";
import RainfallComparisonTable from "@/components/insights/RainfallComparisonTable";

import CompareToggle from "@/components/ui/CompareToggle"; // new toggle
import InsightsIntro from "./InsightsIntro"; // small intro block

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
  // Header still expects this
  const [metric, setMetric] = useState("temperature");

  // Month selection
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const selectedMonthLabel = MONTHS[selectedMonthIndex];

  const selectedMonthData =
    climateData?.years?.[year]?.[selectedMonthIndex + 1] ?? null;

  // ===============================
  // MONTH METRICS
  // ===============================
  const avgMaxTemp = selectedMonthData?.avgMaxTemp ?? null;
  const avgMinTemp = selectedMonthData?.avgMinTemp ?? null;
  const monthRainfall = selectedMonthData?.totalRainfall ?? null;

  const ytdRainfall = Object.values(
    climateData?.years?.[year] ?? {}
  )
    .slice(0, selectedMonthIndex + 1)
    .reduce((sum, m) => {
      return Number.isFinite(m?.totalRainfall)
        ? sum + m.totalRainfall
        : sum;
    }, 0);

  // ===============================
  // YEAR AVERAGES (LEFT COLUMN TOP)
  // ===============================
  const yearMonths = climateData?.years?.[year] ?? {};

  const yearTemps = Object.values(yearMonths).filter(m =>
    Number.isFinite(m?.avgMeanTemp)
  );

  const meanYearTemp =
    yearTemps.length > 0
      ? yearTemps.reduce((sum, m) => sum + m.avgMeanTemp, 0) / yearTemps.length
      : null;

  const totalYearRainfall = Object.values(yearMonths).reduce((sum, m) => {
    return Number.isFinite(m?.totalRainfall) ? sum + m.totalRainfall : sum;
  }, 0);

  // ===============================
  // HISTORICAL TABLE ROWS
  // ===============================

  const tempRows = Object.entries(climateData?.years ?? {})
    .map(([y, months]) => {
      const yearNum = Number(y);
      if (yearNum === year) return null;

      const month = months[selectedMonthIndex + 1];

      if (
        !Number.isFinite(month?.avgMaxTemp) ||
        !Number.isFinite(month?.avgMinTemp)
      ) return null;

      return {
        year: yearNum,
        avgMax: month.avgMaxTemp,
        avgMin: month.avgMinTemp,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.year - a.year);

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

      <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">

        {/* ===============================
            INTRO PANEL
        =============================== */}
        <InsightsIntro />

        {/* ===============================
            1/3 + 2/3 LAYOUT
        =============================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =========================================================
              LEFT COLUMN (1/3)
          ========================================================= */}
          <div className="lg:col-span-1 space-y-6">

            {/* ===== YEAR AVERAGES ===== */}
            <div className="rounded-2xl bg-[#161616] border border-white/10 p-4 space-y-3">
              <h4 className="text-sm font-medium text-white/80">
                Mean temperature and total rainfall for the year
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/50">Mean temperature</div>
                  <div className="text-3xl font-semibold text-pink-400">
                    {meanYearTemp != null
                      ? `${meanYearTemp.toFixed(1)}°C`
                      : "—"}
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs text-white/50">Total rainfall</div>
                  <div className="text-3xl font-semibold text-blue-400">
                    {Number.isFinite(totalYearRainfall)
                      ? `${totalYearRainfall}mm`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== MONTH HEADER ===== */}
            <MonthComparisonHeader
              monthLabel={selectedMonthLabel}
              year={year}
              monthIndex={selectedMonthIndex}
              onMonthChange={setSelectedMonthIndex}
            />

            {/* ===== MONTH TEMP ===== */}
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

            {/* ===== COMPARISON TOGGLES ===== */}

            <CompareToggle title={`Compare the historical average for ${selectedMonthLabel}`}>
              <TemperatureComparisonTable
                monthLabel={selectedMonthLabel}
                rows={tempRows}
              />
            </CompareToggle>

            {/* ===== MONTH RAIN ===== */}
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
                    {Number.isFinite(ytdRainfall)
                      ? `${ytdRainfall}mm`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== COMPARISON TOGGLES ===== */}

            <CompareToggle title={`Compare the historical total for ${selectedMonthLabel}`}>
              <RainfallComparisonTable
                monthLabel={selectedMonthLabel}
                rows={rainRows}
              />
            </CompareToggle>

          </div>

          {/* =========================================================
              RIGHT COLUMN (2/3)
          ========================================================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* Water balance index only */}
            <IndexesSection
              climateData={climateData}
              year={year}
              hideBaseline // optional prop if you want to disable baseline cleanly
            />

          </div>
        </div>
      </main>
    </>
  );
}


