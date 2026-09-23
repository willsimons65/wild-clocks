import React, { useMemo, useState } from "react";

import Lozenge from "@/images/assets/lozenge.svg";

const DEFAULT_MAX_DAYS = 200;
const DEFAULT_MAX_SPELL = 40;

function roundDay(value) {
  return Math.round(value);
}

function getAutomaticMax(highestValue, minimum, interval) {
  return Math.max(
    minimum,
    Math.ceil(highestValue / interval) * interval
  );
}

export default function FutureRainfallChart({
  data,
  maxDays = DEFAULT_MAX_DAYS,
  maxSpellDays = DEFAULT_MAX_SPELL,
}) {
  const metrics = data?.metrics ?? [];

  const frequencyMetrics = useMemo(
    () =>
      metrics.filter(
        (metric) => metric.key !== "longestDrySpell"
      ),
    [metrics]
  );

  const drySpellMetric = useMemo(
    () =>
      metrics.find(
        (metric) => metric.key === "longestDrySpell"
      ) ?? null,
    [metrics]
  );

  const [activeKey, setActiveKey] = useState(
    metrics[0]?.key ?? null
  );

  const activeMetric = useMemo(
    () =>
      metrics.find(
        (metric) => metric.key === activeKey
      ) ?? metrics[0],
    [activeKey, metrics]
  );

  if (!metrics.length) {
    return null;
  }

  const highestFrequencyUpper = Math.max(
    0,
    ...frequencyMetrics.map(
      (metric) => Number(metric.upper) || 0
    )
  );

  const resolvedMaxDays = Math.max(
    maxDays,
    getAutomaticMax(
      highestFrequencyUpper,
      DEFAULT_MAX_DAYS,
      50
    )
  );

  const highestSpellUpper =
    Number(drySpellMetric?.upper) || 0;

  const resolvedMaxSpellDays = Math.max(
    maxSpellDays,
    getAutomaticMax(
      highestSpellUpper,
      DEFAULT_MAX_SPELL,
      10
    )
  );

  const scaleValue = (value, max) => {
    const clampedValue = Math.max(
      0,
      Math.min(value, max)
    );

    return (clampedValue / max) * 100;
  };

  const activeLower = roundDay(activeMetric.lower);
  const activeUpper = roundDay(activeMetric.upper);
  const activeMedian = roundDay(activeMetric.median);

  const activeDescription =
    activeMetric.key === "longestDrySpell"
      ? `The longest dry spell could last between ${activeLower} and ${activeUpper} days, with around ${activeMedian} days the most likely outcome.`
      : `${activeMetric.label} (${activeMetric.range}) could occur on between ${activeLower} and ${activeUpper} days each year, with around ${activeMedian} days the most likely outcome.`;

  function renderMetricRow(metric, maxValue) {
    const lowerPosition = scaleValue(
      metric.lower,
      maxValue
    );

    const upperPosition = scaleValue(
      metric.upper,
      maxValue
    );

    const medianPosition = scaleValue(
      metric.median,
      maxValue
    );

    const roundedMedian = roundDay(metric.median);

    const rangeWidth = Math.max(
      upperPosition - lowerPosition,
      0
    );

    const isActive =
      metric.key === activeMetric.key;

    return (
      <div
        key={metric.key}
        className="
          grid
          grid-cols-[112px_minmax(0,1fr)]
          items-center
          gap-3
          md:grid-cols-[145px_minmax(0,1fr)]
          md:gap-7
        "
        onMouseEnter={() =>
          setActiveKey(metric.key)
        }
      >
        <div
          className={[
            "text-right transition-opacity duration-200",
            isActive
              ? "opacity-100"
              : "opacity-60",
          ].join(" ")}
        >
          <div className="text-[13px] font-medium leading-tight text-white md:text-xs">
            {metric.label}
          </div>

          <div className="mt-0.5 text-[11px] text-white/55 md:text-[10px]">
            {metric.range}
          </div>
        </div>

        <button
          type="button"
          className="relative h-10 w-full cursor-default focus:outline-none"
          onFocus={() =>
            setActiveKey(metric.key)
          }
          aria-label={`${metric.label}, median ${roundedMedian} days, plausible range ${roundDay(
            metric.lower
          )} to ${roundDay(
            metric.upper
          )} days`}
        >
          {/* Plausible range */}
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
            <span className="absolute inset-0 bg-cyan-500/85" />
          </span>

          {/* Median value and marker */}
          <span
            className="
              absolute
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              transition-all
              duration-200
            "
            style={{
              left: `${medianPosition}%`,
            }}
          >
            <span
              className={[
                "absolute bottom-[27px] left-1/2 -translate-x-1/2",
                "text-[12px] font-semibold text-white/85",
                "transition-opacity duration-200",
                isActive
                  ? "opacity-100"
                  : "opacity-0",
              ].join(" ")}
            >
              {roundedMedian}
            </span>

            <img
              src={Lozenge}
              alt=""
              aria-hidden="true"
              className={[
                "block h-6 w-3 transition-transform duration-200",
                isActive
                  ? "scale-100"
                  : "scale-[0.89]",
              ].join(" ")}
            />
          </span>
        </button>
      </div>
    );
  }

  function renderAxis(maxValue, interval) {
    const ticks = Array.from(
      {
        length:
          Math.floor(maxValue / interval) + 1,
      },
      (_, index) => index * interval
    );

    return (
      <div
        className="
          mt-4
          grid
          grid-cols-[112px_minmax(0,1fr)]
          gap-3
          md:grid-cols-[145px_minmax(0,1fr)]
          md:gap-7
        "
      >
        <div />

        <div className="flex justify-between text-xs font-medium text-white/55 md:text-[13px]">
          {ticks.map((value) => (
            <span key={value}>
              {value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="mb-6 min-h-6 text-center text-sm font-semibold text-white/75"
        aria-live="polite"
      >
        {activeDescription}
      </div>

      <div
        onMouseLeave={() =>
          setActiveKey(metrics[0].key)
        }
      >
        {/* Annual frequency */}
        <div className="space-y-2">
          {frequencyMetrics.map((metric) =>
            renderMetricRow(
              metric,
              resolvedMaxDays
            )
          )}
        </div>

        {renderAxis(
          resolvedMaxDays,
          resolvedMaxDays > 200 ? 50 : 50
        )}

        {/* Dry spell duration */}
        {drySpellMetric && (
          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="space-y-2">
              {renderMetricRow(
                drySpellMetric,
                resolvedMaxSpellDays
              )}
            </div>

            {renderAxis(
              resolvedMaxSpellDays,
              10
            )}
          </div>
        )}
      </div>
    </div>
  );
}