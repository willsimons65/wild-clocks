export type TemperatureMonthData = {
  month: number; // 1–12
  year: number;  // selected year

  summary: {
    avgMax: number;
    avgMin: number;
  };

  byYear: Array<{
    year: number;
    avgMax: number;
    avgMin: number;
  }>;

  meanDifference: Array<{
    year: number;
    diffMax: number;
    diffMin: number;
  }>;
};
