export const metricAvailabilityByPlace = {
  "thousand-year-trust": {
    temperature: false,
    rainfall: true,
    humidity: false,
    photoperiod: false,
    microclimate: true,
  },

  "appleton-woods": {
    temperature: true,
    rainfall: true,
    humidity: true,
    photoperiod: true,
    microclimate: false,
  },

  "little-knepp": {
    temperature: true,
    rainfall: true,
    humidity: true,
    photoperiod: true,
    microclimate: false,
  },
};

export function isMetricAvailable(place, metric) {
  return Boolean(metricAvailabilityByPlace?.[place]?.[metric]);
}

export function getDefaultMetricForPlace(place) {
  if (place === "thousand-year-trust") return "microclimate";
  return "temperature";
}