// src/components/charts/base/ChartGrid.jsx

import React from "react";
import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function ChartGrid({
  xTicks = [],
  yTicks = [],
  xScale,
  yScale,
  chartWidth,
  showZeroLine = true,
}) {
  return (
    <g>
      {/* Zero baseline */}
      {showZeroLine && yScale && (
        <line
          x1={0}
          x2={chartWidth}
          y1={yScale(0)}
          y2={yScale(0)}
          stroke="rgba(106, 106, 106, 0.6)"
          strokeWidth={1}
        />
      )}
    </g>
  );
}













