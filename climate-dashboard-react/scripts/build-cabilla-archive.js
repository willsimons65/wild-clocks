#!/usr/bin/env node

/**
 * Build the Cabilla Wild Clocks archive from Ecowitt CSV exports.
 *
 * Outputs:
 *   cabilla-full-resolution-YYYY-MM.csv
 *   cabilla-daily-YYYY-MM.csv
 *   cabilla-validation-YYYY-MM.txt
 *
 * Usage (August 2026 example):
 *   node scripts/build-cabilla-archive.js \
 *     --input ~/Documents/wild-clocks-data/cabilla/2026/08 \
 *     --year 2026 \
 *     --month 8 \
 *     --start "2026-08-28 13:35" \
 *     --out ~/Documents/wild-clocks-data/cabilla/2026/08/processed
 *
 * Normal full month:
 *   node scripts/build-cabilla-archive.js \
 *     --input ~/Documents/wild-clocks-data/cabilla/2026/09 \
 *     --year 2026 \
 *     --month 9 \
 *     --out ~/Documents/wild-clocks-data/cabilla/2026/09/processed
 *
 * Notes:
 * - Expects Ecowitt CSV exports with the standard two-row header.
 * - Default expected interval is 5 minutes.
 * - Missing expected timestamps are retained with blank measurements.
 * - No interpolation is performed.
 * - Canopy coverage is tracked independently from the main station.
 * - Daily rainfall uses the maximum Ecowitt Daily(mm) cumulative value;
 *   Daily(mm) is never summed.
 * - Output timestamps are ISO 8601 Europe/London local time with an
 *   explicit UTC offset. The grid is generated in real elapsed time, so
 *   British Summer Time clock changes are represented correctly.
 */

import fs from "node:fs";
import path from "node:path";

const TIME_ZONE = "Europe/London";
const DEFAULT_INTERVAL_MINUTES = 5;

const FULL_COLUMNS = [
  "timestamp",
  "station_available",
  "canopy_available",
  "station_temp_c",
  "station_feels_like_c",
  "station_dew_point_c",
  "station_humidity_pct",
  "station_vpd_kpa",
  "solar_wm2",
  "uvi",
  "rain_rate_mm_hr",
  "rain_daily_mm",
  "rain_event_mm",
  "rain_hourly_mm",
  "rain_24h_mm",
  "rain_weekly_mm",
  "rain_monthly_mm",
  "rain_yearly_mm",
  "wind_speed_mph",
  "wind_gust_mph",
  "wind_direction_deg",
  "wind_direction_10min_deg",
  "canopy_temp_c",
  "canopy_humidity_pct",
  "wind_sensor_v",
  "rainfall_sensor_v",
  "console_v",
  "console_pct",
  "external_supply_v",
];

