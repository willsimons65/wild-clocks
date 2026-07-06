// src/pages/AppletonWoods.jsx

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import SentinelBanner from "@/components/sentinel/SentinelBanner";
import AppletonWoodsBanner from "@/images/assets/app-wood-banner.webp";
import MonthBlock from "@/components/layout/MonthBlock";
import { loadWeatherSpreadsheet } from "@/utils/loadSpreadsheet";
import { groupByMonth } from "@/utils/charts";
import appletonWoodsClimate from "@/data/aggregates/appleton-woods.json";
import appletonRainfallDaily from "@/data/appleton-woods/aggregates/appleton-rainfall-daily.json";
import ClimateEnvelopeCard from "@/components/trends/ClimateEnvelopeCard";
import { baselineEnvelope as appletonBaselineEnvelope } from "@/data/climate-envelope/appleton/baseline-envelope";
import { currentEnvelope as appletonCurrentEnvelope } from "@/data/climate-envelope/appleton/current-envelope";

import RainfallRegimeCard from "@/components/trends/RainfallRegimeCard";
import { appletonBaselineRainfallRegime } from "@/data/annual-rainfall/appleton/baseline-regime";
import { appletonCurrentRainfallRegime } from "@/data/annual-rainfall/appleton/current-regime";

import HeatStressCard from "@/components/trends/HeatStressCard";
import { appletonBaselineHeatStress } from "@/data/heat-stress/appleton/baseline-heat-stress";
import { appletonCurrentHeatStress } from "@/data/heat-stress/appleton/current-heat-stress";

import WinterColdCard from "@/components/trends/WinterColdCard";
import { appletonBaselineWinterCold } from "@/data/winter-cold/appleton/baseline-winter-cold";
import { appletonCurrentWinterCold } from "@/data/winter-cold/appleton/current-winter-cold";

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
  const [viewMode, setViewMode] = useState("feed");
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
  placeName="Appleton Woods"
  baselineEnvelope={appletonBaselineEnvelope}
  currentEnvelope={appletonCurrentEnvelope}
  baselineLabel="1961–1990"
  currentLabel="2021–2025"
  baselineCopy={[
    "The 1961–1990 baseline represents the historical climate envelope for this woodland before accelarated regional warming.",
    "During this thirty-year reference period, both seasonal heat accumulation and summer moisture deficit remained within tightly defined boundaries.",
  ]}
  currentCopy={[
    "The 2021–2025 envelope represents recent climate conditions experienced by Appleton Woods.",
    "Compared with the historical baseline, accumulated warmth has increased substantially and seasonal moisture deficits have deepened.",
  ]}
  sourceNote="Historical climate data are derived from the Radcliffe Observatory, Oxford, approximately 4 miles from Appleton Woods. Recent temperature records are drawn from the Observatory, while rainfall observations are collected locally."
/>

<RainfallRegimeCard
      placeName="Cabilla"
      baselineRegime={appletonBaselineRainfallRegime}
      currentRegime={appletonCurrentRainfallRegime}
      baselineLabel="1961–1990"
      currentLabel="2021–2025"
      introCopy=
        "Although annual rainfall has changed relatively little, the way it is delivered has changed substantially. Light rainfall has become much less frequent, dry days are now commonplace, and rainfall above 10 mm—once an occasional event—now occurs regularly."
      
      baselineCopy={[
        "Light rainfall dominated the year.",
        "Dry days were uncommon, and rainfall above 10 mm was somewhat rare. Moisture was delivered little and often, helping to maintain consistently damp soils throughout much of the year.",
      ]}
      currentCopy={[
        "Dry days are now much more frequent, while heavier rainfall events occur regularly.",
        "Water increasingly arrives in bursts separated by longer dry spells, changing how moisture is stored and made available within the woodland.",
      ]}
      sourceNote="Historical climate data are derived from the Radcliffe Observatory, Oxford, approximately 4 miles from Appleton Woods. Recent temperature records are drawn from the Observatory, while rainfall observations are collected locally."
    />

  <HeatStressCard
    placeName="Appleton Woods"
    baselineData={appletonBaselineHeatStress}
    currentData={appletonCurrentHeatStress}
    baselineLabel="1961–1990"
    currentLabel="2021–2025"
    introCopy="Hot days matter because woodland stress is often driven by short periods of high daytime temperature, not by seasonal averages. These thresholds show how often Appleton Woods now experiences potentially stressful heat."
    baselineCopy={[
      "Historically, hot days were relatively uncommon.",
      "Warm days occurred most years, but higher heat-stress thresholds were reached only occasionally. Extreme heat was rare, giving the woodland more time to recover between hot spells.",
    ]}
    currentCopy={[
      "Hot days are now much more frequent across every threshold.",
      "The woodland is exposed to more frequent daytime heat stress, increasing pressure on soils, seedlings and understorey plants, especially when heat coincides with dry conditions.",
    ]}
    sourceNote="Historical and recent temperature records are derived from the Radcliffe Observatory, Oxford, approximately 4 miles from Appleton Woods."
  />

    <WinterColdCard
    placeName="Appleton Woods"
    baselineData={appletonBaselineWinterCold}
    currentData={appletonCurrentWinterCold}
    baselineLabel="1961–1990"
    currentLabel="2021–2025"
    introCopy="Winter is becoming shorter and milder. These thresholds show how often Appleton Woods experiences ecologically important cold, from cool winter days through to hard frost. Many woodland processes—from dormancy and bud development to the survival of insects, fungi and pathogens—depend on these periods of sustained cold."
    baselineCopy={[
      "Winter cold was a defining feature of the year.",
      "Cool conditions persisted for much of the winter, with temperatures below 7°C on around half the days of the year. Frosts were common and hard frosts occurred most winters, providing the prolonged cold that has shaped Britain's woodland ecology for centuries.",
    ]}
    currentCopy={[
      "Winter cold is becoming less persistent.",
      "Days below every threshold have become less frequent. The woodland still experiences frost, but sustained winter chill and hard frosts are becoming increasingly rare. As winters continue to warm, the seasonal cold that many native species rely on is gradually disappearing.",
    ]}
    sourceNote="Historical and recent temperature records are derived from the Radcliffe Observatory, Oxford, approximately 4 miles from Appleton Woods."
  />
  </div>
) : (
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
        rainfallDailyData={appletonRainfallDaily}
      />
    ))}
  </div>
)}
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















