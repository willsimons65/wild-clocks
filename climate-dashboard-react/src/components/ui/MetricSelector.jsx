// src/components/ui/MetricSelector.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";

import NavPill from "@/components/ui/NavPill";

import TempIcon from "@/images/assets/temperature.svg";
import RainIcon from "@/images/assets/rainfall.svg";
import HumidIcon from "@/images/assets/humidity.svg";
import PhotoIcon from "@/images/assets/photoperiod.svg";

export default function MetricSelector({
  selected,
  onChange,
  disabled = false,
  subtle = false,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Memoized metric list
  const metrics = useMemo(
    () => [
      { key: "temperature", label: "Temperature", icon: TempIcon },
      { key: "rainfall", label: "Rainfall", icon: RainIcon },
      { key: "humidity", label: "Humidity", icon: HumidIcon },
      { key: "photoperiod", label: "Photoperiod", icon: PhotoIcon },
    ],
    []
  );

  const selectedMetric = metrics.find((m) => m.key === selected) || metrics[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger pill */}
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

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-44
            rounded-xl
            bg-[#2A2A2A]
            border border-white/20
            shadow-lg
            overflow-hidden
            z-50
          "
        >
          {metrics.map((m) => {
            const isSelected = m.key === selected;

            return (
              <button
                key={m.key}
                onClick={() => {
                  onChange(m.key);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3
                  px-4 py-3 text-left
                  text-sm
                  transition-colors
                  ${isSelected ? "bg-white/10" : "hover:bg-white/5"}
                `}
              >
                <img
                  src={m.icon}
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4 opacity-80"
                />
                <span className="text-white">{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
