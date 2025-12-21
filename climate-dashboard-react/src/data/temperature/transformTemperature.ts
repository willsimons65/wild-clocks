import type { TemperatureMonthData } from "./types";

type RawAggregates = {
  years: {
    [year: string]: {
      [month: string]: {
        avgMaxTemp: number;
        avgMinTemp: number;
        avgMeanTemp: number;
        days: number;
      };
    };
  };
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Transform raw aggregate data into UI-ready temperature data
 * for a specific month and selected year.
 */
export function transformTemperatureMonth(
  raw: RawAggregates,
  selectedYear: number,
  selectedMonth: number
): TemperatureMonthData {
  const byYear: TemperatureMonthData["byYear"] = [];

  // 1️⃣ Collect absolute values for this month across years
  for (const year of Object.keys(raw.years)) {
    const monthData = raw.years[year][selectedMonth];
    if (!monthData) continue;

    byYear.push({
      year: Number(year),
      avgMax: monthData.avgMaxTemp,
      avgMin: monthData.avgMinTemp,
    });
  }

  // 2️⃣ Sort descending by year
  byYear.sort((a, b) => b.year - a.year);

  // 3️⃣ Find baseline (selected year)
  const baseline = byYear.find(
    (row) => row.year === selectedYear
  );

  if (!baseline) {
    throw new Error(
      `No temperature data for ${selectedYear}-${selectedMonth}`
    );
  }

  // 4️⃣ Build meanDifference
  const meanDifference = byYear.map((row) => ({
    year: row.year,
    diffMax: round1(row.avgMax - baseline.avgMax),
    diffMin: round1(row.avgMin - baseline.avgMin),
  }));

  // 5️⃣ Summary (explicit, no recomputation)
  const summary = {
    avgMax: baseline.avgMax,
    avgMin: baseline.avgMin,
  };

  return {
    month: selectedMonth,
    year: selectedYear,
    summary,
    byYear,
    meanDifference,
  };
}
