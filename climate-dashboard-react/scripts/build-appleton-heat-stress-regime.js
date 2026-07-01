import fs from "fs";
import path from "path";

const INPUT_PATH = "src/data/heat-stress/raw/appleton_heat_stress.csv";

const BASELINE_OUTPUT_PATH =
  "src/data/heat-stress/appleton/baseline-heat-stress.js";

const CURRENT_OUTPUT_PATH =
  "src/data/heat-stress/appleton/current-heat-stress.js";

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
    warm: 0,
    heatStress: 0,
    highHeatStress: 0,
    extremeHeat: 0,
  };

  for (const row of rows) {
    const rawValue = row[columnName];
    const value = parseFloat(rawValue);

    if (rawValue !== "" && Number.isFinite(value)) {
      if (value >= 25) counts.warm += 1;
      if (value >= 28) counts.heatStress += 1;
      if (value >= 30) counts.highHeatStress += 1;
      if (value >= 32) counts.extremeHeat += 1;
    }
  }

  return counts;
}

const rows = parseCSV(fs.readFileSync(INPUT_PATH, "utf8"));

const categories = [
  { key: "warm", label: "Warm day", range: "> 25°C" },
  { key: "heatStress", label: "Heat stress", range: "> 28°C" },
  { key: "highHeatStress", label: "High heat stress", range: "> 30°C" },
  { key: "extremeHeat", label: "Extreme heat", range: "> 32°C" },
];

const baselineCounts = countThresholdDays(rows, "Baseline_MaxTemp");
const currentCounts = countThresholdDays(rows, "Current_MaxTemp");

const baselineCategories = categories.map((category) => ({
  ...category,
  days: Number((baselineCounts[category.key] / 30).toFixed(1)),
}));

const currentCategories = categories.map((category) => ({
  ...category,
  days: Number((currentCounts[category.key] / 5).toFixed(1)),
}));

const baselineOutput = `export const appletonBaselineHeatStress = {
  categories: ${JSON.stringify(baselineCategories, null, 4)},
};
`;

const currentOutput = `export const appletonCurrentHeatStress = {
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