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
  ecowittData,
  year,
  monthIndex,
  metric,
  location = "outside",
}) {
  const series = useMemo(
    () =>
      getCabillaDailySeries(
        dailyData,
        year,
        monthIndex,
        metric,
        location,
        ecowittData
      ),
    [dailyData, ecowittData, year, monthIndex, metric, location]
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

const toNumber = (value) =>
  value == null || value === ""
    ? null
    : Number.isFinite(Number(value))
      ? Number(value)
      : null;

    const clean = Array.from({ length: lastDay }, (_, i) => {
      const day = i + 1;
      const d = byDay.get(day);

      if (!d) {
        return {
          day,
          value: null,
          y: null,
          maxTemp: null,
          minTemp: null,
          isMissing: true,
        };
      }

      return {
        day,
        value: toNumber(d.value),
        y: toNumber(d.value),
        maxTemp: toNumber(d.maxTemp),
        minTemp: toNumber(d.minTemp),
        isMissing: false,
      };
    });

    const style = METRIC_STYLES[metric] || METRIC_STYLES.temperature;
    const color = style.color;

    const values =
      metric === "temperature"
        ? clean.flatMap((d) => [d.maxTemp, d.minTemp])
            .filter(Number.isFinite)
        : clean.map((d) => d.value)
            .filter(Number.isFinite);

    if (!values.length) {
      return (
        <EmptyChartState message="No valid daily observations yet" />
      );
    }

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

          const items =
            metric === "temperature"
              ? [
                  {
                    label: "Max temp",
                    value: d.maxTemp,
                    unit: "°C",
                    className: "text-pink-400",
                  },
                  {
                    label: "Min temp",
                    value: d.minTemp,
                    unit: "°C",
                    className: "text-blue-300",
                  },
                ]
              : [
                  {
                    label,
                    value: d.value,
                    unit,
                    className: "",
                    style: { color },
                  },
                ];

          return <ChartMetricHeader items={items} />;
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

    {metric === "temperature" && (
      <ChartLine
        data={clean.map((d) => ({
          day: d.day,
          value: d.maxTemp,
        }))}
        seriesColor="#FF2E94"
        strokeWidth={2}
      />
    )}

    {metric === "temperature" && (
      <ChartLine
        data={clean.map((d) => ({
          day: d.day,
          value: d.minTemp,
        }))}
        seriesColor="#7bbaff"
        strokeWidth={2}
      />
    )}

    {metric !== "temperature" && (
      <ChartLine
        data={clean.map((d) => ({
          day: d.day,
          value: d.value,
          y: d.y,
        }))}
        seriesColor={color}
        strokeWidth={2}
      />
    )}

        </ChartContainer>
  );
}