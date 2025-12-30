// src/components/modals/TemperatureModal.jsx

import { useMemo } from "react";
import useModalShell from "@/hooks/useModalShell";
import ModalFrame from "@/components/modals/ModalFrame";

import { transformTemperatureMonth } from "@/data/temperature/transformTemperature";

export default function TemperatureModal({
  month,
  year,
  monthIndex,
  raw,        // ✅ aggregated temperature data
  onClose,
}) {
  useModalShell({ isOpen: true, onClose });

  if (!raw || !raw.years) {
    console.warn("TemperatureModal: raw temperature data missing", raw);
    return null;
  }

  const data = transformTemperatureMonth(raw, year, monthIndex);

  if (!data) return null;

  const { summary, byYear } = data;

  const previousYears = useMemo(
    () => byYear.filter((row) => row.year !== year),
    [byYear, year]
  );

  return (
    <ModalFrame
      title={`Average temperature for ${month}`}
      onClose={onClose}
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl bg-zinc-800 p-4">
          <div className="text-sm text-white/60">
            Average max for the month
          </div>
          <div className="mt-2 text-4xl font-semibold text-pink-400">
            {summary.avgMax.toFixed(1)}°C
          </div>
        </div>

        <div className="rounded-xl bg-zinc-800 p-4">
          <div className="text-sm text-white/60">
            Average min for the month
          </div>
          <div className="mt-2 text-4xl font-semibold text-blue-400">
            {summary.avgMin.toFixed(1)}°C
          </div>
        </div>
      </div>

      <p className="text-sm text-white/50 mb-4">
        Compare the historical average for {month}.
      </p>

      {/* Table */}
<div className="rounded-xl bg-zinc-800 overflow-hidden">
  {/* Table header */}
  <table className="w-full text-sm">
    <thead className="bg-zinc-800 border-b border-white/10">
    <tr>
        <th className="px-4 py-3 text-left font-medium text-white">
        Year
        </th>
        <th className="px-7 py-3 text-left font-medium text-pink-400">
        °C
        </th>
        <th className="px-6 py-3 text-left font-medium text-blue-400">
        °C
        </th>
    </tr>
    </thead>
  </table>

  {/* Scrollable body */}
  <div className="max-h-[360px] overflow-y-auto">
    <table className="w-full text-sm">
      <tbody>
        {previousYears.map((row) => (
          <tr key={row.year} className="border-t border-white/5">
            <td className="px-4 py-3 text-white">
              {row.year}
            </td>
            <td className="px-4 py-3 text-pink-300">
              {row.avgMax.toFixed(1)}°C
            </td>
            <td className="px-4 py-3 text-blue-300">
              {row.avgMin.toFixed(1)}°C
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <p className="mt-4 text-xs text-white/40">
        Scroll down to view earlier years.
      </p>
    </ModalFrame>
  );
}
