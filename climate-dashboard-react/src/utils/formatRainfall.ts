type FormatOptions = {
  forceUnit?: "mm" | "m";
  decimals?: number;
};

/**
 * Formats rainfall values consistently across the app.
 *
 * Rules:
 * - Default auto-switch:
 *   - < 1000mm → mm
 *   - ≥ 1000mm → m
 * - Optional forced unit (used in tables)
 * - Graceful handling of null / undefined
 */
export function formatRainfall(
  valueMm?: number | null,
  options: FormatOptions = {}
): string {
  if (valueMm == null || Number.isNaN(valueMm)) {
    return "—";
  }

  const { forceUnit, decimals } = options;

  // Forced mm
  if (forceUnit === "mm") {
    return `${Math.round(valueMm)}mm`;
  }

  // Forced m
  if (forceUnit === "m") {
    const meters = valueMm / 1000;
    return `${meters.toFixed(decimals ?? 1)}m`;
  }

  // Auto
  if (valueMm >= 1000) {
    return `${(valueMm / 1000).toFixed(decimals ?? 2)}m`;
  }

  return `${Math.round(valueMm)}mm`;
}
