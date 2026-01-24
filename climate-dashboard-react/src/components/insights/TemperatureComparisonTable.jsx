// src/components/insights/TemperatureComparisonTable.jsx

export default function TemperatureComparisonTable({
  monthLabel,
  rows,
}) {
  return (
    <section className="space-y-4">
      {/* Section title */}
      <h3 className="text-sm font-medium text-white/80">
        Compare the historical average for {monthLabel}
      </h3>

      <div className="rounded-2xl bg-[#161616] border border-white/10 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-3 px-4 py-3 text-xs font-medium text-white/60 border-b border-white/10">
          <div><th className="text-base font-medium text-white">Year</th></div>

          <div className="text-center text-blue-400">°C</div>
          <div className="text-center text-teal-400">°C</div>
        </div>

        {/* Table body */}
        <div className="max-h-[320px] overflow-y-auto">
          {rows.map((row) => (
            <div
              key={row.year}
              className="grid grid-cols-3 px-4 py-3 text-sm border-b border-white/5 last:border-b-0"
            >
              {/* Year */}
              <div className="text-white/90">
                {row.year}
              </div>

              {/* Avg max */}
              <div className="text-center text-pink-400 text-center tabular-nums">
                {row.avgMax != null ? `${row.avgMax.toFixed(1)}°C` : "—"}
              </div>

              {/* Avg min */}
              <div className="text-center text-blue-400 text-center tabular-nums">
                {row.avgMin != null ? `${row.avgMin.toFixed(1)}°C` : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-xs text-white/40">
        Scroll down to view earlier years.
      </p>
    </section>
  );
}