const DAILY_COLUMNS = [
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

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value = argv[i + 1];

    if (!value || value.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = value;
      i += 1;
    }
  }

  return args;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function monthName(year, month) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  values.push(current);

  return values;
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";

  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function writeCsv(filePath, columns, rows) {
  const lines = [columns.join(",")];

  for (const row of rows) {
    lines.push(
      columns
        .map((column) => csvEscape(row[column]))
        .join(",")
    );
  }

  fs.writeFileSync(
    filePath,
    `${lines.join("\n")}\n`,
    "utf8"
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replaceAll("℃", "C")
    .replaceAll("º", "deg")
    .replaceAll("²", "2")
    .replace(/\s+/g, " ");
}

function toNumber(value) {
  const text = String(value ?? "").trim();

  if (
    !text ||
    text === "-" ||
    text.toLowerCase() === "null"
  ) {
    return null;
  }

  const number = Number(text);

  return Number.isFinite(number)
    ? number
    : null;
}

function buildColumnDescriptors(
  groupRow,
  fieldRow
) {
  const width = Math.max(
    groupRow.length,
    fieldRow.length
  );

  let currentGroup = "";

  const descriptors = [];

  for (let i = 0; i < width; i += 1) {
    const groupCell = normalizeText(
      groupRow[i]
    );

    if (groupCell) {
      currentGroup = groupCell;
    }

    const field = normalizeText(
      fieldRow[i]
    );

    descriptors.push({
      index: i,
      group: currentGroup,
      field,
    });
  }

  return descriptors;
}

function findColumn(
  descriptors,
  group,
  field
) {
  const wantedGroup =
    normalizeText(group).toLowerCase();

  const wantedField =
    normalizeText(field).toLowerCase();

  const found = descriptors.find(
    (descriptor) =>
      descriptor.group.toLowerCase() ===
        wantedGroup &&
      descriptor.field.toLowerCase() ===
        wantedField
  );

  return found?.index ?? null;
}

function makeIndices(descriptors) {
  const idx = (group, field) =>
    findColumn(
      descriptors,
      group,
      field
    );

  return {
    time:
      descriptors.find(
        (descriptor) =>
          descriptor.index === 0
      )?.index ?? 0,

    stationTemp: idx(
      "Sky",
      "Temperature(C)"
    ),

    feelsLike: idx(
      "Sky",
      "Feels Like(C)"
    ),

    dewPoint: idx(
      "Sky",
      "Dew Point(C)"
    ),

    stationHumidity: idx(
      "Sky",
      "Humidity(%)"
    ),

    vpd: idx(
      "Sky",
      "VPD(kPa)"
    ),

    solar: idx(
      "Solar and UVI",
      "Solar(W/m2)"
    ),

    uvi: idx(
      "Solar and UVI",
      "UVI"
    ),

    rainRate: idx(
      "Rainfall",
      "Rain Rate(mm/hr)"
    ),

    rainDaily: idx(
      "Rainfall",
      "Daily(mm)"
    ),

    rainEvent: idx(
      "Rainfall",
      "Event(mm)"
    ),

    rainHourly: idx(
      "Rainfall",
      "Hourly(mm)"
    ),

    rain24h: idx(
      "Rainfall",
      "24 Hours(mm)"
    ),

    rainWeekly: idx(
      "Rainfall",
      "Weekly(mm)"
    ),

    rainMonthly: idx(
      "Rainfall",
      "Monthly(mm)"
    ),

    rainYearly: idx(
      "Rainfall",
      "Yearly(mm)"
    ),

    windSpeed: idx(
      "Wind",
      "Wind Speed(mph)"
    ),

    windGust: idx(
      "Wind",
      "Wind Gust(mph)"
    ),

    windDirection: idx(
      "Wind",
      "Wind Direction(deg)"
    ),

    windDirection10min: idx(
      "Wind",
      "10-minute Average Wind Direction(deg)"
    ),

    canopyTemp: idx(
      "Canopy",
      "Temperature(C)"
    ),

    canopyHumidity: idx(
      "Canopy",
      "Humidity(%)"
    ),

    windSensorV: idx(
      "Battery",
      "Wind Sensor(V)"
    ),

    rainfallSensorV: idx(
      "Battery",
      "Rainfall Sensor(V)"
    ),

    consoleV: idx(
      "Battery",
      "Console(V)"
    ),

    consolePct: idx(
      "Battery",
      "Console(%)"
    ),

    externalSupplyV: idx(
      "Battery",
      "External Supply(V)"
    ),
  };
}

function cell(row, index) {
  return index === null ||
    index === undefined
    ? null
    : toNumber(row[index]);
}

function readEcowittCsv(filePath) {
  const text = fs
    .readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "");

  const lines = text
    .split(/\r?\n/)
    .filter(
      (line) => line.length > 0
    );

  if (lines.length < 3) {
    throw new Error(
      `${filePath}: expected two header rows and data`
    );
  }

  const groupRow =
    parseCsvLine(lines[0]);

  const fieldRow =
    parseCsvLine(lines[1]);

  const descriptors =
    buildColumnDescriptors(
      groupRow,
      fieldRow
    );

  const indices =
    makeIndices(descriptors);

  if (
    indices.stationTemp === null ||
    indices.stationHumidity === null
  ) {
    throw new Error(
      `${filePath}: Sky temperature/humidity columns not found`
    );
  }

  return lines
    .slice(2)
    .map(
      (line, rowIndex) => {
        const row =
          parseCsvLine(line);

        const localTime =
          String(
            row[indices.time] ?? ""
          ).trim();

        if (
          !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(
            localTime
          )
        ) {
          throw new Error(
            `${filePath}: invalid timestamp on data row ${
              rowIndex + 3
            }: ${localTime}`
          );
        }

        return {
          sourceFile:
            path.basename(filePath),

          localTime,

          station_temp_c: cell(
            row,
            indices.stationTemp
          ),

          station_feels_like_c:
            cell(
              row,
              indices.feelsLike
            ),

          station_dew_point_c:
            cell(
              row,
              indices.dewPoint
            ),

          station_humidity_pct:
            cell(
              row,
              indices.stationHumidity
            ),

          station_vpd_kpa: cell(
            row,
            indices.vpd
          ),

          solar_wm2: cell(
            row,
            indices.solar
          ),

          uvi: cell(
            row,
            indices.uvi
          ),

          rain_rate_mm_hr: cell(
            row,
            indices.rainRate
          ),

          rain_daily_mm: cell(
            row,
            indices.rainDaily
          ),

          rain_event_mm: cell(
            row,
            indices.rainEvent
          ),

          rain_hourly_mm: cell(
            row,
            indices.rainHourly
          ),

          rain_24h_mm: cell(
            row,
            indices.rain24h
          ),

          rain_weekly_mm: cell(
            row,
            indices.rainWeekly
          ),

          rain_monthly_mm: cell(
            row,
            indices.rainMonthly
          ),

          rain_yearly_mm: cell(
            row,
            indices.rainYearly
          ),

          wind_speed_mph: cell(
            row,
            indices.windSpeed
          ),

          wind_gust_mph: cell(
            row,
            indices.windGust
          ),

          wind_direction_deg:
            cell(
              row,
              indices.windDirection
            ),

          wind_direction_10min_deg:
            cell(
              row,
              indices.windDirection10min
            ),

          canopy_temp_c: cell(
            row,
            indices.canopyTemp
          ),

          canopy_humidity_pct:
            cell(
              row,
              indices.canopyHumidity
            ),

          wind_sensor_v: cell(
            row,
            indices.windSensorV
          ),

          rainfall_sensor_v:
            cell(
              row,
              indices.rainfallSensorV
            ),

          console_v: cell(
            row,
            indices.consoleV
          ),

          console_pct: cell(
            row,
            indices.consolePct
          ),

          external_supply_v:
            cell(
              row,
              indices.externalSupplyV
            ),
        };
      }
    );
}

