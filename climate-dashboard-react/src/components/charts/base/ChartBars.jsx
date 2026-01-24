// src/components/charts/base/ChartBars.jsx

import React from "react";

export default function ChartBars({
  data,
  xScale, // still passed in, but we won't use it for discrete monthly bars
  yScale,
  chartWidth,
  fill = "#7bbaff",
  positiveFill,
  negativeFill,
}) {
  if (!data || !yScale || !chartWidth) return null;

  const barCount = data.length;
  if (barCount === 0) return null;

  // Each month gets a fixed horizontal slot
  const slotWidth = chartWidth / barCount;

  // Bars occupy only part of that slot
  const barWidth = Math.min(slotWidth * 0.55, 26);

  const baselineY = yScale(0);

  return (
    <g>
      {data.map((d, i) => {
        if (!Number.isFinite(d?.y)) return null;

        // ✅ Use slot geometry, not xScale
        const x = (i + 0.5) * slotWidth;

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

