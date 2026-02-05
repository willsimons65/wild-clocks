// src/services/auth.js

export async function loginWithCode(code) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: code }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Invalid access code");
  }

  // ✅ CLIENT FLAG (routing only)
  localStorage.setItem("wc_auth", "1");

  return true;
}

export function isAuthenticated() {
  // 🔓 Public launch — authentication disabled
  return true;
}


export function logout() {
  localStorage.removeItem("wc_auth");
}
