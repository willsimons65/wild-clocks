// src/components/charts/base/ChartBars.jsx

import React from "react";

export default function ChartBars({
  data,
  xScale,
  yScale,
  chartWidth,
  fill = "#7bbaff",
  positiveFill,
  negativeFill,
}) {
  if (!data || !xScale || !yScale || !chartWidth) return null;

  const barCount = data.length;
  if (barCount === 0) return null;

  const baselineY = yScale(0);

  // Width based on a 12-month chart, not the number of visible points
  const slotWidth = chartWidth / 12;
  const barWidth = Math.min(slotWidth * 0.25, 12);

  return (
    <g>
      {data.map((d, i) => {
        if (!Number.isFinite(d?.x) || !Number.isFinite(d?.y)) return null;

        const x = xScale(d.x);
        if (!Number.isFinite(x)) return null;

        const valueY = yScale(d.y);
        if (!Number.isFinite(valueY)) return null;

        const y = Math.min(valueY, baselineY);
        const height = Math.abs(baselineY - valueY);
        if (height === 0) return null;

        const barFill =
          d.y >= 0 ? positiveFill ?? fill : negativeFill ?? fill;

        return (
          <rect
            key={d.x ?? i}
            x={x - barWidth / 2}
            y={y}
            width={barWidth}
            height={height}
            rx={3}
            fill={barFill}
            style={{
              transformBox: "fill-box",
              transformOrigin: d.y >= 0 ? "center bottom" : "center top",
              transform: "scaleY(0)",
              animation: "growBar 0.8s ease-out forwards",
              animationDelay: `${i * 0.02}s`,
            }}
          />
        );
      })}
    </g>
  );
}

