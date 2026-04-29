// src/pages/ThousandYearTrust.jsx

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import MonthBlock from "@/components/layout/MonthBlock";
import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";
import thousandYearTrustClimate from "@/data/aggregates/thousand-year-trust.json";
import ExternalLinkIcon from "@/images/assets/external-link-2.svg";
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
                    <section className="mb-10">
          <div className="relative overflow-hidden rounded-[15px] border border-white/10">
            <img
              src={TemWoodBanner}
              alt="Temperate rainforest at Thousand Year Trust"
              className="block w-full h-[300px] md:h-[360px] lg:h-[390px] object-cover"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
              <div className="max-w-5xl text-center">
                <h1 className="text-[18px] sm:text-[26px] md:text-[32px] lg:text-[30px] leading-tight font-normal tracking-[-0.02em] text-white">
                  The Thousand Year Trust is home to a rare Atlantic rainforest
                </h1>

                <p className="mt-6 text-[15px] sm:text-[15px] md:text-[16px] lg:text-[20px] leading-relaxed text-white/85">
                  The Trust is working to research these ancient ecosystems and
                  better understand how they recover and thrive. This Wild Clock will document how the landscape changes through the seasons.
                </p>

                <a
                  href="https://thousandyeartrust.org"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-3 text-[13px] md:text-[18px] font-normal text-white/80 hover:text-white transition-colors"
                >
                  Learn more about the Thousand Year Trust
                  <img
                    src={ExternalLinkIcon}
                    alt=""
                    aria-hidden="true"
                    className="w-6 h-6 opacity-80"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

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