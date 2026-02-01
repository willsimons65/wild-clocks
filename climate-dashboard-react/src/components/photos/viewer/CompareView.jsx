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
      if (!place || monthIndex < 0 || slotIndex < 0) return;
      if (!Number.isFinite(primaryYear) || !Number.isFinite(compareYear)) return;

      setStatus("loading");

      try {
        const { index } = await loadPhotoIndexForPlace(place);

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
        console.error("CompareView: failed to load photo index", err);
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

  // state 2/3: one missing → show 2-up layout with placeholders
  return (
    <div className="space-y-4">

      <div className="grid grid-cols-2 gap-4">
        <YearLabel year={leftYear} />
        <YearLabel year={rightYear} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          {leftPhoto ? (
            <img
              src={leftPhoto.url}
              alt={`${monthLabel} slot ${slotIndex + 1} ${leftYear}`}
              className="w-full rounded-2xl object-contain"
              draggable={false}
            />
          ) : (
            <div className="aspect-[4/3]">
              <PlaceholderPanel
                title={`No photo for ${leftYear} yet`}
                subtitle="This comparison becomes richer as the archive grows."
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          {rightPhoto ? (
            <img
              src={rightPhoto.url}
              alt={`${monthLabel} slot ${slotIndex + 1} ${rightYear}`}
              className="w-full rounded-2xl object-contain"
              draggable={false}
            />
          ) : (
            <div className="aspect-[4/3]">
              <PlaceholderPanel
                title={`No photo for ${rightYear} yet`}
                subtitle="Try another slot, or another year."
              />
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-white/40">
        Slider: disabled (needs both photos)
      </div>
    </div>
  );
}
