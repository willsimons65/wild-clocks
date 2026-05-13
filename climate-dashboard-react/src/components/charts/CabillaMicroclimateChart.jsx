export default function CabillaMicroclimateChart({ data, year, monthIndex }) {
  const monthData = data?.years?.[String(year)]?.[String(monthIndex)];

  if (!monthData) {
    return (
      <div className="px-4 pb-6 text-center text-sm text-white/45">
        No microclimate data yet
      </div>
    );
  }

  function format(value, decimals = 1) {
    if (value == null) return "—";
    return Number(value).toFixed(decimals);
  }

  const cards = [
    {
      label: "Avg temp",
      value: monthData.avgMeanTemp,
      suffix: "°C",
      helper: "Mean air temperature",
    },
    {
      label: "Humidity",
      value: monthData.avgHumidity,
      suffix: "%",
      helper: "Mean relative humidity",
    },
    {
      label: "Light",
      value: monthData.avgSolarRadiation,
      suffix: " W/m²",
      helper: "Avg solar radiation",
      compact: true,
    },
  ];

  return (
    <div className="pb-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="
              rounded-xl bg-white/[0.04] border border-white/10
              px-3 py-3 text-center
            "
          >
            <p className="text-[11px] uppercase tracking-wide text-white/45">
              {card.label}
            </p>

            <p
              className={`
                mt-1 leading-none text-white/90
                ${card.compact ? "text-[16px]" : "text-[20px]"}
              `}
            >
              {card.value == null ? "—" : `${format(card.value)}${card.suffix}`}
            </p>

            <p className="mt-2 text-[10px] leading-tight text-white/35">
              {card.helper}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-white/45">
        On-site microclimate data from Cabilla.
      </p>
    </div>
  );
}