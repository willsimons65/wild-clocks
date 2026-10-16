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
  getCabillaComparisonSeries,
  getCabillaMetricLabel,
  getCabillaMetricUnit,
} from "@/data/cabilla/transformCabillaDailySeries";
import CabillaComparisonHeader from "./CabillaComparisonHeader";

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
  view = "outside",
  comparisonFocus = "outside",
  heatwaveThreshold = null,
}) {
  const isCompare =
    view === "compare" &&
    Boolean(
      ecowittData?.years?.[String(year)]?.[String(monthIndex)]
    );

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

  const comparisonSeries = useMemo(
    () =>
      isCompare
        ? getCabillaComparisonSeries(
            ecowittData,
            year,
            monthIndex
          )
        : [],
    [isCompare, ecowittData, year, monthIndex]
  );

  if (
    isCompare
      ? !comparisonSeries.length
      : !series.length
  ) {
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
  (isCompare ? comparisonSeries : series).map(
    (d) => [Number(d.day), d]
  )
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
      outsideMax: null,
      outsideMin: null,
      canopyMax: null,
      canopyMin: null,
      outsideHumidity: null,
      canopyHumidity: null,
      isMissing: true,
    };
  }

  if (isCompare) {
    const outsideMax = toNumber(d.outsideMax);
    const outsideMin = toNumber(d.outsideMin);
    const canopyMax = toNumber(d.canopyMax);
    const canopyMin = toNumber(d.canopyMin);
    const outsideHumidity = toNumber(d.outsideHumidity);
    const canopyHumidity = toNumber(d.canopyHumidity);

    const outsideTemperature =
      outsideMax != null && outsideMin != null
        ? (outsideMax + outsideMin) / 2
        : null;

    const canopyTemperature =
      canopyMax != null && canopyMin != null
        ? (canopyMax + canopyMin) / 2
        : null;

    const focusedValue =
      metric === "temperature"
        ? comparisonFocus === "outside"
          ? outsideTemperature
          : canopyTemperature
        : comparisonFocus === "outside"
          ? outsideHumidity
          : canopyHumidity;

    const otherValue =
      metric === "temperature"
        ? comparisonFocus === "outside"
          ? canopyTemperature
          : outsideTemperature
        : comparisonFocus === "outside"
          ? canopyHumidity
          : outsideHumidity;

    const hoverValue = focusedValue ?? otherValue;

    return {
      day,
      value: hoverValue,
      y: hoverValue,
      outsideMax,
      outsideMin,
      canopyMax,
      canopyMin,
      outsideHumidity,
      canopyHumidity,
      isMissing: hoverValue === null,
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

    const threshold =
  metric === "temperature" &&
  location === "outside" &&
  heatwaveThreshold != null
    ? Number(heatwaveThreshold)
    : null;

const hasHeatwave = (rows, threshold) => {
  if (!Number.isFinite(threshold)) return false;

  const sorted = [...rows]
    .filter(
      (d) =>
        Number.isFinite(d.day) &&
        Number.isFinite(d.maxTemp)
    )
    .sort((a, b) => a.day - b.day);

  let streak = 0;
  let previousDay = null;

  for (const d of sorted) {
    const isConsecutive =
      previousDay !== null &&
      d.day === previousDay + 1;

    if (d.maxTemp >= threshold) {
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

const thresholdReached =
  hasHeatwave(clean, threshold);

    const style = METRIC_STYLES[metric] || METRIC_STYLES.temperature;
    const color = style.color;


    const values = isCompare
      ? metric === "temperature"
        ? clean.flatMap((d) => [
            d.outsideMax,
            d.outsideMin,
            d.canopyMax,
            d.canopyMin,
          ]).filter(Number.isFinite)
        : clean.flatMap((d) => [
            d.outsideHumidity,
            d.canopyHumidity,
          ]).filter(Number.isFinite)
      : metric === "temperature"
        ? clean.flatMap((d) => [
            d.maxTemp,
            d.minTemp,
          ]).filter(Number.isFinite)
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
        if (isCompare) {
          return (
            <CabillaComparisonHeader
              data={d}
              metric={metric}
              comparisonFocus={comparisonFocus}
            />
          );
        }

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

        {/* Individual temperature views */}
        {!isCompare && metric === "temperature" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.maxTemp,
            }))}
            seriesColor="#FF2E94"
            strokeWidth={2}
          />
        )}

        {!isCompare && metric === "temperature" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.minTemp,
            }))}
            seriesColor="#7bbaff"
            strokeWidth={2}
          />
        )}

        {/* Individual humidity and light views */}
        {!isCompare && metric !== "temperature" && (
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

        {/* Compare — outside maximum */}
        {isCompare && metric === "temperature" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.outsideMax,
            }))}
            seriesColor={
              comparisonFocus === "outside"
                ? "#FF2E94"
                : "rgba(255,46,148,0.3)"
            }
            strokeWidth={2}
          />
        )}

        {/* Compare — outside minimum */}
        {isCompare && metric === "temperature" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.outsideMin,
            }))}
            seriesColor={
              comparisonFocus === "outside"
                ? "#7bbaff"
                : "rgba(123,186,255,0.3)"
            }
            strokeWidth={2}
          />
        )}

        {/* Compare — canopy maximum */}
        {isCompare && metric === "temperature" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.canopyMax,
            }))}
            seriesColor={
              comparisonFocus === "underCanopy"
                ? "#FF2E94"
                : "rgba(255,46,148,0.3)"
            }
            strokeWidth={2}
          />
        )}

        {/* Compare — canopy minimum */}
        {isCompare && metric === "temperature" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.canopyMin,
            }))}
            seriesColor={
              comparisonFocus === "underCanopy"
                ? "#7bbaff"
                : "rgba(123,186,255,0.3)"
            }
            strokeWidth={2}
          />
        )}

        {/* Compare — outside humidity */}
        {isCompare && metric === "humidity" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.outsideHumidity,
            }))}
            seriesColor={
              comparisonFocus === "outside"
                ? "#6066FF"
                : "rgba(96,102,255,0.3)"
            }
            strokeWidth={2}
          />
        )}

        {/* Compare — canopy humidity */}
        {isCompare && metric === "humidity" && (
          <ChartLine
            data={clean.map((d) => ({
              day: d.day,
              value: d.canopyHumidity,
            }))}
            seriesColor={
              comparisonFocus === "underCanopy"
                ? "#6066FF"
                : "rgba(96,102,255,0.3)"
            }
            strokeWidth={2}
          />
        )}
        </ChartContainer>
  );
}