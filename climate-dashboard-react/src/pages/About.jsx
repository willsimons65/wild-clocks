// src/pages/About.jsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import ExternalLink from "@/components/ui/ExternalLink";


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
      href="#archive"
      className="block hover:text-white transition-colors"
    >
      What is the Wild Clocks archive?
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
                  Wild Clocks is a long-term woodland observation network building an archive of how Britain's woodlands respond to climate change and ecological restoration.
                </p>

                <p>Combining repeat photography, environmental monitoring and ecological observation, the project documents how individual woodlands change through the seasons and over decades.</p>

                <p>
                  The project began with two places: a garden in Oxfordshire and a nearby woodland. Since then, Wild Clocks has begun expanding into other woodlands, with the ambition of establishing a network of observatories across Britain.
                </p>

                <p>
                  Each observatory follows a consistent methodology, allowing changes to be documented over time and compared between locations. Together, these records form a growing archive of woodland change, preserving evidence of landscapes as they respond to a changing climate and the decisions we make in response.
                </p>

                <p>
                  At its simplest, Wild Clocks is a way of paying closer attention. But it is also an attempt to make change comparable: across years, across places, and against the memory of what a season once was.
                </p>

                <p>
                The intention is to create a record that remains useful long into the future, not only for science and conservation, but also for memory, attachment and care.
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
                  Britain's woodlands are entering a period of significant ecological change. Rising temperatures, shifting rainfall patterns and more frequent weather extremes are affecting the seasonal rhythm of woodland life, from the timing of budburst and flowering to the growth, health and regeneration of trees.
                </p>

                <p>
                  At the same time, woodland owners and conservation organisations are responding through restoration, natural regeneration, changes in management and the creation of new habitats.
                </p>

                <p>
                  Understanding these changes requires observation over many years.
                </p>

                <p>
                  While national climate datasets describe broad environmental trends, they cannot fully explain how individual woodlands respond. Every woodland is different. Geology, topography, soils, species composition and management history all influence how a woodland experiences change.
                </p>

                <p>
                  Wild Clocks documents these local responses, creating a long-term record of how woodlands change, whether through natural processes, climate pressures or deliberate restoration.
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
                  Wild Clocks combines repeat photography, continuous environmental monitoring and ecological observations to build a detailed picture of woodland change.
                </p>

                <p>
                  Fixed photographic viewpoints capture changes in vegetation, canopy and woodland structure. Weather stations and under-canopy sensors record local environmental conditions, including temperature, rainfall, humidity and solar radiation.
                </p>

                <p>
                  These records are complemented by observations of seasonal events, ecological changes and, where relevant, restoration or management interventions.
                </p>

                <p>
                  Each observatory follows a consistent methodology, making it possible to compare observations across different woodlands and over time.
                </p>

                <p>Rather than relying solely on occasional surveys, Wild Clocks builds a continuing record that connects environmental conditions with visible changes in the woodland itself.
                </p>

              </div>
            </div>

            <div className="my-12 border-t border-white/20" />

              <div id="archive" className="scroll-mt-24">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                What is the Wild Clocks archive?
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  The archive is the enduring record created by the network of woodland observatories.
                </p>

                <p>
                  It brings together repeat photography, environmental measurements, ecological observations and records of significant events or interventions, preserving them as a continuous account of how individual woodlands change.
                </p>

                <p>
                  Some of these changes may be gradual, unfolding over decades. Others may follow particular events, such as droughts, storms, woodland creation or the restoration of natural water systems.
                </p>

                <p>
                  By recording these changes from their earliest stages, the archive creates opportunities to understand not only what happened, but how and when landscapes changed.
                </p>

                <p>
                  Its value is intended to grow over time. Future researchers, conservationists and woodland managers may use these records to investigate questions that have not yet been asked.
                </p>

                <p>
                  Wild Clocks aims to make this evidence accessible and useful, creating a lasting resource for understanding Britain's changing woodlands.
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
                  Wild Clocks is developing a network of observatories representing different woodland types, environmental conditions and approaches to management across Britain.
                </p>

                <p>
                  Current work includes broadleaved woodland in Oxfordshire and temperate rainforest in Cornwall, with further partnerships being explored in landscapes undergoing restoration, natural regeneration and long-term ecological change.
                </p>

                <p>
                  Each location contributes a distinct perspective to the archive. Some document established woodlands responding to climate pressures, while others may follow restoration projects from their earliest stages.
                </p>

                <p>
                  The network will grow gradually, with new observatories added where they can contribute meaningful evidence and where long-term observation can be maintained.
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
                  Depending on the site, records may include repeat photography, air temperature, rainfall, relative humidity, solar radiation and under-canopy microclimate measurements.
                </p>

                <p>
                  These observations support indicators describing seasonal and environmental conditions, including heat stress, winter chill, rainfall patterns and climate envelopes.
                </p>

                <p>
                  Where woodlands are undergoing restoration, the archive may also incorporate existing ecological baselines, management records, restoration objectives and observations of progress towards intended outcomes.
                </p>

                <p>
                  Together, these records provide environmental context and visual evidence that can be explored individually or compared across the wider network.
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
                  The project works with woodland owners, conservation organisations, researchers and land managers who share an interest in understanding and documenting long-term woodland change.
                </p>

                <p>
                  Partners contribute local knowledge, ecological expertise and stewardship of their landscapes, while Wild Clocks provides a consistent approach to observation, data collection and archiving.
                </p>

                <p>
                  This collaborative model allows each observatory to contribute to a shared national record while retaining its own identity, ecological context and management objectives.
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
                  Wild Clocks welcomes collaboration with organisations interested in long-term woodland observation and the development of a shared archive.
                </p>

                <p>
                  Partnerships may involve establishing a new observatory, contributing existing ecological records, supporting research, providing monitoring equipment or helping make the archive accessible to wider audiences.
                </p>

                <p>
                  The project is designed to grow steadily through collaboration, with an emphasis on the continuity, quality and long-term value of the records it creates.
                </p>

              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
