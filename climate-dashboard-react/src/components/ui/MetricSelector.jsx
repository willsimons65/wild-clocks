
import React, { useState, useRef, useEffect, useMemo } from "react";

import NavPill from "@/components/ui/NavPill";

import TempIcon from "@/images/assets/temperature.svg";
import RainIcon from "@/images/assets/rainfall-double.svg";
import HumidIcon from "@/images/assets/humidity.svg";
import PhotoIcon from "@/images/assets/photoperiod.svg";
import MicroIcon from "@/images/assets/microclimate.svg";

// New Cabilla icons
import RainDoubleIcon from "@/images/assets/rainfall-double.svg";
import MoistureIcon from "@/images/assets/moisture.svg";
import CanopyIcon from "@/images/assets/canopy-cooling.svg";

import { isMetricAvailable } from "@/config/metricAvailability";

export default function MetricSelector({
  selected,
  onChange,
  place,
  disabled = false,
  subtle = false,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isCabilla = place === "thousand-year-trust";

  // Original menu for Appleton and Little Knepp
  const originalMetrics = useMemo(
    () => [
      { key: "temperature", label: "Temperature", icon: TempIcon },
      { key: "rainfall", label: "Rainfall", icon: RainIcon },
      { key: "humidity", label: "Humidity", icon: HumidIcon },
      { key: "photoperiod", label: "Photoperiod", icon: PhotoIcon },
      { key: "microclimate", label: "Microclimate", icon: MicroIcon },
    ],
    []
  );

  // Cabilla-specific menu
  const cabillaGroups = useMemo(
    () => [
      {
        heading: "Observations",
        items: [
          { key: "temperature", label: "Temperature", icon: TempIcon },
          { key: "rainfall", label: "Rainfall", icon: RainDoubleIcon },
          { key: "humidity", label: "Humidity", icon: HumidIcon },
          {
            key: "solar-radiation",
            label: "Solar radiation",
            icon: PhotoIcon,
            comingSoon: true,
          },
          {
            key: "soil-moisture",
            label: "Soil moisture",
            icon: MoistureIcon,
            comingSoon: true,
          },
          {
            key: "microclimate",
            label: "Microclimate",
            icon: MicroIcon,
          },
        ],
      },
      {
        heading: "Comparisons",
        items: [
          {
            key: "canopy-buffering",
            label: "Canopy buffering",
            icon: CanopyIcon,
            comingSoon: true,
          },
        ],
      },
    ],
    []
  );

  const metrics = isCabilla
    ? cabillaGroups.flatMap((group) => group.items)
    : originalMetrics;

  const selectedMetric =
    metrics.find((m) => m.key === selected) ||
    originalMetrics.find((m) => m.key === selected) ||
    originalMetrics[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [place]);

  function renderMetric(m) {
    const isSelected = m.key === selected;

    const isDisabled =
      m.comingSoon || !isMetricAvailable(place, m.key);

    return (
      <button
        key={m.key}
        type="button"
        disabled={isDisabled}
        aria-current={isSelected ? "true" : undefined}
        title={isDisabled ? "Not available for this site" : ""}
        onClick={() => {
          if (isDisabled) return;
          onChange(m.key);
          setOpen(false);
        }}
        className={`
          w-full flex items-center gap-3
          px-4 py-3 text-left text-sm
          transition-colors
          ${
            isDisabled
              ? "opacity-35 cursor-not-allowed"
              : isSelected
                ? "bg-white/10"
                : "hover:bg-white/5"
          }
        `}
      >
        <img
          src={m.icon}
          alt=""
          aria-hidden="true"
          className="w-4 h-4 shrink-0 opacity-80"
        />

        <span
          className={
            isDisabled ? "text-white/40" : "text-white"
          }
        >
          {m.label}
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <NavPill
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        disabled={disabled}
        withChevron
        title="Choose metric"
        className={[
          compact ? "h-11 px-4" : "",
          subtle ? "opacity-50" : "",
        ].join(" ")}
      >
        <img
          src={selectedMetric.icon}
          alt=""
          aria-hidden="true"
          className="w-4 h-4"
        />
      </NavPill>

      {open && (
        <div
          className={`
            absolute right-0 mt-2
            ${isCabilla ? "w-60" : "w-44"}
            rounded-xl
            bg-[#2A2A2A]
            border border-white/20
            shadow-lg
            overflow-hidden
            max-h-[70vh] overflow-y-auto
            z-50
          `}
        >
          {isCabilla
            ? cabillaGroups.map((group) => (
                <div key={group.heading}>
                  <div
                    className="
                      px-4 pt-4 pb-2
                      text-xs uppercase
                      tracking-[0.12em]
                      text-white/60
                    "
                  >
                    {group.heading}
                  </div>

                  {group.items.map(renderMetric)}
                </div>
              ))
            : originalMetrics.map(renderMetric)}
        </div>
      )}
    </div>
  );
}
