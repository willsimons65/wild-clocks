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
const STATE_ORDER = [
  "severe_drought",
  "below_average",
  "balanced",
  "wet",
  "excessive_rain",
];

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

function summariseValues(values) {
  if (!values.length) {
    return {
      count: 0,
      median: null,
      p25: null,
      p75: null,
      min: null,
      max: null,
    };
  }

  return {
    count: values.length,
    median: round1(median(values)),
    p25: round1(percentile(values, 25)),
    p75: round1(percentile(values, 75)),
    min: round1(Math.min(...values)),
    max: round1(Math.max(...values)),
  };
}

function quantileThresholds(values) {
  return {
    q20: percentile(values, 20),
    q40: percentile(values, 40),
    q60: percentile(values, 60),
    q80: percentile(values, 80),
  };
}

function classifyState(total, thresholds) {
  if (total <= thresholds.q20) return "severe_drought";
  if (total <= thresholds.q40) return "below_average";
  if (total <= thresholds.q60) return "balanced";
  if (total <= thresholds.q80) return "wet";
  return "excessive_rain";
}

function isUsableMonth(monthData) {
  if (!monthData) return false;
  if (monthData.totalRainfall == null) return false;
  if (monthData.days != null && monthData.days < 28) return false;
  return true;
}

// -----------------------------
// Core builders
// -----------------------------
function buildMonthlyRainfallBaseline(data) {
  const years = data.years || {};
  const byMonth = {};

  for (let m = 1; m <= 12; m++) {
    byMonth[m] = [];
  }

  for (const months of Object.values(years)) {
    for (const [monthKey, monthData] of Object.entries(months)) {
      const month = Number(monthKey);
      if (!month || !isUsableMonth(monthData)) continue;
      byMonth[month].push(monthData.totalRainfall);
    }
  }

  const monthlyRainfall = {};
  for (let m = 1; m <= 12; m++) {
    monthlyRainfall[m] = summariseValues(byMonth[m]);
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
      if (!isUsableMonth(monthData)) {
        valid = false;
        break;
      }
      total += monthData.totalRainfall;
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

  for (const months of Object.values(years)) {
    let runningTotal = 0;
    let valid = true;

    for (const month of springMonths) {
      const monthData = months?.[String(month)];
      if (!isUsableMonth(monthData)) {
        valid = false;
        break;
      }

      runningTotal += monthData.totalRainfall;
      cumulativeByMonth[month].push(runningTotal);
    }

    if (!valid) {
      // incomplete years are ignored naturally
    }
  }

  const result = {};
  for (const month of springMonths) {
    result[month] = summariseValues(cumulativeByMonth[month]);
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

function buildRepresentativeYears(springTotalsByYear) {
  const byState = {
    severe_drought: [],
    below_average: [],
    balanced: [],
    wet: [],
    excessive_rain: [],
  };

  for (const row of springTotalsByYear) {
    byState[row.state].push(row);
  }

  const representativeYears = {};

  for (const state of STATE_ORDER) {
    const rows = byState[state];
    if (!rows.length) {
      representativeYears[state] = null;
      continue;
    }

    const stateMedian = median(rows.map((r) => r.total));

    let best = rows[0];
    let bestDiff = Math.abs(rows[0].total - stateMedian);

    for (const row of rows) {
      const diff = Math.abs(row.total - stateMedian);
      if (diff < bestDiff) {
        best = row;
        bestDiff = diff;
      }
    }

    representativeYears[state] = {
      year: best.year,
      total: best.total,
      stateMedianTotal: round1(stateMedian),
    };
  }

  // extra convenience field: closest-to-median balanced year
  const balancedRows = byState.balanced;
  const balancedMedian = median(balancedRows.map((r) => r.total));
  let closestBalancedYear = null;

  if (balancedRows.length) {
    let best = balancedRows[0];
    let bestDiff = Math.abs(balancedRows[0].total - balancedMedian);

    for (const row of balancedRows) {
      const diff = Math.abs(row.total - balancedMedian);
      if (diff < bestDiff) {
        best = row;
        bestDiff = diff;
      }
    }

    closestBalancedYear = {
      year: best.year,
      total: best.total,
      balancedMedianTotal: round1(balancedMedian),
    };
  }

  return {
    representativeYears,
    closestBalancedYear,
  };
}

function buildStateMonthlyRainfall(data, springTotalsByYear) {
  const years = data.years || {};
  const stateYearSets = {};

  for (const state of STATE_ORDER) {
    stateYearSets[state] = new Set(
      springTotalsByYear
        .filter((row) => row.state === state)
        .map((row) => String(row.year))
    );
  }

  const stateMonthlyRainfall = {};

  for (const state of STATE_ORDER) {
    const byMonth = {};
    for (let m = 1; m <= 12; m++) {
      byMonth[m] = [];
    }

    for (const [yearKey, months] of Object.entries(years)) {
      if (!stateYearSets[state].has(yearKey)) continue;

      for (let m = 1; m <= 12; m++) {
        const monthData = months?.[String(m)];
        if (!isUsableMonth(monthData)) continue;
        byMonth[m].push(monthData.totalRainfall);
      }
    }

    const stateSummary = {};
    for (let m = 1; m <= 12; m++) {
      stateSummary[m] = summariseValues(byMonth[m]);
    }

    stateMonthlyRainfall[state] = stateSummary;
  }

  return stateMonthlyRainfall;
}

function buildStateCumulativeRainfall(data, springTotalsByYear, springMonths) {
  const years = data.years || {};
  const stateYearSets = {};

  for (const state of STATE_ORDER) {
    stateYearSets[state] = new Set(
      springTotalsByYear
        .filter((row) => row.state === state)
        .map((row) => String(row.year))
    );
  }

  const stateCumulativeRainfall = {};

  for (const state of STATE_ORDER) {
    const cumulativeByMonth = {};
    for (const month of springMonths) {
      cumulativeByMonth[month] = [];
    }

    for (const [yearKey, months] of Object.entries(years)) {
      if (!stateYearSets[state].has(yearKey)) continue;

      let runningTotal = 0;
      let valid = true;

      for (const month of springMonths) {
        const monthData = months?.[String(month)];
        if (!isUsableMonth(monthData)) {
          valid = false;
          break;
        }

        runningTotal += monthData.totalRainfall;
        cumulativeByMonth[month].push(runningTotal);
      }

      if (!valid) {
        // skip incomplete year naturally
      }
    }

    const stateSummary = {};
    for (const month of springMonths) {
      stateSummary[month] = summariseValues(cumulativeByMonth[month]);
    }

    stateCumulativeRainfall[state] = stateSummary;
  }

  return stateCumulativeRainfall;
}

function buildBaseline(data) {
  const monthlyRainfall = buildMonthlyRainfallBaseline(data);
  const springTotals = buildSpringTotalsByYear(data, SPRING_MONTHS);
  const springCumulativeRainfall = buildSpringCumulativeRainfall(data, SPRING_MONTHS);
  const springStates = buildSpringStates(springTotals);
  const representative = buildRepresentativeYears(springStates.springTotalsByYear);
  const stateMonthlyRainfall = buildStateMonthlyRainfall(
    data,
    springStates.springTotalsByYear
  );
  const stateCumulativeRainfall = buildStateCumulativeRainfall(
    data,
    springStates.springTotalsByYear,
    SPRING_MONTHS
  );

  return {
    generatedAt: new Date().toISOString(),
    source: data.source || null,
    location: data.location || null,
    springWindow: SPRING_MONTHS,
    monthlyRainfall,
    springCumulativeRainfall,
    ...springStates,
    ...representative,
    stateMonthlyRainfall,
    stateCumulativeRainfall,
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