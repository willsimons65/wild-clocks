// src/pages/FieldNotes.jsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import WaveClockDiagram from "@/components/field-notes/WaveClockDiagram";
import RainfallStatesDiagram from "@/data/notes/RainfallStatesDiagram";
import FootnoteToggle from "@/components/ui/FootnoteToggle";

export default function FieldNotes() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* LEFT COLUMN — Navigation */}
          <aside className="hidden md:block md:col-span-1">
            <nav className="pl-4 space-y-6 text-white/70 text-xl md:text-base">
              <a
                href="#wave-model"
                className="block hover:text-white transition-colors"
              >
                Wave Model
              </a>
              <a
                href="#rainfall"
                className="block hover:text-white transition-colors"
              >
                Five Rainfall States
              </a>
            </nav>
          </aside>

          {/* RIGHT COLUMN — Content */}
          <section className="md:col-span-2 space-y-10">
            <article id="wave-model">
              <h1 className="text-2xl md:text-3xl font-light mb-6">
                Wave Model
              </h1>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks began with a simple idea: that landscapes change
                  through time, and that those changes can be observed,
                  recorded and compared.
                </p>

                <p>
                  The image of a clock has been useful because it offers a way
                  of thinking about seasonal recurrence. It allows us to ask
                  clear questions: when did flowering begin, when did leaf-out
                  occur, how long did a canopy remain open, and how does one
                  year compare with another?
                </p>

                <p>But a clock can only take us so far.</p>

                <p>
                  A woodland does not move through the year as a single
                  mechanism. It does not “turn” all at once, nor does it follow
                  one neat cycle repeated in the same way each year. What we
                  call spring or autumn is not one event but the temporary
                  alignment of many different ecological processes.
                </p>

                <p>
                  A more faithful way of describing seasonal change may be as a
                  set of overlapping waves moving through a landscape.
                </p>

                <WaveClockDiagram />

                <p>
                  These waves are made up of many smaller oscillations: warming soil,
                  lengthening days, sap rise, flowering, leaf emergence, canopy
                  closure, moisture loss, insect activity, fungal response, bird
                  behaviour. Each has its own timing, pace and duration. Some
                  are abrupt and brief. Others build slowly and linger. Some
                  reinforce one another. Others fall out of step.
                </p>

                <p>
                  What we perceive as a seasonal “moment” is often the visible
                  result of these waves briefly combining.
                </p>

                <p>
                  This matters because climate change does not only alter
                  individual dates. It can also change the shape, duration and
                  relationship of the waves themselves. A flowering period may
                  arrive earlier, but also become shorter. A canopy may close
                  more rapidly. Moisture stress may begin before flowering has
                  finished. 
                </p>
                <p>  
                  The issue is not only whether something happens
                  earlier or later, but whether the different parts of a
                  landscape still move together.
                </p>

                <p>
                  The Wave Model above is based on seasonal observations and
                  weather patterns from a single woodland year. Its shapes are
                  shown in relative terms to reveal timing, overlap and seasonal
                  character, rather than exact measured equivalence.
                </p>
              </div>
            </article>
                      
            <div className="my-16 border-t border-white/40" />

