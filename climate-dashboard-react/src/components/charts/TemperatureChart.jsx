// src/components/charts/TemperatureChart.jsx

import React from "react";
import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartLine from "./base/ChartLine";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";
import EmptyChartState from "./base/EmptyChartState";
import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function TemperatureChart({
  data,
  year,
  monthIndex,
  heatwaveThreshold,
}) {
  if (!data || data.length === 0) {
    return (
      <EmptyChartState message="No temperature data recorded yet" />
    );
  }

  const clean = data.map((d) => ({
    day: Number(d.day),
    max: Number(d.temperatureMax),
    min: Number(d.temperatureMin),
  }));

const threshold =
  heatwaveThreshold == null
    ? null
    : Number(heatwaveThreshold);

const hasHeatwave = (rows, threshold) => {
  if (!Number.isFinite(threshold)) return false;

  const sorted = [...rows]
    .filter(
      (d) =>
        Number.isFinite(d.day) &&
        Number.isFinite(d.max)
    )
    .sort((a, b) => a.day - b.day);

  let streak = 0;
  let previousDay = null;

  for (const d of sorted) {
    const isConsecutive =
      previousDay !== null &&
      d.day === previousDay + 1;

    if (d.max >= threshold) {
      streak = isConsecutive ? streak + 1 : 1;

      if (streak >= 3) {
        return true;
      }
    } else {
      streak = 0;
    }

    previousDay = d.day;
  }

  return false;
};

const thresholdReached = hasHeatwave(clean, threshold);

const lastDay = new Date(year, monthIndex, 0).getDate();

  const yScale = (v) =>
    CHART_HEIGHT - ((v + 10) / 55) * CHART_HEIGHT;

  const yTicks = [-10, 5, 20, 35, 45];

  console.log({
  heatwaveThreshold,
  thresholdReached,
  maxTemperature: Math.max(...clean.map((d) => d.max)),
});

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

{thresholdReached && (
  <ChartLine
    data={[
      { day: 1, value: threshold },
      { day: lastDay, value: threshold },
    ]}
    seriesColor="#f97316"
    strokeWidth={1.25}
    animate={false}
  />
)}

<ChartLine
  data={clean.map((d) => ({ day: d.day, value: d.max }))}
  seriesColor="#FF2E94"
/>

<ChartLine
  data={clean.map((d) => ({ day: d.day, value: d.min }))}
  seriesColor="#7bbaff"
/>
    </ChartContainer>
  );
}

