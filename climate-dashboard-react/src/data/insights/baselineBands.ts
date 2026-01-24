// /data/insights/baselineBands.ts

export const BASELINE_BANDS = [
  {
    min: -Infinity,
    max: 0.6,
    label: "Water-limited",
    description: "Water is persistently limited relative to atmospheric demand.",
  },
  {
    min: 0.6,
    max: 0.8,
    label: "Seasonally stressed",
    description:
      "Water is usually adequate, but summer moisture stress is common.",
  },
  {
    min: 0.8,
    max: 1.0,
    label: "Balanced temperate",
    description:
      "Rainfall broadly matches atmospheric demand through most of the year.",
  },
  {
    min: 1.0,
    max: 1.25,
    label: "Moist temperate",
    description:
      "Rainfall regularly exceeds atmospheric demand.",
  },
  {
    min: 1.25,
    max: Infinity,
    label: "Wet / perhumid",
    description:
      "Persistent moisture surplus throughout most years.",
  },
];
