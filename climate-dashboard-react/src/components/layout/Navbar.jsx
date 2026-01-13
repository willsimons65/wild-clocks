// src/components/layout/Navbar.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "@/images/assets/wildclocks-logo-1.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full border-b border-white/10 bg-[#1E1E1E]/80 backdrop-blur sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={Logo}
              alt="Wild Clocks"
              className="h-12 w-auto"
              loading="eager"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link to="/about" className="hover:text-white transition-colors">
              ABOUT
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
 <button
  onClick={() => setOpen(!open)}
  className="md:hidden p-3 text-white/70 hover:text-white transition-colors"
  aria-label={open ? "Close menu" : "Open menu"}
>
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    className="overflow-visible"
  >
    {/* TOP LINE */}
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      className={`transition-all duration-300 ease-in-out ${
        open ? "rotate-45 translate-y-[6px]" : ""
      }`}
      style={{
        transformOrigin: "center",
        transformBox: "fill-box",
      }}
    />

    {/* MIDDLE LINE */}
    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      className={`transition-opacity duration-200 ${
        open ? "opacity-0" : "opacity-100"
      }`}
    />

    {/* BOTTOM LINE */}
    <line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      className={`transition-all duration-300 ease-in-out ${
        open ? "-rotate-45 -translate-y-[6px]" : ""
      }`}
      style={{
        transformOrigin: "center",
        transformBox: "fill-box",
      }}
    />
  </svg>
</button>


        </div>
      </motion.nav>

        {/* MOBILE OVERLAY MENU */}
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="fixed top-0 left-0 h-full w-2/3 bg-black/85 backdrop-blur-none z-50"
          >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        delay: 0.25,   // ← panel arrives first
        duration: 0.3,
        ease: "easeOut",
      }}
      className="pt-16 px-6 space-y-6"
    >
      <a href="/about" className="block text-white text-sm">
        ABOUT WILD CLOCKS
      </a>

      <a href="/contributors" className="block text-white text-sm">
        CONTRIBUTOR’S GUIDE
      </a>

    </motion.div>
  </motion.div>
)}

    </>
  );
}


