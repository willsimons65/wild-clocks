// src/pages/AppletonWoods.jsx

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import SentinelBanner from "@/components/sentinel/SentinelBanner";
import AppletonWoodsBanner from "@/images/assets/app-wood-banner.webp";
import MonthBlock from "@/components/layout/MonthBlock";
import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";
import appletonWoodsClimate from "@/data/aggregates/appleton-woods.json";

export default function AppletonWoods({
  year,
  setYear,
  place,
  setPlace,
}) {

  useEffect(() => {
  setPlace("appleton-woods");
}, [setPlace]);

  const [metric, setMetric] = useState("temperature");
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
      setWeather(byYear[year] ?? null);
      setLoading(false);
    }

    load();
  }, []);

  // Update weather when year changes
  useEffect(() => {
    if (!allYearsData) return;
    setWeather(allYearsData[year] || {});
  }, [year, allYearsData]);

if (loading) {
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
        place={place}
        setPlace={setPlace}
        year={year}
        setYear={setYear}
        metric={metric}
        setMetric={setMetric}
      />

      <main className="max-w-[1200px] mx-auto p-6 space-y-8">
        <SentinelBanner
          title="Appleton Woods"
          landscapeType="Broadleaf woodland"
          sensitivity="canopy and ground-layer system"
          image={AppletonWoodsBanner}
          description="A broadleaf woodland where seasonal change is visible in the canopy, the ground layer and the shifting availability of light through the year. This Wild Clock documents how the wood changes from winter openness to spring flowering, summer shade and autumn leaf fall."
          ctaLabel="Learn more about Appleton Woods"
          ctaHref="https://earthtrust.org.uk"
          tracking={[
            "Leaf-out timing and canopy closure",
            "Bluebell emergence and peak flowering",
            "Light penetration and ground-layer response",
            "Bramble, fern and shrub growth",
            "Autumn leaf fall and canopy retreat",
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {months.map((month) => (
            <MonthBlock
              key={month}
              month={month}
              year={year}
              place="appleton-woods"
              metric={metric}
              data={weather?.[month] || []}
              fullData={allDailyRows}
              temperatureData={appletonWoodsClimate}
            />
          ))}
        </div>
      </main>
              <footer className="mt-10 border-t border-white/10">
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 py-6 text-center">
            <a
            href="https://earthtrust.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white/90 transition-colors"
            >
            {" "}
            <span className="font-medium text-white"></span>
            </a>
        </div>
        </footer>
    </div>
  );
}















