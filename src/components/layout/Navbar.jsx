// src/components/layout/Navbar.jsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "@/images/assets/wildclocks-logo-1.svg";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-white/10 bg-[#1E1E1E]/80 backdrop-blur sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={Logo}
            alt="Wild Clocks"
            className="h-12 w-auto"
            loading="eager"
          />
        </Link>
      </div>
    </motion.nav>
  );
}
