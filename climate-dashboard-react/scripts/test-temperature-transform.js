import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { transformTemperatureMonth } from "../src/data/temperature/transformTemperature.js";

// Needed because you're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load raw aggregate JSON
const rawPath = path.join(
  __dirname,
  "../src/data/aggregates/little-knepp.json"
);

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

// Call the transformer
const result = transformTemperatureMonth(raw, 2025, 2);

// Log it nicely
console.log(
  JSON.stringify(result, null, 2)
);
