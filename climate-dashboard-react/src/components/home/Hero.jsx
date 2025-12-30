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
            For millennia, plant communities have followed the same unchanging patterns of
            leaf-out, flowering, fruiting, and decay. Gardeners and ecologists
            know these rhythms well.</p>
            
          <p>But the world is changing.</p>

          <p>The environment is warming up. And with it, the old certainties are giving way to something new and less certain: a world in which the 'slow violence' of climate change is destabilising the seasons.
          </p>

          <p>Wild Clocks follows these changes through two landscapes: a garden in Oxfordshire and a nearby wood.</p> 
            
          <p>Their seasonal stories unfold through a series of photographs - or 'clocks' - one for each month. These are then paired with the climate and seasonal data that shape them.</p>
          
          <p> Together, they reveal not only how the seasons are shifting, but how
            much beauty remains - and how much is still worth protecting.
          </p>
        </div>
      </div>
    </section>
  );
}

