export function createReviewToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export async function hashToken(token) {
  const encoded = new TextEncoder().encode(token);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoded
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}