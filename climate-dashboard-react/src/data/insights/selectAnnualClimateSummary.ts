// src/data/insights/selectAnnualClimateSummary.ts

type AnnualClimateSummary =
  | {
      hasData: true;
      rainfallTotal: number;
      meanTemperature: number;
      monthsUsed: number;
    }
  | {
      hasData: false;
      reason: string;
    };

const MIN_REQUIRED_MONTHS = 10;

export function selectAnnualClimateSummary(
  climateData: any,
  year: number
): AnnualClimateSummary {
  const yearData = climateData?.years?.[year];

  if (!yearData) {
    return { hasData: false, reason: "no-year-data" };
  }

  const months = Object.values(yearData);

  let rainfallSum = 0;
  let temperatureSum = 0;
  let validMonths = 0;

  for (const month of months) {
    const rainfall = month?.totalRainfall;
    const meanTemp = month?.avgMeanTemp;

    if (
      Number.isFinite(rainfall) &&
      Number.isFinite(meanTemp)
    ) {
      rainfallSum += rainfall;
      temperatureSum += meanTemp;
      validMonths += 1;
    }
  }

  if (validMonths < MIN_REQUIRED_MONTHS) {
    return {
      hasData: false,
      reason: "insufficient-months",
    };
  }

  return {
    hasData: true,
    rainfallTotal: rainfallSum,
    meanTemperature: temperatureSum / validMonths,
    monthsUsed: validMonths,
  };
}
