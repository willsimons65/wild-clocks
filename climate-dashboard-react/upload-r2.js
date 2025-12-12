// upload-r2.js

import fs from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import cliProgress from "cli-progress";
import dotenv from "dotenv";
import mime from "mime-types";

dotenv.config();

const {
  LOCAL_PHOTO_ROOT,
  R2_S3_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME
} = process.env;

if (!LOCAL_PHOTO_ROOT) throw new Error("LOCAL_PHOTO_ROOT missing in .env");

const PLACE = "littleknepp";
const YEAR = "2025";
const MONTH = "december";

const DRY_RUN = process.argv.includes("--dry-run");
const LOCAL_FOLDER = path.join(LOCAL_PHOTO_ROOT, PLACE, YEAR, MONTH);

// --- R2 client ---
const s3 = new S3Client({
  region: "auto",
  endpoint: R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// --- Upload process ---
async function upload() {
  const entries = await fs.readdir(LOCAL_FOLDER);
  const files = entries.filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

  if (files.length === 0) {
    console.log("⚠️ No images found.");
    return;
  }

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(files.length, 0);

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const localPath = path.join(LOCAL_FOLDER, fileName);
    const body = await fs.readFile(localPath);

    const r2Key = `${PLACE}/${YEAR}/${MONTH}/${fileName}`;
    const contentType = mime.lookup(fileName) || "application/octet-stream";

    if (!DRY_RUN) {
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: r2Key,
          Body: body,
          ContentType: contentType,
        })
      );
    }

    bar.update(i + 1);
  }

  bar.stop();
  console.log("✅ Upload complete");
}

upload().catch(console.error);


