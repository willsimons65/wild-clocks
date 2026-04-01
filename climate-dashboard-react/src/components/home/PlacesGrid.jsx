// src/components/home/PlacesGrid.jsx

import React, { useState } from "react";
import PlaceCard from "./PlaceCard";
import { places } from "@/data/places";

export default function PlacesGrid() {
  const [openCardSlug, setOpenCardSlug] = useState(null);

  function handleToggle(slug) {
    setOpenCardSlug((current) => (current === slug ? null : slug));
  }

  return (
    <section className="w-full mt-12 px-0 lg:px-6">
      <div className="w-full lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-6">
        {places.map((place) => (
          <PlaceCard
            key={place.slug}
            {...place}
            isOpen={openCardSlug === place.slug}
            onToggle={() => handleToggle(place.slug)}
          />
        ))}
      </div>
    </section>
  );
}

