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

const HEATWAVE_THRESHOLDS = {
  "appleton-woods": 27,
  "littleknepp": 27,
  "thousand-year-trust": 25,
};

export default function MonthBlock({
  month,
  year,
  place,
  metric,
  data,
  fullData,
  temperatureData,
  microclimateDailyData,
  ecowittMonthlyData,
  ecowittDailyData,
  rainfallDailyData,
  photos = [],
}) {
  const navigate = useNavigate();
  const [microclimateMetric, setMicroclimateMetric] = useState("temperature");

  const [microclimateLocation, setMicroclimateLocation] =
  useState("outside");

  const heatwaveThreshold =
  HEATWAVE_THRESHOLDS[place] ?? null;

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
        heatwaveThreshold={heatwaveThreshold}
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
                ecowittData={ecowittMonthlyData}
                monthIndex={monthIndex}
                year={year}
                selectedMetric={microclimateMetric}
                onMetricChange={setMicroclimateMetric}
                location={microclimateLocation}
              />

              <CabillaDailyMicroclimateChart
                dailyData={microclimateDailyData}
                ecowittData={ecowittDailyData}
                year={year}
                monthIndex={monthIndex}
                metric={microclimateMetric}
                location={microclimateLocation}
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
          <div className="px-4 pt-2 pb-5 flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium tracking-tight opacity-90">
              {month}
            </h2>

            {metric === "microclimate" &&
              place === "thousand-year-trust" &&
              ecowittMonthlyData?.years?.[String(year)]?.[String(monthIndex)] && (
                <button
                  type="button"
                  onClick={() => {
                    const nextLocation =
                      microclimateLocation === "outside"
                        ? "underCanopy"
                        : "outside";

                    setMicroclimateLocation(nextLocation);

                    if (
                      nextLocation === "underCanopy" &&
                      microclimateMetric === "radiation"
                    ) {
                      setMicroclimateMetric("temperature");
                    }
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                  aria-label={`Switch to ${
                    microclimateLocation === "outside"
                      ? "under canopy"
                      : "outside"
                  } measurements`}
                >
                  <span>
                    {microclimateLocation === "outside"
                      ? "Outside"
                      : "Under canopy"}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 7h14l-3-3" />
                    <path d="m21 7-3 3" />
                    <path d="M17 17H3l3 3" />
                    <path d="m3 17 3-3" />
                  </svg>
                </button>
              )}
          </div>

          {renderChart()}
        </div>
      </ChartCard>
    </div>
  );
}






