import ChartContainer from "@/components/charts/base/ChartContainer";
import ChartLine from "@/components/charts/base/ChartLine";
import ChartAxes from "@/components/charts/base/ChartAxes";

export default function CabillaChart({
  data,
  monthIndex,
  year,
}) {
  const monthData = data?.years?.[year]?.[monthIndex];

  if (!monthData) {
    return (
      <div className="text-center text-white/50 py-10">
        No data available
      </div>
    );
  }

  const chartData = [
    {
      label: "Temperature",
      value: monthData.avgMeanTemp,
    },
    {
      label: "Humidity",
      value: monthData.avgHumidity,
    },
  ];

  return (
    <ChartContainer height={160}>
      <ChartAxes />

      {/* Temperature line */}
      <ChartLine
        data={[{ x: 0, y: monthData.avgMeanTemp }]}
        strokeWidth={2}
      />

      {/* Humidity line (scaled visually) */}
      <ChartLine
        data={[{ x: 0, y: monthData.avgHumidity / 2 }]}
        strokeWidth={2}
        opacity={0.5}
      />
    </ChartContainer>
  );
}