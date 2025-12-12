// src/pages/Home.jsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PlacesGrid from "@/components/home/PlacesGrid";

function Home() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="w-full lg:w-1/2 ml-auto space-y-10">
          <Hero />
          <PlacesGrid />
        </div>
      </main>
    </div>
  );
}

export default React.memo(Home);





