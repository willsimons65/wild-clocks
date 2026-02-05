// src/components/insights/RainfallComparisonTable.jsx

export default function RainfallComparisonTable({
  monthLabel,
  rows,
}) {
  return (
    <section className="space-y-4">
      
      <div className="rounded-2xl bg-[#161616] border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 px-4 py-3 text-xs font-medium text-white/60 border-b border-white/10">
          <div className="text-base font-medium text-white">Year</div>
          <div className="text-center text-blue-400">mm</div>
          <div className="text-center text-teal-400">m</div>
        </div>

        {/* Body */}
        <div className="max-h-[320px] overflow-y-auto">
          {rows.map((row) => (
            <div
              key={row.year}
              className="grid grid-cols-3 px-4 py-3 text-sm border-b border-white/5 last:border-b-0"
            >
              <div className="text-white/90">
                {row.year}
              </div>

              <div className="text-center text-blue-400 tabular-nums">
                {row.total != null ? `${row.total}mm` : "—"}
              </div>

              <div className="text-center text-teal-400 tabular-nums">
                {row.ytd != null ? `${row.ytd.toFixed(1)}m` : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/40">
        Scroll down to view earlier years.
      </p>
    </section>
  );
}
