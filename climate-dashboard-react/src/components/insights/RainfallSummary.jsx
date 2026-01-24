// /components/insights/RainfallSummary.jsx

export default function RainfallSummary({
  totalRainfall,
  days,
  monthLabel,
  year,
}) {
  if (!Number.isFinite(totalRainfall)) {
    return (
      <div className="rounded-2xl bg-[#161616] p-6 text-sm text-white/50">
        No rainfall data for {monthLabel} {year}.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#161616] p-6">
      <div className="text-3xl font-medium">
        {Math.round(totalRainfall)} mm
      </div>

      <div className="text-sm opacity-70">
        Total rainfall in {monthLabel} ({days} days)
      </div>
    </div>
  );
}



