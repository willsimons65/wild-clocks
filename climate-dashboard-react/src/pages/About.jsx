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
                  Wild Clocks is a long-term record of seasonal change.
                </p>

                <p>It brings together repeat photography, climate data and ecological observation to document how landscapes move through the year — and how those patterns are beginning to shift.</p>

                <p>
                  The project began with two places: a garden in Oxfordshire and a nearby wood. Both are photographed regularly from the same fixed viewpoint, creating a visual record of change across weeks, months and years.
                </p>

                <p>
                  These images are paired with local environmental data such as rainfall, temperature and daylight, allowing seasonal events to be seen not in isolation, but in relation to the conditions that shape them.
                </p>

                <p>
                  Since then, Wild Clocks has begun to expand into other landscapes, and will continue to grow as more are added.
                </p>

                <p>
                  At its simplest, it is a way of paying closer attention. But it is also an attempt to make change comparable: across years, across places, and against the memory of what a season once was.
                </p>

                <p>
                As the climate warms, the familiar timing of flowering, leaf-out, canopy closure and decline becomes less certain.
                </p>

                <p>
                Wild Clocks exists to observe those changes carefully, and to build a shared record of what is happening — not only for science, but for memory, attachment and care.
              </p>
            </div>
          </div>

          <div className="my-16 border-t border-white/40" />

