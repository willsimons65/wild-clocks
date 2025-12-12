// src/components/layout/MonthBlock.jsx

import React from "react";
import PhotoGrid from "@/components/photos/PhotoGrid";
import ChartCard from "@/components/layout/ChartCard";

import TemperatureChart from "@/components/charts/TemperatureChart";
import RainfallChart from "@/components/charts/RainfallChart";
import HumidityChart from "@/components/charts/HumidityChart";
import PhotoperiodChart from "@/components/charts/PhotoperiodChart";

export default function MonthBlock({ month, year, place, metric, data }) {

  if (!data || data.length === 0) {
    console.warn("MonthBlock: empty data for", month);
    return <div style={{ height: 300 }}></div>;
  }

  const monthIndex =
    [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ].indexOf(month) + 1;

  // 🔍 FIX: FILTER DATA FOR THIS MONTH
  const monthRows = data.filter(
    (d) => Number(d.year) === Number(year) && d.month === month
  );

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
    <div className="flex flex-col gap-4 relative overflow-visible">
      
      {/* Photo block */}
      <div className="rounded-2xl bg-[#1E1E1E] relative">
        <PhotoGrid month={monthIndex} year={year} place={place} />
      </div>

      {/* Month label */}
      <h2 className="text-center text-lg font-medium tracking-tight opacity-90">
        {month}
      </h2>

      {/* Chart block */}
      <ChartCard>
        <div className="relative overflow-visible">{renderChart()}</div>
      </ChartCard>
    </div>
  );
}




