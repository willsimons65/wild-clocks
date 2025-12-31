// src/components/charts/RainfallChart.jsx

import React from "react";

import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartBars from "./base/ChartBars";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";
import EmptyChartState from "./base/EmptyChartState";
import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function RainfallChart({ data, monthIndex, year }) {
  if (!data || data.length === 0) {
    return (
      <EmptyChartState message="No rainfall data recorded yet" />
    );
  }
  const clean = data
    .map((d) => ({
      day: Number(d.day),
      rainfall: Number(d.precipitation),
    }))
    .filter((d) => Number.isFinite(d.day) && Number.isFinite(d.rainfall));

  {/*if (clean.length === 0) return <div style={{ height: 300 }} />;*/}

  //
  // 📏 Dynamic max — follows your January/February dataset patterns
  //
  const maxRain = Math.max(...clean.map((d) => d.rainfall), 0);
  const upper = Math.max(5, Math.ceil(maxRain / 5) * 5); // round to nearest 5mm

  //
  // 📏 Y ticks matching your design (same positions as other charts)
  //
  const yTicks = [0, upper * 0.3, upper * 0.5, upper * 0.8, upper];

  //
  // 📏 Y scale — bars grow upward
  //
  const yScale = (v) => CHART_HEIGHT - (v / upper) * CHART_HEIGHT;

  return (
    <ChartContainer
      data={clean}
      monthIndex={monthIndex}
      year={year}
      yScale={yScale}
      yTicks={yTicks}
      interactive
      rightPadding={52}
      metricHeader={({ index }) => {
        const p = clean[index];
        if (!p) return null;

        return (
          <ChartMetricHeader
            items={[
              {
                label: "Rainfall",
                value: p.rainfall,
                unit: "mm",
                className: "text-blue-300",
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
      {/* ChartContainer injects xScale, xTicks, chartWidth automatically */}
      <ChartGrid />
      <ChartAxes yFormatter={(v) => `${Math.round(v)}mm`} />

      <ChartBars
        data={clean.map((d) => ({ x: d.day, y: d.rainfall }))}
        fill="#7BB9FF"
      />
    </ChartContainer>
  );
}



