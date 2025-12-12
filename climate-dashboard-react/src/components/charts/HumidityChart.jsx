// src/components/charts/HumidityChart.jsx

// src/components/charts/HumidityChart.jsx

import React from "react";

import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartLine from "./base/ChartLine";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";

import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function HumidityChart({ data, year, monthIndex }) {
  if (!data || data.length === 0) return null;

  //
  // 🔍 Clean humidity data
  //
  const clean = data
    .map((d) => ({
      day: Number(d.day),
      humidity: Number(d.humidity),
    }))
    .filter((d) => Number.isFinite(d.day) && Number.isFinite(d.humidity));

  if (clean.length === 0) return null;

  //
  // 📏 Y scale only — x scale comes from ChartContainer
  //
  const yScale = (v) =>
    CHART_HEIGHT - (v / 100) * CHART_HEIGHT;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <ChartContainer
      data={clean}
      year={year}
      monthIndex={monthIndex}
      yScale={yScale}
      yTicks={yTicks}
      interactive
      rightPadding={52}
      metricHeader={({ index }) => {
        const p = clean[index];
        return (
          <ChartMetricHeader
            items={[
              {
                label: "Humidity",
                value: p.humidity,
                unit: "%",
                className: "text-[#5F67FF]",
              },
            ]}
          />
        );
      }}

      TooltipComponent={({ index, x, y, position }) => {
        const d = clean[index];
        return (
          <ChartDateBubble
            x={x}
            y={y}
            label={d.day}
            position={position}
          />
        );
      }}
    >
      {/* ChartContainer injects xScale, xTicks, chartWidth */}
      <ChartGrid />
      <ChartAxes yFormatter={(v) => `${v}%`} />

      <ChartLine
  data={clean.map(d => ({ day: d.day, value: d.humidity }))}
  seriesColor="#5F67FF"
/>

    </ChartContainer>
  );
}










