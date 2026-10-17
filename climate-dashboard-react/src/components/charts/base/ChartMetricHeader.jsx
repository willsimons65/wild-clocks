// src/components/charts/base/ChartMetricHeader.jsx

export default function ChartMetricHeader({
  items,
  compact = false,
}) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`
        flex justify-center text-center
        pointer-events-none select-none
        ${
          compact
            ? "gap-3 text-[11px] md:text-xs"
            : "gap-6 text-xs md:text-sm"
        }
      `}
    >
      {items.map(({ label, value, unit, className, style }) => (
        <span
          key={label}
          className={className}
          style={style}
        >
          <span className="opacity-70">{label}: </span>
          <span className="font-semibold">
            {value}
            {unit ?? ""}
          </span>
        </span>
      ))}
    </div>
  );
}
