export function getCabillaDailySeries(dailyData, year, month, metric) {
  const monthData = dailyData?.years?.[year]?.[month];

  if (!monthData) return [];

  return Object.values(monthData)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((day) => ({
      date: day.date,
      day: Number(day.date.slice(8, 10)),
      value: getMetricValue(day, metric),
      readings: day.readings,
    }))
    .filter((d) => d.value !== null && d.value !== undefined);
}

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