export const RAINFALL_STATE_ORDER = [
  "severe_drought",
  "below_average",
  "balanced",
  "wet",
  "excessive_rain",
];

export const RAINFALL_STATE_META = {
  severe_drought: {
    label: "Severe spring drought",
    shortLabel: "Severe spring\ndrought",
  },
  below_average: {
    label: "Below-average rainfall",
    shortLabel: "Below-average\nrainfall",
  },
  balanced: {
    label: "Typical / balanced year",
    shortLabel: "Typical / balanced\nyear",
  },
  wet: {
    label: "Wet spring",
    shortLabel: "Wet spring",
  },
  excessive_rain: {
    label: "Persistent / excessive rain",
    shortLabel: "Persistent /\nexcessive rain",
  },
};

export const RAINFALL_MONTHS = [
  { key: 3, label: "Mar" },
  { key: 4, label: "Apr" },
  { key: 5, label: "May" },
  { key: 6, label: "Jun" },
  { key: 7, label: "Jul" },
];

export const RAINFALL_STATE_SERIES = {
  severe_drought: {
    3: 34.5,
    4: 50.5,
    5: 98.5,
    6: 140.5,
    7: 158,
  },
  below_average: {
    3: 35,
    4: 65,
    5: 96,
    6: 169,
    7: 229,
  },
  balanced: {
    3: 42.5,
    4: 116,
    5: 181.5,
    6: 220,
    7: 264,
  },
  wet: {
    3: 57.5,
    4: 110,
    5: 183.5,
    6: 213.5,
    7: 289,
  },
  excessive_rain: {
    3: 74,
    4: 140,
    5: 220,
    6: 304,
    7: 391,
  },
};

export const RAINFALL_DIAGRAM_COPY = {
  title: "Five recurring spring conditions",
  intro:
    "Each state shows how rainfall typically accumulates between March and July.",
  caption:
    "Median cumulative rainfall by month, March–July. Each state represents a different part of the Appleton Woods record, from severe spring drought to persistently wet seasons.",
};