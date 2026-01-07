// src/data/rainfall/transformRainfallMonth.ts

import {
  RawRainfallRow,
  RainfallMonthResult,
  RainfallYearRow,
} from "./types";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function transformRainfallMonth(
  raw: RawRainfallRow[],
  year: number,
  monthLabel: string
): RainfallMonthResult & {
  hasSelectedYearData: boolean;
  hasHistoricalData: boolean;
} {
  if (!Array.isArray(raw)) {
    console.warn("transformRainfallMonth: raw data missing or invalid", raw);
    return {
      summary: null,
      byYear: [],
      hasSelectedYearData: false,
      hasHistoricalData: false,
    };
  }

  const cutoffIndex = MONTHS.indexOf(monthLabel);
  if (cutoffIndex === -1) {
    console.warn("transformRainfallMonth: invalid monthLabel", monthLabel);
  }

  // -----------------------------
  // Selected-year data check
  // -----------------------------
  const rowsForMonth = raw.filter(
    (r) => r.year === year && r.month === monthLabel
  );

  const hasSelectedYearData = rowsForMonth.length > 0;

  // -----------------------------
  // Summary (selected year)
  // -----------------------------
  let monthTotalMm = 0;
  let yearToDateMm = 0;

  if (hasSelectedYearData) {
    for (const r of raw) {
      if (r.year !== year) continue;

      const rMonthIndex = MONTHS.indexOf(r.month);
      if (rMonthIndex === -1) continue;

      if (r.month === monthLabel) {
        monthTotalMm += r.precipitation;
      }

      if (rMonthIndex <= cutoffIndex) {
        yearToDateMm += r.precipitation;
      }
    }
  }

  // -----------------------------
// Table (ALL years except selected)
// -----------------------------
const byYear: RainfallYearRow[] = Array.from(
  new Set(raw.map(r => r.year))
)
  .filter(y => y !== year) // ✅ remove selected year
  .sort((a, b) => b - a)
  .map((y) => {
    let monthTotalMm = 0;
    let yearTotalMm = 0;

    for (const r of raw) {
      if (r.year !== y) continue;

      const rMonthIndex = MONTHS.indexOf(r.month);
      if (rMonthIndex === -1) continue;

      if (r.month === monthLabel) {
        monthTotalMm += r.precipitation;
      }

      if (rMonthIndex <= cutoffIndex) {
        yearTotalMm += r.precipitation;
      }
    }

    return { year: y, monthTotalMm, yearTotalMm };
  });

  const yearsWithMonthData = Array.from(
    new Set(
      raw
        .filter((r) => r.month === monthLabel)
        .map((r) => r.year)
    )
  );

  const hasHistoricalData = yearsWithMonthData.length > 1;

  return {
    summary: hasSelectedYearData
      ? { monthTotalMm, yearToDateMm }
      : null,
    byYear,
    hasSelectedYearData,
    hasHistoricalData,
  };
}




