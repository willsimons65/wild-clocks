import { thousandYearTrustArchive } from "./sites/thousand-year-trust.js";

export const archiveRegistry = {
  [thousandYearTrustArchive.siteKey]: thousandYearTrustArchive,
};

export function getArchiveConfig(siteKey) {
  return archiveRegistry[siteKey] ?? null;
}

export function hasArchiveConfig(siteKey) {
  return Boolean(archiveRegistry[siteKey]);
}