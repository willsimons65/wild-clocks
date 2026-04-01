import React from "react";
import Navbar from "@/components/layout/Navbar";
import WaveClockDiagram from "@/components/field-notes/WaveClockDiagram";

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
          </section>
        </div>
      </main>
    </div>
  );
}