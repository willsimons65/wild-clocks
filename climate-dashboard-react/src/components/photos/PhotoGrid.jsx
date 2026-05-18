// src/components/photos/PhotoGrid.jsx

import React, { useEffect, useState } from "react";
import { MONTH_NAMES } from "@/constants/months";
import { resolvePhotoUrl } from "@/utils/resolvePhotoUrl";

export default function PhotoGrid({
  year,
  place,
  month,
  photos = [],
  manifestOnly = false,
  onPhotoClick,
}) {
  const monthNameRaw = MONTH_NAMES[month - 1] || null;
  const monthName = monthNameRaw ? monthNameRaw.toLowerCase() : null;

  const [urls, setUrls] = useState([null, null, null, null]);

  useEffect(() => {
    if (!monthName) {
      console.warn("PhotoGrid: invalid month prop:", month);
      setUrls([null, null, null, null]);
      return;
    }

    if (!place || !year) {
      setUrls([null, null, null, null]);
      return;
    }

    const useManifestPhotos = Array.isArray(photos) && photos.length > 0;

    const candidates = useManifestPhotos
      ? Array.from({ length: 4 }, (_, i) => {
          const slot = i + 1;
          const photo = photos.find((p) => Number(p.slot) === slot);

          return photo?.url ? [resolvePhotoUrl(photo.url)] : [];
        })
      : manifestOnly
        ? [[], [], [], []]
        : Array.from({ length: 4 }, (_, i) => {
            const slot = i + 1;

            return [
              `/photos/${place}/${year}/${monthName}/${slot}.webp`,
              `/photos/${place}/${year}/${monthName}/${slot}.png`,
            ];
          });

    let cancelled = false;

    function testImage(url) {
      return new Promise((resolve) => {
        if (!url) {
          resolve(null);
          return;
        }

        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    }

    async function resolveSlot(urlOptions) {
      for (const url of urlOptions) {
        const result = await testImage(url);
        if (result) return result;
      }

      return null;
    }

    async function run() {
      const results = await Promise.all(
        candidates.map((urlOptions) => resolveSlot(urlOptions))
      );

      if (!cancelled) setUrls(results);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [monthName, place, year, month, photos, manifestOnly]);

  const useManifestPhotos = Array.isArray(photos) && photos.length > 0;

  const cornerClasses = [
    "rounded-tl-2xl",
    "rounded-tr-2xl",
    "rounded-bl-2xl",
    "rounded-br-2xl",
  ];

  return (
    <div className="w-full grid grid-cols-2 grid-rows-2 gap-[5px]">
      {urls.map((src, i) => (
        <PhotoCell
          key={i}
          src={src}
          rounded={cornerClasses[i]}
          contain={useManifestPhotos}
          onClick={() => {
            if (!src) return;
            onPhotoClick?.(i);
          }}
        />
      ))}
    </div>
  );
}

function PhotoCell({ src, rounded, contain = false, onClick }) {
  const showPlaceholder = !src;

  return (
    <div
      className={`aspect-square overflow-hidden ${rounded}
      bg-white/[0.03] border border-white/10
      ${!showPlaceholder ? "cursor-pointer" : ""}`}
      onClick={!showPlaceholder ? onClick : undefined}
    >
      {!showPlaceholder ? (
        <img
          src={src}
          alt=""
          className={`w-full h-full ${
            contain ? "object-contain bg-transparent" : "object-cover"
          }`}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center
          bg-[#1A1A1A] border border-white/15 rounded-[inherit] select-none"
        >
          <div className="text-white/40 text-[0.75rem] tracking-wide">
            Image not available
          </div>
        </div>
      )}
    </div>
  );
}