const localFormatter =
  new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }
  );

function localParts(utcMs) {
  const parts =
    Object.fromEntries(
      localFormatter
        .formatToParts(
          new Date(utcMs)
        )
        .filter(
          (part) =>
            part.type !== "literal"
        )
        .map(
          (part) => [
            part.type,
            part.value,
          ]
        )
    );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function localKeyFromUtc(utcMs) {
  const p = localParts(utcMs);

  return `${p.year}-${pad2(
    p.month
  )}-${pad2(
    p.day
  )} ${pad2(
    p.hour
  )}:${pad2(
    p.minute
  )}`;
}

function dateKeyFromUtc(utcMs) {
  const p = localParts(utcMs);

  return `${p.year}-${pad2(
    p.month
  )}-${pad2(
    p.day
  )}`;
}

function offsetMinutesForUtc(
  utcMs
) {
  const p = localParts(utcMs);

  const localAsUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour,
    p.minute
  );

  return Math.round(
    (localAsUtc - utcMs) /
      60000
  );
}

function isoInLondon(utcMs) {
  const p = localParts(utcMs);

  const offset =
    offsetMinutesForUtc(
      utcMs
    );

  const sign =
    offset >= 0 ? "+" : "-";

  const abs =
    Math.abs(offset);

  const offsetText =
    `${sign}${pad2(
      Math.floor(abs / 60)
    )}:${pad2(
      abs % 60
    )}`;

  return `${p.year}-${pad2(
    p.month
  )}-${pad2(
    p.day
  )}T${pad2(
    p.hour
  )}:${pad2(
    p.minute
  )}${offsetText}`;
}

