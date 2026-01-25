// /data/insights/classifyBaselineRange.ts

import { classifyBaselineValue } from "./classifyBaselineValue";

export function classifyBaselineRange(min: number, max: number) {
 
  const from = classifyBaselineValue(min);
  const to = classifyBaselineValue(max);

  if (!from || !to) return null;

  if (from.label === to.label) {
    return {
      label: from.label,
      description: from.description,
    };
  }

  return {
  label: `${from.label} to ${to.label.toLowerCase()}`,
  description: `${from.description} → ${to.description}`,
};

}