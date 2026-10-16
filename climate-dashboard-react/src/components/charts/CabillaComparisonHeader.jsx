
export default function CabillaComparisonHeader({
  data,
  metric,
  comparisonFocus = "outside",
}) {
  const isTemperature = metric === "temperature";

  const groups = [
    {
      key: "outside",
      label: "Outside",
      max: data?.outsideMax,
      min: data?.outsideMin,
      humidity: data?.outsideHumidity,
    },
    {
      key: "underCanopy",
      label: "Under canopy",
      max: data?.canopyMax,
      min: data?.canopyMin,
      humidity: data?.canopyHumidity,
    },
  ];

  const format = (value, suffix = "°") => {
    if (value == null || !Number.isFinite(Number(value))) {
      return "—";
    }

    return `${Number(value).toFixed(1)}${suffix}`;
  };

  return (
    <div className="grid w-full max-w-[260px] -translate-y-1 grid-cols-2 gap-4 text-center">
      {groups.map((group) => {
        const isFocused = comparisonFocus === group.key;

        return (
          <div
            key={group.key}
            className="min-w-0"
            style={{
              opacity: isFocused ? 1 : 0.4,
            }}
          >
            <p className="text-[11px] leading-tight text-white/75">
              {group.label}
            </p>

            {isTemperature ? (
              <div className="mt-1 flex items-center justify-center gap-2 whitespace-nowrap">
                <span className="text-[13px] font-medium text-[#FF2E94] tabular-nums">
                  {format(group.max)}
                </span>

                <span className="text-[13px] font-medium text-[#7bbaff] tabular-nums">
                  {format(group.min)}
                </span>
              </div>
            ) : (
              <div className="mt-1 text-[13px] font-medium text-[#6066FF] tabular-nums">
                {format(group.humidity, "%")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
