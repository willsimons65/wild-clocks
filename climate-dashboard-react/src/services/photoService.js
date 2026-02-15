// src/services/photoService.js

// ------------------------------------------------------------
// Legacy photo URLs (current system)
// ------------------------------------------------------------
export function getPhotoUrls(place, year, month, count = 4) {
  const base = import.meta.env.VITE_R2_PUBLIC_BASE_URL;
  const cleanMonth = month.toLowerCase();

  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    return `${base}/${place}/${year}/${cleanMonth}/${index}.png`;
  });
}

// ------------------------------------------------------------
// Photo manifests (new system for compare viewer)
// Phase 1: explicit imports (simple + reliable)
// ------------------------------------------------------------

import lk2026 from "@/data/photos/manifests/littleknepp/2026.json";
import lk2025 from "@/data/photos/manifests/littleknepp/2025.json";
import aw2025 from "@/data/photos/manifests/appletonwoods/2025.json";
import aw2026 from "@/data/photos/manifests/appletonwoods/2026.json";

// add more over time
const MANIFESTS_BY_PLACE = {
  littleknepp: [lk2025, lk2026],
  appletonwoods: [aw2025, aw2026],
};

import { buildPhotoIndex, getLeadPhoto } from "@/data/photos/photoIndex";

export async function loadPhotoIndexForPlace(place) {
  const manifests = MANIFESTS_BY_PLACE[place] || [];
  const index = buildPhotoIndex(manifests);

  const availableYears = manifests
    .map((m) => m.year)
    .filter((y) => Number.isFinite(y))
    .sort((a, b) => a - b);

  return { manifests, index, availableYears };
}

// Optional convenience wrapper (very handy later)
export function getLeadPhotoForSlot(index, { place, year, monthIndex, slotIndex }) {
  return getLeadPhoto(index, { place, year, monthIndex, slotIndex });
}

