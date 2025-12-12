// src/utils/xAxis.js

import { useChartScale } from "@/components/charts/base/useChartScale";

/**
 * Create a responsive x-scale for days 1..lastDay
 * @param {number} lastDay
 * @param {number} width - dynamic pixel width from useChartWidth
 */
export function makeXScale(lastDay, width) {
  return useChartScale([1, lastDay], [0, width]);
}

/**
 * Returns evenly spaced ticks:
 * Always 1, then roughly every 1/5 of month,
 * ending exactly at lastDay (28/29/30/31).
 */
export function makeXTicks(lastDay) {
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
