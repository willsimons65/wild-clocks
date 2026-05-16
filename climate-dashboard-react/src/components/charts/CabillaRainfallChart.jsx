import React, { useMemo } from "react";
import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartBars from "./base/ChartBars";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";
import EmptyChartState from "./base/EmptyChartState";
import { CHART_HEIGHT } from "@/constants/chartLayout";

function getMonthEntries(dailyData, year, monthIndex) {
  const monthData =
    dailyData?.years?.[String(year)]?.[String(monthIndex)] || {};

  return Object.values(monthData);
}

function roundUpToNiceNumber(value) {
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return 50;
  if (value <= 100) return 100;
  return Math.ceil(value / 50) * 50;
}

export default function CabillaRainfallChart({
  dailyData,
  year,
  monthIndex,
}) {
  const clean = useMemo(() => {
    const lastDay = new Date(year, monthIndex, 0).getDate();
    const entries = getMonthEntries(dailyData, year, monthIndex);

    const byDay = new Map(
      entries.map((d) => [Number(new Date(`${d.date}T12:00:00`).getDate()), d])
    );

    return Array.from({ length: lastDay }, (_, i) => {
      const day = i + 1;
      const entry = byDay.get(day);

      return {
        day,
        rainfall: entry ? Number(entry.rainfall) : null,
        isMissing: !entry,
      };
    });
  }, [dailyData, year, monthIndex]);

  const values = clean
    .map((d) => d.rainfall)
    .filter(Number.isFinite);

  if (!values.length) {
    return <EmptyChartState message="No rainfall data recorded yet" />;
  }

  const maxRainfall = Math.max(...values);
  const yMax = roundUpToNiceNumber(maxRainfall);

  const yScale = (v) =>
    CHART_HEIGHT - (v / yMax) * CHART_HEIGHT;

  const yTicks = [0, yMax * 0.3, yMax * 0.5, yMax * 0.8, yMax].map((v) =>
    Math.round(v)
  );

  return (
    <ChartContainer
      data={clean}
      year={year}
      monthIndex={monthIndex}
      yScale={yScale}
      yTicks={yTicks}
      interactive
      chartHeightOverride={260}
      bottomPaddingOverride={56}
      rightPadding={48}
      leftPaddingOverride={36}
      metricHeader={({ index }) => {
        const d = clean[index];

        if (!Number.isFinite(d?.rainfall)) return null;

        return (
          <ChartMetricHeader
            items={[
              {
                label: "Rainfall",
                value: d.rainfall,
                unit: "mm",
                className: "text-[#7BB8FF]",
              },
            ]}
          />
        );
      }}
      TooltipComponent={({ index, x, y, position }) => {
        const d = clean[index];

        if (!Number.isFinite(d?.rainfall)) return null;

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
      <ChartAxes yFormatter={(v) => `${v}mm`} />

        <ChartBars
        data={clean
            .filter((d) => Number.isFinite(d.rainfall))
            .map((d) => ({
            x: d.day,
            y: d.rainfall,
            }))}
        fill="#7BB8FF"
        />
    </ChartContainer>
  );
}