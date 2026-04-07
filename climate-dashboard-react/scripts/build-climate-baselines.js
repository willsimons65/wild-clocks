import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -----------------------------
// Path helpers
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AGGREGATES_DIR = path.resolve(__dirname, "../src/data/aggregates");
const OUTPUT_DIR = path.resolve(__dirname, "../src/data/baselines");

const SPRING_MONTHS = [3, 4, 5, 6, 7];

// -----------------------------
// Helpers
// -----------------------------
function round1(n) {
  return n == null ? null : Math.round(n * 10) / 10;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(values, p) {
  if (!values.length) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sorted[lower];

  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function quantileThresholds(values) {
  const sorted = [...values].sort((a, b) => a - b);

  return {
    q20: percentile(sorted, 20),
    q40: percentile(sorted, 40),
    q60: percentile(sorted, 60),
    q80: percentile(sorted, 80),
  };
}

function classifyState(total, thresholds) {
  if (total <= thresholds.q20) return "severe_drought";
  if (total <= thresholds.q40) return "below_average";
  if (total <= thresholds.q60) return "balanced";
  if (total <= thresholds.q80) return "wet";
  return "excessive_rain";
}

// -----------------------------
// Core builder
// -----------------------------
function buildMonthlyRainfallBaseline(data) {
  const years = data.years || {};

  const byMonth = {};
  for (let m = 1; m <= 12; m++) {
    byMonth[m] = [];
  }

  for (const [, months] of Object.entries(years)) {
    for (const [monthKey, monthData] of Object.entries(months)) {
      const month = Number(monthKey);
      const rainfall = monthData?.totalRainfall;
      const days = monthData?.days;

      if (!month || rainfall == null) continue;

      // Skip obviously incomplete months
      if (days != null && days < 28) continue;

      byMonth[month].push(rainfall);
    }
  }

  const monthlyRainfall = {};

  for (let m = 1; m <= 12; m++) {
    const values = byMonth[m];

    monthlyRainfall[m] = {
      count: values.length,
      median: round1(median(values)),
      p25: round1(percentile(values, 25)),
      p75: round1(percentile(values, 75)),
      min: round1(values.length ? Math.min(...values) : null),
      max: round1(values.length ? Math.max(...values) : null),
    };
  }

  return monthlyRainfall;
}

function buildSpringTotalsByYear(data, springMonths) {
  const years = data.years || {};
  const rows = [];

  for (const [yearKey, months] of Object.entries(years)) {
    const year = Number(yearKey);

    let total = 0;
    let valid = true;

    for (const month of springMonths) {
      const monthData = months?.[String(month)];

      if (!monthData) {
        valid = false;
        break;
      }

      const rainfall = monthData.totalRainfall;
      const days = monthData.days;

      if (rainfall == null) {
        valid = false;
        break;
      }

      // Require full-ish month
      if (days != null && days < 28) {
        valid = false;
        break;
      }

      total += rainfall;
    }

    if (valid) {
      rows.push({
        year,
        total: round1(total),
      });
    }
  }

  return rows.sort((a, b) => a.total - b.total);
}

function buildSpringCumulativeRainfall(data, springMonths) {
  const years = data.years || {};
  const cumulativeByMonth = {};

  for (const month of springMonths) {
    cumulativeByMonth[month] = [];
  }

  for (const [, months] of Object.entries(years)) {
    let runningTotal = 0;
    let validYear = true;

    for (const month of springMonths) {
      const monthData = months?.[String(month)];

      if (!monthData || monthData.totalRainfall == null) {
        validYear = false;
        break;
      }

      if (monthData.days != null && monthData.days < 28) {
        validYear = false;
        break;
      }

      runningTotal += monthData.totalRainfall;
      cumulativeByMonth[month].push(runningTotal);
    }

    if (!validYear) {
      // do nothing; incomplete years are naturally excluded
    }
  }

  const result = {};

  for (const month of springMonths) {
    const values = cumulativeByMonth[month];

    result[month] = {
      count: values.length,
      median: round1(median(values)),
      p25: round1(percentile(values, 25)),
      p75: round1(percentile(values, 75)),
      min: round1(values.length ? Math.min(...values) : null),
      max: round1(values.length ? Math.max(...values) : null),
    };
  }

  return result;
}

function buildSpringStates(springTotals) {
  const totals = springTotals.map((row) => row.total);
  const thresholds = quantileThresholds(totals);

  const withStates = springTotals.map((row) => ({
    ...row,
    state: classifyState(row.total, thresholds),
  }));

  const stateYears = {
    severe_drought: [],
    below_average: [],
    balanced: [],
    wet: [],
    excessive_rain: [],
  };

  for (const row of withStates) {
    stateYears[row.state].push(row.year);
  }

  return {
    springTotalsByYear: withStates,
    springStateThresholds: {
      severe_drought_max: round1(thresholds.q20),
      below_average_max: round1(thresholds.q40),
      balanced_max: round1(thresholds.q60),
      wet_max: round1(thresholds.q80),
    },
    springStateYears: stateYears,
  };
}

function buildBaseline(data) {
  const monthlyRainfall = buildMonthlyRainfallBaseline(data);
  const springTotals = buildSpringTotalsByYear(data, SPRING_MONTHS);
  const springCumulativeRainfall = buildSpringCumulativeRainfall(data, SPRING_MONTHS);
  const springStates = buildSpringStates(springTotals);

  return {
    generatedAt: new Date().toISOString(),
    source: data.source || null,
    location: data.location || null,
    springWindow: SPRING_MONTHS,
    monthlyRainfall,
    springCumulativeRainfall,
    ...springStates,
  };
}

// -----------------------------
// File processing
// -----------------------------
function processFile(filename) {
  const inputPath = path.join(AGGREGATES_DIR, filename);
  const raw = fs.readFileSync(inputPath, "utf8");
  const data = JSON.parse(raw);

  const baseline = buildBaseline(data);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outputName = filename.replace(".json", "-baseline.json");
  const outputPath = path.join(OUTPUT_DIR, outputName);

  fs.writeFileSync(outputPath, JSON.stringify(baseline, null, 2), "utf8");

  console.log(`✅ Built baseline: ${outputName}`);
}

// -----------------------------
// Run
// -----------------------------
function main() {
  const files = fs
    .readdirSync(AGGREGATES_DIR)
    .filter((f) => f.endsWith(".json"));

  if (!files.length) {
    console.log("No aggregate JSON files found.");
    return;
  }

  files.forEach(processFile);
}

main();