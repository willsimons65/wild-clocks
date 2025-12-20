// scripts/build-climate-aggregates.js

import fs from "fs";
import https from "https";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1oNxd5AV2YjWmHEeO1ZOKMYH5JvHwwykhJdA5e4DacMg/gviz/tq?tqx=out:csv&gid=0";

const REQUIRED_COLUMNS = [
  "Place",
  "Year",
  "Month",
  "Date",
  "Tempmax °C",
  "Tempmin °C",
  "Precipitation mm",
];

const MONTH_MAP = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function round1(n) {
  return Math.round(n * 10) / 10;
}

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function parseCSV(text) {
  const lines = text.trim().split("\n");

  const headers = lines[0]
    .split(",")
    .map((h) =>
      h
        .replace(/^\uFEFF/, "")
        .replace(/^"|"$/g, "")
        .trim()
    );

  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i]
        ?.replace(/^"|"$/g, "")
        .trim();
    });
    return row;
  });
}

async function build() {
  const csv = await fetchCSV(SHEET_CSV_URL);

  // Guard: ensure we actually received CSV
  if (!csv.includes(",")) {
    console.error(csv.slice(0, 200));
    throw new Error(
      "Google Sheets did not return CSV. See output above."
    );
  }

  const rows = parseCSV(csv);
  const data = {};

  for (const r of rows) {
    const place = r["Place"];
    const year = r["Year"];

    const month =
      MONTH_MAP[r["Month"]] ?? Number(r["Month"]);

    const max = Number(r["Tempmax °C"]);
    const min = Number(r["Tempmin °C"]);
    const rain = Number(r["Precipitation mm"]);

    if (
      Number.isNaN(max) ||
      Number.isNaN(min) ||
      Number.isNaN(rain)
    ) {
      throw new Error(
        `Invalid numeric data for ${place} ${year}-${month}`
      );
    }

    if (!data[place]) data[place] = {};
    if (!data[place][year]) data[place][year] = {};
    if (!data[place][year][month]) {
      data[place][year][month] = {
        sumMax: 0,
        sumMin: 0,
        sumMean: 0,
        sumRain: 0,
        days: 0,
      };
    }

    const bucket = data[place][year][month];
    bucket.sumMax += max;
    bucket.sumMin += min;
    bucket.sumMean += (max + min) / 2;
    bucket.sumRain += rain;
    bucket.days += 1;
  }

  fs.mkdirSync("src/data/aggregates", { recursive: true });

  for (const place of Object.keys(data)) {
    const out = {
      location: place,
      source: "Google Sheets",
      generatedAt: new Date().toISOString(),
      units: { temp: "C", rainfall: "mm" },
      years: {},
    };

    for (const year of Object.keys(data[place])) {
      out.years[year] = {};
      for (const month of Object.keys(data[place][year])) {
        const m = data[place][year][month];
        out.years[year][month] = {
          avgMaxTemp: round1(m.sumMax / m.days),
          avgMinTemp: round1(m.sumMin / m.days),
          avgMeanTemp: round1(m.sumMean / m.days),
          totalRainfall: round1(m.sumRain),
          days: m.days,
        };
      }
    }

    const fileName = place.toLowerCase().replace(/\s+/g, "-");
    fs.writeFileSync(
      `src/data/aggregates/${fileName}.json`,
      JSON.stringify(out, null, 2)
    );
  }

  console.log("✅ Climate aggregates built");
}

build().catch((err) => {
  console.error("❌ Failed to build aggregates");
  console.error(err);
  process.exit(1);
});
