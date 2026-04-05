// src/pages/ThousandYearTrust.jsx

import React from "react";
import Header from "@/components/layout/Header";
import ExternalLinkIcon from "@/images/assets/external-link-2.svg";
import TemWoodBanner from "@/images/assets/tem-wood-banner.png";

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

      <main className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 py-8 lg:py-10">
        {/* Banner */}
<section className="mb-10">
  <div className="relative overflow-hidden rounded-[15px] border border-white/10">
    <img
      src={TemWoodBanner}
      alt="Temperate woodland"
      className="block w-full h-[220px] md:h-[300px] lg:h-[355px] object-cover"
    />
    <div className="absolute inset-0 bg-black/40" />
  </div>
</section>

        {/* Holding card */}
        <section>
          <div className="rounded-[15px] border border-white/10 bg-[#1E1E1E] min-h-[320px] md:min-h-[350px] flex items-center justify-center px-6 py-12 text-center">
            <div className="w-full max-w-3xl">
              <h1 className="text-[34px] md:text-[48px] font-normal tracking-[-0.02em] text-white">
                Thousand Year Trust
              </h1>

              <p className="mt-6 text-[20px] md:text-[24px] font-normal text-white/95">
                First observations coming soon
              </p>

              <p className="mt-8 text-[16px] md:text-[18px] text-white/80 leading-relaxed">
                This clock is currently being established. The first observations will appear shortly
              </p>

              <a
                href="https://thousandyeartrust.org"
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 text-[16px] md:text-[18px] text-white/85 hover:text-white transition-colors"
              >
                Learn more about the Thousand Year Trust
                <img
                  src={ExternalLinkIcon}
                  alt=""
                  className="w-6 h-6 opacity-80"
                />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-white/10">
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 py-6 text-center">
          <a
            href="https://thousandyeartrust.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white/90 transition-colors"
          >
            In collaboration with the{" "}
            <span className="font-medium text-white">Thousand Year Trust</span>
            
          </a>
        </div>
      </footer>
    </div>
  );
}