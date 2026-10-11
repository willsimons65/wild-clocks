
import fs from "node:fs";
import path from "node:path";

const INPUT_DIR = "src/data/cabilla/ecowitt/daily";
const OUTPUT_DIR = "src/data/cabilla/aggregates";

const REQUIRED = [
  "date",
  "mean_temp_c",
  "max_temp_c",
  "min_temp_c",
  "mean_humidity_pct",
  "rainfall_mm",
  "mean_solar_wm2",
  "max_solar_wm2",
  "mean_canopy_temp_c",
  "max_canopy_temp_c",
  "min_canopy_temp_c",
  "mean_canopy_humidity_pct",
  "station_observations",
  "expected_observations",
  "station_coverage_pct",
  "canopy_observations",
  "canopy_coverage_pct",
  "is_partial_day",
];

// Parse CSV, including quoted cells and escaped quotes.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  text = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i++;

      row.push(cell);
      cell = "";

      if (row.some((v) => v.trim() !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      cell += ch;
    }
  }

  if (quoted) {
    throw new Error("Unclosed quoted cell in CSV");
  }

  row.push(cell);

  if (row.some((v) => v.trim() !== "")) {
    rows.push(row);
  }

  const [headers, ...body] = rows;

  if (!headers) return [];

  for (const key of REQUIRED) {
    if (!headers.includes(key)) {
      throw new Error(`Missing CSV column: ${key}`);
    }
  }

  return body.map((cells, i) => {
    if (cells.length !== headers.length) {
      throw new Error(
        `CSV line ${i + 2} has ${cells.length} columns ` +
        `(expected ${headers.length})`
      );
    }

    return Object.fromEntries(
      headers.map((h, j) => [h, cells[j].trim()])
    );
  });
}

function numeric(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const n = Number(value);

  if (!Number.isFinite(n)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  return n;
}

function round(value) {
  if (value == null) return null;

  return Math.round(
    (value + Number.EPSILON) * 10
  ) / 10;
}

function dateValid(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const dt = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(dt.getTime()) &&
    dt.toISOString().slice(0, 10) === date
  );
}

function reading(row, fields, count) {
  const result = {};

  for (const [target, source] of Object.entries(fields)) {
    result[target] = numeric(row[source]);
  }

  result.observations = numeric(row[count]);

  return result;
}

// Find all monthly CSV files.
const files = fs
  .readdirSync(INPUT_DIR)
  .filter((file) =>
    /^cabilla-daily-\d{4}-\d{2}\.csv$/.test(file)
  )
  .sort();

if (!files.length) {
  throw new Error(
    `No monthly CSVs found in ${INPUT_DIR}`
  );
}

const records = new Map();

for (const file of files) {
  const fileMonth = file.match(
    /(\d{4}-\d{2})\.csv$/
  )[1];

  const rows = parseCsv(
    fs.readFileSync(
      path.join(INPUT_DIR, file),
      "utf8"
    )
  );

  for (const row of rows) {
    if (
      !dateValid(row.date) ||
      row.date.slice(0, 7) !== fileMonth
    ) {
      throw new Error(
        `${file}: invalid/out-of-month date ${row.date}`
      );
    }

    if (records.has(row.date)) {
      throw new Error(
        `Duplicate date ${row.date}`
      );
    }

    const outside = reading(
      row,
      {
        meanTemp: "mean_temp_c",
        maxTemp: "max_temp_c",
        minTemp: "min_temp_c",
        humidity: "mean_humidity_pct",
        solarRadiation: "mean_solar_wm2",
        maxSolarRadiation: "max_solar_wm2",
      },
      "station_observations"
    );

    const underCanopy = reading(
      row,
      {
        meanTemp: "mean_canopy_temp_c",
        maxTemp: "max_canopy_temp_c",
        minTemp: "min_canopy_temp_c",
        humidity: "mean_canopy_humidity_pct",
      },
      "canopy_observations"
    );

    const expected = numeric(
      row.expected_observations
    );

    if (expected == null || expected <= 0) {
      throw new Error(
        `${row.date}: invalid expected_observations`
      );
    }

    if (
      outside.observations == null ||
      underCanopy.observations == null ||
      outside.observations < 0 ||
      underCanopy.observations < 0 ||
      outside.observations > expected ||
      underCanopy.observations > expected
    ) {
      throw new Error(
        `${row.date}: invalid observation counts`
      );
    }

    if (
      outside.observations === 0 &&
      Object.entries(outside).some(
        ([key, value]) =>
          key !== "observations" && value !== null
      )
    ) {
      throw new Error(
        `${row.date}: outside values without observations`
      );
    }

    if (
      underCanopy.observations === 0 &&
      Object.entries(underCanopy).some(
        ([key, value]) =>
          key !== "observations" && value !== null
      )
    ) {
      throw new Error(
        `${row.date}: canopy values without observations`
      );
    }

    records.set(row.date, {
      date: row.date,
      outside,
      underCanopy,
      rainfallMm: numeric(row.rainfall_mm),
      coverage: {
        expectedObservations: expected,
        stationPct: numeric(
          row.station_coverage_pct
        ),
        canopyPct: numeric(
          row.canopy_coverage_pct
        ),
        isPartialDay:
          row.is_partial_day === "1" ||
          row.is_partial_day.toLowerCase() === "true",
      },
    });
  }
}

