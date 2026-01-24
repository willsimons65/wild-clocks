// src/data/insights/buildWaterBalanceLite.ts

type WaterBalanceLiteInput = {
  rainfallTotal: number;
  meanTemperature: number;
} | null;

export function buildWaterBalanceLite(input: WaterBalanceLiteInput) {
  if (!input) {
    return {
      hasData: false,
      reason: "missing-inputs",
    };
  }

  const { rainfallTotal, meanTemperature } = input;

  if (
    !Number.isFinite(rainfallTotal) ||
    !Number.isFinite(meanTemperature)
  ) {
    return {
      hasData: false,
      reason: "invalid-inputs",
    };
  }

  // --- core calculation ---
  const expectedDemand = meanTemperature * 20;
  const balanceRatio = rainfallTotal / expectedDemand;

  let classification: "deficit" | "balanced" | "surplus";

  if (balanceRatio < 2.0) {
    classification = "deficit";
  } else if (balanceRatio > 3.8) {
    classification = "surplus";
  } else {
    classification = "balanced";
  }

  return {
    hasData: true,
    rainfallTotal,
    meanTemperature,
    expectedDemand,
    balanceRatio,
    classification,
  };
}
