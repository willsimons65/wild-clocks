// src/constants/chartLayout.js

// src/constants/chartLayout.js

// --- Chart drawing area height (used everywhere) ---
export const CHART_HEIGHT = 240;

// --- Padding for inner SVG <g> translation ---
export const PADDING_LEFT = 20;
export const PADDING_TOP = 20;

// --- Axis & grid styling ---
export const AXIS_FONT_SIZE = 12;
export const AXIS_COLOR = "#e5e5e5";

export const GRID_STROKE = "#666";
export const GRID_DASH = "4 4";

// --- Dynamic rainfall tick helper (still in use) ---
export function getMonthXTicks(lastDay) {
  return [1, 5, 10, 15, 20, 25, lastDay].filter(
    (d, i, arr) => d <= lastDay && arr.indexOf(d) === i
  );
}




