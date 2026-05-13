import fs from "node:fs";
import path from "node:path";

const INPUT = "src/data/cabilla/raw/20260507_datahog_export.txt";
const OUTPUT = "src/data/cabilla/parsed/cabilla-microclimate-raw.json";

const CHANNELS = {
  0: "solarRadiation",
  1: "windSpeed",
  2: "windDirection",
  3: "unused",
  4: "windDirectionSecondary",
  5: "temperature",
  6: "relativeHumidity",
};

function parseDateTime(time, date) {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}T${time}`;
}

function parseLine(line) {
  const parts = line.trim().split(/\s+/);

  if (parts.length < 4) return null;
  if (!/^\d{2}:\d{2}:\d{2}$/.test(parts[0])) return null;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(parts[1])) return null;

  const timestamp = parseDateTime(parts[0], parts[1]);
  const readings = {};

  for (let i = 2; i < parts.length - 1; i += 2) {
    const channel = Number(parts[i]);
    const value = Number(parts[i + 1]);

    const key = CHANNELS[channel] || `channel${channel}`;
    readings[key] = value;
  }

  return { timestamp, ...readings };
}

const text = fs.readFileSync(INPUT, "utf8");

const rows = text
  .split(/\r?\n/)
  .map(parseLine)
  .filter(Boolean)
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// de-dupe by timestamp, keeping the fullest row
const byTimestamp = new Map();

for (const row of rows) {
  const existing = byTimestamp.get(row.timestamp);

  if (!existing || Object.keys(row).length > Object.keys(existing).length) {
    byTimestamp.set(row.timestamp, row);
  }
}

const cleaned = [...byTimestamp.values()];

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

fs.writeFileSync(
  OUTPUT,
  JSON.stringify(
    {
      source: "Cabilla DataHog export",
      generatedAt: new Date().toISOString(),
      channelMapping: CHANNELS,
      rows: cleaned,
    },
    null,
    2
  )
);

console.log(`Parsed ${cleaned.length} rows`);