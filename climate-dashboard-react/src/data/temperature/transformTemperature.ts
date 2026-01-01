// src/data/temperature/transformTemperature.ts

import type { TemperatureMonthData } from "./types";

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function transformTemperatureMonth(
  raw: { years: Record<string, any> } | null | undefined,
  selectedYear: number,
  monthIndex: number
): TemperatureMonthData & {
  hasData: boolean;
  hasSelectedYearData: boolean;
} {
  const selectedMonth = String(monthIndex + 1);

  // -------------------------------------------------
  // Invalid or missing source data
  // -------------------------------------------------
  if (!raw || !raw.years) {
    console.warn("transformTemperatureMonth: invalid raw data", raw);

    return {
      month: selectedMonth,
      year: selectedYear,
      summary: null,
      byYear: [],
      meanDifference: [],
      hasData: false,
      hasSelectedYearData: false,
    };
  }

  // -------------------------------------------------
  // Collect data for this month across all years
  // -------------------------------------------------
  const byYear: TemperatureMonthData["byYear"] = [];

  for (const year of Object.keys(raw.years)) {
    const monthData = raw.years[year]?.[selectedMonth];
    if (!monthData) continue;

    byYear.push({
      year: Number(year),
      avgMax: monthData.avgMaxTemp,
      avgMin: monthData.avgMinTemp,
    });
  }

  byYear.sort((a, b) => b.year - a.year);

  const hasData = byYear.length > 0;
  const hasSelectedYearData = byYear.some(
    (row) => row.year === selectedYear
  );

  // -------------------------------------------------
  // No data at all for this month (any year)
  // -------------------------------------------------
  if (!hasData) {
    return {
      month: selectedMonth,
      year: selectedYear,
      summary: null,
      byYear: [],
      meanDifference: [],
      hasData: false,
      hasSelectedYearData: false,
    };
  }

  // -------------------------------------------------
  // Summary — ONLY if selected year has data
  // -------------------------------------------------
  const baseline = byYear.find(
    (row) => row.year === selectedYear
  );

  const summary = baseline
    ? {
        avgMax: round1(baseline.avgMax),
        avgMin: round1(baseline.avgMin),
      }
    : null;

  return {
    month: selectedMonth,
    year: selectedYear,
    summary,
    byYear,
    meanDifference: [],
    hasData: true,
    hasSelectedYearData,
  };
}




