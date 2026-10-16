// src/components/charts/CabillaMicroclimateChart.jsx

export default function CabillaMicroclimateChart({
  data,
  ecowittData,
  year,
  monthIndex,
  selectedMetric,
  onMetricChange,
  location = "outside",
  view = "outside",
  comparisonFocus = "outside",
  onComparisonFocusChange,
}) {
  const dataHogMonth =
    data?.years?.[String(year)]?.[String(monthIndex)];

  const ecowittMonth =
    ecowittData?.years?.[String(year)]?.[String(monthIndex)];

  const useEcowitt = Boolean(ecowittMonth);
  const isCompare = view === "compare" && useEcowitt;

  const monthData = useEcowitt
    ? ecowittMonth?.[location]
    : dataHogMonth;

  if (!monthData && !isCompare) return null;

  function format(value, decimals = 1) {
    if (value == null || !Number.isFinite(Number(value))) {
      return "—";
    }

    return Number(value).toFixed(decimals);
  }

  const cards = [
    {
      key: "temperature",
      label: "Avg temp",
      value: useEcowitt
        ? monthData?.meanTemp
        : monthData?.avgMeanTemp,
      suffix: "°C",
      helper: "Mean air temperature",
    },
    {
      key: "humidity",
      label: "Humidity",
      value: useEcowitt
        ? monthData?.humidity
        : monthData?.avgHumidity,
      suffix: "%",
      helper: "Mean relative humidity",
    },
    ...(
      !isCompare && location === "outside"
        ? [{
            key: "radiation",
            label: "Light",
            value: useEcowitt
              ? monthData?.solarRadiation
              : monthData?.avgSolarRadiation,
            suffix: " W/m²",
            helper: "Avg solar radiation",
            compact: true,
          }]
        : []
    ),
  ];

  const METRIC_STYLES = {
    temperature: "#FE2E95",
    humidity: "#6066FF",
    radiation: "#F5D94A",
  };

  const flipFocus = () => {
    onComparisonFocusChange?.(
      comparisonFocus === "outside"
        ? "underCanopy"
        : "outside"
    );
  };

  return (
    <div className="pb-5">
      <div
        className={`grid grid-cols-1 gap-2 ${
          cards.length === 2
            ? "sm:grid-cols-2"
            : "sm:grid-cols-3"
        }`}
      >
        {cards.map((card) => {
          const isSelected = selectedMetric === card.key;

          const outsideValue =
            card.key === "temperature"
              ? ecowittMonth?.outside?.meanTemp
              : ecowittMonth?.outside?.humidity;

          const canopyValue =
            card.key === "temperature"
              ? ecowittMonth?.underCanopy?.meanTemp
              : ecowittMonth?.underCanopy?.humidity;

          return (
            <div
              key={card.key}
              className={`
                relative rounded-xl border
                text-center transition-colors
                ${
                  isSelected
                    ? "border-white/30 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.04]"
                }
              `}
            >
              <button
                type="button"
                onClick={() => onMetricChange(card.key)}
                aria-pressed={isSelected}
                className="w-full rounded-xl px-3 py-3 text-center hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                <p
                  className={`text-[11px] uppercase tracking-wide ${
                    isSelected
                      ? "text-white/80"
                      : "text-white/45"
                  }`}
                >
                  {card.label}
                </p>

                {isCompare ? (
                  <div className="mt-1 flex flex-col items-center leading-tight">
                    {[
                      {
                        key: "outside",
                        value: outsideValue,
                      },
                      {
                        key: "underCanopy",
                        value: canopyValue,
                      },
                    ].map((item) => {
                      const isFocused =
                        comparisonFocus === item.key;

                      const mainColor =
                        card.key === "temperature"
                          ? "#FE2E95"
                          : "#6066FF";

                      return (
                        <span
                          key={item.key}
                          className={
                            isFocused
                              ? "text-[20px]"
                              : "text-[17px]"
                          }
                          style={{
                            color: mainColor,
                            opacity: isFocused ? 1 : 0.4,
                          }}
                        >
                          {item.value == null
                            ? "—"
                            : `${format(item.value)}${card.suffix}`}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    className={`mt-1 leading-none ${
                      card.compact
                        ? "text-[16px]"
                        : "text-[20px]"
                    }`}
                    style={{
                      color: isSelected
                        ? METRIC_STYLES[card.key]
                        : "rgba(255,255,255,0.9)",
                    }}
                  >
                    {card.value == null
                      ? "—"
                      : `${format(card.value)}${card.suffix}`}
                  </p>
                )}

                <p className="mt-2 text-[10px] leading-tight text-white/35">
                  {card.helper}
                </p>
              </button>

              {isCompare && isSelected && (
                <button
                  type="button"
                  onClick={flipFocus}
                  title={`Focus on ${
                    comparisonFocus === "outside"
                      ? "under-canopy"
                      : "outside"
                  } observations`}
                  aria-label={`Focus on ${
                    comparisonFocus === "outside"
                      ? "under-canopy"
                      : "outside"
                  } observations`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 7v14l-3-3" />
                    <path d="m7 21 3-3" />
                    <path d="M17 17V3l-3 3" />
                    <path d="m17 3 3 3" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-white/45">
        On-site microclimate data from Cabilla
      </p>
    </div>
  );
}
