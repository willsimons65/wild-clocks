// src/components/modals/TemperatureModal.jsx

import { useState } from "react";
import useModalShell from "@/hooks/useModalShell";

import { transformTemperatureMonth } 
  from "@/data/temperature/transformTemperature";

import temperatureAggregates 
  from "@/data/aggregates/little-knepp.json";

export default function TemperatureModal({ month, year, onClose }) {
  // Lock modal behaviour (ESC, body scroll)
  useModalShell({ isOpen: true, onClose });

  // Local tab state (resets when modal closes)
  const [activeTab, setActiveTab] = useState("average"); 
  // "average" | "difference"

  // Month → index
  const monthIndex =
    [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ].indexOf(month) + 1;

  // Transform data (already validated)
  const temperature = transformTemperatureMonth(
    temperatureAggregates,
    year,
    monthIndex
  );

  const { summary, byYear } = temperature;

  const rows = byYear.filter(r => r.year !== year);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal panel */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-[#1E1E1E] border border-white/10 shadow-2xl pb-6">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h3 className="text-lg font-medium">
              Average temperature for {month} 
            </h3>

            <button
              aria-label="Close modal"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          {/* === TOP CARDS === */}
          <div className="px-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 p-4 bg-[#171717]/90">
                <div className="text-sm text-white/50 mb-2">
                  Average max for the month
                </div>
                <div className="text-4xl font-medium text-pink-400">
                  {summary.avgMax}°C
                </div>
              </div>

              <div className="rounded-xl border border-white/10 p-4 bg-[#171717]/90">
                <div className="text-sm text-white/50 mb-2">
                  Average min for the month
                </div>
                <div className="text-4xl font-medium text-blue-400">
                  {summary.avgMin}°C
                </div>
              </div>
            </div>
          </div>

<div className="px-6 mt-4">
  <p className="mt-6 text-sm text-white/40">
  Compare the historical average for [month].
</p>
</div>

<div className="px-6 mt-4">
<div className="mt-4 rounded-xl border border-white/10 bg-[#1E1E1E]/80 overflow-hidden">

{/* Sticky header */}
<div
  className="grid grid-cols-3 px-4 py-3
             text-base font-medium
             bg-[#1A1A1A]/90
             backdrop-blur-sm
             sticky top-0 z-30
             border-b border-white/10"
>
  <div>Year</div>
  <div className="text-pink-400">0°C</div>
  <div className="text-blue-400">0°C</div>
</div>



{/* Scrollable rows */}
<div className="max-h-[260px] overflow-y-auto bg-[#171717]/90">
  {rows.map(row => (
    <div
      key={row.year}
      className="grid grid-cols-3 px-4 py-2
                 border-t border-white/5 text-sm"
    >
      <div>{row.year}</div>
      <div className="text-pink-300">
        {row.avgMax.toFixed(1)}°C
      </div>
      <div className="text-blue-300">
        {row.avgMin.toFixed(1)}°C
      </div>
    </div>
  ))}
</div>

</div>
</div>



          </div>
        </div>
        </div>
    );
}


