import fs from "node:fs";

const INPUT = "src/data/cabilla/parsed/cabilla-microclimate-raw.json";
const OUTPUT = "src/data/cabilla/aggregates/cabilla-microclimate-monthly.json";
const STABLE_START = {
  year: 2026,
  month: 3,
  day: 15,
};

function isAfterStableStart(date) {
  return date >= new Date(
    STABLE_START.year,
    STABLE_START.month - 1,
    STABLE_START.day
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

const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
const rows = raw.rows || [];

const byYearMonth = {};

for (const row of rows) {
  if (!row.timestamp) continue;

  const date = new Date(row.timestamp);
    if (isNaN(date.getTime())) continue;
    if (!isAfterStableStart(date)) continue;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (!byYearMonth[year]) byYearMonth[year] = {};
  if (!byYearMonth[year][month]) {
    byYearMonth[year][month] = {
      temps: [],
      humidity: [],
      radiation: [],
      daysSet: new Set(),
    };
  }

const bucket = byYearMonth[year][month];
const dayKey = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  
  bucket.daysSet.add(dayKey);

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

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}

function round(value, decimals = 1) {
  if (value === null || value === undefined) return null;
  return Number(value.toFixed(decimals));
}

const output = { years: {} };

for (const year of Object.keys(byYearMonth)) {
  output.years[year] = {};

for (const monthKey of Object.keys(byYearMonth[year])) {
    const month = Number(monthKey);
    const bucket = byYearMonth[year][month];

    const temps = bucket.temps;

    output.years[year][month] = {
    days: bucket.daysSet.size,
    avgMeanTemp: round(avg(temps)),
    avgMaxTemp: temps.length ? round(Math.max(...temps)) : null,
    avgMinTemp: temps.length ? round(Math.min(...temps)) : null,
    avgHumidity: round(avg(bucket.humidity)),
    avgSolarRadiation: round(avg(bucket.radiation)),
    maxSolarRadiation: bucket.radiation.length
    ? round(Math.max(...bucket.radiation))
    : null,
    };
  }
}

fs.mkdirSync("src/data/cabilla/aggregates", { recursive: true });

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

console.log("Cabilla aggregates built");