export type RawRainfallRow = {
  year: number;
  month: string; // 0–11
  precipitation: number;
};

export type RainfallMonthSummary = {
  monthTotalMm: number;
  yearToDateMm: number;
};

export type RainfallYearRow = {
  year: number;
  monthTotalMm: number;
  yearTotalMm: number;
};

export type RainfallMonthResult = {
  summary: RainfallMonthSummary;
  byYear: RainfallYearRow[];
};
