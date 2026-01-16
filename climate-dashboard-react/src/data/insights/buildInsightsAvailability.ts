// src/data/insights/buildInsightsAvailability.ts

export function buildInsightsAvailability({
  monthRows,
  yearRows,
}) {
  // Does the selected year have any data at all?
  const hasSelectedYearData =
    Array.isArray(yearRows) && yearRows.length > 0;

  // Month-level
  const hasSelectedMonthData =
    Array.isArray(monthRows) && monthRows.length > 0;

  const isSelectedMonthComplete =
    hasSelectedMonthData && monthRows.length >= 28;

  let monthStatus = "no-data";
  if (hasSelectedMonthData && !isSelectedMonthComplete) {
    monthStatus = "incomplete";
  }
  if (isSelectedMonthComplete) {
    monthStatus = "complete";
  }

  return {
    hasSelectedYearData,
    hasSelectedMonthData,
    isSelectedMonthComplete,
    monthStatus,
  };
}
