export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const password = String(body.password || "").trim();

  if (!password) {
    return new Response(JSON.stringify({ ok: false, error: "Missing code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1️⃣ Look up the code in KV
  const codeKey = `code:${password}`;
  const record = await env.WC_USERS.get(codeKey, { type: "json" });

  if (!record) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid code" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2️⃣ Log this successful login
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent") || "unknown";
  const now = new Date().toISOString();

  const logKey = `${codeKey}:visits`;
  const visits = (await env.WC_USERS.get(logKey, { type: "json" })) || [];

  visits.push({
    ip,
    userAgent,
    at: now,
  });

  await env.WC_USERS.put(logKey, JSON.stringify(visits));

  // 3️⃣ Set auth cookie (same as before)
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
