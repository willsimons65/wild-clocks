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
        border border-white/5
        shadow-lg
        transition-all duration-300
        hover:shadow-xl
        hover:-translate-y-0.5
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
            h-40 md:h-full
            object-cover
          "
        />
      </div>

      {/* TEXT */}
      <div
        className="
          w-full md:w-1/2
          p-4 md:p-8
          flex flex-col justify-center
          text-left
        "
      >
        <h2 className="text-xl md:text-2xl font-normal mb-2 md:mb-3">
          {title}
        </h2>

        <p className="text-base md:text-lg text-white/80">{location}</p>
        <p className="text-white/60 mb-4 md:mb-6">{country}</p>

        <p className="text-white/60 text-sm">
          Latitude: {latitude}
        </p>
        <p className="text-white/60 text-sm mt-1">
          Altitude: {altitude}
        </p>
      </div>
    </Link>
  );
}
