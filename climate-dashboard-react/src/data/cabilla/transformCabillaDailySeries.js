
export function getCabillaDailySeries(
  dailyData,
  year,
  month,
  metric,
  location = "outside",
  ecowittData = null
) {
  const ecowittMonth =
    ecowittData?.years?.[String(year)]?.[String(month)];

  const dataHogMonth =
    dailyData?.years?.[String(year)]?.[String(month)];

  const useEcowitt = Boolean(ecowittMonth);
  const monthData = useEcowitt
    ? ecowittMonth
    : dataHogMonth;

  if (!monthData) return [];

  return Object.values(monthData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => {
      const observations = useEcowitt
        ? day[location]
        : day;

      if (!observations) return null;

      const value = useEcowitt
        ? getEcowittMetricValue(observations, metric)
        : getMetricValue(observations, metric);

      return {
        date: day.date,
        day: Number(day.date.slice(8, 10)),
        value,
        maxTemp: useEcowitt
          ? observations.maxTemp
          : day.maxTemp,
        minTemp: useEcowitt
          ? observations.minTemp
          : day.minTemp,
        readings: useEcowitt
          ? observations.observations
          : day.readings,
      };
    })
    .filter(
      (d) =>
        d !== null &&
        d.value !== null &&
        d.value !== undefined
    );
}

// Existing DataHog fields
function getMetricValue(day, metric) {
  switch (metric) {
    case "temperature":
      return day.avgMeanTemp;

    case "temperatureMax":
      return day.maxTemp;

    case "temperatureMin":
      return day.minTemp;

    case "humidity":
      return day.avgHumidity;

    case "radiation":
      return day.avgSolarRadiation;

    case "radiationMax":
      return day.maxSolarRadiation;

    default:
      return null;
  }
}

// New Ecowitt fields
function getEcowittMetricValue(day, metric) {
  switch (metric) {
    case "temperature":
      return day.meanTemp;

    case "temperatureMax":
      return day.maxTemp;

    case "temperatureMin":
      return day.minTemp;

    case "humidity":
      return day.humidity;

    case "radiation":
      return day.solarRadiation;

    case "radiationMax":
      return day.maxSolarRadiation;

    default:
      return null;
  }
}

export function getCabillaMetricLabel(metric) {
  switch (metric) {
    case "temperature":
      return "Mean temperature";

    case "temperatureMax":
      return "Max temperature";

    case "temperatureMin":
      return "Min temperature";

    case "humidity":
      return "Relative humidity";

    case "radiation":
      return "Solar radiation";

    case "radiationMax":
      return "Max solar radiation";

    default:
      return "Daily value";
  }
}

export function getCabillaMetricUnit(metric) {
  switch (metric) {
    case "temperature":
    case "temperatureMax":
    case "temperatureMin":
      return "°C";

    case "humidity":
      return "%";

    case "radiation":
    case "radiationMax":
      return "W/m²";

    default:
      return "";
  }
}


/**
 * Prepare paired outside and under-canopy observations
 * for the Cabilla Compare view.
 *
 * Preserves missing observations as null.
 * Each sensor retains its own measured values.
 */
export function getCabillaComparisonSeries(
  ecowittData,
  year,
  month
) {
  const monthData =
    ecowittData?.years?.[String(year)]?.[String(month)];

  if (!monthData) return [];

  const validNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  return Object.values(monthData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((record) => {
      const outside = record.outside;
      const canopy = record.underCanopy;

      const outsideValid =
        Number(outside?.observations) > 0;

      const canopyValid =
        Number(canopy?.observations) > 0;

      const read = (sensor, valid, key) =>
        valid ? validNumber(sensor?.[key]) : null;

      const outsideMax = read(
        outside, outsideValid, "maxTemp"
      );

      const outsideMin = read(
        outside, outsideValid, "minTemp"
      );

      const canopyMax = read(
        canopy, canopyValid, "maxTemp"
      );

      const canopyMin = read(
        canopy, canopyValid, "minTemp"
      );

      const outsideHumidity = read(
        outside, outsideValid, "humidity"
      );

      const canopyHumidity = read(
        canopy, canopyValid, "humidity"
      );

      const pairedTemperature =
        outsideMax !== null &&
        outsideMin !== null &&
        canopyMax !== null &&
        canopyMin !== null;

      const pairedHumidity =
        outsideHumidity !== null &&
        canopyHumidity !== null;

      return {
        date: record.date,
        day: Number(record.date.slice(8, 10)),

        outsideMax,
        outsideMin,
        canopyMax,
        canopyMin,

        outsideHumidity,
        canopyHumidity,

        outsideObservations:
          validNumber(outside?.observations) ?? 0,

        canopyObservations:
          validNumber(canopy?.observations) ?? 0,

        pairedTemperature,
        pairedHumidity,
      };
    });
}

