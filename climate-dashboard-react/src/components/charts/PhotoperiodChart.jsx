/// src/components/charts/PhotoperiodChart.jsx

import React from "react";

import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartLine from "./base/ChartLine";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";

import { CHART_HEIGHT } from "@/constants/chartLayout";

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const LATITUDE = 51.7 * (Math.PI / 180);

// --------------------------------------------------
// DAYLENGTH CALCULATION (your original algorithm)
// --------------------------------------------------

function computeDaylengthUTC(date) {
  const N = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const decl = 0.4095 * Math.sin((2 * Math.PI / 365) * (N - 81));

  const cosH =
    (Math.cos(Math.PI / 2) - Math.sin(LATITUDE) * Math.sin(decl)) /
    (Math.cos(LATITUDE) * Math.cos(decl));

  if (cosH <= -1) return 24; // 24h sunlight
  if (cosH >= 1) return 0;   // 0h sunlight

  return (2 * Math.acos(cosH) / (2 * Math.PI)) * 24;
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function PhotoperiodChart({ year, monthIndex }) {
  //
  // 🗓 Determine how many days in this month
  //
  const lastDay = new Date(year, monthIndex, 0).getDate();

  //
  // 🧮 Build dataset (day + computed daylight hours)
  //
  const clean = Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, monthIndex - 1, day);
    const hours = computeDaylengthUTC(date);
    return { day, hours };
  });

  //
  // 📏 Y-scale fixed at 0–24 hours
  //
  const yTicks = [0, 6, 12, 18, 24];
  const yScale = (v) => CHART_HEIGHT - (v / 24) * CHART_HEIGHT;

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
        const d = clean[index];
        return (
          <ChartMetricHeader
            items={[
              {
                label: "Daylength",
                value: d.hours.toFixed(2),
                unit: "h",
                className: "text-yellow-300",
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
      {/* ChartContainer now injects xScale + xTicks + chartWidth */}
      <ChartGrid />
      <ChartAxes yFormatter={(v) => `${v}h`} />

      <ChartLine
        data={clean.map(d => ({ day: d.day, value: d.hours }))}
        seriesColor="#FDDF45"
    />

    </ChartContainer>
  );
}



