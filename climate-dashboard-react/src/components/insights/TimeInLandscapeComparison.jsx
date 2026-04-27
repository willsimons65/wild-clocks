// src/components/notes/TimeInLandscapeComparison.jsx

import React from "react";

export default function TimeInLandscapeComparison() {
  return (
    <figure className="my-12 rounded-none border border-white/10 bg-[#1c1c1c] px-4 py-8 sm:px-8 sm:py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* February */}
        <div>
          <h3 className="mb-5 text-center text-base font-semibold text-white">
            February
          </h3>

          <div className="relative overflow-hidden bg-black">
            <img
              src="/photos/appleton-woods/article-time-in-a-landscape/micro-feb.png"
              alt="Appleton Woods in February, comparing 2025 and 2026"
              className="block w-full"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/70" />

            <div className="pointer-events-none absolute bottom-4 left-0 w-1/2 text-center text-sm font-medium text-white drop-shadow-lg">
              2025
            </div>

            <div className="pointer-events-none absolute bottom-4 right-0 w-1/2 text-center text-sm font-medium text-white drop-shadow-lg">
              2026
            </div>
          </div>
        </div>

        {/* April */}
        <div>
          <h3 className="mb-5 text-center text-base font-semibold text-white">
            April
          </h3>

          <div className="relative overflow-hidden bg-black">
            <img
              src="/photos/appleton-woods/article-time-in-a-landscape/micro-apr.png"
              alt="Appleton Woods in April, comparing 2025 and 2026"
              className="block w-full"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/70" />

            <div className="pointer-events-none absolute bottom-4 left-0 w-1/2 text-center text-sm font-medium text-white drop-shadow-lg">
              2025
            </div>

            <div className="pointer-events-none absolute bottom-4 right-0 w-1/2 text-center text-sm font-medium text-white drop-shadow-lg">
              2026
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-white/60">
        Appleton Woods in the second and third week of February and April respectively - comparing the same view in 2025 and
        2026
      </figcaption>
    </figure>
  );
}