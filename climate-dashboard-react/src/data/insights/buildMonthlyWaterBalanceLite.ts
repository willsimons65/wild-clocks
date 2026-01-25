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

const K = 6; // same constant used elsewhere

export function buildMonthlyWaterBalanceLite(
  climateData: ClimateData | null,
  year: number
) {
  const yearData = climateData?.years?.[year];
  if (!yearData) return [];

  const result: { x: number; y: number }[] = [];

  for (let month = 1; month <= 12; month++) {
    const m = yearData[month];
    if (
      !m ||
      typeof m.totalRainfall !== "number" ||
      typeof m.avgMeanTemp !== "number"
    ) {
      continue;
    }

    const moistureLoss = m.avgMeanTemp * K;
    const balance = m.totalRainfall - moistureLoss;

    if (Number.isFinite(balance)) {
      result.push({
        x: month,   // ✅ correct key
        y: balance,
      });
    }
  }

  return result;
}

