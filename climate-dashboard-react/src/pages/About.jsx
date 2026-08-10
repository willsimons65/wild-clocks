// src/pages/About.jsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import FootnoteToggle from "@/components/ui/FootnoteToggle";
import ExternalLink from "@/components/ui/ExternalLink";
import CameraMountAnimation from "@/components/illustrations/CameraMountAnimation";


export default function About() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* LEFT COLUMN — Navigation (1/3) */}
<aside className="hidden md:block md:col-span-1">
  <nav className="pl-4 space-y-6 text-white/70 text-xl md:text-base">
    <a
      href="#what"
      className="block hover:text-white transition-colors"
    >
      What is Wild Clocks
    </a>
    <a
      href="#why"
      className="block hover:text-white transition-colors"
    >
      Why do Britain's woodlands need long-term observation?
    </a>
        <a
      href="#how"
      className="block hover:text-white transition-colors"
    >
      How does Wild Clocks work?
    </a>
        <a
      href="#where"
      className="block hover:text-white transition-colors"
    >
      Where are the observation sites?
    </a>
        <a
      href="#data"
      className="block hover:text-white transition-colors"
    >
      What data is collected?
    </a>
            <a
      href="#who"
      className="block hover:text-white transition-colors"
    >
      Who are Wild Clocks' partners?
    </a>
                <a
      href="#organisations"
      className="block hover:text-white transition-colors"
    >
      How can organisations become involved?
    </a>
  </nav>
</aside>

          {/* RIGHT COLUMN — Content (2/3) */}
          <section className="md:col-span-2 space-y-10">

            {/* ABOUT */}
            <div id="what" className="scroll-mt-24">
              <h1 className="text-2xl md:text-3xl font-light mb-6">
                What is Wild Clocks?
              </h1>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks is a long-term woodland climate observation network that documents how Britain's woodlands respond to a changing climate.
                </p>

                <p>It brings together repeat photography, climate data and ecological observation to record how seasonal rhythms are changing over time.</p>

                <p>
                  The project began with two places: a garden in Oxfordshire and a nearby woodland. Since then, Wild Clocks has begun to expand into other landscapes, with the long-term ambition of establishing a network of woodland observatories across the UK.
                </p>

                <p>
                  Each observatory follows a consistent monitoring methodology, allowing changes in temperature, rainfall and seasonal timing to be documented and compared between locations.
                </p>

                <p>
                  At its simplest, Wild Clocks is a way of paying closer attention. But it is also an attempt to make change comparable: across years, across places, and against the memory of what a season once was.
                </p>

                <p>
                As the climate warms, the familiar timing of flowering, leaf-out, canopy closure and decline becomes less certain. Wild Clocks exists to observe those changes carefully, building a shared record of what is happening—not only for science, but also for memory, attachment and care.
                </p>

            </div>
          </div>

          <div className="my-12 border-t border-white/20" />

            <div id="why" className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                Why do Britain's woodlands need long-term observation?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Britain's woodlands are entering a period of rapid ecological change. Rising temperatures, shifting rainfall patterns and more frequent weather extremes are altering the seasonal rhythm of woodland life, affecting everything from the timing of budburst and flowering to the growth, health and regeneration of trees.
                </p>

                <p>
                  While national climate datasets describe these changes at broad scales, they rarely show how individual woodlands respond through time. Every woodland is different. Geology, topography, soils, management history and species composition all influence how a site experiences a changing climate.
                </p>

                <p>
                  Wild Clocks exists to document those local responses. By observing the same places year after year, the project creates a long-term record of ecological change that becomes increasingly valuable with each passing season.
                </p>

              </div>
            </div>

            <div className="my-12 border-t border-white/20" />

              <div id="how" className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                How does Wild Clocks work?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks combines repeat photography with continuous environmental monitoring to build a detailed picture of how woodlands change through the seasons.
                </p>

                <p>
                  Each woodland observatory follows a consistent methodology. Fixed photographic viewpoints capture changes in vegetation and structure, while weather stations and woodland sensors record local environmental conditions such as temperature, rainfall, humidity and solar radiation. Together these observations create a continuous record that links changes in climate with changes in the woodland itself.
                </p>

                <p>
                  Rather than relying on occasional surveys, Wild Clocks documents change as an ongoing process, building a record that can be revisited year after year.
                </p>

              </div>
            </div>

                <div className="my-12 border-t border-white/20" />

              <div id="where" className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                Where are the observation sites?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks is developing a network of woodland observatories that represent a range of woodland types across Britain.
                </p>

                <p>
                  Current work includes broadleaved woodland in Oxfordshire and temperate rainforest in Cornwall, with additional sites under development including wood pasture and historic estate woodland. Together these locations provide contrasting environmental conditions and management histories, allowing the project to document how different woodlands respond to a changing climate.
                </p>

                <p>
                  The network will grow gradually, with new observatories added only where long-term monitoring can be maintained.
                </p>

              </div>
            </div>

                        <div className="my-12 border-t border-white/20" />

              <div id="data"className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                What data is collected?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks combines visual observations with environmental measurements to create a richer understanding of woodland change.
                </p>

                <p>
                  Each observatory records repeat photography alongside local climate data, including temperature, rainfall, humidity and solar radiation. These measurements are used to develop indicators that describe changing seasonal conditions, such as heat stress, winter chill, rainfall patterns and climate envelopes.
                </p>

                <p>
                  By combining environmental measurements with visual evidence, Wild Clocks provides both the scientific context and the visible expression of climate change within individual woodlands.
                </p>

              </div>
            </div>

                        <div className="my-12 border-t border-white/20" />

              <div id="who" className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                Who are Wild Clocks' partners?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks is built through collaboration.
                </p>

                <p>
                  The project works with woodland owners, conservation organisations, researchers and land managers who share an interest in understanding how Britain's woodlands are responding to climate change. Each partner contributes local knowledge and long-term stewardship, while Wild Clocks provides a consistent framework for observation and interpretation.
                </p>

                <p>
                  This collaborative approach enables each woodland observatory to become part of a wider network while retaining its own identity and management objectives.
                </p>

              </div>
            </div>

                                    <div className="my-12 border-t border-white/20" />

              <div id="organisations"className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                How can organisations become involved?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks welcomes collaboration with organisations that share an interest in long-term woodland observation.
                </p>

                <p>
                  Partnerships may involve establishing a new woodland observatory, contributing environmental expertise, supporting research, providing equipment or helping to communicate the project's findings. Every partnership is built around a shared commitment to long-term observation and a consistent monitoring methodology.
                </p>

                <p>
                  The project is designed to grow steadily through collaboration rather than rapid expansion, ensuring that every observatory becomes a lasting part of the network.
                </p>

              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
