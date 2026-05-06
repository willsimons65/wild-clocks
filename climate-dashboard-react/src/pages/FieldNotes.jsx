// src/pages/FieldNotes.jsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import WaveClockDiagram from "@/components/field-notes/WaveClockDiagram";
import RainfallStatesDiagram from "@/data/notes/RainfallStatesDiagram";
import FootnoteToggle from "@/components/ui/FootnoteToggle";
import SequenceSlider from "@/data/notes/SequenceSlider";
import { bluebellsAppleton2026 } from "@/data/sequences/bluebellsAppleton2026";
import TimeInLandscapeComparison from "@/components/insights/TimeInLandscapeComparison";
import ImageCarousel from "@/data/notes/ImageCarousel";

const cabillaImages = [
  {
    id: "cab1",
    src: "/photos/thousand-year-trust/intro/cab1.webp",
    alt: "Moss-covered oak trees at Cabilla",
  },{
    id: "cab3",
    src: "/photos/thousand-year-trust/intro/cab3.webp",
    alt: "Moss-covered oak trees at Cabilla",
  },
  {
    id: "cab2",
    src: "/photos/thousand-year-trust/intro/cab2.webp",
    alt: "Temperate rainforest canopy at Cabilla",
  },
  {
    id: "cab5",
    src: "/photos/thousand-year-trust/intro/cab5.webp",
    alt: "Temperate rainforest canopy at Cabilla",
  },
  {
    id: "cab6",
    src: "/photos/thousand-year-trust/intro/cab6.webp",
    alt: "Temperate rainforest canopy at Cabilla",
  },
  {
    id: "cab7",
    src: "/photos/thousand-year-trust/intro/cab7.webp",
    alt: "Temperate rainforest canopy at Cabilla",
  },
];

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
              <a
                href="#bluebells"
                className="block hover:text-white transition-colors"
              >
                Bluebell Wave
              </a>
              <a
                href="#time"
                className="block hover:text-white transition-colors"
              >
                Time in a Landscape
              </a>
              <a
                href="#cabilla"
                className="block hover:text-white transition-colors"
              >
                Cabilla and the Thousand-Year Clock
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
      loosely - as a feeling, or a memory. But if a landscape is made up of
      overlapping seasonal clocks, it helps to be a little more precise than
      that.
    </p>

    <p>
      For this piece, I wanted to see whether the weather record for
      Appleton Woods could be simplified into a small number of recurring
      seasonal states - not every possible variation, but the broad kinds of
      spring a landscape experiences over time.
    </p>

    <p>
      Rather than treating each year as a separate story, I looked at the part
      of the year when flowering, pollination and early summer growth are most
      active, and asked a simple question:
    </p>

    <p className="text-white text-lg md:text-lg leading-relaxed">
      What does a spring look like when it unfolds with very little rain - and
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
          UK’s longest continuous weather records - together with supplementary
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
        based on the amount of rain accumulated between March and July - the
        part of the year when flowering, pollination and early summer growth
        are most active.
      </p>

      <p>
        Rather than showing every year individually, it calculates the median
        cumulative rainfall for each state. The result is not a forecast or a fixed ecological rule, but the <strong>Five Rainfall States</strong> - a way of turning a long local rainfall record into something that can be easily considered and worked with.
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
        representatives. Others sit at the outer edges of the record — years
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
        good weeks to work with. A persistently wet spring may do the opposite - or introduce a different kind of disruption altogether.
      </p>

      <p>
        In a companion piece, I want to explore what these five rainfall states
        might mean for two overlapping seasonal waves:{" "}
        <span className="text-white">flowering</span> and{" "}
        <span className="text-white">pollination</span>.
      </p>
      </div>
    </div>
  </div>
</article>
<div className="my-16 border-t border-white/40" />

<article id="bluebells">
  <h1 className="text-2xl md:text-3xl font-light mb-3">
    Bluebell Wave
  </h1>

  <p className="text-base md:text-lg text-white/60 italic mb-8">
    A day-by-day record of bluebell emergence in Appleton Woods
  </p>

  <div className="space-y-5 text-white/80 leading-relaxed">
    <p>
      Bluebells are one of the most recognisable signals of spring in a
      broadleaf woodland. Their emergence is gradual, but once underway,
      it can feel as though the woodland floor changes almost from one day
      to the next.
    </p>

    <p>
      The sequence below records that change as it happens - a daily
      progression through the early stages of bluebell growth, set
      alongside the temperature conditions in which it unfolds.
    </p>
  </div>

  {/* 👇 THIS IS YOUR COMPONENT */}
  <SequenceSlider
    entries={bluebellsAppleton2026}
    aspect="square"
    className="my-10"
  />

  <div className="space-y-5 text-white/80 leading-relaxed">
    <p>
      At this stage, the sequence is still in progress. What begins as
      scattered shoots will, over the coming weeks, form a continuous
      layer across the woodland floor before gradually fading again.
    </p>

    <p>
      What is striking is not only the timing of emergence, but the pace
      at which it develops - and how closely that pace appears to follow
      short runs of warmer or cooler days.
    </p>
  </div>
