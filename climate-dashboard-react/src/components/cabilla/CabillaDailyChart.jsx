import React, { useMemo } from "react";

import {
  getCabillaDailySeries,
  getCabillaMetricLabel,
  getCabillaMetricUnit,
} from "@/data/cabilla/transformCabillaDailySeries";

export default function CabillaDailyChart({
  dailyData,
  year,
  month,
  metric = "temperature",
}) {
  const series = useMemo(
    () => getCabillaDailySeries(dailyData, year, month, metric),
    [dailyData, year, month, metric]
  );

  const label = getCabillaMetricLabel(metric);
  const unit = getCabillaMetricUnit(metric);

  if (!series.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">
        No daily microclimate data available for this month.
      </div>
    );
  }

  const values = series.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 720;
  const height = 260;
  const padding = {
    top: 24,
    right: 24,
    bottom: 36,
    left: 44,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = series.map((d, index) => {
    const x =
      padding.left +
      (series.length === 1 ? chartWidth / 2 : (index / (series.length - 1)) * chartWidth);

    const y =
      padding.top +
      chartHeight -
      ((d.value - min) / range) * chartHeight;

    return { ...d, x, y };
  });

  const path = points
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">
  Daily pattern
</h3>

<p className="mt-1 text-xs text-white/50">
  {label} across the month
</p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`${label} daily chart`}
      >
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={height - padding.bottom}
          y2={height - padding.bottom}
          stroke="currentColor"
          className="text-white/15"
        />

        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="currentColor"
          className="text-white/15"
        />

        <text
          x={padding.left}
          y={18}
          className="fill-white/50 text-[11px]"
        >
          {max.toFixed(1)}{unit}
        </text>

        <text
          x={padding.left}
          y={height - padding.bottom + 24}
          className="fill-white/50 text-[11px]"
        >
          {min.toFixed(1)}{unit}
        </text>

        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/80"
        />

        {points.map((p) => (
          <circle
            key={p.date}
            cx={p.x}
            cy={p.y}
            r="3"
            className="fill-white/80"
          />
        ))}

        {points.map((p, index) => {
          const showLabel =
            index === 0 ||
            index === points.length - 1 ||
            p.day === 1 ||
            p.day % 7 === 0;

          if (!showLabel) return null;

          return (
            <text
              key={`${p.date}-label`}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-white/45 text-[10px]"
            >
              {p.day}
            </text>
          );
        })}
      </svg>
    </section>
  );
}