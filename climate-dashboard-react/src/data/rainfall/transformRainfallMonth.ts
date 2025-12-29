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
): RainfallMonthResult {

  if (!Array.isArray(raw)) {
    console.warn("transformRainfallMonth: raw data missing or invalid", raw);
    return {
      summary: { monthTotalMm: 0, yearToDateMm: 0 },
      byYear: [],
    };
  }

  const cutoffIndex = MONTHS.indexOf(monthLabel);

  let monthTotalMm = 0;
  let yearToDateMm = 0;

  // ---- Summary (selected year only) ----
  for (const r of raw) {
    if (r.year !== year) continue;

    const rMonthIndex = MONTHS.indexOf(r.month);

    // Selected month total
    if (r.month === monthLabel) {
      monthTotalMm += r.precipitation;
    }

    // Year-to-date (Jan → selected month)
    if (rMonthIndex !== -1 && rMonthIndex <= cutoffIndex) {
      yearToDateMm += r.precipitation;
    }
  }

  // ---- Table (all years) ----
  const years = Array.from(new Set(raw.map(r => r.year)))
    .sort((a, b) => b - a);

  const byYear: RainfallYearRow[] = years.map((y) => {
    let monthTotalMm = 0;
    let yearTotalMm = 0;

    for (const r of raw) {
      if (r.year !== y) continue;

      const rMonthIndex = MONTHS.indexOf(r.month);

      // Month total for this year
      if (r.month === monthLabel) {
        monthTotalMm += r.precipitation;
      }

      // Year-to-date for this year
      if (rMonthIndex !== -1 && rMonthIndex <= cutoffIndex) {
        yearTotalMm += r.precipitation;
      }
    }

    return { year: y, monthTotalMm, yearTotalMm };
  });

  return {
    summary: { monthTotalMm, yearToDateMm },
    byYear,
  };
}

