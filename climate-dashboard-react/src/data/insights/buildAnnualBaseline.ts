// src/data/insights/buildAnnualBaseline.ts

type ClimateMonth = {
  totalRainfall: number;
  avgMeanTemp: number;
};

type ClimateYear = {
  [month: number]: ClimateMonth;
};

type ClimateData = {
  years: {
    [year: number]: ClimateYear;
  };
};

const BASELINE_K = 50; // UK-lite moisture loss proxy

export function buildAnnualBaseline(climateData: ClimateData | null) {
  if (!climateData?.years) {
    return { hasData: false, reason: "no-rainfall-history" };
  }

  const values: number[] = [];

  for (const year of Object.keys(climateData.years)) {
    const months = climateData.years[Number(year)];
    if (!months) continue;

    let rainfallTotal = 0;
    let tempSum = 0;
    let tempCount = 0;

    for (const month of Object.values(months)) {
      if (
        typeof month.totalRainfall !== "number" ||
        typeof month.avgMeanTemp !== "number"
      ) {
        continue;
      }

      rainfallTotal += month.totalRainfall;
      tempSum += month.avgMeanTemp;
      tempCount++;
    }

    // Require at least half a year of data
    if (tempCount < 6) continue;

    const meanTemp = tempSum / tempCount;
    const baseline = rainfallTotal / (meanTemp * BASELINE_K);

    if (Number.isFinite(baseline)) {
      values.push(baseline);
    }
  }

  if (values.length === 0) {
    return { hasData: false, reason: "no-valid-years" };
  }

  return {
    hasData: true,
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
