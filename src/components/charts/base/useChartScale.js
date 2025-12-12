// src/components/charts/base/useChartScale.js
// Responsive-safe linear scale factory

import { useMemo } from "react";

/**
 * React hook that returns a fresh linear scale (like d3.scaleLinear)
 * Whenever `domain` or `range` changes (e.g., responsive width),
 * the scale is rebuilt and always correct.
 */
export function useChartScale(domain, range) {
  return useMemo(() => {
    const [d0, d1] = domain;
    const [r0, r1] = range;

    // Protect against degenerate domain
    if (d0 === d1) {
      const mid = (r0 + r1) / 2;
      const scale = () => mid;
      scale.invert = () => d0;
      return scale;
    }

    const m = (r1 - r0) / (d1 - d0);

    const scale = (value) => r0 + (value - d0) * m;
    scale.invert = (px) => d0 + (px - r0) / m;

    return scale;
  }, [
    domain[0],
    domain[1],
    range[0],
    range[1],
  ]);
}




