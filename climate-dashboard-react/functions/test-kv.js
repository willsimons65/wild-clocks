export async function onRequestGet({ env }) {
  await env.WC_USERS.put("test", "KV is working");
  const value = await env.WC_USERS.get("test");

  return new Response(`Stored value: ${value}`);
}
