// src/utils/date.js

const MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export function parseSpreadsheetDate({ year, month, day }) {
  const m = MONTH_INDEX[month];

  // Use UTC to avoid local timezone shifting the day backward
  const d = new Date(Date.UTC(year, m, day));

  // Return ISO format YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

