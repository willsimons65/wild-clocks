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
): RainfallMonthResult & { hasData: boolean } {

  if (!Array.isArray(raw)) {
    console.warn("transformRainfallMonth: raw data missing or invalid", raw);
    return {
      summary: null,
      byYear: [],
      hasData: false,
    };
  }

  const cutoffIndex = MONTHS.indexOf(monthLabel);

  // -----------------------------
  // Rows for selected year/month
  // -----------------------------
  const rowsForMonth = raw.filter(
    (r) => r.year === year && r.month === monthLabel
  );

  const hasData = rowsForMonth.length > 0;

  // -----------------------------
  // If no data, return early
  // -----------------------------
  if (!hasData) {
    return {
      summary: null,
      byYear: [],
      hasData: false,
    };
  }

  // -----------------------------
  // Summary (selected year)
  // -----------------------------
  let monthTotalMm = 0;
  let yearToDateMm = 0;

  for (const r of raw) {
    if (r.year !== year) continue;

    const rMonthIndex = MONTHS.indexOf(r.month);
    if (rMonthIndex === -1) continue;

    // Selected month total
    if (r.month === monthLabel) {
      monthTotalMm += r.precipitation;
    }

    // Year-to-date (Jan → selected month)
    if (rMonthIndex <= cutoffIndex) {
      yearToDateMm += r.precipitation;
    }
  }

  // -----------------------------
  // Table (all years with data)
  // -----------------------------
  const years = Array.from(
    new Set(raw.map((r) => r.year))
  ).sort((a, b) => b - a);

  const byYear: RainfallYearRow[] = years.map((y) => {
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

  return {
    summary: { monthTotalMm, yearToDateMm },
    byYear,
    hasData: true,
  };
}


