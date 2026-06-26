import fs from "fs";
import path from "path";

const INPUT_PATH = "src/data/climate-envelope/raw/baseline_cabilla_1961_1990_60.csv";
const OUTPUT_PATH = "src/data/climate-envelope/cabilla/cabilla-baseline-envelope.js";

function parseCSV(text) {
  const allLines = text.trim().split(/\r?\n/);
  const headerIndex = allLines.findIndex((line) => line.startsWith("DOY,"));

  if (headerIndex === -1) {
    throw new Error("Could not find CSV header row starting with DOY,");
  }

  const headerLine = allLines[headerIndex];
  const lines = allLines.slice(headerIndex + 1);
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(",").map((v) => v.trim());

    return Object.fromEntries(
      headers.map((header, i) => [header, values[i]])
    );
  });
}

function monthFromDOY(doy) {
  const date = new Date(Date.UTC(2001, 0, doy));
  return date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
}

const csv = fs.readFileSync(INPUT_PATH, "utf8");
const rows = parseCSV(csv)
  .map((row) => ({
    doy: Number(row.DOY),
    month: monthFromDOY(Number(row.DOY)),
    gdd: Number(row.CumulativeGDD_avg),
    moisture: Number(row.MoistureProxy60_avg),
  }))
  .filter((row) =>
    Number.isFinite(row.doy) &&
    Number.isFinite(row.gdd) &&
    Number.isFinite(row.moisture)
  );

const byMonth = new Map();

for (const row of rows) {
  byMonth.set(row.month, row);
}

const chartData = Array.from(byMonth.values()).map((row) => ({
  month: row.month,
  gdd: Number(row.gdd.toFixed(1)),
  moisture: Number(row.moisture.toFixed(1)),
}));

const peakGDD = Math.max(...rows.map((row) => row.gdd));
const peakMoistureDeficit = Math.min(...rows.map((row) => row.moisture));

const output = `export const cabillaBaselineEnvelope = {
  peakGDD: ${Number(peakGDD.toFixed(1))},
  peakMoistureDeficit: ${Number(peakMoistureDeficit.toFixed(1))},

  chartData: ${JSON.stringify(chartData, null, 4)},
};
`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, output);

console.log(`Wrote ${OUTPUT_PATH}`);
console.log(`Rows read: ${rows.length}`);
console.log(`Chart points: ${chartData.length}`);
console.log(`Peak GDD: ${peakGDD.toFixed(1)}`);
console.log(`Peak moisture deficit: ${peakMoistureDeficit.toFixed(1)}`);