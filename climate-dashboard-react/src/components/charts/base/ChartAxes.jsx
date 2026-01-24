// src/components/charts/base/ChartAxes.jsx

import React from "react";
import { CHART_HEIGHT } from "@/constants/chartLayout";   // ⭐ ADD THIS LINE

export default function ChartAxes({
  xTicks,
  yTicks,
  xScale,
  yScale,
  yFormatter = (v) => v,
  xFormatter = (v) => v,
  chartWidth,
  yPosition = "right",
}) {


  if (!Number.isFinite(chartWidth)) {
  return null;
  }

  ChartAxes.displayName = "ChartAxes";

  const X_LABEL_Y = CHART_HEIGHT + 22;
  const Y_LABEL_X =
  yPosition === "left"
    ? -6
    : chartWidth + 4;


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
          {xFormatter(t)}
        </text>
      ))}

      {yTicks.map((t) => (
        <text
          key={`yt-${t}`}
          x={Y_LABEL_X}
          y={yScale(t) + 4}
          textAnchor={yPosition === "left" ? "end" : "start"}
        >
          {Number.isFinite(t) ? yFormatter(t) : ""}
        </text>
      ))}

    </g>
  );
}













