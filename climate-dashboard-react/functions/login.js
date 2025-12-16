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

export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const password = String(body.password || "").trim();

  if (!VALID_CODES.has(password)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid code" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const maxAgeSeconds = 60 * 60 * 24;

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": [
        "wc_auth=1",
        "Path=/",
        `Max-Age=${maxAgeSeconds}`,
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
      ].join("; "),
    },
  });
}

