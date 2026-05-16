import fs from "node:fs";
import https from "node:https";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSagwLT2bTQPD0djOzNmw6FBZurQuE8-7WqL0fm4QLPUowX9TIZVAcuUpHVcwE3kIjkpcFgbXZRE3IZ/pub?gid=0&single=true&output=csv";

const OUTPUT =
  "src/data/cabilla/aggregates/cabilla-rainfall-daily.json";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function fetchCSV(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          if (redirects > 5) {
            reject(new Error("Too many redirects"));
            return;
          }

          const nextUrl = new URL(res.headers.location, url).toString();
          resolve(fetchCSV(nextUrl, redirects + 1));
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);

  const headers = lines[0]
    .split(",")
    .map((h) =>
      h.replace(/^\uFEFF/, "").replace(/^"|"$/g, "").trim()
    );

  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const row = {};

    headers.forEach((header, index) => {
      row[header] = cells[index]?.replace(/^"|"$/g, "").trim();
    });

    return row;
  });
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

async function build() {
  const csv = await fetchCSV(SHEET_CSV_URL);
  const rows = parseCSV(csv);

  const output = {
    source: "Google Sheets",
    generatedAt: new Date().toISOString(),
    units: { rainfall: "mm" },
    years: {},
  };

  for (const row of rows) {
    const place = String(row.Place || "").trim().toLowerCase();

    if (!place.includes("cabilla")) continue;

const year = Number(row.Year);
const day = Number(row.Date);
const rainfall = Number(row["Rainfall [mm]"]);

let month = null;

if (row.Month) {
  const monthName = String(row.Month).trim().toLowerCase();
  const idx = MONTHS.indexOf(monthName);
  if (idx >= 0) month = idx + 1;
}

if (
  Number.isNaN(year) ||
  Number.isNaN(day) ||
  Number.isNaN(rainfall) ||
  !month
) {
  continue;
}

const date = new Date(year, month - 1, day, 12);

    if (!output.years[year]) output.years[year] = {};
    if (!output.years[year][month]) output.years[year][month] = {};

    output.years[year][month][day] = {
      date: date.toISOString().slice(0, 10),
      rainfall: round1(rainfall),
    };
  }

  fs.mkdirSync("src/data/cabilla/aggregates", { recursive: true });

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  console.log("Cabilla rainfall daily JSON built");
}

build().catch((err) => {
  console.error("Failed to build Cabilla rainfall JSON");
  console.error(err);
  process.exit(1);
});