function parseLocalString(
  value
) {
  const match =
    String(value).match(
      /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/
    );

  if (!match) {
    throw new Error(
      `Invalid local date/time: ${value}`
    );
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  };
}

function localToUtcCandidates(
  localString
) {
  const target =
    parseLocalString(
      localString
    );

  const naive = Date.UTC(
    target.year,
    target.month - 1,
    target.day,
    target.hour,
    target.minute
  );

  const candidates = [];

  for (
    let deltaMinutes = -120;
    deltaMinutes <= 120;
    deltaMinutes += 1
  ) {
    const candidate =
      naive +
      deltaMinutes * 60000;

    if (
      localKeyFromUtc(
        candidate
      ) === localString
    ) {
      candidates.push(
        candidate
      );
    }
  }

  return [
    ...new Set(candidates),
  ].sort(
    (a, b) => a - b
  );
}

function resolveLocalToUtc(
  localString,
  prefer = "earlier"
) {
  const candidates =
    localToUtcCandidates(
      localString
    );

  if (
    candidates.length === 0
  ) {
    throw new Error(
      `${localString} does not exist in ${TIME_ZONE} (possible DST clock change)`
    );
  }

  return prefer === "later"
    ? candidates[
        candidates.length - 1
      ]
    : candidates[0];
}

function round(
  value,
  decimals
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  const factor =
    10 ** decimals;

  return (
    Math.round(
      (value +
        Number.EPSILON) *
        factor
    ) / factor
  );
}

function mean(values) {
  const valid =
    values.filter(
      (value) =>
        Number.isFinite(value)
    );

  if (
    valid.length === 0
  ) {
    return null;
  }

  return (
    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / valid.length
  );
}

function maxValue(values) {
  const valid =
    values.filter(
      (value) =>
        Number.isFinite(value)
    );

  return valid.length
    ? Math.max(...valid)
    : null;
}

function minValue(values) {
  const valid =
    values.filter(
      (value) =>
        Number.isFinite(value)
    );

  return valid.length
    ? Math.min(...valid)
    : null;
}

function contiguousRanges(
  utcTimes,
  intervalMinutes
) {
  if (!utcTimes.length) {
    return [];
  }

  const sorted = [
    ...utcTimes,
  ].sort(
    (a, b) => a - b
  );

  const step =
    intervalMinutes *
    60000;

  const ranges = [];

  let start =
    sorted[0];

  let previous =
    sorted[0];

  for (
    let i = 1;
    i < sorted.length;
    i += 1
  ) {
    const current =
      sorted[i];

    if (
      current - previous !==
      step
    ) {
      ranges.push([
        start,
        previous,
      ]);

      start = current;
    }

    previous = current;
  }

  ranges.push([
    start,
    previous,
  ]);

  return ranges;
}

function displayLocal(utcMs) {
  return localKeyFromUtc(
    utcMs
  ).slice(11);
}

const args =
  parseArgs(
    process.argv.slice(2)
  );

const inputDir =
  args.input
    ? path.resolve(
        args.input
      )
    : null;

const outDir =
  args.out
    ? path.resolve(
        args.out
      )
    : null;

const year =
  Number(args.year);

const month =
  Number(args.month);

const intervalMinutes =
  Number(
    args.interval ??
      DEFAULT_INTERVAL_MINUTES
  );

if (!inputDir) {
  fail(
    "--input is required"
  );
}

if (!outDir) {
  fail(
    "--out is required"
  );
}

if (
  !Number.isInteger(
    year
  ) ||
  year < 2000
) {
  fail(
    "--year must be a valid year"
  );
}

if (
  !Number.isInteger(
    month
  ) ||
  month < 1 ||
  month > 12
) {
  fail(
    "--month must be 1–12"
  );
}

if (
  !Number.isInteger(
    intervalMinutes
  ) ||
  intervalMinutes <= 0
) {
  fail(
    "--interval must be a positive number of minutes"
  );
}

