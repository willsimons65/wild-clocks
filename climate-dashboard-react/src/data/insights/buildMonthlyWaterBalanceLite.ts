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

const K = 6;

export function buildMonthlyWaterBalanceLite(
  climateData: ClimateData | null,
  year: number
) {
  const yearData = climateData?.years?.[year];
  if (!yearData) return [];

  const result: {
    x: number;
    y: number;
    rainfall: number;
    petLite: number;
    monthlyBalance: number;
    cumulativeBalance: number;
  }[] = [];

  let runningTotal = 0;

  for (let month = 1; month <= 12; month++) {
    const m = yearData[month];

    if (
      !m ||
      typeof m.totalRainfall !== "number" ||
      typeof m.avgMeanTemp !== "number"
    ) {
      break;
    }

    const petLite = m.avgMeanTemp * K;
    const monthlyBalance = m.totalRainfall - petLite;

    if (!Number.isFinite(monthlyBalance)) break;

    runningTotal += monthlyBalance;

    result.push({
      x: month,
      y: monthlyBalance, // keep backward compatibility
      rainfall: m.totalRainfall,
      petLite,
      monthlyBalance,
      cumulativeBalance: runningTotal,
    });
  }

  return result;
}