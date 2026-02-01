// src/pages/PhotoViewer.jsx

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import ViewerNavBar from "@/components/photos/viewer/ViewerNavBar";
import CompareActionsRow from "@/components/photos/viewer/CompareActionsRow";
import PhotosView from "@/components/photos/viewer/PhotosView";

import { MONTH_NAMES } from "@/constants/months";
import CompareView from "@/components/photos/viewer/CompareView";
import Toast from "@/components/ui/Toast";

import {
  getQueryEnum,
  getQueryNumber,
  setQueryParams,
} from "@/utils/queryState";

function normalizePlaceSlug(raw) {
  if (!raw) return null;
  return String(raw).replace(/-/g, "");
}

function monthSlugToIndex(slug) {
  const lower = String(slug || "").toLowerCase();
  return MONTH_NAMES.findIndex((m) => m.toLowerCase() === lower);
}

export default function PhotoViewer() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const place = useMemo(() => normalizePlaceSlug(params.place), [params.place]);
  const year = useMemo(() => Number(params.year), [params.year]);
  const monthIndex = useMemo(
    () => monthSlugToIndex(params.month),
    [params.month]
  );

  // -----------------------------
  // Read initial state from URL
  // -----------------------------
  const urlMode = getQueryEnum(searchParams, "mode", ["photos", "compare"]);
  const urlSlot = getQueryNumber(searchParams, "slot"); // 1..4
  const urlCompareYear = getQueryNumber(searchParams, "compare");
  const urlPhoto = getQueryNumber(searchParams, "photo"); // 1..4

  const [mode, setMode] = useState(urlMode || "compare");
  const [slotIndex, setSlotIndex] = useState(() => {
    if (!urlSlot) return 0;
    return Math.max(0, Math.min(3, urlSlot - 1));
  });

  const [compareYear, setCompareYear] = useState(() => {
    return urlCompareYear || (Number.isFinite(year) ? year - 1 : 2025);
  });

  const [swapSides, setSwapSides] = useState(false);

  const [activePhotoIndex, setActivePhotoIndex] = useState(() => {
    if (!urlPhoto) return 0;
    return Math.max(0, Math.min(3, urlPhoto - 1));
    });

    // ✅ Reset selected photo whenever the "album context" changes
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [place, year, monthIndex]);

    // reset swap when selection changes
  useEffect(() => {
    setSwapSides(false);
  }, [place, year, monthIndex, slotIndex, compareYear]);

  // Toast
  const [toastOpen, setToastOpen] = useState(false);

  const monthLabel = MONTH_NAMES[monthIndex] || params.month;

  // ---------------------------------------
  // Keep local state in sync if URL changes
  // ---------------------------------------
  useEffect(() => {
    if (urlMode && urlMode !== mode) setMode(urlMode);

    if (urlSlot != null) {
      const nextSlotIndex = Math.max(0, Math.min(3, urlSlot - 1));
      if (nextSlotIndex !== slotIndex) setSlotIndex(nextSlotIndex);
    }

    if (urlCompareYear != null && urlCompareYear !== compareYear) {
      setCompareYear(urlCompareYear);
    }
    if (urlPhoto != null) {
     const nextPhotoIndex = Math.max(0, Math.min(3, urlPhoto - 1));
     if (nextPhotoIndex !== activePhotoIndex) setActivePhotoIndex(nextPhotoIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ---------------------------------------
  // Write state → URL
  // ---------------------------------------
  useEffect(() => {
    if (!place || !Number.isFinite(year) || monthIndex < 0) return;

    const next = setQueryParams(searchParams, {
      mode,
      slot: slotIndex + 1,
      compare: compareYear,
      photo: activePhotoIndex + 1,
    });

    const currentStr = searchParams.toString();
    const nextStr = next.toString();
    if (currentStr === nextStr) return;

    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, slotIndex, compareYear, activePhotoIndex, place, year, monthIndex]);

  // If main year changes, ensure compare year stays sensible
  useEffect(() => {
    if (!Number.isFinite(year)) return;
    if (compareYear === year) setCompareYear(year - 1);
  }, [year, compareYear]);

  useEffect(() => {
    if (mode !== "compare") return;
    setSlotIndex(activePhotoIndex);
    }, [mode, activePhotoIndex]);

  // ------------------------------------------------------------
  // Share handler (used by CompareActionsRow)
  // ------------------------------------------------------------
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastOpen(true);
    } catch {
      window.prompt("Copy this link:", window.location.href);
      setToastOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      {/* toast */}
      <Toast
        isOpen={toastOpen}
        message="Link copied"
        onClose={() => setToastOpen(false)}
      />

      {/* ✅ New nav header (3-column grid like Feed/Insights) */}
      <ViewerNavBar
        title={place === "littleknepp" ? "Little Knepp" : "Photo Viewer"}
        mode={mode}
        setMode={setMode}
        monthLabel={monthLabel || "Month"}
        onMonthClick={() => {
          // Placeholder until we implement Month dropdown
          console.log("open month menu");
        }}
        slotLabel={`Slot ${slotIndex + 1}`}
        onSlotClick={() => {
          // Placeholder until we implement Slot dropdown
          console.log("open slot menu");
        }}
        slotEnabled={mode === "compare"}
        onBack={() => navigate(-1)}
      />

      {/* ✅ Compare-only action row (swap + share above photos) */}
      {mode === "compare" ? (
        <CompareActionsRow
          onSwap={() => setSwapSides((v) => !v)}
          onShare={handleShare}
          swapDisabled={false}
        />
      ) : null}

      {/* Body content */}
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        


        <div className="mt-6">
{mode === "photos" ? (
  <PhotosView
    place={place}
    year={year}
    monthIndex={monthIndex}
    activeIndex={activePhotoIndex}
    setActiveIndex={setActivePhotoIndex}
  />
) : (

    <CompareView
        place={place}
        monthIndex={monthIndex}
        slotIndex={slotIndex}
        primaryYear={year}
        compareYear={compareYear}
        swapSides={swapSides}
    />
    )}
        </div>
      </main>
    </div>
  );
}

