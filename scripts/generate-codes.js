// scripts/generate-codes.js

const PREFIX = "w1ldth1ng";
const COUNT = 100;

const codes = new Set();

while (codes.size < COUNT) {
  const num = Math.floor(1000 + Math.random() * 9000); // 1000–9999
  codes.add(`${PREFIX}${num}`);
}

console.log([...codes].sort().join("\n"));
