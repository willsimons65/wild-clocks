import fs from "fs";
import path from "path";

const INPUT_PATH = "src/data/annual-rainfall/raw/appleton-rainfall.csv";

const BASELINE_OUTPUT_PATH =
  "src/data/annual-rainfall/appleton/baseline-regime.js";

const CURRENT_OUTPUT_PATH =
  "src/data/annual-rainfall/appleton/current-regime.js";

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
}

function getCategory(value) {
  if (value < 1) return "dry";
  if (value <= 2) return "light";
  if (value <= 5) return "moderate";
  return "heavy";
}

function countCategories(rows, columnName) {
  const counts = {
    dry: 0,
    light: 0,
    moderate: 0,
    heavy: 0,
  };

  for (const row of rows) {
    const rawValue = row[columnName];
    const value = parseFloat(rawValue);

    if (rawValue !== "" && Number.isFinite(value)) {
      counts[getCategory(value)] += 1;
    }
  }

  return counts;
}

const rows = parseCSV(fs.readFileSync(INPUT_PATH, "utf8"));

const categories = [
  { key: "dry", label: "Dry", range: "< 1 mm" },
  { key: "light", label: "Light", range: "1 - 2 mm" },
  { key: "moderate", label: "Moderate", range: "2 - 5 mm" },
  { key: "heavy", label: "Heavy", range: "> 5 mm" },
];

const baselineCounts = countCategories(rows, "Baseline_rain_mm_avg");
const currentCounts = countCategories(rows, "Current_rain_mm_avg");

const baselineCategories = categories.map((category) => ({
  ...category,
  days: baselineCounts[category.key],
}));

const currentCategories = categories.map((category) => ({
  ...category,
  days: currentCounts[category.key],
}));

const baselineOutput = `export const appletonBaselineRainfallRegime = {
  categories: ${JSON.stringify(baselineCategories, null, 4)},
};
`;

const currentOutput = `export const appletonCurrentRainfallRegime = {
  categories: ${JSON.stringify(currentCategories, null, 4)},
};
`;

fs.mkdirSync(path.dirname(BASELINE_OUTPUT_PATH), { recursive: true });
fs.mkdirSync(path.dirname(CURRENT_OUTPUT_PATH), { recursive: true });

fs.writeFileSync(BASELINE_OUTPUT_PATH, baselineOutput);
fs.writeFileSync(CURRENT_OUTPUT_PATH, currentOutput);

console.log(`Wrote ${BASELINE_OUTPUT_PATH}`);
console.log(`Wrote ${CURRENT_OUTPUT_PATH}`);
console.log("Baseline:", baselineCategories);
console.log("Current:", currentCategories);