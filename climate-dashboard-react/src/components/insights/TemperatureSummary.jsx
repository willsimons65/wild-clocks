// src/components/insights/TemperatureSummary.jsx

export default function TemperatureSummary({
  avgMeanTemp,
  days,
  monthLabel,
  year,
}) {
  if (!Number.isFinite(avgMeanTemp)) {
    return (
      <div className="rounded-2xl bg-[#161616] p-6 text-sm text-white/50">
        No temperature data for {monthLabel} {year}.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#161616] p-6 space-y-1">
      <div className="text-3xl font-medium">
        {avgMeanTemp.toFixed(1)}°C
      </div>

      <div className="text-sm opacity-70">
        Average mean temperature ({days} days)
      </div>
    </div>
  );
}



