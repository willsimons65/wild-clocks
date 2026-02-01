// src/utils/queryState.js

export function getQueryParam(searchParams, key) {
  const v = searchParams.get(key);
  return v == null ? null : v;
}

export function getQueryNumber(searchParams, key) {
  const raw = searchParams.get(key);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function getQueryEnum(searchParams, key, allowed) {
  const raw = searchParams.get(key);
  if (raw == null) return null;
  return allowed.includes(raw) ? raw : null;
}

export function setQueryParams(searchParams, updates) {
  const next = new URLSearchParams(searchParams);

  Object.entries(updates).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") next.delete(k);
    else next.set(k, String(v));
  });

  return next;
}
