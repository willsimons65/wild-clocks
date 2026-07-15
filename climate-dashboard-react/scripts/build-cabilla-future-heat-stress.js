// scripts/build-cabilla-future-heat-stress.js

import fs from "fs";
import path from "path";

const INPUT_DIR =
  "/Users/willsimons/Documents/wild-clocks-data/cabilla/derived";

const OUTPUT_PATH =
  "src/data/heat-stress/cabilla/future-heat-stress.js";

const PERIODS = [
  "2031-2040",
  "2041-2050",
  "2051-2060",
  "2061-2070",
  "2071-2080",
];

const METRIC_MAP = {
  WarmDay: {
    key: "warmDay",
    label: "Warm day",
    range: ">25°C",
  },
  HeatStress: {
    key: "heatStress",
    label: "Heat stress",
    range: ">28°C",
  },
  HighHeatStress: {
    key: "highHeatStress",
    label: "High heat stress",
    range: ">30°C",
  },
  ExtremeHeat: {
    key: "extremeHeat",
    label: "Extreme heat",
    range: ">32°C",
  },
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);

  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    return Object.fromEntries(
      headers.map((header, index) => [
        header.trim(),
        values[index]?.trim(),
      ])
    );
  });
}

const output = {};

for (const period of PERIODS) {
  const inputPath = path.join(
    INPUT_DIR,
    `cabilla-heat-stress-ensemble-summary-${period}.csv`
  );

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing ${inputPath}`);
  }

  const rows = parseCSV(
    fs.readFileSync(inputPath, "utf8")
  );

  output[period.replace("-", "–")] = {
    period: period.replace("-", "–"),

    thresholds: rows.map((row) => {
      const metric = METRIC_MAP[row.Metric];

      return {
        key: metric.key,
        label: metric.label,
        range: metric.range,

        lower: Number(row.P10),
        median: Number(row.Median),
        upper: Number(row.P90),
      };
    }),
  };
}

const file = `export const cabillaFutureHeatStress = ${JSON.stringify(
  output,
  null,
  2
)};
`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), {
  recursive: true,
});

fs.writeFileSync(OUTPUT_PATH, file);

console.log(
  `✓ Wrote ${OUTPUT_PATH}`
);