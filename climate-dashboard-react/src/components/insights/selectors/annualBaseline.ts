export function deriveAnnualBaseline({
  climateData,
  year,
}: {
  climateData: any;
  year: number;
}) {
  const rainfallByYear = climateData?.rainfall?.byYear;

  if (!rainfallByYear) {
    return {
      hasData: false,
      reason: "no-rainfall-history",
    };
  }

  const allYears = Object.entries(rainfallByYear)
    .map(([yr, data]) => ({
      year: Number(yr),
      total: Number(data?.total),
    }))
    .filter((row) => Number.isFinite(row.total));

  if (allYears.length === 0) {
    return {
      hasData: false,
      reason: "no-valid-years",
    };
  }

  const selected = allYears.find((r) => r.year === year);
  if (!selected) {
    return {
      hasData: false,
      reason: "selected-year-missing",
    };
  }

  const historicalYears = allYears.filter((r) => r.year !== year);
  if (historicalYears.length === 0) {
    return {
      hasData: false,
      reason: "no-historical-baseline",
    };
  }

  const longTermMean =
    historicalYears.reduce((sum, r) => sum + r.total, 0) /
    historicalYears.length;

  return {
    hasData: true,
    year,
    baselineRatio: selected.total / longTermMean,
    selectedTotal: selected.total,
    longTermMean,
    yearsUsed: historicalYears.length,
  };
}
