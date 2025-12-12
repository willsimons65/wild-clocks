// src/components/charts/base/ChartBars.jsx

import React from "react";
import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function ChartBars(props) {
  if (!props?.data || props.data.length === 0) return null;

  const { data, xScale, yScale, chartWidth, fill = "#7bbaff" } = props;

  // ❌ Prevent NaN
  if (!xScale || !yScale || !chartWidth) return null;

  const days = data.length;

  const barWidth = chartWidth / days - 2;

  return (
    <g>
      {data.map((d, i) => {
        const x = xScale(d.x);
        const y = yScale(d.y);

        const height = CHART_HEIGHT - y;

        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

return (
  <rect
  key={d.x}
  x={x - barWidth / 2}
  y={y}
  width={barWidth}
  height={height}
  rx={2}
  fill={fill}
  style={{
    transformBox: "fill-box",      // ★ Important
    transformOrigin: "center bottom",
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
