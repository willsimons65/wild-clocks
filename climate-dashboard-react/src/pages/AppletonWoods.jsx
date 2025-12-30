// src/pages/AppletonWoods.jsx

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import MonthBlock from "@/components/layout/MonthBlock";
import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";

import appletonTemperatureData from "@/data/aggregates/appleton-woods.json";

export default function AppletonWoodsPage() {
  const [metric, setMetric] = useState("temperature");
  const [year, setYear] = useState(new Date().getFullYear());

  const [allYearsData, setAllYearsData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const months = useMemo(
    () => [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ],
    []
  );

  // Load ALL years once
  useEffect(() => {
    async function load() {
      const CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnTrtD4kMVWWH8lTnDCYOrfM7ORsYYjxce8oE3QU_3fAiZ6NkVqorUa_ANqDP9dbOwSi2YBVXCosYP/pub?output=csv";

      const rows = await loadWeatherSpreadsheet(CSV_URL);

      const byYear = {};

      for (const row of rows) {
        if (row.place.toLowerCase() !== "appleton woods") continue;

        const yr = Number(row.year);
        if (!byYear[yr]) byYear[yr] = [];
        byYear[yr].push(row);
      }

      // Group each year by month
      Object.keys(byYear).forEach((yr) => {
        byYear[yr] = groupByMonth(byYear[yr]);
      });

      setAllYearsData(byYear);
      setWeather(byYear[year] || {});
      setLoading(false);
    }

    load();
  }, []);

  // Update weather when year changes
  useEffect(() => {
    if (!allYearsData) return;
    setWeather(allYearsData[year] || {});
  }, [year, allYearsData]);

  if (loading || !weather) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        Loading Appleton Woods data…
      </div>
    );
  }

  // Flatten ALL years for modals
  const allDailyRows = Object.values(allYearsData)
    .flatMap((byMonth) => Object.values(byMonth).flat());

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Header
        placeName="Appleton Woods"
        year={year}
        setYear={setYear}
        metric={metric}
        setMetric={setMetric}
      />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
        {months.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            year={year}
            place="appletonwoods"
            metric={metric}
            data={weather[month] || []}      // charts
            fullData={allDailyRows}          // rainfall modal
            temperatureData={appletonTemperatureData}       // temperature modal
          />
        ))}

      </div>
    </div>
  );
}















