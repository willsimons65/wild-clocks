// src/components/home/Hero.jsx

import React from "react";

export default function Hero() {
  return (
    <section className="space-y-6 text-left font-thin">
      <div
        className="
          max-w-[600px] 
          w-full 
          px-0 
          py-1
        "
      >
        <div
          className="
            text-2xl md:text-2xl 
            font-thin
            mb-6 
            leading-tight
            tracking-tight
          "
        >
          Wild Clocks is an invitation to notice
        </div>

        <div
          className="
            max-w-[600px] 
            text-l md:text-l 
            text-white/80 
            leading-relaxed 
            space-y-5
          "
        >
          <p>
            For centuries, plants have followed the same unchanging patterns of
            leaf-out, flowering, fruiting, and decay. Gardeners and ecologists
            know these rhythms well.
          </p>

          <p>
            But the world is changing. Warming temperatures are unsettling the
            timing of the seasons, and with them the life cycles of plants,
            insects and animals.
          </p>

          <p>
            Wild Clocks follows these changes through two landscapes: a garden in Oxfordshire and a nearby wood. Their seasonal stories unfold through a series of photographs, which are arranged into quadrants - or 'clocks'. These are then paired with the climate and seasonal data that shape them.
          </p>

          <p>
        
            Together, they reveal not only how the seasons are shifting, but how
            much beauty remains - and how much is still worth protecting.
          </p>
        </div>
      </div>
    </section>
  );
}

