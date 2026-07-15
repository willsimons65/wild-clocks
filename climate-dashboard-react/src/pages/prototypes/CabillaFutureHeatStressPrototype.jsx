// src/pages/prototypes/CabillaFutureHeatStressPrototype.jsx

import React, { useState } from "react";

import PossibleFuturesCard from "@/components/trends/PossibleFuturesCard";
import FutureHeatStressChart from "@/components/trends/FutureHeatStressChart";

import { cabillaFutureHeatStress } from "@/data/heat-stress/cabilla/future-heat-stress";

import ChevronDown from "@/images/assets/chevron-down.svg";

const PERIOD_OPTIONS = [
  {
    period: "2031–2040",
    summaryCopy: [
      "Warm days are likely to become more frequent than they are today.",
      "Heat stress remains relatively uncommon, but hotter summers are beginning to emerge and the direction of change is becoming apparent.",
    ],
  },
  {
    period: "2041–2050",
    summaryCopy: [
      "Periods of unusually warm weather could become a regular feature of summer.",
      "Heat stress may occur more often, increasing seasonal water demand and making some summers noticeably more challenging for trees and woodland plants.",
    ],
  },
  {
    period: "2051–2060",
    summaryCopy: [
      "Heat stress could become a recurring feature of the growing season.",
      "Summers once considered exceptional may become more common, placing greater pressure on tree growth, soil moisture and the woodland understorey.",
    ],
  },
  {
    period: "2061–2070",
    summaryCopy: [
      "Hot summers could become a defining feature of the local climate.",
      "More frequent periods of high temperature may place sustained pressure on the woodland, favouring species better adapted to warmer and drier conditions.",
    ],
  },
  {
    period: "2071–2080",
    summaryCopy: [
      "Temperatures above 25°C could occur several times more often than they do today.",
      "Heat stress may become a regular part of summer, with implications for tree health, woodland structure and the long-term composition of the forest.",
    ],
  },
];

export default function CabillaFutureHeatStressPrototype() {
  const [selectedPeriod, setSelectedPeriod] =
    useState("2071–2080");

  const selectedData =
    cabillaFutureHeatStress[selectedPeriod];

  const selectedOption =
    PERIOD_OPTIONS.find(
      (option) => option.period === selectedPeriod
    ) ?? PERIOD_OPTIONS[PERIOD_OPTIONS.length - 1];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        Prototype only — not part of the Wild Clocks site.
      </div>

      <div className="space-y-8">
        <PossibleFuturesCard
          period={selectedPeriod}
          periodControl={
            <div className="relative inline-block">
              <select
                value={selectedPeriod}
                onChange={(event) =>
                  setSelectedPeriod(event.target.value)
                }
                aria-label="Select climatic period"
                className={[
                  "appearance-none bg-transparent",
                  "cursor-pointer pr-8",
                  "text-lg font-semibold text-white",
                  "focus:outline-none focus-visible:ring-2",
                  "focus-visible:ring-amber-300/0",
                  "rounded-md",
                ].join(" ")}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option
                    key={option.period}
                    value={option.period}
                    className="bg-neutral-900 text-white"
                  >
                    {option.period}
                  </option>
                ))}
              </select>

              <img
                src={ChevronDown}
                alt=""
                aria-hidden="true"
                className={[
                  "pointer-events-none",
                  "absolute right-0 top-1/2",
                  "h-4 w-4 -translate-y-1/2",
                ].join(" ")}
              />
            </div>
          }
          introCopy="Climate projections help us explore how environmental conditions at Cabilla could change under different warming scenarios. They describe plausible futures rather than predictions of individual years. Values show the average trend and the expected range of uncertainty under a high-emissions pathway."
          summaryCopy={selectedOption.summaryCopy}
          sourceNote="Derived from UKCP18 Local daily maximum-temperature projections for the 5 km grid cell covering Cabilla, using 16 ensemble members under RCP8.5. The orange band shows the 10th–90th percentile range across the ensemble, while the lozenge shows the median."
        >
          <FutureHeatStressChart
            key={selectedPeriod}
            data={selectedData}
            maxDays={60}
          />
        </PossibleFuturesCard>
      </div>
    </main>
  );
}