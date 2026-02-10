// src/components/layout/HomeFooter.jsx

import ContactIcon from "@/images/assets/contact.svg?react";
import BlueskyIcon from "@/images/assets/bluesky.png";

export default function HomeFooter() {
  return (
    <footer className="mt-24">

      {/* Full-width divider */}
      <div className="border-t border-white/10 w-full" />

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 py-12 flex items-center justify-center gap-10">

        {/* CONTACT */}
        <a
          href="mailto:will.simons@icloud.com?subject=Wild%20Clocks"
          className="flex items-center gap-3 text-sm font-thin text-white/50 hover:text-white transition"
        >
          <ContactIcon className="w-6 h-6 opacity-80" />

          {/* Desktop label */}
          <span className="hidden md:inline">
            for collaborations, questions, or shared observations
          </span>

          {/* Mobile label */}
          <span className="md:hidden">
            get in touch
          </span>
        </a>

        {/* BLUESKY */}
        <a
          href="https://bsky.app/profile/betweenclock.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm font-thin text-white/50 hover:text-white transition"
        >
          <img src={BlueskyIcon} alt="Bluesky" className="w-6 h-5 opacity-90" />
          <span>bluesky</span>
        </a>

      </div>
    </footer>
  );
}


