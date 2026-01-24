// src/pages/LittleKnepp.jsx

import React, { useState, useEffect, useMemo } from "react";

import Header from "@/components/layout/Header";
import MonthBlock from "@/components/layout/MonthBlock";

import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";

import littleKneppClimate from "@/data/aggregates/little-knepp.json";

export default function LittleKnepp({
  year,
  setYear,
  setPlace,
}) {

  useEffect(() => {
    setPlace("little-knepp");
  }, [setPlace]);

  const [weather, setWeather] = useState(null);

  // rest of your logic

  const [metric, setMetric] = useState("temperature");

  const [allYearsData, setAllYearsData] = useState(null);

  const allDailyRows = useMemo(() => {
  if (!allYearsData) return [];
  return Object.values(allYearsData).flatMap((byMonth) =>
    Object.values(byMonth).flat()
  );
  }, [allYearsData]);

  const [fade, setFade] = useState(false);

  const months = useMemo(
    () => [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ],
    []
  );

  // -------------------------------
  // Load dataset once on mount
  // -------------------------------
  useEffect(() => {
    async function load() {
      const CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmWrUW53NZXXPO-67eWAxOAqLBXWhVWb3ftNZipsVymsl7iapTucavMLurhwQgGwhXmu4quk2Av0mm/pub?output=csv";

      const rows = await loadWeatherSpreadsheet(CSV_URL);

      const byYear = {};

      for (const row of rows) {
        // Use LITTLE KNEPP consistently
        if (row.place.toLowerCase() !== "little knepp") continue;

        const yr = Number(row.year);
        if (!byYear[yr]) byYear[yr] = [];
        byYear[yr].push(row);
      }

      // Group by month once
      Object.keys(byYear).forEach((yr) => {
        byYear[yr] = groupByMonth(byYear[yr]);
      });

      setAllYearsData(byYear);
      setWeather(byYear[year] || {});
    }

    load();
  }, []);

  // -------------------------------
  // Switch year with fade animation
  // -------------------------------
  useEffect(() => {
    if (!allYearsData) return;

    setFade(true);

    const timeout = setTimeout(() => {
      setWeather(allYearsData[year] || {});
      setFade(false);
    }, 300); // match CSS transition

    return () => clearTimeout(timeout);
  }, [year, allYearsData]);

  // -------------------------------
  // Loading screen
  // -------------------------------
  if (!weather) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        Loading Little Knepp data…
      </div>
    );
  }

  // -------------------------------
  // Render page
  // -------------------------------
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Header
        placeName="Little Knepp"
        year={year}
        setYear={setYear}
        metric={metric}
        setMetric={setMetric}
        viewMode="feed"
      />

      <div className={`transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {months.map((month) => (
            <MonthBlock
              key={month}
              month={month}
              year={year}
              place="littleknepp"        // ✅ fixed
              metric={metric}
              data={weather[month]}
              fullData={allDailyRows}
              temperatureData={littleKneppClimate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