{/* CONTRIBUTORS */}
            <div id="contributors">
              <h2 className="text-xl md:text-3xl font-light mb-7">
                Contributor’s guide
              </h2>

              <div className="space-y-5 text-white/80 leading-relaxed">
                <p>
                  Wild Clocks is a long-term project. It’s designed to reflect
                  real landscapes as they change — slowly, unevenly, and
                  sometimes unpredictably.
                </p>

                <p>
                  This guide explains how to contribute in a way that is sustainable, low-pressure, and consistent over time.
                </p>

                <div className="my-12 border-t border-white/20" />

                <p>
                  <strong>How often should I take photos?</strong><br />
                  Aim for around four photographs per month — roughly one every
                  7–8 days. This doesn’t need to be exact. Regularity is more
                  important than precision.
                </p>

                <div className="my-12 border-t border-white/20" />

                <p>
                  <strong>What happens if I miss a week?</strong><br />
                  The short answer is: <strong>nothing</strong>. If you miss a week, Wild Clocks will simply skip that point in time and display a placeholder instead. Gaps are expected and completely acceptable.
                </p>

                <p>
                  The only important rule is this: <strong>photos should be labelled by the week in which they were taken, not by their position in a sequence.</strong><br />
                </p>

                <p>
                 For example:
                </p>
            
                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>if your first photo is taken in week 2 of January, it should be labelled “week 2”</li>
                <li>if you miss week 3 and take your next photo in week 4, that photo should be labelled “week 4”</li>
                <li>when the next month begins, numbering resets to week 1</li>
                </ul>

                <p>
                  This allows the site to place each image accurately in time, even when weeks are missed.
                </p>

                <div className="my-12 border-t border-white/20" />

                <p>
                  <strong>Where does the climate data come from?</strong><br />
                  No clock would be complete without the mechanisms that drive it. Wild Clocks uses four main climate measures:
                </p>

                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>temperature</li>
                <li>rainfall</li>
                <li>humidity</li>
                <li>daylight</li>
                </ul>

                <p>
                Temperature, humidity, and daylight can usually be derived from national data sources or APIs. <strong>Rainfall is different</strong>. It is often highly local and can vary significantly, even over short distances. For this reason, contributors are encouraged — where possible — to collect rainfall data from their own location. Even simple measurements are valuable.
                </p>

                <FootnoteToggle title="Other ways of measuring climate">
                <p>
                    <strong>Wild Clocks</strong> does not treat temperature, rainfall, humidity and daylight as isolated variables. In living systems, these forces are felt together. Growth, flowering, decay, and dormancy are shaped by the climate as a whole — by how conditions combine and unfold over time, not simply by how many warm or wet days occur.  
                </p>

                <p>
                    This leads to a broader question: 
                 </p>
                    
                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>what is the combined effect of these values?</li>
                <li>and what does it mean for the habitats that move through them?</li>
                </ul>   

                <p>
                    The <strong>Index of Hygrothermy</strong> is one way of approaching that question. It looks at the data as a whole and brings multiple climatic factors into a single, comparative view of growing conditions. Each value is interpreted against a shared historical baseline, allowing seasons to be compared across years and across locations.
                </p>

                </FootnoteToggle>

                <div className="my-12 border-t border-white/20" />
                
                <p>
                  <strong>What is the best way to measure rainfall?</strong><br />
                  A basic <strong>rain gauge</strong> is sufficient. It does not need to be expensive or digital.
                  What matters most is:
                </p>

                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>using the same gauge consistently</li>
                <li>recording rainfall in millimetres</li>
                </ul>

                <p>For accurate readings, place the gauge in an open spot, well away from overhanging branches or walls that could deflect rainfall. To keep it upright in strong wind, set it inside a bucket or an empty flowerpot.</p>

                <FootnoteToggle title="Where can I find a rain gauge?">                   
                <p>
                    You’ll find plenty of options online — including on Amazon — but you don’t need anything elaborate. 
                    A simple, clearly marked gauge is all that’s required. One reliable example can be found{" "}
                    <ExternalLink href="https://www.amazon.co.uk/STOWBERRY-Outdoor-Rain-Gauge-Garden/dp/B0F9LKDBRY/ref=sr_1_1_sspa?adgrpid=185740323345&dib=eyJ2IjoiMSJ9.xHa5zE-hTVEVZOWx8cmF72Y3Mu79tQfRZA0-a-C4injYiXU5uObQY83VhjifSnllDjgx-729nHLhic5ooDv1tp3KoYEoxJpqhG8atH-pHHUn7qwQAhje8caZj-N8u_vW6PaLGguM6NcnES6hIbDasFQxkXJ3Q5pk-IOzIeeckKio0DNTIqYbcmsGLScEHdlZ8Nbx7iDdGUFSFvALHykMFvLXxn8kMf3uJdkDucRzrbPnPcj7WuXSaOBZwyrqx-1LMFXJk4S0hcoa5ZHahlmi6QlteavcuXg1rXG19CN1qyU.6kQTfGayloVF6Hja1pmoXCIsL7a89USXHDAgp_a7uKM&dib_tag=se&gad_source=1&hvadid=779283453034&hvdev=c&hvexpln=0&hvlocphy=9189606&hvnetw=g&hvocijid=8315224018449169743--&hvqmt=e&hvrand=8315224018449169743&hvtargid=kwd-491901796313&hydadcr=22610_2214464_376947&keywords=rain+gauges+amazon&mcid=2dbda22179713333ba0ee941f890b3e4&qid=1767944433&sr=8-1-spons&aref=kZxrfar8o6&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1">
                    here
                    </ExternalLink>.
                </p>
                </FootnoteToggle>

                <div className="my-12 border-t border-white/20" />

                <p>
                    <strong>Photos: how to take them</strong><br />
                    After choosing a location, the ideal approach is to photograph it from exactly <strong>the same position</strong> each time. This consistency makes long-term changes visible.
                </p>

                <p>
                    You can achieve this by:
                </p>

                <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>using a tripod and carefully positioning it each time, or</li>
                <li>building a simple fixed marker or mount that stays in place</li>
                </ul>

                <p>
                    A fixed solution often produces the most consistent results, as there’s no risk of gradual movements.
                </p>

                <div className="my-12 border-t border-white/20" />

                <p className="pb-6 mb-10">
                    <strong>Building your own fixed camera position</strong><br />
                    If you decide to create a permanent mount, it doesn’t need to be complicated.
                    A simple post set into the ground, with two blocks to hold your mobile phone/camera in place,
                    is often enough. What matters is consistency — not precision engineering.
                </p>

                <CameraMountAnimation />

                <div className="my-12 border-t border-white/20" />

                <p className="pt-2 mt-5">
                    <strong>What if my photos aren’t perfect?</strong><br />
                    That’s expected. Light levels will change. Weather will interfere. Vegetation will grow unpredictably. Some weeks will look quieter than others.
                </p>

                <p>
                    Wild Clocks isn’t about perfect images — it’s about honest ones.
                </p>

              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
