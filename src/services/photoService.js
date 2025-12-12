export function getPhotoUrls(place, year, month, count = 4) {
  const base = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

  const cleanMonth = month.toLowerCase(); // "April" → "april"

  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    return `${base}/${place}/${year}/${cleanMonth}/${index}.png`;
  });
}
