// src/components/charts/base/ChartAxes.jsx

import React from "react";
import { CHART_HEIGHT } from "@/constants/chartLayout";   // ⭐ ADD THIS LINE

export default function ChartAxes({
  xTicks,
  yTicks,
  xScale,
  yScale,
  yFormatter = (v) => v,
  chartWidth,        // from ChartContainer
}) {
  const X_LABEL_Y = CHART_HEIGHT + 22;
  const Y_LABEL_X = chartWidth + 4;

  const formatX = (t) => {
    if (typeof t === "number") return t;
    const d = new Date(t);
    return d.getDate();
  };

  return (
    <g fill="#e5e5e5" fontSize="12">
      {xTicks.map((t) => (
        <text
          key={`xt-${t}`}
          x={xScale(t)}
          y={X_LABEL_Y}
          textAnchor="middle"
        >
          {formatX(t)}
        </text>
      ))}

      {yTicks.map((t) => (
        <text
          key={`yt-${t}`}
          x={Y_LABEL_X}
          y={yScale(t) + 4}
          textAnchor="start"
        >
          {yFormatter(t)}
        </text>
      ))}
    </g>
  );
}













