// src/components/home/PlaceCard.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function PlaceCard({
  title,
  image,
  location,
  country,
  latitude,
  altitude,
  url,
}) {
  return (
    <Link
      to={url}
      className="
        flex flex-col md:flex-row
        bg-[#2A2A2A]
        rounded-3xl overflow-hidden
        shadow-lg hover:shadow-xl
        transition-all duration-300
        border border-white/5
      "
    >
      {/* IMAGE */}
      <div className="w-full md:w-1/2">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="
            w-full 
            h-40 md:h-full    /* ⭐ shorter landscape image on mobile */
            object-cover
          "
        />
      </div>

      {/* TEXT */}
      <div
        className="
          w-full md:w-1/2
          p-4 md:p-8       /* ⭐ smaller padding on mobile */
          flex flex-col justify-center
          text-center md:text-left  /* ⭐ center text on mobile, left on desktop */
        "
      >
        <h2 className="text-xl md:text-2xl font-normal mb-2 md:mb-3">
          {title}
        </h2>

        <p className="text-base md:text-lg text-white/80">{location}</p>
        <p className="text-white/60 mb-4 md:mb-6">{country}</p>

        <p className="text-white/70 text-sm md:text-base">
          Latitude: {latitude}
        </p>
        <p className="text-white/70 text-sm md:text-base mt-1">
          Altitude: {altitude}
        </p>
      </div>
    </Link>
  );
}


