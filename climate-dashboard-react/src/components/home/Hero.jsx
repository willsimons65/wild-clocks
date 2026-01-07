// src/components/home/Hero.jsx

import React from "react";

export default function Hero() {
  return (
    <section className="w-full pt-10 md:pt-16 pb-20 md:pb-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1
          className="
            text-3xl md:text-5xl
            font-thin
            tracking-tight
            mb-4
          "
        >
          The seasons are changing
        </h1>

        <p
          className="
            text-xl md:text-2xl
            font-thin
            text-white/70
          "
        >
          Wild Clocks is an invitation to notice
        </p>
      </div>
    </section>
  );
}