if (
  !fs.existsSync(inputDir)
) {
  fail(
    `input folder does not exist: ${inputDir}`
  );
}

const sourceFiles = fs
  .readdirSync(inputDir)
  .filter(
    (name) =>
      name
        .toLowerCase()
        .endsWith(".csv")
  )
  .sort()
  .map(
    (name) =>
      path.join(
        inputDir,
        name
      )
  );

if (
  sourceFiles.length === 0
) {
  fail(
    `no CSV files found in ${inputDir}`
  );
}

let sourceRows = [];

for (
  const file of sourceFiles
) {
  sourceRows =
    sourceRows.concat(
      readEcowittCsv(file)
    );
}

const monthPrefix =
  `${year}-${pad2(
    month
  )}-`;

sourceRows =
  sourceRows.filter(
    (row) =>
      row.localTime.startsWith(
        monthPrefix
      )
  );

if (
  sourceRows.length === 0
) {
  fail(
    `no source observations found for ${year}-${pad2(
      month
    )}`
  );
}

const defaultStart =
  `${year}-${pad2(
    month
  )}-01 00:00`;

const lastDay =
  daysInMonth(
    year,
    month
  );

const defaultEnd =
  `${year}-${pad2(
    month
  )}-${pad2(
    lastDay
  )} 23:${pad2(
    60 -
      intervalMinutes
  )}`;

const startLocal =
  args.start ??
  defaultStart;

const endLocal =
  args.end ??
  defaultEnd;

const startUtc =
  resolveLocalToUtc(
    startLocal,
    "earlier"
  );

const endUtc =
  resolveLocalToUtc(
    endLocal,
    "later"
  );

if (
  endUtc < startUtc
) {
  fail(
    "archive end is before archive start"
  );
}

// Group source rows by wall-clock timestamp.
// Arrays preserve repeated local times across
// the autumn DST transition if Ecowitt exports
// both instances.

const sourceByLocal =
  new Map();

for (
  const row of sourceRows
) {
  if (
    !sourceByLocal.has(
      row.localTime
    )
  ) {
    sourceByLocal.set(
      row.localTime,
      []
    );
  }

  sourceByLocal
    .get(row.localTime)
    .push(row);
}

const canonicalRows = [];

const expectedUtcTimes = [];

const intervalMs =
  intervalMinutes *
  60000;

for (
  let utcMs = startUtc;
  utcMs <= endUtc;
  utcMs += intervalMs
) {
  expectedUtcTimes.push(
    utcMs
  );

  const localKey =
    localKeyFromUtc(
      utcMs
    );

  const candidates =
    sourceByLocal.get(
      localKey
    ) ?? [];

  const source =
    candidates.length
      ? candidates.shift()
      : null;

  const stationAvailable =
    Boolean(
      source &&
        Number.isFinite(
          source.station_temp_c
        ) &&
        Number.isFinite(
          source.station_humidity_pct
        )
    );

  const canopyAvailable =
    Boolean(
      source &&
        Number.isFinite(
          source.canopy_temp_c
        ) &&
        Number.isFinite(
          source.canopy_humidity_pct
        )
    );

  const row = {
    timestamp:
      isoInLondon(
        utcMs
      ),

    station_available:
      stationAvailable
        ? 1
        : 0,

    canopy_available:
      canopyAvailable
        ? 1
        : 0,
  };

  for (
    const column of
      FULL_COLUMNS.slice(3)
  ) {
    row[column] =
      source?.[column] ??
      null;
  }

  canonicalRows.push({
    ...row,
    _utcMs: utcMs,
    _date:
      dateKeyFromUtc(
        utcMs
      ),
  });
}

const dailyRows = [];

const byDate =
  new Map();

for (
  const row of canonicalRows
) {
  if (
    !byDate.has(
      row._date
    )
  ) {
    byDate.set(
      row._date,
      []
    );
  }

  byDate
    .get(row._date)
    .push(row);
}

