import type { TemperatureMonthData } from "./types";

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function transformTemperatureMonth(
  raw: { years: Record<string, any> } | null | undefined,
  selectedYear: number,
  monthIndex: number
): TemperatureMonthData | null {

  if (!raw || !raw.years) {
    console.warn("transformTemperatureMonth: invalid raw data", raw);
    return null;
  }

  const selectedMonth = String(monthIndex + 1); // ✅ FIX

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

  const baseline =
    byYear.find((row) => row.year === selectedYear) ?? byYear[0];

  if (!baseline) {
    console.warn("transformTemperatureMonth: no temperature data at all");
    return null;
  }

  const summary = {
    avgMax: baseline.avgMax,
    avgMin: baseline.avgMin,
  };

  return {
    month: selectedMonth,
    year: selectedYear,
    summary,
    byYear,
    meanDifference: [],
  };
}

