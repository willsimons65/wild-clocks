import fs from "fs";
import path from "path";

const INPUT_PATH = "src/data/winter-cold/raw/cabilla_winter_cold.csv";

const BASELINE_OUTPUT_PATH =
  "src/data/winter-cold/cabilla/baseline-winter-cold.js";

const CURRENT_OUTPUT_PATH =
  "src/data/winter-cold/cabilla/current-winter-cold.js";

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
}

function countThresholdDays(rows, columnName) {
  const counts = {
    winterChill: 0,
    dormancyConditions: 0,
    nearFreezing: 0,
    frost: 0,
    hardFrost: 0,
  };

  for (const row of rows) {
    const rawValue = row[columnName];
    const value = parseFloat(rawValue);

    if (rawValue !== "" && Number.isFinite(value)) {
      if (value <= 7) counts.winterChill += 1;
      if (value <= 5) counts.dormancyConditions += 1;
      if (value <= 2) counts.nearFreezing += 1;
      if (value <= 0) counts.frost += 1;
      if (value <= -5) counts.hardFrost += 1;
    }
  }

  return counts;
}

const rows = parseCSV(fs.readFileSync(INPUT_PATH, "utf8"));

const categories = [
  { key: "winterChill", label: "Winter chill", range: "≤ 7°C" },
  { key: "dormancyConditions", label: "Dormancy conditions", range: "≤ 5°C" },
  { key: "nearFreezing", label: "Near freezing", range: "≤ 2°C" },
  { key: "frost", label: "Frost", range: "≤ 0°C" },
  { key: "hardFrost", label: "Hard frost", range: "≤ -5°C" },
];

const baselineCounts = countThresholdDays(rows, "Baseline_MinTemp");
const currentCounts = countThresholdDays(rows, "Current_MinTemp");

const baselineCategories = categories.map((category) => ({
  ...category,
  days: Number((baselineCounts[category.key] / 30).toFixed(1)),
}));

const currentCategories = categories.map((category) => ({
  ...category,
  days: Number((currentCounts[category.key] / 5).toFixed(1)),
}));

const baselineOutput = `export const cabillaBaselineWinterCold = {
  categories: ${JSON.stringify(baselineCategories, null, 4)},
};
`;

const currentOutput = `export const cabillaCurrentWinterCold = {
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