import AppletonThumb from "@/images/hero/appleton-hero.jpg";
import LittleKneppThumb from "@/images/hero/littleknepp-hero.jpg";
import CabillaThumb from "@/images/hero/cabilla-hero.jpg";

export const places = [
  {
    slug: "appleton-woods",
    name: "Appleton Woods",
    shortName: "Appleton",
    image: AppletonThumb,
    location: "Oxfordshire",
    country: "UK",
    latitude: "51.7°N",
    altitude: "96m",
    url: "/appleton-woods",
    description: "Ancient woodland in Oxfordshire with a strong bluebell season.",
    sentinel: "Sentinel for spring woodland timing.",
    steward: {
      name: "Earth Trust",
      url: "https://earthtrust.org.uk",
    },
    tracking: ["Bluebells", "Canopy development", "Seasonal timing"],
  },
  {
    slug: "thousand-year-trust",
    name: "Thousand Year Trust",
    shortName: "TYT",
    image: CabillaThumb,
    location: "Cornwall",
    country: "UK",
    latitude: "50.5°N",
    altitude: "290m",
    url: "/thousand-year-trust",
    description: "Temperate rainforest in a steep-sided valley on Bodmin Moor.",
    sentinel: "Sentinel for Atlantic rainforest recovery.",
    steward: {
      name: "Thousand Year Trust",
      url: "https://thousandyeartrust.org",
    },
    tracking: ["Canopy development", "Ground flora", "Moisture balance"],
  },
  {
    slug: "little-knepp",
    name: "Little Knepp",
    shortName: "Knepp",
    image: LittleKneppThumb,
    location: "Oxfordshire",
    country: "UK",
    latitude: "51.7°N",
    altitude: "96m",
    url: "/little-knepp",
    description: "Private garden in rural Oxfordshire.",
    sentinel: null,
    steward: null,
    tracking: ["Flowering", "Rainfall", "Seasonal timing"],
  },
].sort((a, b) => a.name.localeCompare(b.name));

export function getPlaceBySlug(slug) {
  return places.find((place) => place.slug === slug) || null;
}