// src/utils/scale.js

// NOTE: This scale function is legacy and not used by the current chart system.
// Charts now use makeXScale() in utils/xAxis.js.
// Kept for compatibility with older code snippets only.

export function getXScale(width, data) {
  if (!data || data.length === 0) {
    return () => 0;
  }

  // Sort to ensure correct chronological order
  const sorted = [...data].sort(
    (a, b) => new Date(a.fullDate) - new Date(b.fullDate)
  );

  const firstDate = new Date(sorted[0].fullDate);
  const year = firstDate.getFullYear();
  const month = firstDate.getMonth();

  // Correct number of days in the month
  const dayCount = new Date(year, month + 1, 0).getDate();

  // 🔒 Safety: avoid divide-by-zero if corrupted input ever appears
  const safeDayCount = Math.max(dayCount, 2);

  return function xScale(fullDate) {
    const d = new Date(fullDate);
    const day = d.getDate();

    return ((day - 1) / (safeDayCount - 1)) * width;
  };
}





