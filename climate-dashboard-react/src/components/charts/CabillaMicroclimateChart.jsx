export default function CabillaMicroclimateChart({
  data,
  year,
  monthIndex,
  selectedMetric,
  onMetricChange,
}) {
  const monthData = data?.years?.[String(year)]?.[String(monthIndex)];

if (!monthData) {
  return null;
}

  function format(value, decimals = 1) {
    if (value == null) return "—";
    return Number(value).toFixed(decimals);
  }

const cards = [
  {
    key: "temperature",
    label: "Avg temp",
    value: monthData.avgMeanTemp,
    suffix: "°C",
    helper: "Mean air temperature",
  },
  {
    key: "humidity",
    label: "Humidity",
    value: monthData.avgHumidity,
    suffix: "%",
    helper: "Mean relative humidity",
  },
  {
    key: "radiation",
    label: "Light",
    value: monthData.avgSolarRadiation,
    suffix: " W/m²",
    helper: "Avg solar radiation",
    compact: true,
  },
];

const METRIC_STYLES = {
  temperature: "#FE2E95",
  humidity: "#6066FF",
  radiation: "#F5D94A",
};

  return (
    <div className="pb-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cards.map((card) => (
            <button
            key={card.key}
            type="button"
            onClick={() => onMetricChange(card.key)}
                className={`
                rounded-xl border px-3 py-3 text-center transition cursor-pointer
                hover:bg-white/[0.06]
                ${
                    selectedMetric === card.key
                    ? "border-white/30 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.04]"
                }
                `}
                            >
            <p
                className={`
                    text-[11px] uppercase tracking-wide
                    ${
                    selectedMetric === card.key
                        ? "text-white/80"
                        : "text-white/45"
                    }
                `}
                >
                {card.label}
            </p>

            <p
            className={`
                mt-1 leading-none
                ${card.compact ? "text-[16px]" : "text-[20px]"}
            `}
            style={{
                color:
                    selectedMetric === card.key
                    ? METRIC_STYLES[card.key]
                    : "rgba(255,255,255,0.9)",
                }}
            >
              {card.value == null ? "—" : `${format(card.value)}${card.suffix}`}
            </p>

            <p className="mt-2 text-[10px] leading-tight text-white/35">
              {card.helper}
            </p>
        </button>
        ))}
      </div>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-white/45">
        On-site microclimate data from Cabilla
      </p>
    </div>
  );
}