// upload-r2.js
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import cliProgress from "cli-progress";
import dotenv from "dotenv";

dotenv.config(); // Load .env

// ---------------------
// CONFIGURATION
// ---------------------

const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const ENDPOINT   = process.env.R2_S3_ENDPOINT;
const BUCKET     = process.env.R2_BUCKET_NAME;

// Change these per upload
const PLACE = "appletonwoods";   // folder name in R2
const YEAR  = "2025";
const MONTH = "january";         // lowercase

// Local folder
const LOCAL_FOLDER = `./photos/${PLACE}/${YEAR}/${MONTH}`;

// ---------------------
// CLOUDLARE R2 (S3 API)
// ---------------------

const s3 = new AWS.S3({
  endpoint: ENDPOINT,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  signatureVersion: "v4",
  region: "auto",
});

// ---------------------
// UPLOAD SCRIPT
// ---------------------

async function upload() {
  if (!fs.existsSync(LOCAL_FOLDER)) {
    console.error("❌ Folder not found:", LOCAL_FOLDER);
    process.exit(1);
  }

  const files = fs
    .readdirSync(LOCAL_FOLDER)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log("⚠️ No image files found:", LOCAL_FOLDER);
    return;
  }

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(files.length, 0);

  for (let i = 0; i < files.length; i++) {
    const localFile = files[i];
    const remoteFileName = `${i + 1}.png`;

    const localPath = path.join(LOCAL_FOLDER, localFile);
    const buffer = fs.readFileSync(localPath);

    const r2Key = `${PLACE}/${YEAR}/${MONTH}/${remoteFileName}`;

    await s3
      .putObject({
        Bucket: BUCKET,
        Key: r2Key,
        Body: buffer,
        ContentType: "image/png",
      })
      .promise();

    bar.update(i + 1);
  }

  bar.stop();
}

upload().catch(console.error);
