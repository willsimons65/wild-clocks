// src/pages/ThousandYearTrust.jsx

import React from "react";
import Header from "@/components/layout/Header";
import ExternalLinkIcon from "@/images/assets/external-link-2.svg";

export default function ThousandYearTrust({
  place,
  setPlace,
  year,
  setYear,
  metric,
  setMetric,
}) {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Header
        place="thousand-year-trust"
        placeName="Thousand Year Trust"
        setPlace={setPlace}
        year={year}
        setYear={setYear}
        metric={metric}
        setMetric={setMetric}
      />

      <main className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <section className="max-w-4xl">
          <h1 className="text-3xl md:text-3xl font-normal leading-tight text-white">
            Thousand Year Trust
          </h1>

          <div className="mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-3xl space-y-5">
            <p>
              The Thousand Year Trust clock is a long-term seasonal record of change within one of Britain’s rare temperate rainforests.
            </p>

            <p>
              Created in collaboration with the Thousand Year Trust, it combines repeat photography and local climate data to document how this landscape shifts over time.
            </p>

            <a
            href="https://thousandyeartrust.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-5 text-white hover:text-white/80 transition-colors"
            >
            Learn more about the Thousand Year Trust
            <img
                src={ExternalLinkIcon}
                alt=""
                className="w-5 h-5 opacity-100"
            />
            </a>

            
          </div>
        </section>

        <section className="mt-12 lg:mt-14">
          <div className="rounded-[15px] border border-white/10 bg-[#181818] min-h-[320px] md:min-h-[360px] flex items-center justify-center px-6 text-center">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-normal text-white mb-4">
                First observations coming soon
              </h2>
              <p className="text-base md:text-lg text-white/70 leading-relaxed">
                This clock is currently being established. The first observations will appear shortly.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-white/10 text-center">
<a
  href="https://thousandyeartrust.org"
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
>
  In collaboration with the{" "}
  <span className="font-medium text-white">Thousand Year Trust</span>

</a>
        </footer>
      </main>
    </div>
  );
}