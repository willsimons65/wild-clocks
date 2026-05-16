// src/components/charts/CabillaDailyMicroclimateChart.jsx

import React, { useMemo } from "react";
import ChartContainer from "./base/ChartContainer";
import ChartGrid from "./base/ChartGrid";
import ChartAxes from "./base/ChartAxes";
import ChartLine from "./base/ChartLine";
import ChartMetricHeader from "./base/ChartMetricHeader";
import ChartDateBubble from "./base/ChartDateBubble";
import EmptyChartState from "./base/EmptyChartState";
import { CHART_HEIGHT } from "@/constants/chartLayout";
import {
  getCabillaDailySeries,
  getCabillaMetricLabel,
  getCabillaMetricUnit,
} from "@/data/cabilla/transformCabillaDailySeries";

const METRIC_STYLES = {
    temperature: {
        color: "#FE2E95",
    },
    humidity: {
        color: "#6066FF",
    },
    radiation: {
        color: "#F5D94A",
    },
};

export default function CabillaDailyMicroclimateChart({
  dailyData,
  year,
  monthIndex,
  metric,
}) {
  const series = useMemo(
    () => getCabillaDailySeries(dailyData, year, monthIndex, metric),
    [dailyData, year, monthIndex, metric]
  );

  if (!series.length) {
  return (
    <div className="pt-0 pb-4 -mt-16">
      <EmptyChartState message="No daily microclimate data yet" />
    </div>
  );
}

    const label = getCabillaMetricLabel(metric);
    const unit = getCabillaMetricUnit(metric);

    const lastDay = new Date(year, monthIndex, 0).getDate();

    const byDay = new Map(
    series.map((d) => [Number(d.day), d])
    );

    const clean = Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const d = byDay.get(day);

    if (!d) {
        return {
        day,
        value: null,
        y: null,
        isMissing: true,
        };
    }

    return {
        day,
        value: Number(d.value),
        y: Number(d.value),
        isMissing: false,
    };
    });

    const style = METRIC_STYLES[metric] || METRIC_STYLES.temperature;
    const color = style.color;

    const values = clean.map((d) => d.value).filter(Number.isFinite);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const padding = metric === "humidity" ? 5 : metric === "radiation" ? 20 : 2;
    const domainMin =
        metric === "humidity" ? 0 : Math.floor(min - padding);
    const domainMax =
        metric === "humidity" ? 100 : Math.ceil(max + padding);

    const range = domainMax - domainMin || 1;

    const yScale = (v) =>
        CHART_HEIGHT - ((v - domainMin) / range) * CHART_HEIGHT;

    const yTicks =
        metric === "humidity"
        ? [0, 25, 50, 75, 100]
        : [
            domainMin,
            Math.round(domainMin + range * 0.25),
            Math.round(domainMin + range * 0.5),
            Math.round(domainMin + range * 0.75),
            domainMax,
            ];

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

            return (
<ChartMetricHeader
  items={[
    {
      label,
      value: d.value,
      unit,
      className: "",
      style: { color },
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

    <ChartAxes
    yFormatter={(v) =>
        metric === "radiation" ? `${v}` : `${v}${unit}`
    }
    />

    <ChartLine
    data={clean.map((d) => ({
        day: d.day,
        value: d.value,
        y: d.y,
    }))}
    seriesColor={color}
    strokeWidth={2}
    />
        </ChartContainer>
  );
}