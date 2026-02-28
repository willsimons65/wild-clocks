// src/components/photos/viewer/CompareView.jsx

import { useEffect, useState } from "react";
import { MONTH_NAMES } from "@/constants/months";
import { loadPhotoIndexForPlace, getLeadPhotoForSlot } from "@/services/photoService";
import CompareSlider from "@/components/photos/viewer/CompareSlider";

function YearLabel({ year }) {
  return (
    <div className="text-sm font-medium text-white/70 tracking-wide text-center">
      {year}
    </div>
  );
}

function PlaceholderPanel({ title, subtitle }) {
  return (
    <div className="w-full h-full rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-white/70 font-medium">{title}</div>
      {subtitle ? (
        <div className="mt-1 text-white/40 text-sm">{subtitle}</div>
      ) : null}
    </div>
  );
}

export default function CompareView({
  place,
  monthIndex,
  slotIndex,
  primaryYear,
  compareYear,
  swapSides = false,
}) {

  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [primaryPhoto, setPrimaryPhoto] = useState(null);
  const [comparePhoto, setComparePhoto] = useState(null);

  const [split, setSplit] = useState(0.5);

  useEffect(() => {
    setSplit(0.5);
  }, [place, monthIndex, slotIndex, primaryYear, compareYear, swapSides]);

useEffect(() => {
  let cancelled = false;

  async function run() {
    const ok =
      typeof place === "string" &&
      place.length > 0 &&
      Number.isInteger(monthIndex) &&
      monthIndex >= 0 &&
      Number.isInteger(slotIndex) &&
      slotIndex >= 0 &&
      Number.isFinite(primaryYear) &&
      Number.isFinite(compareYear);

    if (!ok) return;

    setStatus("loading");

    try {
      const res = await loadPhotoIndexForPlace(place);

      if (!res || !res.index) {
        throw new Error(
          `loadPhotoIndexForPlace("${place}") returned no { index }. Got: ${JSON.stringify(res)}`
        );
      }

      const { index } = res;

      const left = getLeadPhotoForSlot(index, {
        place,
        year: primaryYear,
        monthIndex,
        slotIndex,
      });

      const right = getLeadPhotoForSlot(index, {
        place,
        year: compareYear,
        monthIndex,
        slotIndex,
      });

      if (cancelled) return;

      setPrimaryPhoto(left || null);
      setComparePhoto(right || null);
      setStatus("ready");
    } catch (err) {
      console.error("[CompareView] failed:", {
        place,
        monthIndex,
        slotIndex,
        primaryYear,
        compareYear,
        err,
      });
      if (cancelled) return;
      setStatus("error");
    }
  }

  run();
  return () => {
    cancelled = true;
  };
}, [place, monthIndex, slotIndex, primaryYear, compareYear]);


  const bothExist = !!primaryPhoto && !!comparePhoto;
  const neitherExist = !primaryPhoto && !comparePhoto;

  const monthLabel = MONTH_NAMES[monthIndex] || "Month";

  const leftYear = swapSides ? compareYear : primaryYear;
  const rightYear = swapSides ? primaryYear : compareYear;

  const leftPhoto = swapSides ? comparePhoto : primaryPhoto;
  const rightPhoto = swapSides ? primaryPhoto : comparePhoto;

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading comparison…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-white/80">
        Failed to load compare view.
      </div>
    );
  }

  // state 4: neither exists → single empty panel
  if (status === "ready" && neitherExist) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="text-white/80 font-medium">No photos for this slot yet</div>
        <div className="mt-1 text-white/50 text-sm">
          Try a different month or slot.
        </div>
      </div>
    );
  }

  // ✅ state 1: both exist → slider
  if (status === "ready" && bothExist) {
    return (
      <div className="space-y-4">
        <CompareSlider
          leftPhoto={leftPhoto}
          rightPhoto={rightPhoto}
          leftYear={leftYear}
          rightYear={rightYear}
          monthLabel={monthLabel}
          slotIndex={slotIndex}
          split={split}
          setSplit={setSplit}
          enabled={true}
        />
      </div>
    );
  }

// state 2/3: one missing → show single panel with masked side
const existingPhoto = leftPhoto || rightPhoto;
const missingIsRight = !!leftPhoto && !rightPhoto;
const missingYear = missingIsRight ? rightYear : leftYear;

return (
  <div className="space-y-4">
    <div className="relative rounded-2xl border border-white/10 bg-black/30 overflow-hidden mx-auto w-full md:max-w-[600px]">
      {/* Existing image */}
      {existingPhoto ? (
        <img
          src={existingPhoto.url}
          alt={`${monthLabel} slot ${slotIndex + 1}`}
          className="block w-full h-auto object-contain"
          draggable={false}
        />
      ) : null}

      {/* Masked “missing” side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          // mask right half if right missing, else left half
          clipPath: missingIsRight
            ? "inset(0 0 0 50%)"
            : "inset(0 50% 0 0)",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
        }}
      />

<div
  className="absolute inset-0 pointer-events-none"
>
  <div
    className="absolute top-0 bottom-0 flex items-center justify-center px-6 text-center"
    style={{
      width: "50%",
      left: missingIsRight ? "50%" : "0%",
    }}
  >
    <div className="max-w-[260px] text-white/80">
      <div className="font-medium">
        No photo for {missingYear}
      </div>
      <div className="mt-1 text-sm text-white/50">
        Try another slot, or another year.
      </div>
    </div>
  </div>
</div>

      {/* Top year labels (optional) */}
      <div className="absolute top-3 left-0 right-0 z-20 pointer-events-none">
        <div className="absolute left-1/4 -translate-x-1/2">
          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-medium text-white/80">
            {leftYear}
          </div>
        </div>
        <div className="absolute left-3/4 -translate-x-1/2">
          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-medium text-white/80">
            {rightYear}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
