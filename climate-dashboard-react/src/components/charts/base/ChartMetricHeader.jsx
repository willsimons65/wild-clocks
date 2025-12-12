// src/components/charts/base/ChartMetricHeader.jsx

export default function ChartMetricHeader({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex justify-center gap-6 text-center pointer-events-none select-none text-xs md:text-sm">
      {items.map(({ label, value, unit, className }) => (
        <span key={label} className={className}>
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

