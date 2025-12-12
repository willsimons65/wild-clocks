// src/utils/loadSpreadsheet.js

import { parseSpreadsheetDate } from "@/utils/date";

export async function loadWeatherSpreadsheet(csvUrl) {
  const response = await fetch(csvUrl);
  const csvText = await response.text();

  const rows = parseCsv(csvText);

  const normalized = rows
    .filter((r) => r.Place && r.Year && r.Month && r.Date) // remove blanks
    .map((row) => normalizeRow(row));

  // 🔥 The most important line — return the normalized data
  return normalized;
}

/**
 * Minimal CSV parser
 */
function parseCsv(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] ? values[i].trim() : "";
    });
    return obj;
  });
}

/**
 * Convert one CSV row into normalized numeric-safe row.
 */
function normalizeRow(row) {
  const year = Number(row.Year);
  const month = row.Month;
  const day = Number(row.Date);

  const max = Number(row["Tempmax °C"]);
  const min = Number(row["Tempmin °C"]);

  // ⚠️ Catch corrupted or missing temperature values
  if (isNaN(max) || isNaN(min)) {
    console.warn("BAD ROW (non numeric temp):", row);
  }

  return {
    place: row.Place,
    year,
    month,
    day,
    fullDate: parseSpreadsheetDate({ year, month, day }),

    temperatureMax: max,
    temperatureMin: min,
    precipitation: Number(row["Precipitation mm"]),
    humidity: Number(row["Humidity %"]),
    photoperiod: Number(row["Photoperiod"]) || null,
  };
}


