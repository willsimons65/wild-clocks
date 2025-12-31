// src/components/charts/base/EmptyChartState.jsx

export default function EmptyChartState({ message }) {
  return (
    <div className="h-[220px] flex items-center justify-center">
      <p className="text-sm text-white/50 text-center px-4">
        {message}
      </p>
    </div>
  );
}