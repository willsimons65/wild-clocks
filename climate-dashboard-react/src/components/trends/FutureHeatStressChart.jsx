// src/components/trends/FutureHeatStressChart.jsx

import React, { useMemo, useState } from "react";

import Lozenge from "@/images/assets/lozenge.svg";

const DEFAULT_MAX_DAYS = 60;

function roundDay(value) {
  return Math.round(value);
}

export default function FutureHeatStressChart({
  data,
  maxDays = DEFAULT_MAX_DAYS,
}) {
  const thresholds = data?.thresholds ?? [];

  const [activeKey, setActiveKey] = useState(
    thresholds[0]?.key ?? null
  );

  const activeThreshold = useMemo(
    () =>
      thresholds.find(
        (threshold) => threshold.key === activeKey
      ) ?? thresholds[0],
    [activeKey, thresholds]
  );

  if (!thresholds.length) {
    return null;
  }

  const scaleValue = (value) => {
    const clampedValue = Math.max(
      0,
      Math.min(value, maxDays)
    );

    return (clampedValue / maxDays) * 100;
  };

  const activeLower = roundDay(activeThreshold.lower);
  const activeUpper = roundDay(activeThreshold.upper);
  const activeMedian = roundDay(activeThreshold.median);

const activeLabel =
  activeThreshold.key === "warmDay"
    ? "Warm days"
    : `${activeThreshold.label} days`;

  return (
    <div className="w-full">
<div
  className="mb-6 min-h-6 text-center text-sm font-semibold text-white/75"
  aria-live="polite"
>
  {activeLabel} ({activeThreshold.range}) could occur on between{" "}
  {activeLower} and {activeUpper} days each year, with around{" "}
  {activeMedian} days the most likely outcome.
</div>

<div
  className="space-y-2"
  onMouseLeave={() => setActiveKey(thresholds[0].key)}
>
        {thresholds.map((threshold) => {
          const lowerPosition = scaleValue(
            threshold.lower
          );

          const upperPosition = scaleValue(
            threshold.upper
          );

          const medianPosition = scaleValue(
            threshold.median
          );

          const roundedMedian = roundDay(threshold.median);
          const showMedianMarker = roundedMedian > 0;
          const medianOffset = showMedianMarker ? "0px" : "4px";
          const medianYOffset = showMedianMarker ? "0px" : "4px";
          const medianLabelBottom = showMedianMarker
            ? "bottom-[27px]"
            : "bottom-[18px]";

          const rangeWidth = Math.max(
            upperPosition - lowerPosition,
            0
          );

          const isActive =
            threshold.key === activeThreshold.key;

          return (
            <div
            key={threshold.key}
            className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-5 md:grid-cols-[100px_minmax(0,1fr)] md:gap-7"
            onMouseEnter={() => setActiveKey(threshold.key)}
            >
            <div
                className={[
                    "text-right transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-60",
                ].join(" ")}
                >
                <div className="text-sm font-medium leading-tight text-white md:text-xs">
                    {threshold.label}
                </div>

                <div className="mt-0.5 text-xs text-white/55 md:text-[10px]">
                    {threshold.range}
                </div>
            </div>

              <button
                type="button"
                className="relative h-10 w-full cursor-default focus:outline-none"
                onFocus={() =>
                  setActiveKey(threshold.key)
                }
                aria-label={`${threshold.label}, median ${roundDay(
                  threshold.median
                )} days, plausible range ${roundDay(
                  threshold.lower
                )} to ${roundDay(
                  threshold.upper
                )} days`}
              >
{/* Plausible-range interval */}
    <span
    className={[
        "absolute top-1/2 h-6 -translate-y-1/2",
        "origin-center transition-all duration-200",
        isActive
        ? "scale-y-100 opacity-100"
        : "scale-y-[0.82] opacity-55",
    ].join(" ")}
    style={{
        left: `${lowerPosition}%`,
        width: `${rangeWidth}%`,
    }}
    >
    <span className="absolute inset-0 bg-orange-500/85" />
    </span>

{/* Median value and lozenge */}
<span
  className={[
    "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
    "transition-all duration-200",
  ].join(" ")}
  style={{
    left: `calc(${medianPosition}% + ${medianOffset})`,
    transform: `translate(-50%, calc(-50% + ${medianYOffset}))`,
  }}
>
<span
  className={[
    "absolute left-1/2 -translate-x-1/2",
    "text-[12px] font-semibold text-white/85",
    "transition-opacity duration-200",
    medianLabelBottom,
    isActive ? "opacity-100" : "opacity-0",
  ].join(" ")}
>
  {roundedMedian}
</span>

  {showMedianMarker && (
    <img
      src={Lozenge}
      alt=""
      aria-hidden="true"
      className={[
        "block h-6 w-3 transition-transform duration-200",
        isActive ? "scale-100" : "scale-[0.89]",
      ].join(" ")}
    />
  )}
</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[120px_minmax(0,1fr)] gap-5 md:grid-cols-[103px_minmax(0,1fr)] md:gap-7">
        <div />

        <div>
          <div className="flex justify-between text-xs font-medium text-white/55 md:text-[13px]">
            {Array.from(
              { length: Math.floor(maxDays / 10) + 1 },
              (_, index) => index * 10
            ).map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}