// src/pages/ThousandYearTrust.jsx

import React from "react";
import Header from "@/components/layout/Header";

export default function ThousandYearTrust({ place, setPlace, year, setYear, metric, setMetric }) {
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
        <section className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">
            Coming soon
          </p>

          <h1 className="text-3xl md:text-5xl font-normal leading-tight text-white">
            Thousand Year Trust
          </h1>

        <div className="mt-6 text-base md:text-lg text-white/75 leading-relaxed max-w-2xl">
          <p> A Wild Clock for Thousand Year Trust is currently being prepared.</p>
            <br></br>
          <p>This page will soon begin documenting seasonal change at the site
            through repeat photography and climate-linked observation.
        </p>
        </div>
        </section>
      </main>
    </div>
  );
}