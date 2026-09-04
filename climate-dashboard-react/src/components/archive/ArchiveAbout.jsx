// src/components/archive/ArchiveAbout.jsx

export default function ArchiveAbout() {
  return (
    <div className="pt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LEFT COLUMN — Navigation */}
        <aside className="hidden md:block md:col-span-1">
          <nav className="space-y-6 text-white/60 text-base">
            <a
              href="#measured"
              className="block hover:text-white transition-colors"
            >
              What is being measured
            </a>

            <a
              href="#monitoring-began"
              className="block hover:text-white transition-colors"
            >
              When monitoring began
            </a>

            <a
              href="#equipment"
              className="block hover:text-white transition-colors"
            >
              Equipment and sensor models
            </a>

            <a
              href="#interval"
              className="block hover:text-white transition-colors"
            >
              Recording interval
            </a>

            <a
              href="#positioning"
              className="block hover:text-white transition-colors"
            >
              Where/how sensors are positioned
            </a>

            <a
              href="#gaps"
              className="block hover:text-white transition-colors"
            >
              Known gaps or equipment changes
            </a>

            <a
              href="#units"
              className="block hover:text-white transition-colors"
            >
              Units and derived measures
            </a>

            <a
              href="#citation"
              className="block hover:text-white transition-colors"
            >
              Preferred citation
            </a>

            <a
              href="#licence"
              className="block hover:text-white transition-colors"
            >
              Licence/access statement
            </a>
          </nav>
        </aside>

        {/* RIGHT COLUMN — Content */}
        <section className="md:col-span-2">

            <div id="#" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              About this archive
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                The Cabilla archive is the start of what will eventually become a network of archives, with Cabilla as the first implementation. It has been designed to provide open access to daily environmental records, alongside controlled access to the original full-resolution sensor observations.
              </p>

              <p>
                The archive will become fully operational once the new monitoring equipment has been installed at Cabilla. This is planned for the end of August, 2026, after which environmental data will begin to be added on a regular basis.
              </p>

              <p>
                In the meantime, this section documents the monitoring approach, equipment, sensor locations, data structure and access arrangements that will underpin the archive.
              </p>
            </div>
            </div>

             <div className="my-12 border-t border-white/10" />

            <div id="measured" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              What is being measured
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Environmental monitoring at Cabilla records local weather
                conditions alongside conditions experienced within the woodland.
              </p>

              <p>
                The core record includes air temperature, relative humidity,
                rainfall and solar radiation. Temperature and humidity are also
                measured beneath the woodland canopy, allowing conditions
                within the rainforest to be compared with those recorded by
                the main weather station.
              </p>

              <p>
                Additional environmental measurements may be introduced over
                time where they contribute to understanding woodland conditions,
                including soil moisture and other measures of water availability.
              </p>
            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="monitoring-began" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              When monitoring began
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                The Wild Clocks environmental record at Cabilla began in
                August 2026, following the installation of the current
                monitoring equipment.
              </p>

              <p>
                Earlier microclimate observations were collected at Cabilla
                during spring and summer 2026 as part of research led by <a href="https://experts.exeter.ac.uk/25502-ruth-warfield" class="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Ruth Warfield</a>, research assistant at <a href="https://www.exeter.ac.uk" class="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Exeter University</a>. These are retained as a separate precursor dataset
                and are not combined with the main Wild Clocks environmental
                record.
              </p>
            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="equipment" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Equipment and sensors
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                The Cabilla observatory uses an <a href="https://ecowitt.com" class="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Ecowitt</a> environmental monitoring system.
              </p>

              <p>
                The installation consists of a main weather station together
                with additional sensors positioned within the woodland. The
                system records atmospheric conditions continuously and
                transmits observations to the Wild Clocks data archive.
              </p>

              <div>
                <p className="mb-2">Current equipment:</p>

                <ul className="list-disc pl-6 space-y-1">
                  <li>Gateway: Ecowitt WS6210S 4G Mobile/Wifi Gateway</li>
                  <li>Rainfall: Ecowitt WH40H Wireless Self-emptying Rain Sensor</li>
                  <li>Temperature and relative humidity: Ecowitt WN32 Primary Temperature & Humidity Sensor</li>
                  <li>Solar radiation: Ecowitt WS68 Wireless Solar Anemometer with Light & UV Sensor</li>
                  <li>Woodland temperature and humidity: Ecowitt WN31 Multi-channel Temperature & Humidity Sensor</li>
                </ul>
              </div>

              <p>
                Equipment details are recorded so that any future changes to
                instrumentation can be identified within the long-term dataset.
              </p>
            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="interval" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Recording interval
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Sensors record environmental conditions at regular intervals throughout the day.
              </p>

              <p>
                The standard recording interval is 5 minutes. These full-resolution observations are preserved in the archive and are also used to produce daily summary records.
              </p>

              <p>
                Daily values are calculated from all valid observations recorded during each calendar day.
              </p>
            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="positioning" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Where/how sensors are positioned
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                The main weather station is positioned in an open location with good exposure to the sky, allowing rainfall and solar radiation to be measured without significant interference from the surrounding canopy.
              </p>

              <p>
                Additional temperature and humidity monitoring is undertaken beneath the woodland canopy to record the microclimate experienced within the rainforest.
              </p>

              <p>
                Sensor positions are intended to remain fixed wherever possible so that measurements remain comparable through time. The position, height and environmental context of each sensor are documented as part of the observatory metadata.
              </p>
            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="gaps" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Known gaps or equipment changes
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Wild Clocks aims to maintain a continuous environmental record, but gaps may occasionally occur because of equipment failure, communications problems, maintenance or changes to instrumentation.
              </p>

              <p>
                Known gaps and significant equipment changes are documented here rather than interpolated or concealed.
              </p>

              <div>
                <p className="mb-2">Record of changes:</p>

                <ul className="list-disc pl-6 space-y-1">
                  <li>28 August 2026 — Wild Clocks environmental monitoring began.</li>
                  <li>29 August 2026 — Intermittent transmission from the woodland temperature and humidity sensor identified.</li>
                  <li>3 September 2026 — Woodland temperature and humidity sensor moved closer to the main weather station to improve signal reception. Sensor now transmitting normally.</li>
                </ul>
              </div>
              <p>
                Where a dataset is incomplete, the original missing values are retained as missing data.
              </p>

            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="units" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Units and derived measures
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Environmental measurements are stored using standard units:
              </p>

              <div>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Air temperature — degrees Celsius (°C)</li>
                  <li>Relative humidity — percent (%)</li>
                  <li>Rainfall — millimetres (mm)</li>
                  <li>Solar radiation — watts per square metre (W/m²)</li>
                  <li>Soil moisture — [unit/method, if introduced]</li>
                </ul>
              </div>

              <p>
                The archive contains both direct sensor observations and derived daily measures.
              </p>

              <p>
                Derived values may include:
              </p>

              <div>
                <ul className="list-disc pl-6 space-y-1">
                  <li>mean daily temperature;</li>
                  <li>maximum and minimum daily temperature;</li>
                  <li>mean relative humidity;</li>
                  <li>daily rainfall total;</li>
                  <li>mean and maximum solar radiation.</li>
                </ul>
              </div>

              <p>
                Derived measures are calculated consistently across Wild Clocks observatories wherever equivalent data are available.
              </p>

            </div>
          </div>

          <div className="my-12 border-t border-white/10" />

          <div id="citation" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Preferred citation
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Researchers using Wild Clocks data are asked to acknowledge both the observatory and Wild Clocks in publications, reports, student projects and other outputs.
              </p>

              <p className="mb-2">Suggested citation:</p>

              <p>
                Wild Clocks (year). <span class="italic">Cabilla environmental monitoring dataset.</span> Thousand Year Trust, Cornwall, UK. [dataset version/date]. CC BY 4.0..
              </p>

              <p>
                Where appropriate, the specific dataset version or date range used should also be included.
              </p>

              <p>
                Please let us know about research or publications that use the dataset. This helps us understand how the archive is being used and maintain a record of research associated with each observatory.
              </p>
            </div>
          </div>          

          <div className="my-12 border-t border-white/10" />

          <div id="licence" className="scroll-mt-24">
            <h2 className="text-xl md:text-3xl font-light mb-7">
              Licence/access statement
            </h2>

            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Wild Clocks environmental data are intended to be openly accessible wherever participating organisations are happy for their data to be shared.
              </p>

              <p>
                Daily environmental records from Cabilla may be viewed and downloaded without requesting permission. Unless otherwise stated, these datasets are made available under the <a href="https://creativecommons.org/licenses/by/4.0/?utm" class="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0 International (CC BY 4.0) licence</a>.
              </p>

              <p>
                This means the data may be copied, analysed, adapted and redistributed, provided appropriate credit is given to Wild Clocks and the participating organisation, a link to the licence is provided, and any changes made to the data are indicated.
              </p>

              <p>
                Full-resolution sensor observations are also retained by Wild Clocks. Access to these data is available on request for projects requiring greater temporal detail. Unless otherwise stated, approved datasets are provided under the same <a href="https://creativecommons.org/licenses/by/4.0/?utm" class="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">CC BY 4.0 licence</a>.
              </p>

              <p>
                Data are provided in good faith as an observational record. Users should review the accompanying metadata, known gaps and equipment history before interpreting the measurements.
              </p>
            </div>
          </div>                   

        </section>
      </div>
    </div>
  );
}