// Create daily and monthly output structures.
const daily = {
  source: "Cabilla Ecowitt daily CSV",
  units: {
    temp: "C",
    humidity: "%",
    solarRadiation: "W/m2",
    rainfall: "mm",
  },
  years: {},
};

const monthly = {
  source: daily.source,
  units: daily.units,
  years: {},
};

const monthGroups = new Map();

for (const d of [...records.values()].sort(
  (a, b) => a.date.localeCompare(b.date)
)) {
  const [year, month, day] = d.date
    .split("-")
    .map(Number);

  (daily.years[year] ??= {})[month] ??= {};
  daily.years[year][month][day] = d;

  const key = `${year}-${month}`;

  if (!monthGroups.has(key)) {
    monthGroups.set(key, []);
  }

  monthGroups.get(key).push(d);
}

// Calculate weighted monthly means.
function weightedMean(days, location, prop) {
  let sum = 0;
  let weight = 0;

  for (const d of days) {
    const value = d[location][prop];
    const count = d[location].observations;

    if (value != null && count > 0) {
      sum += value * count;
      weight += count;
    }
  }

  return weight ? round(sum / weight) : null;
}

function extreme(days, location, prop, fn) {
  const values = days
    .map((d) => d[location][prop])
    .filter((value) => value != null);

  return values.length ? fn(...values) : null;
}

function summariseLocation(days, location) {
  const result = {
    meanTemp: weightedMean(
      days, location, "meanTemp"
    ),
    maxTemp: extreme(
      days, location, "maxTemp", Math.max
    ),
    minTemp: extreme(
      days, location, "minTemp", Math.min
    ),
    humidity: weightedMean(
      days, location, "humidity"
    ),
    observations: days.reduce(
      (sum, d) =>
        sum + d[location].observations,
      0
    ),
  };

  if (location === "outside") {
    result.solarRadiation = weightedMean(
      days, location, "solarRadiation"
    );

    result.maxSolarRadiation = extreme(
      days,
      location,
      "maxSolarRadiation",
      Math.max
    );
  }

  return result;
}

// Build monthly summaries.
for (const [key, days] of monthGroups) {
  const [year, month] = key.split("-").map(Number);

  (monthly.years[year] ??= {})[month] = {
    days: days.length,

    outside: summariseLocation(
      days, "outside"
    ),

    underCanopy: summariseLocation(
      days, "underCanopy"
    ),

    rainfallMm:
      days.some((d) => d.rainfallMm != null) &&
      days.every((d) => d.rainfallMm != null)
        ? round(
            days.reduce(
              (sum, d) => sum + d.rainfallMm,
              0
            )
          )
        : null,

    coverage: {
      expectedObservations: days.reduce(
        (sum, d) =>
          sum + d.coverage.expectedObservations,
        0
      ),

      outsideObservations: days.reduce(
        (sum, d) =>
          sum + d.outside.observations,
        0
      ),

      canopyObservations: days.reduce(
        (sum, d) =>
          sum + d.underCanopy.observations,
        0
      ),

      partialDays: days.filter(
        (d) => d.coverage.isPartialDay
      ).length,
    },
  };
}

// Write output JSON files.
fs.mkdirSync(
  OUTPUT_DIR,
  { recursive: true }
);

fs.writeFileSync(
  path.join(
    OUTPUT_DIR,
    "cabilla-ecowitt-daily.json"
  ),
  JSON.stringify(daily, null, 2) + "\n"
);

fs.writeFileSync(
  path.join(
    OUTPUT_DIR,
    "cabilla-ecowitt-monthly.json"
  ),
  JSON.stringify(monthly, null, 2) + "\n"
);

console.log(
  `Built Ecowitt aggregates from ` +
  `${files.length} CSV(s), ${records.size} days`
);
