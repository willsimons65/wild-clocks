// /components/insights/WaterBalanceLiteChart.jsx

import ChartContainer from "@/components/charts/base/ChartContainer";
import ChartGrid from "@/components/charts/base/ChartGrid";
import ChartAxes from "@/components/charts/base/ChartAxes";
import ChartBars from "@/components/charts/base/ChartBars";
import ChartMetricHeader from "@/components/charts/base/ChartMetricHeader";
import EmptyChartState from "@/components/charts/base/EmptyChartState";
import { useEffect, useState } from "react";
import { CHART_HEIGHT } from "@/constants/chartLayout";

export default function WaterBalanceLiteChart({ data, year, monthIndex }) {
  if (!data || data.length === 0) return null;

  const MONTH_LABELS_DESKTOP = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const MONTH_LABELS_MOBILE = ["J","F","M","A","M","J","J","A","S","O","N","D"];

 const [isMobile, setIsMobile] = useState(() => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
});

useEffect(() => {
  function onResize() {
    setIsMobile(window.innerWidth < 768);
  }
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
  const MONTH_LABELS = isMobile ? MONTH_LABELS_MOBILE : MONTH_LABELS_DESKTOP;

  const MONTH_DOMAIN = [1, 12];
  const MONTH_TICKS = [1,2,3,4,5,6,7,8,9,10,11,12];

  const maxAbs = Math.max(...data.map(d => Math.abs(d.y)), 10);
  const upper = Math.ceil(maxAbs / 5) * 5;

  const yScale = (v) =>
    CHART_HEIGHT / 2 - (v / upper) * (CHART_HEIGHT / 2);

  const yTicks = [-upper, -upper / 2, 0, upper / 2, upper];

  return (
    <ChartContainer
      data={data}
      year={year}
      yScale={yScale}
      yTicks={yTicks}
      xDomainOverride={MONTH_DOMAIN}
      xTicksOverride={MONTH_TICKS}
      interactive
      leftPaddingOverride={64}
      rightPadding={24}
        metricHeader={({ index }) => {
        const d = data[index];
        if (!d) return null;

        const abs = Math.abs(Math.round(d.y));
        const label = d.y < 0 ? "Moisture deficit" : "Moisture surplus";
        const color = d.y < 0 ? "text-orange-400" : "text-green-400";

        return (
          <ChartMetricHeader
            items={[
              {
                label,
                value: abs,
                unit: "mm",
                className: color,
              },
            ]}
          />
        );
      }}
    >
      <ChartGrid />

      <ChartAxes
        showZeroLine
        yPosition="left"
        yFormatter={(v) => `${Math.round(v)}mm`}
        xFormatter={(v) => MONTH_LABELS[v - 1]}
      />

      <ChartBars
        data={data}
        positiveFill="#2EA44F"   // green
        negativeFill="#F0883E"   // orange
      />

    </ChartContainer>
  );
}

