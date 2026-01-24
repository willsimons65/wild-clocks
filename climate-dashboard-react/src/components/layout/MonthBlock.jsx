// src/components/layout/MonthBlock.jsx

import { useState, useMemo, useEffect } from "react";

import PhotoGrid from "@/components/photos/PhotoGrid";
import ChartCard from "@/components/layout/ChartCard";
import TemperatureChart from "@/components/charts/TemperatureChart";
import RainfallChart from "@/components/charts/RainfallChart";
import HumidityChart from "@/components/charts/HumidityChart";
import PhotoperiodChart from "@/components/charts/PhotoperiodChart";
import { transformRainfallMonth } from "@/data/rainfall/transformRainfallMonth";
import { transformTemperatureMonth } from "@/data/temperature/transformTemperature";
import { buildInsightsAvailability } from "@/data/insights/buildInsightsAvailability";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function normalizeRainfallRows(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.map((r) => {
    if (typeof r.month === "string") return r;

    if (typeof r.month === "number") {
      return {
        ...r,
        month: MONTHS[r.month - 1],
      };
    }

    return r;
  });
}

export default function MonthBlock({
  month,
  year,
  place,
  metric,
  data,
  fullData,
  temperatureData,
}) {

  const hasData = Array.isArray(data) && data.length > 0;

  const monthIndex0 = MONTHS.indexOf(month);
  const monthIndex = monthIndex0 + 1;

  // 🔍 DEBUG: inspect rainfall years per place
  useEffect(() => {
    if (!Array.isArray(fullData)) return;

    const years = fullData
      .filter(
        (r) =>
          typeof r.place === "string" &&
          r.place.toLowerCase().replace(/\s/g, "") === place
      )
      .map((r) => r.year);

  
  }, [fullData, place]);

  // ✅ Rainfall modal data
  const rainfallModalData = useMemo(() => {
    if (metric !== "rainfall") return null;
    if (!Array.isArray(fullData)) return null;

    const placeFilteredRows = fullData;

    if (placeFilteredRows.length === 0) return null;

    const normalizedRows = normalizeRainfallRows(placeFilteredRows);

    return transformRainfallMonth(
      normalizedRows,
      year,
      month
    );
  }, [metric, fullData, year, month, place]);

  const temperatureModalData = useMemo(() => {
    if (metric !== "temperature") return null;
    if (!temperatureData) return null;

    return transformTemperatureMonth(
      temperatureData,
      year,
      monthIndex0
    );
  }, [metric, temperatureData, year, monthIndex0]);

  const monthRows = hasData
    ? data.filter(
        (d) =>
          Number(d.year) === Number(year) &&
          d.month === month
      )
    : [];

  const yearRows = hasData
  ? data.filter((d) => Number(d.year) === Number(year))
  : [];


const availability = useMemo(() => {
  return buildInsightsAvailability({
    monthRows,
    yearRows,
  });
}, [monthRows, yearRows]);

  const renderChart = () => {
    switch (metric) {
      case "temperature":
        return (
          <TemperatureChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "rainfall":
        return (
          <RainfallChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "humidity":
        return (
          <HumidityChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "photoperiod":
        return (
          <PhotoperiodChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 relative overflow-visible">
        <div className="rounded-2xl bg-[#1E1E1E] relative">
          <PhotoGrid month={monthIndex} year={year} place={place} />
        </div>

        <ChartCard>
          <div className="relative overflow-visible">
            <div className="px-4 pt-2 pb-5 flex items-center justify-center">
  <h2 className="text-lg font-medium tracking-tight opacity-90">
    {month}
  </h2>
</div>

            {renderChart()}
          </div>
        </ChartCard>
      </div>
    </>
  );
}







