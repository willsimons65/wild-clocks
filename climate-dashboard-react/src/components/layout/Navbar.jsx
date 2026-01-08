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
              About
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-white/70 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY MENU */}
      {open && (
        <div className="fixed top-0 left-0 h-full w-2/3 z-50 bg-black/85 backdrop-blur-none">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col h-full">

            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-12">
              <span className="text-white text-sm tracking-wide">
                
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            {/* NAV LINKS */}
            <nav className="flex flex-col gap-6 text-white text-sm font-light">
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="hover:text-white/80 transition-colors"
              >
                ABOUT WILD CLOCKS
              </Link>

              <Link
                to="/about#contributors"
                onClick={() => setOpen(false)}
                className="hover:text-white/80 transition-colors"
              >
                CONTRIBUTOR'S GUIDE
              </Link>

              <Link
                to="/about#index"
                onClick={() => setOpen(false)}
                className="hover:text-white/80 transition-colors"
              >
                INDEX OF HYGROTHERMY
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}


