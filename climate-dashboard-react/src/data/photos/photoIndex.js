// src/data/photos/photoIndex.js

export function makeSlotKey(place, year, monthIndex, slotIndex) {
  const month = monthIndex + 1; // 1–12
  const slot = slotIndex + 1;   // 1–4

  return `${place}__${year}__m${String(month).padStart(2, "0")}__s${slot}`;
}

export function sortPhotosDeterministically(a, b) {
  const aShot = Number.isFinite(a.shot) ? a.shot : 9999;
  const bShot = Number.isFinite(b.shot) ? b.shot : 9999;
  if (aShot !== bShot) return aShot - bShot;

  // final stable tie-breaker
  return String(a.id).localeCompare(String(b.id));
}

export function buildPhotoIndex(manifests) {
  const photosBySlot = new Map();

  for (const manifest of manifests || []) {
    const { place, year, photos } = manifest || {};

    if (!place || !Number.isFinite(year) || !Array.isArray(photos)) continue;

    for (const p of photos) {
      const monthIndex = Number(p.month) - 1; // month is 1–12 in manifest
      const slotIndex = Number(p.slot) - 1;   // slot is 1–4 in manifest

      if (
        !Number.isFinite(monthIndex) ||
        monthIndex < 0 ||
        monthIndex > 11 ||
        !Number.isFinite(slotIndex) ||
        slotIndex < 0 ||
        slotIndex > 3
      ) {
        // ignore invalid rows
        continue;
      }

      const key = makeSlotKey(place, year, monthIndex, slotIndex);
      const arr = photosBySlot.get(key) || [];
      arr.push(p);
      photosBySlot.set(key, arr);
    }
  }

  // deterministically sort each slot bucket
  for (const [key, arr] of photosBySlot.entries()) {
    arr.sort(sortPhotosDeterministically);
    photosBySlot.set(key, arr);
  }

  return { photosBySlot };
}

export function getPhotosForSlot(index, { place, year, monthIndex, slotIndex }) {
  if (!index?.photosBySlot) return [];

  const key = makeSlotKey(place, year, monthIndex, slotIndex);
  return index.photosBySlot.get(key) || [];
}

export function getLeadPhoto(index, { place, year, monthIndex, slotIndex }) {
  const photos = getPhotosForSlot(index, { place, year, monthIndex, slotIndex });
  return photos.length ? photos[0] : null;
}

export function hasSlotData(index, { place, year, monthIndex, slotIndex }) {
  return getPhotosForSlot(index, { place, year, monthIndex, slotIndex }).length > 0;
}
