// Cloudflare Pages Function: POST /login
// Checks the access code and, if valid, sets a 24h auth cookie.

const VALID_CODES = new Set([
  "w1ldth1ng1084",
  "w1ldth1ng1394",
  "w1ldth1ng1459",
  "w1ldth1ng1481",
  "w1ldth1ng1509",
  "w1ldth1ng1560",
  "w1ldth1ng1751",
  "w1ldth1ng1777",
  "w1ldth1ng1866",
  "w1ldth1ng1967",
]);

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const password = String(body.password || "").trim();

  // VALID_CODES should be a secret set in Cloudflare dashboard, e.g.
  // "w1ldth1ng4829,w1ldth1ng9371,w1ldth1ng1204"
  const raw = env.VALID_CODES || "";
  const validCodes = raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const isValid = validCodes.includes(password);

  if (!isValid) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid code" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 24 hours
  const maxAgeSeconds = 60 * 60 * 24;

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  headers.append(
    "Set-Cookie",
    [
      "wc_auth=1",
      "Path=/",
      `Max-Age=${maxAgeSeconds}`,
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
    ].join("; ")
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers,
  });
}
