// organize-photos.js
import fs from "fs";
import path from "path";

// CHANGE THIS TO LITTLE KNEPP FOLDER
const ROOT = "/Users/willsimons/Documents/wild-clocks/wildclocks/photos/littleknepp";

const files = fs.readdirSync(ROOT);

files.forEach((file) => {
  // UPDATED REGEX FOR LITTLE KNEPP
  const match = file.match(/littleknepp:([^:]+):([^:]+):(\d+)\.png/);
  if (!match) return;

  const [_, year, month, index] = match;

  const monthFolder = path.join(ROOT, year, month);
  if (!fs.existsSync(monthFolder)) {
    fs.mkdirSync(monthFolder, { recursive: true });
  }

  const newPath = path.join(monthFolder, `${index}.png`);
  fs.renameSync(path.join(ROOT, file), newPath);


});

