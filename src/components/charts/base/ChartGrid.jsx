// src/components/charts/base/ChartGrid.jsx

// src/components/charts/base/ChartGrid.jsx
import React from "react";
import { CHART_HEIGHT, GRID_STROKE, GRID_DASH } from "@/constants/chartLayout";

export default function ChartGrid({ xTicks = [], yTicks = [], xScale, yScale, chartWidth }) {
  return (
    <g stroke={GRID_STROKE} strokeWidth={1} strokeDasharray={GRID_DASH}>
      {/* Horizontal grid lines */}
      {yTicks.map((t) => (
        <line
          key={`h-${t}`}
          x1={0}
          x2={chartWidth}
          y1={yScale(t)}
          y2={yScale(t)}
        />
      ))}

      {/* Vertical grid lines (optional) */}
      {xTicks.map((t) => (
        <line
          key={`v-${t}`}
          x1={xScale(t)}
          x2={xScale(t)}
          y1={0}
          y2={CHART_HEIGHT}
        />
      ))}
    </g>
  );
}












