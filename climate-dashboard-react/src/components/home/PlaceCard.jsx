// src/components/home/PlaceCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import ExternalLinkIcon from "@/images/assets/external-link-2.svg";
import ArrowRightIcon from "@/images/assets/arrow-right.svg";

export default function PlaceCard({
  name,
  image,
  location,
  country,
  latitude,
  altitude,
  url,
  description,
  sentinel,
  steward,
  tracking = [],
  isOpen = false,
  onToggle,
}) {
  return (
    <article
      className="
        group relative overflow-hidden rounded-xl border border-white/5
        bg-[#2A2A2A] shadow-lg transition-all duration-300
      "
    >
      {/* CARD FACE */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-[1fr_1fr]
            lg:grid-cols-[1fr_1fr]
            h-[250px] lg:h-[250px]
          "
        >
        {/* IMAGE */}
        <div className="relative h-full">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 62%" }}
          />
        </div>

        {/* TEXT SIDE */}
        <div
          className="
            relative h-full flex flex-col justify-center
            p-5 md:p-6 lg:p-6
            pr-14
            bg-[linear-gradient(90deg,rgba(42,42,42,0.92)_0%,rgba(32,32,32,0.98)_100%)]
          "
        >
          <div className="space-y-2">
            <div>
              <h2 className="text-[1rem] leading-tight font-normal text-white">
                {name}
              </h2>

              <div className="mt-2 space-y-1">
                <p className="text-[.85rem] text-white/90">{location}</p>
                <p className="text-[.75rem] text-white/75">{country}</p>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <p className="text-white/70 text-[.75rem]">Latitude: {latitude}</p>
              <p className="text-white/70 text-[.75rem]">Altitude: {altitude}</p>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY PANEL
          - desktop: shows on hover/focus-within
          - mobile: shows when isOpen is true
      */}
<div
  className={`
    absolute inset-x-0 bottom-0 top-4 z-20
    transition-all duration-200 ease-out
    pointer-events-none
    ${
      isOpen
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-focus-within:opacity-100 lg:group-focus-within:translate-y-0"
    }
  `}
>
  <div
    className={`
      rounded-xl bg-[#3A3A3A]/95 backdrop-blur-sm
      px-6 py-5 shadow-xl min-h-[180px]
      ${
        isOpen
          ? "pointer-events-auto"
          : "lg:group-hover:pointer-events-auto lg:group-focus-within:pointer-events-auto"
      }
    `}
  >
       <div className="max-h-[140px] overflow-y-auto pr-2 space-y-5">
          <div className="space-y-5">
            {(description || sentinel) && (
              <div className="space-y-2">
                {description && (
                  <p className="text-white/90 text-[0.80rem] leading-relaxed">
                    {description}
                  </p>
                )}

                {sentinel && (
                  <p className="text-white/65 italic text-[0.80rem] leading-relaxed">
                    {sentinel}
                  </p>
                )}
              </div>
            )}

            {steward?.name && steward?.url && (
              <div className="space-y-1">
                <h3 className="text-white/75 text-xs uppercase tracking-wide">
                  Steward
                </h3>

                <a
                  href={steward.url}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center gap-3
                    text-white/75 hover:text-white transition-colors
                  "
                >
                  <span className="text-[0.80rem] leading-relaxed">
                    {steward.name}
                  </span>
                  <img
                    src={ExternalLinkIcon}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 opacity-90 shrink-0"
                  />
                </a>
              </div>
            )}

            {tracking.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white/75 text-xs uppercase tracking-wide">
                  Tracking
                </h3>

                <p className="text-white/80 text-[0.80rem] leading-relaxed">
                  {tracking.join(" · ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* MOBILE TAP TARGET FOR INFO PANEL */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? `Hide details for ${name}` : `Show details for ${name}`}
        className="
          lg:hidden absolute inset-0 z-10
          cursor-pointer
        "
      />

      {/* PRIMARY NAVIGATION BUTTON */}
<Link
  to={url}
  aria-label={`Go to ${name}`}
  className="
    absolute bottom-0 right-0 z-30
    flex h-[42px] w-[42px] md:h-7 md:w-7 items-center justify-center
    rounded-tl-[16px] md:rounded-tl-[12px] bg-[#006D5B]
    text-white transition-colors duration-200
    hover:bg-[#0A8F7D] focus:outline-none focus:ring-2 focus:ring-white/40
  "
>
  <img
    src={ArrowRightIcon}
    alt=""
    aria-hidden="true"
    className="w-5 h-5 md:w-3 md:h-3"
  />
</Link>
    </article>
  );
}