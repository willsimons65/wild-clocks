// src/components/layout/MonthBlock.jsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PhotoGrid from "@/components/photos/PhotoGrid";
import ChartCard from "@/components/layout/ChartCard";

import TemperatureChart from "@/components/charts/TemperatureChart";
import RainfallChart from "@/components/charts/RainfallChart";
import HumidityChart from "@/components/charts/HumidityChart";
import PhotoperiodChart from "@/components/charts/PhotoperiodChart";

import CabillaMicroclimateChart from "@/components/charts/CabillaMicroclimateChart";
import CabillaDailyMicroclimateChart from "@/components/charts/CabillaDailyMicroclimateChart";
import CabillaRainfallSummary from "@/components/charts/CabillaRainfallSummary";
import CabillaRainfallChart from "@/components/charts/CabillaRainfallChart";

import { MONTH_NAMES } from "@/constants/months";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MonthBlock({
  month,
  year,
  place,
  metric,
  data,
  fullData,
  temperatureData,
  microclimateDailyData,
  rainfallDailyData,
  photos = [],
}) {
  const navigate = useNavigate();
  const [microclimateMetric, setMicroclimateMetric] = useState("temperature");

  const monthIndex0 = MONTHS.indexOf(month);
  const monthIndex = monthIndex0 + 1;

  const monthSlug = useMemo(() => {
    return (MONTH_NAMES[monthIndex0] || month).toLowerCase();
  }, [monthIndex0, month]);

  const hasData = Array.isArray(data) && data.length > 0;

  const monthRows = hasData
    ? data.filter(
        (d) =>
          Number(d.year) === Number(year) &&
          d.month === month
      )
    : [];

  const renderChart = () => {
    switch (metric) {
      case "temperature":
        return (
          <TemperatureChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

case "rainfall":
  if (rainfallDailyData) {
    return (
      <div className="space-y-5">
        <CabillaRainfallSummary
          dailyData={rainfallDailyData}
          year={year}
          monthIndex={monthIndex}
        />

        {place === "thousand-year-trust" ? (
          <CabillaRainfallChart
            dailyData={rainfallDailyData}
            year={year}
            monthIndex={monthIndex}
          />
        ) : (
          <RainfallChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        )}
      </div>
    );
  }

  return (
    <RainfallChart
      data={monthRows}
      month={month}
      monthIndex={monthIndex}
      year={year}
    />
  );

      case "humidity":
        return (
          <HumidityChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "photoperiod":
        return (
          <PhotoperiodChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "microclimate":
        if (place !== "thousand-year-trust") {
          return (
            <div className="px-4 pb-6 text-center text-sm text-white/45">
              Microclimate data is not available for this site yet
            </div>
          );
        }

        return (
          <div className="space-y-0">
            <CabillaMicroclimateChart
              data={temperatureData}
              monthIndex={monthIndex}
              year={year}
              selectedMetric={microclimateMetric}
              onMetricChange={setMicroclimateMetric}
            />

            <CabillaDailyMicroclimateChart
              dailyData={microclimateDailyData}
              year={year}
              monthIndex={monthIndex}
              metric={microclimateMetric}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 relative overflow-visible">
      <div className="rounded-2xl bg-[#1E1E1E] relative">
        <PhotoGrid
          photos={photos}
          manifestOnly={place === "thousand-year-trust"}
          month={monthIndex}
          year={year}
          place={place}
          onPhotoClick={(i) => {
            const photo = i + 1;

            navigate(
              `/viewer/${place}/${year}/${monthSlug}?mode=photos&photo=${photo}`,
              { state: { from: "feed" } }
            );
          }}
        />
      </div>

      <ChartCard>
        <div className="relative overflow-visible">
          <div className="px-4 pt-2 pb-5 flex items-center justify-center">
            <h2 className="text-lg font-medium tracking-tight opacity-90">
              {month}
            </h2>
          </div>

          {renderChart()}
        </div>
      </ChartCard>
    </div>
  );
}






