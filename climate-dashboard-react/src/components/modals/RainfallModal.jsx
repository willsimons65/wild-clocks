import { useMemo } from "react";

import useModalShell from "@/hooks/useModalShell";
import ModalFrame from "@/components/modals/ModalFrame";
import { formatRainfall } from "@/utils/formatRainfall";

/**
 * Props:
 * - onClose: () => void
 * - year: number
 * - monthLabel: string ("February")
 * - data: transformer output
 */

export default function RainfallModal({
  onClose,
  year,
  monthLabel,
  data,
}) {
  useModalShell({ isOpen: true, onClose });

  if (!data) {
    console.warn("RainfallModal: missing data");
    return null;
  }

  const { summary, byYear } = data;

  const previousYears = useMemo(() => {
    return byYear
      .filter((row) => row.year !== year)
      .sort((a, b) => b.year - a.year);
  }, [byYear, year]);

  return (
    <ModalFrame
      title={`Total rainfall for ${monthLabel}`}
      onClose={onClose}
    >
      {/* Summary cards (locked to 2 columns, even on mobile) */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl bg-zinc-800 p-4">
          <div className="text-sm text-white/60">
            Total for the month
          </div>
          <div className="mt-2 text-4xl font-semibold text-blue-400">
            {formatRainfall(summary.monthTotalMm)}
          </div>
        </div>

        <div className="rounded-xl bg-zinc-800 p-4">
          <div className="text-sm text-white/60">
            Year total to {monthLabel}
          </div>
          <div className="mt-2 text-4xl font-semibold text-teal-400">
            {formatRainfall(summary.yearToDateMm)}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-sm text-white/50 mb-4">
        Compare the historical total for {monthLabel}.
      </p>

      {/* Table */}
      <div className="rounded-xl bg-zinc-800 overflow-hidden">
        {/* Header */}
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-800 border-b border-white/10">
            <tr>
              <th className="px-3 py-3 text-left font-medium text-white">
                Year
              </th>
              <th className="px-6 py-3 text-left font-medium text-blue-400">
                mm
              </th>
              <th className="px-6 py-3 text-left font-medium text-teal-400">
                m
              </th>
            </tr>
          </thead>
        </table>

        {/* Scroll body (≈ 8 rows) */}
        <div className="max-h-[360px] overflow-y-auto">
          <table className="w-full text-sm">
<tbody>
  {previousYears.length === 0 ? (
    <tr>
      <td
        colSpan={3}
        className="px-4 py-6 text-center text-sm text-white/50"
      >
        No historical rainfall data available yet.
      </td>
    </tr>
  ) : (
    previousYears.map((row) => (
      <tr
        key={row.year}
        className="border-t border-white/5"
      >
        <td className="px-3 py-3 text-white">
          {row.year}
        </td>
        <td className="px-4 py-4 text-blue-300">
          {formatRainfall(row.monthTotalMm, { forceUnit: "mm" })}
        </td>
        <td className="px-4 py-4 text-teal-300">
          {formatRainfall(row.yearTotalMm, { forceUnit: "m" })}
        </td>
      </tr>
    ))
  )}
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
