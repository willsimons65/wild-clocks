// src/components/charts/TemperatureChart.jsx

import React from "react";
import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartLine from "./base/ChartLine";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";
import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function TemperatureChart({ data, year, monthIndex }) {
  if (!data || data.length === 0) return null;

  const clean = data.map((d) => ({
    day: Number(d.day),
    max: Number(d.temperatureMax),
    min: Number(d.temperatureMin),
  }));

  const yScale = (v) =>
    CHART_HEIGHT - ((v + 10) / 55) * CHART_HEIGHT;

  const yTicks = [-10, 5, 20, 35, 45];

  return (
    <ChartContainer
      data={clean}
      year={year}
      monthIndex={monthIndex}
      yScale={yScale}
      yTicks={yTicks}
      interactive
      metricHeader={({ index }) => {
        const d = clean[index];
        return (
          <ChartMetricHeader
            items={[
              {
                label: "Max temp",
                value: d.max,
                unit: "°C",
                className: "text-pink-400",
              },
              {
                label: "Min temp",
                value: d.min,
                unit: "°C",
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
      <ChartGrid />
      <ChartAxes yFormatter={(v) => `${v}°C`} />

      {/* MAX TEMP LINE */}
      <ChartLine
        data={clean.map((d) => ({ day: d.day, value: d.max }))}
        seriesColor="#FF2E94"
      />

      {/* MIN TEMP LINE */}
      <ChartLine
        data={clean.map((d) => ({ day: d.day, value: d.min }))}
        seriesColor="#7bbaff"
      />
    </ChartContainer>
  );
}