for (
  const [
    date,
    rows,
  ] of byDate.entries()
) {
  const stationRows =
    rows.filter(
      (row) =>
        row.station_available ===
        1
    );

  const canopyRows =
    rows.filter(
      (row) =>
        row.canopy_available ===
        1
    );

  const expected =
    rows.length;

  const firstExpectedLocal =
    localKeyFromUtc(
      rows[0]._utcMs
    );

  const lastExpectedLocal =
    localKeyFromUtc(
      rows[
        rows.length - 1
      ]._utcMs
    );

  const partialDay =
    !firstExpectedLocal.endsWith(
      "00:00"
    ) ||
    !lastExpectedLocal.endsWith(
      `23:${pad2(
        60 -
          intervalMinutes
      )}`
    );

  dailyRows.push({
    date,

    mean_temp_c:
      round(
        mean(
          stationRows.map(
            (row) =>
              row.station_temp_c
          )
        ),
        2
      ),

    max_temp_c:
      round(
        maxValue(
          stationRows.map(
            (row) =>
              row.station_temp_c
          )
        ),
        1
      ),

    min_temp_c:
      round(
        minValue(
          stationRows.map(
            (row) =>
              row.station_temp_c
          )
        ),
        1
      ),

    mean_humidity_pct:
      round(
        mean(
          stationRows.map(
            (row) =>
              row.station_humidity_pct
          )
        ),
        1
      ),

    rainfall_mm:
      round(
        maxValue(
          stationRows.map(
            (row) =>
              row.rain_daily_mm
          )
        ),
        1
      ),

    mean_solar_wm2:
      round(
        mean(
          stationRows.map(
            (row) =>
              row.solar_wm2
          )
        ),
        1
      ),

    max_solar_wm2:
      round(
        maxValue(
          stationRows.map(
            (row) =>
              row.solar_wm2
          )
        ),
        1
      ),

    mean_canopy_temp_c:
      round(
        mean(
          canopyRows.map(
            (row) =>
              row.canopy_temp_c
          )
        ),
        2
      ),

    max_canopy_temp_c:
      round(
        maxValue(
          canopyRows.map(
            (row) =>
              row.canopy_temp_c
          )
        ),
        1
      ),

    min_canopy_temp_c:
      round(
        minValue(
          canopyRows.map(
            (row) =>
              row.canopy_temp_c
          )
        ),
        1
      ),

    mean_canopy_humidity_pct:
      round(
        mean(
          canopyRows.map(
            (row) =>
              row.canopy_humidity_pct
          )
        ),
        1
      ),

    station_observations:
      stationRows.length,

    expected_observations:
      expected,

    station_coverage_pct:
      round(
        (
          stationRows.length /
          expected
        ) * 100,
        1
      ),

    canopy_observations:
      canopyRows.length,

    canopy_coverage_pct:
      round(
        (
          canopyRows.length /
          expected
        ) * 100,
        1
      ),

    is_partial_day:
      partialDay
        ? 1
        : 0,
  });
}

fs.mkdirSync(
  outDir,
  {
    recursive: true,
  }
);

const suffix =
  `${year}-${pad2(
    month
  )}`;

const fullPath =
  path.join(
    outDir,
    `cabilla-full-resolution-${suffix}.csv`
  );

const dailyPath =
  path.join(
    outDir,
    `cabilla-daily-${suffix}.csv`
  );

const validationPath =
  path.join(
    outDir,
    `cabilla-validation-${suffix}.txt`
  );

writeCsv(
  fullPath,
  FULL_COLUMNS,
  canonicalRows.map(
    ({
      _utcMs,
      _date,
      ...row
    }) => row
  )
);

writeCsv(
  dailyPath,
  DAILY_COLUMNS,
  dailyRows
);

const missingStationTimes =
  canonicalRows
    .filter(
      (row) =>
        row.station_available ===
        0
    )
    .map(
      (row) =>
        row._utcMs
    );

const validation = [];

