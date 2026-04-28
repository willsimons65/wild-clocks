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
        {/* Intro hero */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-[15px] border border-white/10">
            <img
              src={TemWoodBanner}
              alt="Temperate rainforest at Thousand Year Trust"
              className="block w-full h-[300px] md:h-[360px] lg:h-[390px] object-cover"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
              <div className="max-w-5xl text-center">
                <h1 className="text-[18px] sm:text-[26px] md:text-[32px] lg:text-[22px]leading-tight font-normal tracking-[-0.02em] text-white">
                  The Thousand Year Trust is home to a rare Atlantic rainforest
                </h1>

                <p className="mt-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[20px] leading-relaxed text-white/85">
                  The Trust is working to research these ancient ecosystems and
                  better understand how they recover and thrive. This Wild Clockwill document how the landscape changes through the seasons.
                </p>

                <a
                  href="https://thousandyeartrust.org"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-3 text-[12px] md:text-[18px] font-normal text-white/80 hover:text-white transition-colors"
                >
                  Learn more about the Thousand Year Trust
                  <img
                    src={ExternalLinkIcon}
                    alt=""
                    aria-hidden="true"
                    className="w-6 h-6 opacity-80"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Placeholder observations grid */}
        <section>
          <div className="rounded-[15px] border border-white/10 bg-[#1A1A1A] min-h-[280px] flex items-center justify-center px-6 py-12 text-center">
            <div className="max-w-2xl">
              <p className="text-[20px] md:text-[24px] text-white/90">
                First observations coming soon
              </p>

              <p className="mt-4 text-[15px] md:text-[17px] text-white/65 leading-relaxed">
                The camera is now being established. Images will begin appearing
                here as the seasonal record develops.
              </p>
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