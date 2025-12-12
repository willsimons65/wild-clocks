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
      {/* Thumbnail */}
      <div className="md:w-1/2 w-full">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover md:h-auto"
        />
      </div>

      {/* Text */}
      <div className="md:w-1/2 w-full p-8 flex flex-col justify-top">
        <h2 className="text-2xl font-normal mb-3">{title}</h2>
        <p className="text-lg text-white/80">{location}</p>
        <p className="text-white/60 mb-6">{country}</p>

        <p className="text-white/70 text-base">Latitude: {latitude}</p>
        <p className="text-white/70 text-base mt-1">Altitude: {altitude}</p>
      </div>
    </Link>
  );
}