validation.push(
  `Cabilla archive validation — ${monthName(
    year,
    month
  )} ${year}`,
  "",
  "Source",
  `- ${
    sourceFiles.length
  } Ecowitt CSV export${
    sourceFiles.length === 1
      ? ""
      : "s"
  }.`,
  `- Expected archive interval: ${intervalMinutes} minutes.`,
  `- Canonical archive period: ${startLocal} to ${endLocal} Europe/London.`,
  "",
  "Canonical full-resolution grid",
  `- Expected timestamps: ${canonicalRows.length}`,
  `- Station observations available: ${
    canonicalRows.length -
    missingStationTimes.length
  }`,
  `- Missing station observations: ${missingStationTimes.length}`
);

if (
  missingStationTimes.length
) {
  for (
    const [
      rangeStart,
      rangeEnd,
    ] of contiguousRanges(
      missingStationTimes,
      intervalMinutes
    )
  ) {
    const startText =
      localKeyFromUtc(
        rangeStart
      );

    const endText =
      localKeyFromUtc(
        rangeEnd
      );

    validation.push(
      rangeStart ===
        rangeEnd
        ? `  - ${startText}`
        : `  - ${startText} to ${endText}`
    );
  }
} else {
  validation.push(
    "  - None"
  );
}

validation.push(
  "- Missing intervals are represented explicitly as timestamped rows with blank measurements.",
  "",
  "Canopy coverage"
);

for (
  const daily of dailyRows
) {
  validation.push(
    `- ${daily.date}: ${daily.canopy_observations} / ${daily.expected_observations} observations (${daily.canopy_coverage_pct}%).`
  );

  const dayRows =
    canonicalRows.filter(
      (row) =>
        row._date ===
        daily.date
    );

  const missingCanopyTimes =
    dayRows
      .filter(
        (row) =>
          row.canopy_available ===
          0
      )
      .map(
        (row) =>
          row._utcMs
      );

  // Only expand ranges when
  // there are gaps but not an
  // entire day of absence.

  if (
    missingCanopyTimes.length >
      0 &&
    missingCanopyTimes.length <
      daily.expected_observations
  ) {
    for (
      const [
        rangeStart,
        rangeEnd,
      ] of contiguousRanges(
        missingCanopyTimes,
        intervalMinutes
      )
    ) {
      validation.push(
        rangeStart ===
          rangeEnd
          ? `  - Missing ${displayLocal(
              rangeStart
            )}`
          : `  - Missing ${displayLocal(
              rangeStart
            )}–${displayLocal(
              rangeEnd
            )}`
      );
    }
  }
}

validation.push(
  "",
  "Daily rainfall"
);

for (
  const daily of dailyRows
) {
  validation.push(
    `- ${daily.date}: ${
      daily.rainfall_mm ??
      "no value"
    } mm`
  );
}

validation.push(
  "- Rainfall is derived from the maximum Ecowitt Daily(mm) cumulative value for each date; Daily(mm) is not summed.",
  "",
  "Partial-day handling"
);

const partialDays =
  dailyRows.filter(
    (row) =>
      row.is_partial_day ===
      1
  );

if (
  partialDays.length
) {
  for (
    const daily of partialDays
  ) {
    validation.push(
      `- ${daily.date} is flagged as a partial day.`
    );
  }
} else {
  validation.push(
    "- No partial days in the canonical archive period."
  );
}

validation.push(
  "",
  "Notes",
  "- No interpolation has been applied.",
  "- Missing station intervals remain blank.",
  "- Canopy gaps remain blank.",
  `- Timestamps are ISO 8601 ${TIME_ZONE} local time with an explicit UTC offset.`
);

fs.writeFileSync(
  validationPath,
  `${validation.join(
    "\n"
  )}\n`,
  "utf8"
);

console.log(
  `Cabilla archive built for ${monthName(
    year,
    month
  )} ${year}`
);

console.log(
  `Source CSVs: ${sourceFiles.length}`
);

console.log(
  `Expected timestamps: ${canonicalRows.length}`
);

console.log(
  `Station observations: ${
    canonicalRows.length -
    missingStationTimes.length
  }/${canonicalRows.length}`
);

console.log(
  `Missing station observations: ${missingStationTimes.length}`
);

console.log(
  "\nCreated:"
);

console.log(
  `- ${fullPath}`
);

console.log(
  `- ${dailyPath}`
);

console.log(
  `- ${validationPath}`
);