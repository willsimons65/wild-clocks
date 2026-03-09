export const PLACES = [
  {
    slug: "little-knepp",
    name: "Little Knepp",
    shortName: "Knepp",
  },
  {
    slug: "appleton-woods",
    name: "Appleton Woods",
    shortName: "Appleton",
  },
  // Future sites:
  // {
  //   slug: "cabilla",
  //   name: "Cabilla Wood",
  //   shortName: "Cabilla",
  // },
  // {
  //   slug: "mornacott",
  //   name: "Mornacott Estate",
  //   shortName: "Mornacott",
  // },
];

export function getPlaceBySlug(slug) {
  return PLACES.find((place) => place.slug === slug) || null;
}