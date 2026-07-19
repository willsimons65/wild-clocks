// src/components/trends/PossibleFuturesCard.jsx

import { useEffect, useState } from "react";

import ChevronDown from "@/images/assets/chevron-down.svg";

export default function PossibleFuturesCard({
    anchorId,
    period,
    periodControl,
    introCopy,
    summaryCopy = [],
    sourceNote,
    children,
}) {
  const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  if (anchorId && window.location.hash === `#${anchorId}`) {
    setIsOpen(true);
  }
}, [anchorId]);

  const periodLabel =
    typeof period === "string"
      ? period
      : period?.label ?? "";

  return (
    <section
    id={anchorId}
    className="scroll-mt-24 rounded-2xl border border-amber-400/20 bg-amber-200/0 px-6 py-7 md:px-8 md:py-8"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/75">
          Climate projections
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Possible futures
        </h2>

        {introCopy && (
          <p className="mt-4 max-w-[90%] text-sm leading-relaxed text-white/75 md:text-base">
            {introCopy}
          </p>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="
            mt-5
            inline-flex
            items-center
            gap-3
            text-sm
            font-medium
            text-amber-300/85
            transition-colors
            hover:text-amber-200
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-amber-300/40
          "
          aria-expanded={isOpen}
        >
          <span>
            {isOpen
              ? "Hide projections"
              : "Explore possible futures"}
          </span>

          <img
            src={ChevronDown}
            alt=""
            aria-hidden="true"
            className={[
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </header>

      {isOpen && (
        <div className="mt-6 grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
          <div className="md:pr-4">
            <h3 className="text-base font-semibold text-white">
              Climatic period
            </h3>

            <div className="mt-2">
              {periodControl ?? (
                <p className="text-xl font-semibold text-white">
                  {periodLabel}
                </p>
              )}
            </div>

            {summaryCopy.length > 0 && (
              <div className="mt-6 space-y-4 text-sm leading-snug text-white/70">
                {summaryCopy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="min-h-[220px] rounded-xl bg-white/[0.03] p-6">
              {children}
            </div>

            {sourceNote && (
              <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-white/45">
                {sourceNote}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}