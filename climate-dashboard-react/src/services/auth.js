// src/services/auth.js

export async function loginWithCode(password) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Invalid access code");
  }

  return true;
}

export function isAuthenticated() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith("wc_auth="));
}

export function logoutLocal() {
  // Client-side helper (you can add a /logout function later if you want)
  document.cookie =
    "wc_auth=; Path=/; Max-Age=0; SameSite=Lax; Secure";
}
