export const cabillaFutureHeatStress = {
  period: {
    id: "2071-2080",
    label: "2071–2080",
  },

  scenario: {
    id: "rcp85",
    label: "High-emissions pathway",
  },

  source: {
    dataset: "UKCP18 Local projections",
    resolution: "5 km",
    ensembleMembers: 16,
    statistic: "Median and 10th–90th percentile range",
  },

  thresholds: [
    {
      key: "warmDay",
      label: "Warm day",
      range: ">25°C",
      median: 39.7,
      lower: 17.62,
      upper: 54.9,
    },
    {
      key: "heatStress",
      label: "Heat stress",
      range: ">28°C",
      median: 17.79,
      lower: 7,
      upper: 29.5,
    },
    {
      key: "highHeatStress",
      label: "High heat stress",
      range: ">30°C",
      median: 10.09,
      lower: 4.03,
      upper: 17.89,
    },
    {
      key: "extremeHeat",
      label: "Extreme heat",
      range: ">32°C",
      median: 5.22,
      lower: 1.92,
      upper: 10.14,
    },
  ],
};