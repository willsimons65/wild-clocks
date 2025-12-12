// src/utils/charts.js

// -------------------------------------------------------------
// GROUP ROWS BY MONTH
// Given an array of spreadsheet rows, returns:
// {
//   January: [ ...rows ],
//   February: [ ...rows ],
//   ...
// }
// -------------------------------------------------------------
export function groupByMonth(rows) {
  const out = {};

  rows.forEach((row) => {
    if (!row.month) return;

    if (!out[row.month]) out[row.month] = [];
    out[row.month].push(row);
  });

  // Ensure rows are sorted by day
  Object.keys(out).forEach((m) => {
    out[m].sort((a, b) => Number(a.day) - Number(b.day));
  });

  return out;
}



// -------------------------------------------------------------
// DYNAMIC FIVE-DAY TICKS
//
// OLD VERSION (buggy): 1, 5, 10, 15, 20, 25, lastDay
// NEW VERSION (correct): evenly spaced ticks for ANY month
//
// Example for a 31-day month:
// [1, 7, 13, 19, 25, 31]
//
// Example for a 28-day month:
// [1, 6, 11, 16, 21, 28]
//
// This ensures:
// - first tick = 1
// - last tick = actual month length
// - ticks scale smoothly across screen width
// -------------------------------------------------------------
export function getFiveDayTicks(data) {
  if (!data || data.length === 0) return [];

  const last = Math.max(...data.map((d) => Number(d.day)));

  const TICK_COUNT = 6; // 6 ticks always
  const ticks = [];

  for (let i = 0; i < TICK_COUNT; i++) {
    const t = 1 + (i * (last - 1)) / (TICK_COUNT - 1);
    ticks.push(Math.round(t));
  }

  // Force exact last day
  ticks[ticks.length - 1] = last;

  return ticks;
}



// -------------------------------------------------------------
// MODULE EXPORTS (optional convenience)
// -------------------------------------------------------------
export default {
  groupByMonth,
  getFiveDayTicks,
};
