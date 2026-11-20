// src/components/charts/CanopyBufferingSummary.jsx

const OPTIONS = [
  {
    key: "cooling",
    label: "CANOPY COOLING",
    description:
      "Mean daily maximum temperature difference",
    color: "#FE2E95",
    dataKey: "canopyCooling",
  },
  {
    key: "humidity",
    label: "HUMIDITY DIFFERENCE",
    description:
      "Mean daytime relative humidity difference",
    color: "#6066FF",
    dataKey: "humidityDifference",
  },
];

function formatValue(value, metric) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "—";
  }

  const n = Number(value);

  if (metric === "humidity") {
    return `${n > 0 ? "+" : ""}${n.toFixed(1).replace(/\.0$/, "")} pp`;
  }

  return `${n.toFixed(1)}°C`;
}

export default function CanopyBufferingSummary({
  monthlyData,
  year,
  monthIndex,
  selectedMetric,
  onMetricChange,
}) {
  const summary =
    monthlyData?.years?.[String(year)]?.[
      String(monthIndex)
    ]?.buffering;

  const hasData = (summary?.days ?? 0) > 0;

  return (
    <div className="space-y-3">
      <div
        className="grid grid-cols-2 gap-2"
        role="group"
        aria-label="Canopy buffering measurement"
      >
        {OPTIONS.map((option) => {
          const isSelected =
            selectedMetric === option.key;

          const value = hasData
            ? summary?.[option.dataKey]
            : null;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onMetricChange(option.key)}
              aria-pressed={isSelected}
              className={`
                min-w-0 min-h-[100px]
                rounded-xl border
                px-2 py-3
                flex flex-col items-center
                justify-start gap-1
                text-center
                transition-colors
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-white
                ${
                isSelected
                    ? "bg-[#303030] border-white/25"
                    : "bg-[#262626] border-white/10 hover:bg-[#303030]"
                }
                `}
            >
              <span className="text-[10px] font-medium text-white/75">
                {option.label}
              </span>

              <span
                className="text-lg font-medium tabular-nums"
                style={{
                  color: hasData
                    ? option.color
                    : "#777777",
                }}
              >
                {formatValue(value, option.key)}
              </span>

              <span
                className="
                  max-w-[150px]
                  text-[10px] leading-tight
                  text-white/45
                "
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-white/50">
        {hasData
          ? "On-site microclimate data from Cabilla"
          : "No canopy buffering comparison available"}
      </p>
    </div>
  );
}