<article id="rainfall">
  <h1 className="text-2xl md:text-3xl font-light mb-3">
    Five Rainfall States
  </h1>

  <div className="space-y-5 text-white/80 leading-relaxed">

  <p className="text-base md:text-lg text-white/60 italic mb-8">
    How a local climate record became a seasonal rainfall model for Appleton Woods
  </p>

  <div className="space-y-6 text-white/80 leading-relaxed">
    <p>
      When we talk about a “dry spring” or a “wet year”, we usually do so
      loosely -- as a feeling, or a memory. But if a landscape is made up of
      overlapping seasonal clocks, it helps to be a little more precise than
      that.
    </p>

    <p>
      For this piece, I wanted to see whether the weather record for
      Appleton Woods could be simplified into a small number of recurring
      seasonal states -- not every possible variation, but the broad kinds of
      spring a landscape experiences over time.
    </p>

    <p>
      Rather than treating each year as a separate story, I looked at the part
      of the year when flowering, pollination and early summer growth are most
      active, and asked a simple question:
    </p>

    <p className="text-white text-lg md:text-lg leading-relaxed">
      What does a spring look like when it unfolds with very little rain -- and
      what does it look like when the rain keeps coming?
    </p>

    <FootnoteToggle title="About the data">
      <div className="space-y-4 text-white/75 leading-relaxed">
        <p>
          Wild Clocks combines several sources of local climate information.
        </p>

        <p>
          The longer-term temperature and rainfall record used here is drawn
          primarily from the Radcliffe Observatory weather station in Oxford -- one of the
          UK’s longest continuous weather records -- together with supplementary
          Met Office data where needed.
        </p>  

        <p>  
          For the purposes of this model, I use a 25-year record.
        </p>

        <p>
          The Observatory is a few miles away, but close enough to provide the
          continuity needed to compare one year with another across time.
        </p>

        <p>
          Since February 2025, I have also kept a rain gauge in the garden at
          home, which lies only a short walk from Appleton Woods. This allows me
          to treat rainfall recorded in the garden as the closest local proxy
          for the woods themselves.
        </p>

        <p>This means the model is built from a mixture of:</p>

        <ul className="list-disc pl-6 space-y-2">
          <li>a long nearby climate record</li>
          <li>and, where available, site-adjacent local measurement</li>
        </ul>

        <p>
          It is not a perfect reconstruction of conditions within the wood
          itself. But it is close enough to begin asking better seasonal
          questions of the landscape.
        </p>
      </div>
    </FootnoteToggle>

    <div className="pt-4">
      <RainfallStatesDiagram />
    </div>

    <div className="space-y-5 pt-2">
      <h2 className="text-xl md:text-2xl font-light text-white">
        How the model was built
      </h2>

      <p>
        The diagram above groups springs into five recurring rainfall states,
        based on the amount of rain accumulated between March and July -- the
        part of the year when flowering, pollination and early summer growth
        are most active.
      </p>

      <p>
        Rather than showing every year individually, it calculates the median
        cumulative rainfall for each state. The result is not a forecast or a fixed ecological rule, but the <strong>Five Rain States</strong> -- a way of turning a long local rainfall record into something that can be easily considered and worked with.
      </p>

      <p>
        To build the model, each year in the record was ranked according to the
        total rainfall accumulated between March and July. The years were then
        grouped into five broad rainfall bands:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>Severe spring drought</li>
        <li>Below-average rainfall</li>
        <li>Typical / balanced year</li>
        <li>Wet spring</li>
        <li>Persistent / excessive rain</li>
      </ul>

      <p>
        Each band was then reduced to a single cumulative median curve. That
        means the diagram above does not show one literal year, but the typical
        shape of rainfall accumulation within each part of the record.
      </p>

      <p className="text-white">
        What emerges is not one “average” spring, but five different ways a
        spring can unfold.
      </p>
    </div>

    <div className="space-y-5 pt-4">
      <h2 className="text-xl md:text-2xl font-light text-white">
        Anchor years in the rainfall record
      </h2>

      <p>
        Although the five-state model is built from grouped medians, it remains
        tied to real observed years.
      </p>

      <p>
        Some years sit close to the centre of a rainfall state and act as useful
        representatives. Others sit at the outer edges of the record —- years
        like <span className="text-white">2025</span>, when spring rainfall all
        but collapsed, or <span className="text-white">2012</span>, when it
        accumulated almost without pause.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/15 text-white/70 text-sm md:text-base">
              <th className="py-3 pr-4 font-normal">Role</th>
              <th className="py-3 pr-4 font-normal">Year</th>
              <th className="py-3 pr-4 font-normal">Mar–Jul rainfall (mm)</th>
              <th className="py-3 font-normal">State</th>
            </tr>
          </thead>
          <tbody className="text-white/85 text-sm md:text-base">
            <tr className="border-b border-white/10">
              <td className="py-3 pr-4">Driest year in record</td>
              <td className="py-3 pr-4">2025</td>
              <td className="py-3 pr-4">66</td>
              <td className="py-3">Severe drought</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 pr-4">Representative severe drought year</td>
              <td className="py-3 pr-4">2022</td>
              <td className="py-3 pr-4">154</td>
              <td className="py-3">Severe drought</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 pr-4">Representative below-average year</td>
              <td className="py-3 pr-4">2019</td>
              <td className="py-3 pr-4">229</td>
              <td className="py-3">Below average</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 pr-4">Representative balanced year</td>
              <td className="py-3 pr-4">2001</td>
              <td className="py-3 pr-4">263</td>
              <td className="py-3">Typical / balanced</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 pr-4">Representative wet year</td>
              <td className="py-3 pr-4">2021</td>
              <td className="py-3 pr-4">289</td>
              <td className="py-3">Wet</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-3 pr-4">Representative excessive-rain year</td>
              <td className="py-3 pr-4">2023</td>
              <td className="py-3 pr-4">391</td>
              <td className="py-3">Persistent / excessive rain</td>
            </tr>
            <tr>
              <td className="py-3 pr-4">Wettest year in record</td>
              <td className="py-3 pr-4">2012</td>
              <td className="py-3 pr-4">472</td>
              <td className="py-3">Persistent / excessive rain</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="space-y-5 pt-4">
      <h2 className="text-xl md:text-2xl font-light text-white">
        Why this matters
      </h2>

      <p>
        Rainfall alone does not tell the whole story of a landscape. But it
        changes the conditions in which other seasonal events unfold.
      </p>

      <p>
        A dry spring does not just mean “less rain”. It can shorten a burst of
        flowering, compress a growing season, or leave pollinators with fewer
        good weeks to work with. A persistently wet spring may do the opposite -- or introduce a different kind of disruption altogether.
      </p>

      <p>
        In the next piece, I want to explore what these five rainfall states
        might mean for two overlapping seasonal waves:{" "}
        <span className="text-white">flowering</span> and{" "}
        <span className="text-white">pollination</span>.
      </p>
      </div>
    </div>
  </div>
</article>
          </section>
        </div>
      </main>
    </div>
  );
}