// src/components/trends/PossibleFuturesCard.jsx

import { useState } from "react";

export default function PossibleFuturesCard({
  period,
  periodControl,
  introCopy,
  summaryCopy = [],
  sourceNote,
  children,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const periodLabel =
    typeof period === "string"
      ? period
      : period?.label ?? "";

  return (
    <section className="rounded-2xl border border-amber-400/20 bg-amber-950/20 px-6 py-7 md:px-8 md:py-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/75">
          Climate projections
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Possible futures
        </h2>

        <p className="mt-4 max-w-[90%] text-sm leading-relaxed text-white/75 md:text-base">
          {introCopy}
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex rounded-full border border-amber-300/20 bg-black/20 p-0.5 text-sm"
          aria-expanded={isOpen}
        >
          <span
            className={`rounded-full px-8 py-1 transition-colors ${
              isOpen
                ? "bg-amber-300/15 text-amber-100"
                : "text-white/55 hover:text-white/80"
            }`}
          >
            {isOpen
              ? "Hide projections"
              : "Explore possible futures"}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
<div>
  <h3 className="text-lg font-semibold text-white">
    Climatic period
  </h3>

  <div className="mt-1">
    {periodControl ?? (
      <div className="text-2xl font-semibold text-white">
        {period}
      </div>
    )}
  </div>

  {summaryCopy.length > 0 && (
    <div className="mt-10 space-y-8">
      <p className="text-sm font-semibold leading-relaxed text-white">
        {summaryCopy[0]}
      </p>

      <p className="text-sm leading-relaxed text-white/70">
        {summaryCopy[1]}
      </p>
    </div>
  )}
</div>

            <div>
            <div className="min-h-[220px] rounded-xl bg-white/[0.03] p-6">
                {children}
            </div>

            {sourceNote && (
                <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-white/45">
                {sourceNote}
                </p>
            )}
            </div>
        </div>
      )}
    </section>
  );
}