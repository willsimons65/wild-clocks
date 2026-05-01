// src/pages/ThousandYearTrust.jsx

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import MonthBlock from "@/components/layout/MonthBlock";
import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";
import thousandYearTrustClimate from "@/data/aggregates/thousand-year-trust.json";
import SentinelBanner from "@/components/sentinel/SentinelBanner";
import TemWoodBanner from "@/images/assets/tem-wood-banner.png";

export default function ThousandYearTrust({
  year,
  setYear,
  place,
  setPlace,
}) {
  useEffect(() => {
    setPlace("thousand-year-trust");
  }, [setPlace]);

  const [metric, setMetric] = useState("temperature");
  const [allYearsData, setAllYearsData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const months = useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    []
  );

  useEffect(() => {
    async function load() {
      const CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnTrtD4kMVWWH8lTnDCYOrfM7ORsYYjxce8oE3QU_3fAiZ6NkVqorUa_ANqDP9dbOwSi2YBVXCosYP/pub?output=csv";

      const rows = await loadWeatherSpreadsheet(CSV_URL);

      const byYear = {};

      for (const row of rows) {
        const rowPlace = String(row.place || "").toLowerCase();

        // Adjust this if your spreadsheet uses "cabilla" instead.
        if (rowPlace !== "thousand year trust") continue;

        const yr = Number(row.year);
        if (!byYear[yr]) byYear[yr] = [];
        byYear[yr].push(row);
      }

      Object.keys(byYear).forEach((yr) => {
        byYear[yr] = groupByMonth(byYear[yr]);
      });

      setAllYearsData(byYear);
      setWeather(byYear[year] ?? {});
      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    if (!allYearsData) return;
    setWeather(allYearsData[year] || {});
  }, [year, allYearsData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        Loading Thousand Year Trust data…
      </div>
    );
  }

  const allDailyRows = Object.values(allYearsData || {}).flatMap((byMonth) =>
    Object.values(byMonth).flat()
  );

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

        {/* HERO */}
        <SentinelBanner
        title="The Thousand Year Trust is home to a rare Atlantic rainforest"
        landscapeType="Temperate rainforest"
        sensitivity="humidity-dependent system"
        image={TemWoodBanner}
        description="The Trust is working to research these ancient ecosystems and better understand how they recover and thrive. This Wild Clock will document how the landscape changes through the seasons."
        ctaLabel="Learn more about the Thousand Year Trust"
        ctaHref="https://thousandyeartrust.org"
        tracking={[
            "Moss and liverwort vitality",
            "Epiphyte coverage on trunks and branches",
            "Canopy density and light penetration",
            "Timing of leaf flush and fall",
        ]}
        />

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {months.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            year={year}
            place="thousand-year-trust"
            metric={metric}
            data={weather?.[month] || []}
            fullData={allDailyRows}
            temperatureData={thousandYearTrustClimate}
          />
        ))}
        </div>
      </main>
        <footer className="mt-10 border-t border-white/10">
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 py-6 text-center">
            <a
            href="https://thousandyeartrust.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white/90 transition-colors"
            >
            In collaboration with the{" "}
            <span className="font-medium text-white">Thousand Year Trust</span>
            </a>
        </div>
        </footer>
    </div>
  );
}