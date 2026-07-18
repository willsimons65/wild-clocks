// src/pages/ThousandYearTrust.jsx

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import MonthBlock from "@/components/layout/MonthBlock";
import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";
import SentinelBanner from "@/components/sentinel/SentinelBanner";
import TemWoodBanner from "@/images/assets/tem-wood-banner.webp";
import cabillaMicroclimate from "@/data/cabilla/aggregates/cabilla-microclimate-monthly.json";
import cabillaDailyData from "@/data/cabilla/aggregates/cabilla-microclimate-daily.json";
import cabillaRainfallDaily from "@/data/cabilla/aggregates/cabilla-rainfall-daily.json";
import { PHOTO_MANIFESTS } from "@/data/photos/manifests";
import ClimateEnvelopeCard from "@/components/trends/ClimateEnvelopeCard";
import { cabillaBaselineEnvelope } from "@/data/climate-envelope/cabilla/cabilla-baseline-envelope";
import { cabillaCurrentEnvelope } from "@/data/climate-envelope/cabilla/cabilla-current-envelope";

import RainfallRegimeCard from "@/components/trends/RainfallRegimeCard";
import { cabillaBaselineRainfallRegime } from "@/data/annual-rainfall/cabilla/baseline-regime";
import { cabillaCurrentRainfallRegime } from "@/data/annual-rainfall/cabilla/current-regime";

import HeatStressCard from "@/components/trends/HeatStressCard";
import { cabillaBaselineHeatStress } from "@/data/heat-stress/cabilla/baseline-heat-stress";
import { cabillaCurrentHeatStress } from "@/data/heat-stress/cabilla/current-heat-stress";

import WinterColdCard from "@/components/trends/WinterColdCard";
import { cabillaBaselineWinterCold } from "@/data/winter-cold/cabilla/baseline-winter-cold";
import { cabillaCurrentWinterCold } from "@/data/winter-cold/cabilla/current-winter-cold";

import { cabillaFutureHeatStress } from "@/data/heat-stress/cabilla/future-heat-stress";

