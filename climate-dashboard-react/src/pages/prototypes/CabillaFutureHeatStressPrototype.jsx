// src/pages/prototypes/CabillaFutureHeatStressPrototype.jsx

import React from "react";

import PossibleFuturesCard from "@/components/trends/PossibleFuturesCard";
import FutureHeatStressChart from "@/components/trends/FutureHeatStressChart";

import { cabillaFutureHeatStress } from "@/data/heat-stress/cabilla/future-heat-stress";

export default function CabillaFutureHeatStressPrototype() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        Prototype — not part of the live Wild Clocks site.
      </div>

      <div className="space-y-8">
        <PossibleFuturesCard
          period={cabillaFutureHeatStress.period}
          introCopy="Climate projections help us explore how environmental conditions at Cabilla could change under different warming scenarios. They describe plausible futures rather than predictions of individual years. Values show the average trend (median) and the expected range of uncertainty (10th–90th percentile) under a high-emissions pathway (RCP8.5)."
          summaryCopy={[
            "Temperatures above 25°C could occur several times more often than they do today.",
            "Short periods of intense heat may become a regular feature of summer, increasing water stress for trees and altering understorey conditions.",
          ]}
          sourceNote="Derived from UKCP18 Local projections on a 5 km grid, using the grid cell covering Cabilla."
        >
          <FutureHeatStressChart
            data={cabillaFutureHeatStress}
            maxDays={60}
          />
        </PossibleFuturesCard>
      </div>
    </main>
  );
}