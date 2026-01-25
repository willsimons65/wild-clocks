// src/data/insights/buildAnnualBaseline.ts

export type ClimateMonth = {
  totalRainfall: number; // mm
  avgMeanTemp: number;   // °C
};

export type ClimateYear = {
  [month: number]: ClimateMonth;
};

export type ClimateData = {
  years: {
    [year: number]: ClimateYear;
  };
};

// UK-lite moisture loss proxy.
// Interpreted as "mm demand per °C (annualised via mean temp)".
const BASELINE_K = 55;

export type AnnualBaselineEmptyReason =
  | "no-rainfall-history"
  | "no-valid-years";

export type AnnualBaselineResult =
  | {
      hasData: false;
      reason: AnnualBaselineEmptyReason;
    }
  | {
      hasData: true;
      median: number;
      min: number;
      max: number;
      yearsUsed: number;
      // optional but handy for debugging/transparency
      usedYears: number[];
    };

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function buildAnnualBaseline(
  climateData: ClimateData | null
): AnnualBaselineResult {
  if (!climateData?.years) {
    return { hasData: false, reason: "no-rainfall-history" };
  }

  const values: number[] = [];
  const usedYears: number[] = [];

  for (const yearKey of Object.keys(climateData.years)) {
    const year = Number(yearKey);
    const months = climateData.years[year];
    if (!months) continue;

    let rainfallTotal = 0;
    let tempSum = 0;
    let tempCount = 0;

    // Months are 1..12 in your climateData model
    for (const month of Object.values(months)) {
      if (
        typeof month?.totalRainfall !== "number" ||
        typeof month?.avgMeanTemp !== "number"
      ) {
        continue;
      }

      if (!Number.isFinite(month.totalRainfall) || !Number.isFinite(month.avgMeanTemp)) {
        continue;
      }

      // Optional guardrails:
      // (prevents weird negative rainfall or broken sensors from corrupting baseline)
      if (month.totalRainfall < 0) continue;

      rainfallTotal += month.totalRainfall;
      tempSum += month.avgMeanTemp;
      tempCount++;
    }

    // Require at least half a year of usable data (prevents partial years biasing baseline)
    if (tempCount < 6) continue;

    const meanTemp = tempSum / tempCount;

    // meanTemp should never be <=0 in the UK, but keep it defensive
    const denom = meanTemp * BASELINE_K;
    if (!Number.isFinite(denom) || denom <= 0) continue;

    const baseline = rainfallTotal / denom;

    if (Number.isFinite(baseline)) {
      values.push(baseline);
      usedYears.push(year);
    }
  }

  if (values.length === 0) {
    return { hasData: false, reason: "no-valid-years" };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const med = median(values);

  return {
    hasData: true,
    median: med,
    min,
    max,
    yearsUsed: values.length,
    usedYears,
  };
}

