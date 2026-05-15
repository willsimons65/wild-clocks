// scripts/build-cabilla-microclimate-aggregates.js

import fs from "node:fs";

const INPUT = "src/data/cabilla/parsed/cabilla-microclimate-raw.json";

const MONTHLY_OUTPUT =
  "src/data/cabilla/aggregates/cabilla-microclimate-monthly.json";

const DAILY_OUTPUT =
  "src/data/cabilla/aggregates/cabilla-microclimate-daily.json";

const STABLE_START = {
  year: 2026,
  month: 3,
  day: 15,
};

function toLocalDate(rowTimestamp) {
  const date = new Date(rowTimestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isAfterStableStart(date) {
  return (
    date >=
    new Date(
      STABLE_START.year,
      STABLE_START.month - 1,
      STABLE_START.day
    )
  );
}

function isValidTemp(t) {
  return typeof t === "number" && t > -20 && t < 40;
}

function isValidHumidity(h) {
  return typeof h === "number" && h >= 0 && h <= 100;
}

function isValidRadiation(r) {
  return typeof r === "number" && r >= 0;
}

function avg(arr) {
  return arr.length
    ? arr.reduce((a, b) => a + b, 0) / arr.length
    : null;
}

function round(value, decimals = 1) {
  if (value === null || value === undefined) return null;
  return Number(value.toFixed(decimals));
}

function createBucket() {
  return {
    temps: [],
    humidity: [],
    radiation: [],
    daysSet: new Set(),
    readings: 0,
  };
}

const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
const rows = raw.rows || [];

const byYearMonth = {};
const byYearMonthDay = {};

for (const row of rows) {
  if (!row.timestamp) continue;

  const date = toLocalDate(row.timestamp);
  if (!date) continue;
  if (!isAfterStableStart(date)) continue;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayKey = getDateKey(date);

  if (!byYearMonth[year]) byYearMonth[year] = {};
  if (!byYearMonth[year][month]) {
    byYearMonth[year][month] = createBucket();
  }

  if (!byYearMonthDay[year]) byYearMonthDay[year] = {};
  if (!byYearMonthDay[year][month]) byYearMonthDay[year][month] = {};
  if (!byYearMonthDay[year][month][day]) {
    byYearMonthDay[year][month][day] = createBucket();
  }

  const monthlyBucket = byYearMonth[year][month];
  const dailyBucket = byYearMonthDay[year][month][day];

  for (const bucket of [monthlyBucket, dailyBucket]) {
    bucket.daysSet.add(dayKey);
    bucket.readings += 1;

    if (isValidTemp(row.temperature)) {
      bucket.temps.push(row.temperature);
    }

    if (isValidHumidity(row.relativeHumidity)) {
      bucket.humidity.push(row.relativeHumidity);
    }

    if (isValidRadiation(row.solarRadiation)) {
      bucket.radiation.push(row.solarRadiation);
    }
  }
}

function summariseBucket(bucket) {
  return {
    days: bucket.daysSet.size,
    readings: bucket.readings,

    avgMeanTemp: round(avg(bucket.temps)),
    maxTemp: bucket.temps.length ? round(Math.max(...bucket.temps)) : null,
    minTemp: bucket.temps.length ? round(Math.min(...bucket.temps)) : null,

    avgHumidity: round(avg(bucket.humidity)),

    avgSolarRadiation: round(avg(bucket.radiation)),
    maxSolarRadiation: bucket.radiation.length
      ? round(Math.max(...bucket.radiation))
      : null,
  };
}

const monthlyOutput = {
  source: raw.source,
  generatedAt: new Date().toISOString(),
  stableStart: STABLE_START,
  units: {
    temp: "C",
    humidity: "%",
    solarRadiation: "W/m2",
  },
  years: {},
};

for (const year of Object.keys(byYearMonth)) {
  monthlyOutput.years[year] = {};

  for (const month of Object.keys(byYearMonth[year])) {
    monthlyOutput.years[year][month] = summariseBucket(
      byYearMonth[year][month]
    );
  }
}

const dailyOutput = {
  source: raw.source,
  generatedAt: new Date().toISOString(),
  stableStart: STABLE_START,
  units: {
    temp: "C",
    humidity: "%",
    solarRadiation: "W/m2",
  },
  years: {},
};

for (const year of Object.keys(byYearMonthDay)) {
  dailyOutput.years[year] = {};

  for (const month of Object.keys(byYearMonthDay[year])) {
    dailyOutput.years[year][month] = {};

    for (const day of Object.keys(byYearMonthDay[year][month])) {
      const bucket = byYearMonthDay[year][month][day];

      const date = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      dailyOutput.years[year][month][day] = {
        date,
        ...summariseBucket(bucket),
      };
    }
  }
}

fs.mkdirSync("src/data/cabilla/aggregates", { recursive: true });

fs.writeFileSync(
  MONTHLY_OUTPUT,
  JSON.stringify(monthlyOutput, null, 2)
);

fs.writeFileSync(
  DAILY_OUTPUT,
  JSON.stringify(dailyOutput, null, 2)
);

console.log("Cabilla monthly and daily aggregates built");