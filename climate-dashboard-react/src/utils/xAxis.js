// src/utils/xAxis.js

import { useChartScale } from "@/components/charts/base/useChartScale";

/**
 * Create a responsive x-scale for discrete steps (days or months).
 * Bars and labels are inset by half a step so they sit inside the frame,
 * preventing edge overlap.
 *
 * @param {number} lastDay - number of steps (e.g. 12 for months, 31 for days)
 * @param {number} width - drawable chart width in pixels
 */
export function makeXScale(count, width) {
  if (!Number.isFinite(count) || count <= 0) {
    return () => width / 2;
  }

  const slot = width / count;

  return (value) => {
    // value is 1..count
    return (value - 0.5) * slot;
  };
}


/**
 * Returns evenly spaced ticks.
 * Tick values remain unchanged — only their *positions* are inset by the scale.
 */
export function makeXTicks(lastDay) {
  if (!Number.isFinite(lastDay) || lastDay <= 1) {
    return [];
  }

  const ticks = [1];
  const step = Math.floor(lastDay / 5);

  for (let d = 1 + step; d < lastDay; d += step) {
    ticks.push(Math.round(d));
  }

  if (ticks[ticks.length - 1] !== lastDay) {
    ticks.push(lastDay);
  }

  return ticks;
}

/**
 * Get number of days in a month.
 * monthIndex = 1..12
 */
export function getLastDay(year, monthIndex) {
  return new Date(year, monthIndex, 0).getDate();
}

