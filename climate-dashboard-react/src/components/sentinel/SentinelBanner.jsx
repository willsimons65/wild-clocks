// src/components/sentinel/SentinelBanner.jsx

import { useState } from "react";
import { ExternalLink, InfoIcon } from "lucide-react";
import InfoTooltip from "@/components/ui/InfoTooltip";

export default function SentinelBanner({
  title,
  landscapeType,
  sensitivity,
  description,
  tracking = [],
  image,
  ctaLabel,
  ctaHref,
}) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="relative overflow-hidden rounded-[22px] bg-neutral-900"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 px-6 py-10 text-center text-white sm:px-10 md:px-16 md:py-16">
        <h1 className="mx-auto max-w-5xl text-2xl font-medium leading-tight sm:text-4xl text-white/85 md:text-3xl">
          {title}
        </h1>

        {/* System line */}
        <div className="relative mt-4 flex justify-center">
            <div className="group relative inline-flex flex-col items-center">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="group inline-flex items-center gap-3 text-sm italic text-white/85 md:text-lg"
                    aria-expanded={open}
                >
                    <span>
                    {landscapeType} — {sensitivity}
                    </span>

                    <InfoTooltip content={<TrackingList tracking={tracking} />}>
                    <span className="text-sm font-medium not-italic leading-none">i</span>
                    </InfoTooltip>
                </button>
            </div>
        </div>

        {/* Mobile expanded panel */}
        {open && (
          <div className="mx-auto mt-5 max-w-md rounded-2xl border border-white/10 bg-[#1E1E1E]/95 p-5 text-left text-sm text-white/80 shadow-2xl md:hidden">
            <TrackingList tracking={tracking} />
          </div>
        )}

        <p className="mx-auto mt-5 max-w-5xl text-lg leading-relaxed text-white/75 sm:text-xl md:text-1xl">
          {description}
        </p>

        {ctaHref && (
          <a
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white md:text-base"
          >
            {ctaLabel}
            <ExternalLink className="h-6 w-6 stroke-[1.5] md:h-7 md:w-7" />
          </a>
        )}
      </div>
    </section>
  );
}

function TrackingList({ tracking }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-white/80 md:text-base">
        Tracking
      </h3>

      <ul className="list-disc space-y-1 pl-5 text-sm md:text-sm">
        {tracking.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}