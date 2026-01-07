// src/pages/About.jsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import FootnoteToggle from "@/components/ui/FootnoteToggle";


export default function About() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* LEFT COLUMN — Navigation (1/3) */}
          <aside className="md:col-span-1">
             <nav className="pl-4 space-y-6 text-white/70 text-xl md:text-base">
              <a
                href="#about"
                className="block hover:text-white transition-colors"
              >
                About Wild Clocks
              </a>
              <a
                href="#contributors"
                className="block hover:text-white transition-colors"
              >
                Contributor’s guide
              </a>
              <a
                href="#contributors"
                className="block hover:text-white transition-colors"
              >
                Index of hygrothermy
              </a>
            </nav>
          </aside>

          {/* RIGHT COLUMN — Content (2/3) */}
          <section className="md:col-span-2 space-y-10">

            {/* ABOUT */}
            <div id="about">
              <h1 className="text-2xl md:text-3xl font-light mb-6">
                About Wild Clocks
              </h1>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  For millennia, plant communities have followed familiar
                  seasonal patterns of leaf-out, flowering, fruiting and decay.
                  Gardeners and ecologists know these rhythms well.
                </p>

                <p>But the world is changing.</p>

                <p>
                  As the climate warms, old certainties begin to loosen. The
                  steady timing of the seasons is becoming less reliable, shaped
                  by the slow, cumulative pressure of climate change.
                </p>

                <p>
                  Wild Clocks follows these changes through two landscapes: a
                  garden in Oxfordshire and a nearby wood.
                </p>

                <p>
                  Their seasonal stories unfold through a series of photographs.
                  Together, they form a visual index of how the seasons flow,
                  drift, change — and sometimes fall out of step.
                </p>

                <p>
                  The forces driving these shifts are climatic: warmth, moisture
                  and light. These influences are well documented, and Wild
                  Clocks draws on that record, pairing each landscape with the
                  climate and seasonal data that shape it.
                </p>

                <p>
                But observation alone is not enough. For change to become meaningful, it needs to be:
                </p>

                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>comparable across years</li>
                <li>comparable across places</li>
                <li>comparable against a shared baseline</li>
                </ul>
                <p>
                Only then can we begin to see not just how the seasons are
                changing, but how much beauty remains — and how much is still
                worth protecting.
              </p>
            <FootnoteToggle title="What do we mean by a “shared baseline”?">
                <p>
                    In climate and ecological science, baselines are a point of reference drawn
                    from long-term climate averages, historical ecological records, and a
                    landscape’s own past.
                </p>

                <p>
                    Wild Clocks draws on these forms of reference not to fix nature in an
                    imagined past, but to make change visible - to understand how today’s
                    seasons differ from what was once typical, both climatically and
                    ecologically.
                </p>
            </FootnoteToggle>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5"></div>

{/* CONTRIBUTORS */}
            <div id="contributors">
              <h2 className="text-xl md:text-3xl font-light mb-6">
                Contributor’s guide
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks is a long-term project. It’s designed to reflect
                  real landscapes as they change — slowly, unevenly, and
                  sometimes unpredictably.
                </p>

                <p>
                  This guide explains how to contribute in a way that’s
                  sustainable and low-pressure.
                </p>

                <p>
                  <strong>How often should I take photos?</strong><br />
                  Aim for around four photographs per month — roughly one every
                  7–8 days. This doesn’t need to be exact. Regularity is more
                  important than precision.
                </p>

                <p>
                  <strong>What happens if I miss a week?</strong><br />
                  The short answer is: <strong>nothing</strong>. If you miss a week, Wild Clocks will simply skip that point in time and display a placeholder instead. Gaps are expected and completely acceptable.
                </p>

                <p>
                  The only important rule is this: <strong>photos should be labelled by the week in which they were taken, not by their position in a sequence.</strong><br />
                </p>

                <p>
                 For example:
                <br /><br />
                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>if your first photo is taken in week 2 of January, it should be labelled “week 2”</li>
                <li>if you miss week 3 and take your next photo in week 4, that photo should be labelled “week 4”</li>
                <li>when the next month begins, numbering resets to week 1</li>
                </ul>
                </p>

                <p>
                  This allows the site to place each image accurately in time, even when weeks are missed.
                </p>

                <p>
                  <strong>Where does the climate data come from?</strong><br />
                  No clock would be complete without the mechanisms that drive it. Wild Clocks uses four main climate measures:
                <br /><br />
                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>temperature</li>
                <li>rainfall</li>
                <li>humidity</li>
                <li>daylight</li>
                </ul>
                </p>

                <p>
                Temperature, humidity, and daylight can usually be derived from national data sources or APIs. <strong>Rainfall is different</strong>. It is often highly local and can vary significantly, even over short distances. For this reason, contributors are encouraged — where possible — to collect rainfall data from their own location. Even simple measurements are valuable.
                </p>
                
                <p>
                  <strong>What is the best way to measure rainfall?</strong><br />
                  A basic <strong>rain gauge</strong> is sufficient. It does not need to be expensive or digital.<br />
                  What matters most is:
                <br /><br />
                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>using the same gauge consistently</li>
                <li>placing it in a fixed, open position</li>
                <li>recording rainfall in millimetres</li>
                </ul>
                </p>

                <p>
                Missing days or weeks are fine — partial data is expected.
                </p>

                {/* More contributor guidance here */}
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
