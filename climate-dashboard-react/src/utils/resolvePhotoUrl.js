export function resolvePhotoUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  // Legacy public folder images should stay local
  if (path.startsWith("/photos/")) {
    return path;
  }

  const base = import.meta.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  if (!base) return path;

  return `${base}/${cleanPath}`;
}