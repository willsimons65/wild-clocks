// src/utils/tooltipPosition.js

/**
 * Computes whether the date bubble should appear ABOVE or BELOW
 * the hover circle based on how close the circle is to the top
 * of the chart area.
 *
 * @param {number} yPx - the pixel Y position of the hovered value
 * @param {number} chartHeight - the height of the drawable chart
 * @param {number} paddingTop - top padding used for the inner <g> translate
 * @returns {"above" | "below"}
 */
export function computeBubblePosition(yPx, chartHeight, paddingTop) {
  if (yPx == null) return "above";

  // threshold: top quarter of chart area
  const flipThreshold = paddingTop + chartHeight * 0.25;

  return yPx < flipThreshold ? "below" : "above";
}
