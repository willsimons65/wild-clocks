// src/components/home/PlacesGrid.jsx

import React from "react";
import PlaceCard from "./PlaceCard";

import LittleKneppThumb from "@/images/hero/littleknepp-hero.jpg";
import AppletonThumb from "@/images/hero/appleton-hero.jpg";

export default function PlacesGrid() {
  const places = [
    {
      title: "Little Knepp",
      image: LittleKneppThumb,
      location: "Oxfordshire",
      country: "UK",
      latitude: "51.7°N",
      altitude: "96m",
      url: "/little-knepp",
    },
    {
      title: "Appleton Woods",
      image: AppletonThumb,
      location: "Oxfordshire",
      country: "UK",
      latitude: "51.7°N",
      altitude: "96m",
      url: "/appleton-woods",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-10 mt-10">
      {places.map((place) => (
        <PlaceCard key={place.title} {...place} />
      ))}
    </section>
  );
}


