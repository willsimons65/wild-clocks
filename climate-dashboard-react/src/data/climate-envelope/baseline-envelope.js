// src/data/climate-envelope/baseline-envelope.js

export const baselineEnvelope = {
  peakGDD: 2100,
  peakMoistureDeficit: -2100,

  chartData: [
    { month: "Jan", gdd: 100, moisture: -50 },
    { month: "Feb", gdd: 300, moisture: -150 },
    { month: "Mar", gdd: 600, moisture: -400 },
    { month: "Apr", gdd: 900, moisture: -800 },
    { month: "May", gdd: 1300, moisture: -1200 },
    { month: "Jun", gdd: 1700, moisture: -1700 },
    { month: "Jul", gdd: 2100, moisture: -2100 },
    { month: "Aug", gdd: 1900, moisture: -1900 },
    { month: "Sep", gdd: 1400, moisture: -1300 },
    { month: "Oct", gdd: 800, moisture: -700 },
    { month: "Nov", gdd: 400, moisture: -300 },
    { month: "Dec", gdd: 150, moisture: -100 },
  ],
};