</article>

<div className="my-16 border-t border-white/40" />

<article id="time">
  <h1 className="text-2xl md:text-3xl font-light mb-3">
    Time in a landscape
  </h1>

  <p className="text-base md:text-lg text-white/60 italic mb-8">
    How time is shaped in a landscape
  </p>

  <div className="space-y-5 text-white/80 leading-relaxed">
    <p>
      When we invented the clock, we didn’t just create a tool to measure time - we invented a particular idea of what time is. While the standard hours, minutes, and seconds emerged over centuries, it was the development of highly accurate mechanical clocks in the 17th and 18th centuries that rendered this system fixed and widely accepted. 
    </p>

    <p>
      A central figure in this story was the English clockmaker, John Harrison. Harrison devoted his life to solving the problem of longitude at sea - a challenge that required a clock of unprecedented accuracy. His eventual success earned him the Longitude Prize, and his clocks are still regarded as some of the most remarkable machines ever made.
    </p>

    <p>
      Central to this challenge were the constantly changing conditions of life at sea. His clocks had to be far more than simple mechanisms for keeping time; they needed to do so in environments that were continually shifting, where changes in temperature, pressure and humidity could create small but critical discrepancies.
    </p>

    <p>
      His solution was to build mechanisms that could compensate for these shifts - where the movement of the clock could adjust itself if it was gaining or losing too much time.
    </p>

    <p>
      In doing so, Harrison helped establish a powerful idea: that time could be made uniform, measurable, and independent of external conditions. The result is our modern belief in absolute time - or, as Iain McGilchrist puts it: “Clock time is invented time… but we have come to believe that our invention has an objective existence.”
    </p>

    <p>
      And yet, outside the mechanism of the clock, time behaves very differently.
    </p>

    <div className="my-12 border-t border-white/20" />

    <p>
      In a small wood just outside Oxford, I have been observing the bluebells. Each spring they rise from the same ground, follow a broadly familiar pattern, and then disappear again. It is an event that belongs, in the abstract, to April and May - part of the expected rhythm of the year. But this year, they arrived early.
    </p>

    <TimeInLandscapeComparison />

    <p>
      By mid-April, the wood was already beginning to turn. The first haze of blue had spread across the floor, and within a few days it was clear that the season was ahead of itself - noticeably earlier than the year before.
    </p>

    <p>
      Nothing in the calendar had changed. The dates were the same. But the season was not.
    </p>

    <p>
      The difference lay in the conditions that shaped the year. The winter had been mild, but more importantly it had been wet. The soil was saturated going into spring, and as temperatures rose, the plants responded quickly. Last year, though also mild, had been much drier. The same sequence unfolded more slowly, and over a longer period.
    </p>

    <p>
      Standing in the wood, it becomes difficult to think of time as something that passes evenly. Instead, it feels as though the season is being drawn forward - compressed and accelerated by the conditions that precede it. What we call “April” contains two very different kinds of time: one fixed and abstract, the other contingent and responsive.
    </p>

    <p>
      The bluebells are not early. They are following a different clock - one that measures time not in hours or days, but in conditions.
    </p>

    <div className="my-12 border-t border-white/20" />

    <p>
      In this sense, time in a landscape is not something that passes independently of the world around it. It is something that emerges from it. Temperature, rainfall, soil moisture, light - these are not external influences acting on time; they are what give it shape.
    </p>

    <p>
      In a wet spring, the season gathers momentum quickly. Growth accelerates, flowering advances, and what might normally unfold over several weeks can be compressed into a much shorter period. In a dry year, the same sequence slows, stretches, and sometimes falters altogether.
    </p>

    <p>
      Time, in these landscapes, does not move at a constant rate. It expands and contracts in response to the conditions that sustain it. This becomes clearer when we look beyond a single species.
    </p>

    <p>
      A woodland in spring is not just bluebells coming into flower. It is leaf buds breaking, insects emerging, birds nesting, fungi receding - multiple processes unfolding together, each responding to the same underlying conditions, but at slightly different speeds. Some advance quickly; others lag behind—some accelerate, while others stall.
    </p>

    <p>
      The result is not a single, uniform flow of time, but a layered and uneven one - closer, perhaps, to the way we experience time ourselves.
    </p>

    <p>
      In this sense, a landscape does not simply exist within time. It produces its own.
    </p>

    <div className="my-12 border-t border-white/20" />

    <p>
      If landscapes produce their own time, the question becomes how to observe it. This is the starting point for Wild Clocks. Rather than measuring time in hours or days, a wild clock attempts to record how a season unfolds in a particular place. It does this through repeated observation - returning to the same point, week after week, and building a visual record of change.
    </p>

    <p>
      In Appleton Woods, that record takes two forms: a week-by-week comparison, and a “micro-clock” that follows the season more closely. Together, they trace the bluebells from their first emergence through to their decline. Each photograph captures a small shift - the first hint of colour, the spread of the flowers across the woodland floor, the gradual fading of the season, and with it, the changing pace at which the season unfolds.
    </p>

    <p>
      Seen individually, these changes are subtle. Taken together, they form a pattern.
    </p>

    <p>
      What emerges is not just a record of what happened, but of how it happened. The length of the season, the speed at which it develops, the moment at which it peaks - these are all expressions of time behaving in different ways.
    </p>

    <p>
      When this visual record is set alongside simple measures of temperature and rainfall, another layer becomes visible. A wet winter followed by a mild spring produces one kind of season: early, fast-moving, and compressed. A drier year produces another: slower, more extended, and often less intense. The clock does not predict these outcomes, and it does not impose a structure on them. It simply reveals the relationship between conditions and response.
    </p>

    <p>
      In this sense, a Wild Clock is not a device for measuring time, but for making it visible. Over time, as these records accumulate across different landscapes - woodlands, grasslands, and other climate-sensitive habitats - it becomes possible to compare how seasons behave in different places, and how they change from year to year.
    </p>

    <p>
      What begins as a local observation becomes something broader: a way of seeing how climate is altering not just what happens in a landscape, but the pace and structure of the seasons themselves.
    </p>
  
  </div>

  </article>

  <div className="my-16 border-t border-white/40" />

                <article id="cabilla">
                <h1 className="text-2xl md:text-3xl font-light mb-3">
                  Cabilla and the Thousand-Year Clock
                </h1>

                <p className="text-base md:text-lg text-white/60 italic mb-8">
                  Notes from a visit to Cabilla Wood
                </p>

                <div className="space-y-5 text-white/80 leading-relaxed">
                  <p>
                    Some weeks ago, I had the good fortune to visit Cabilla Wood, a temperate woodland on Bodmin Moor. It's a four-hour drive from where I live, with the last stretch proving something of a challenge, the road dipping and turning in ways I am not accustomed to.
                  </p>

                  <p>
                    On arrival, you must follow a path that takes you along the edge of several fields. The fields are enclosed by high fences—a precaution against marauding deer, and protection for the newly planted saplings, their slender shoots concealed within plastic sheaths. At first, I didn’t pay much attention - saplings are a familiar enough sight.
                  </p>

                  <p>
                    Only later, on the drive back to Oxford, did the connection take hold. It came during a call from my youngest daughter, asking how things had gone. In that moment, I remembered the saplings: fragile, protected, just beginning—the same age as my daughter.
                  </p>

                  <p>
                  I saw them differently.
                  </p>

                </div>

                <div className="my-6 md:my-6">
                  <ImageCarousel images={cabillaImages} aspect="landscape" />
                </div>

                <div className="space-y-5 text-white/80 leading-relaxed">
                  <p>
                    On entering the wood, I was struck by the twisted forms of the trees. They were unlike anything I had seen before—not towering but short and squat, many of them no bigger than a person. 
                  </p>

                  <p>  
                    There was something familiar in their shapes. I had felt it once before, at Knepp—a sense not of seeing something new, but of recognising something already known. These are the trees of childhood stories—the ones we recognise instinctively, even if we’ve never seen them before.
                  </p>

                  <p>
                    The path leads to the edge of an escarpment. The wood falls away, then rises again on the far side of the valley. The sense of space is immense. Most remarkable of all is the patterning of the canopy. It spreads out in every direction, the intricate shapes of the branches forming a mosaic of silver and green.
                  </p>

                  <p>
                    If the scale of the wood is impressive, the ambition for it is greater still. The aim here is not just restoration, but something far more long-lasting. It is stewarded by the Thousand Year Trust—a name that reflects the time it takes for a sessile oak to grow, thrive, and decay.
                  </p>

                  <p>
                    In that sense, Cabilla is more than a woodland. It is a kind of living experiment—a way of asking what these landscapes might become, and how they might respond to a changing climate.
                  </p>

                  <p>
                    Which brings me back to the saplings.
                  </p>

                  <p>
                  At first, they had seemed incidental—easy to pass by. Now they felt like markers in time: the earliest stages of something that, if allowed, will outlast us all. In the wood, I had seen what that might become. On the edge of the field, I had seen where it begins. The distance between the two is measured not in space, but in years, perhaps centuries.
                  </p>
                </div>
              </article>
          </section>
        </div>
      </main>
    </div>
  );
}