// /data/insights/classifyBaselineValue.ts
import { BASELINE_BANDS } from "./baselineBands";

export function classifyBaselineValue(value) {
  return BASELINE_BANDS.find(
    band => value >= band.min && value < band.max
  );
}