export default function ThousandYearTrust({
  year,
  setYear,
  place,
  setPlace,
  metric,
  setMetric,
}) {
  useEffect(() => {
    setPlace("thousand-year-trust");
    setMetric("microclimate");
  }, [setPlace, setMetric]);

  const [viewMode, setViewMode] = useState("feed");
  const [allYearsData, setAllYearsData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const cabillaPhotos = useMemo(() => {
  return PHOTO_MANIFESTS["cabilla"]?.[year] || [];
}, [year]);

    const allDailyRows = useMemo(() => {
    if (!allYearsData) return [];

    return Object.values(allYearsData).flatMap((byMonth) =>
        Object.values(byMonth).flat()
    );
    }, [allYearsData]);

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

                <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/15 bg-black/20 p-0.5 text-sm">
            <button
              onClick={() => setViewMode("feed")}
              className={`rounded-full px-8 py-1 transition-colors ${
                viewMode === "feed"
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white/80"
              }`}
            >
              Feed
            </button>

            <button
              onClick={() => setViewMode("trends")}
              className={`rounded-full px-8 py-1 transition-colors ${
                viewMode === "trends"
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white/80"
              }`}
            >
              Trends
            </button>
          </div>
        </div>

{viewMode === "trends" ? (
  <div className="space-y-8">
    <ClimateEnvelopeCard
      placeName="Cabilla"
      baselineEnvelope={cabillaBaselineEnvelope}
      currentEnvelope={cabillaCurrentEnvelope}
      baselineLabel="1961–1990"
      currentLabel="2020–2024"
      baselineCopy={[
        "The 1961–1990 baseline represents the historical climate envelope for Cabilla before the most recent phase of warming.",
        "During this reference period, the rainforest system experienced lower heat accumulation and a shallower seasonal moisture deficit.",
      ]}
      currentCopy={[
        "The 2020–2024 envelope represents recent climate conditions experienced by Cabilla.",
        "Compared with the historical baseline, accumulated warmth has increased while the seasonal moisture deficit has deepened.",
      ]}
      sourceNote="Climate data are derived from the HadUK-Grid 1 km gridded dataset, using the grid cell covering Cabilla."
    />

    <RainfallRegimeCard
      placeName="Cabilla"
      baselineRegime={cabillaBaselineRainfallRegime}
      currentRegime={cabillaCurrentRainfallRegime}
      baselineLabel="1961–1990"
      currentLabel="2020–2024"
      introCopy=
        "The chart shows how an average year's rainfall is distributed across different rainfall intensities. During the baseline period, water was supplied to the woodland gradually throughout the year. Today, the same annual rainfall is increasingly delivered in fewer, heavier events separated by longer dry spells."
      baselineCopy={[
        "Light rainfall dominated the year.",
        "Dry days were rare, and rainfall above 10 mm was almost absent. Moisture was delivered little and often, producing a remarkably even rainfall regime.",
      ]}
      currentCopy={[
        "The rainfall regime is now noticeably less even.",
        "Dry days are now much more common, while heavy rainfall events occur regularly. Rain increasingly arrives in bursts rather than being spread across the year.",
      ]}
      sourceNote="Climate data are derived from the HadUK-Grid 1 km gridded dataset, using the grid cell covering Cabilla."
    />

    <HeatStressCard
        placeName="Cabilla"
        baselineData={cabillaBaselineHeatStress}
        currentData={cabillaCurrentHeatStress}
        baselineLabel="1961–1990"
        currentLabel="2020–2024"
        introCopy="Hot days matter because woodland stress is often driven by short periods of high daytime temperature, not by seasonal averages. These thresholds show how often Cabilla's temperate rainforest experiences potentially stressful heat."
        baselineCopy={[
            "Historically, hot days were relatively uncommon.",
            "Temperatures above 25°C occurred only occasionally, while days above 30°C were exceptionally rare.",
        ]}
        currentCopy={[
            "Heat stress is becoming more noticeable.",
            "Days above 25°C have become more frequent, while temperatures above 30°C—once almost absent—now occur periodically.",
        ]}
        sourceNote="Climate data are derived from the HadUK-Grid 1 km gridded dataset, using the grid cell covering Cabilla."

        futureData={cabillaFutureHeatStress}
        futureIntroCopy="Climate projections help us explore how environmental conditions at Cabilla could change under different warming scenarios. They describe plausible futures rather than predictions of individual years."
        futureSummaryCopy={[
            "Temperatures above 25°C could occur several times more often than they do today.",
            "Short periods of intense heat may become a regular feature of summer, increasing water stress for trees and altering understorey conditions.",
        ]}
        futureSourceNote="Derived from UKCP18 Local projections on a 5 km grid, using the grid cell covering Cabilla. Values show the ensemble median and 10th–90th percentile range under RCP8.5."
    />

          <WinterColdCard
          placeName="Cabilla"
          baselineData={cabillaBaselineWinterCold}
          currentData={cabillaCurrentWinterCold}
          baselineLabel="1961–1990"
          currentLabel="2020–2024"
          introCopy="Temperate rainforests depend on long periods of cool, humid weather rather than frequent hard frosts. These thresholds show how often Cabilla experiences ecologically important winter cold, helping to sustain the conditions that define Britain's Atlantic woodlands."
          baselineCopy={[
            "Cool, maritime winters shaped the woodland.",
            "Historically, Cabilla experienced long periods of cool weather, but relatively few frosts. The woodland's Atlantic climate moderated winter extremes, creating stable, humid conditions that favour mosses, lichens, liverworts and other rainforest species.",
          ]}
          currentCopy={[
            "Winter cold is becoming less persistent.",
            "Days below every threshold have become less frequent. Frost is now uncommon and hard frost has almost disappeared, while even the long periods of cool weather that characterise Atlantic winters are becoming shorter.",
          ]}
          sourceNote="Climate data are derived from the HadUK-Grid 1 km gridded dataset, using the grid cell covering Cabilla."
        />
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {months.map((month, monthIndex) => {
      const monthPhotos = cabillaPhotos.filter(
        (p) => p.month === monthIndex + 1
      );

      return (
        <MonthBlock
          key={month}
          month={month}
          year={year}
          place="thousand-year-trust"
          metric={metric}
          data={weather?.[month] || []}
          fullData={allDailyRows}
          temperatureData={cabillaMicroclimate}
          microclimateDailyData={cabillaDailyData}
          rainfallDailyData={cabillaRainfallDaily}
          photos={monthPhotos}
        />
      );
    })}
  </div>
)}

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