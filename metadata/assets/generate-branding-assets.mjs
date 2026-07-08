#!/usr/bin/env node
/**
 * Generate production branding assets for metadata pinning.
 * Outputs metadata/assets/hidden.png and metadata/assets/collection.png
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const GENESIS_DIR = join(ROOT, "public", "genesis");
const OUT_DIR = __dirname;

const CANVAS = 1400;

const PREVIEW_SEVEN_IDS = [
  "000001",
  "000007",
  "000017",
  "000027",
  "000037",
  "000047",
  "000067",
];

async function buildHiddenPng() {
  const svg = `<svg width="${CANVAS}" height="${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="#000000"/>
  <rect x="80" y="80" width="${CANVAS - 160}" height="${CANVAS - 160}" fill="none" stroke="#1a1a1a" stroke-width="1"/>
  <text x="${CANVAS / 2}" y="620" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="128" font-weight="300" letter-spacing="28">THE67</text>
  <text x="${CANVAS / 2}" y="720" text-anchor="middle" fill="#b8b8b8" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="38" font-weight="300" letter-spacing="10">Genesis Citizen</text>
  <text x="${CANVAS / 2}" y="790" text-anchor="middle" fill="#666666" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="24" font-weight="300" letter-spacing="8">Reveal Pending</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(OUT_DIR, "hidden.png"));
}

async function buildThumb(id, size) {
  const path = join(GENESIS_DIR, `${id}.png`);
  return sharp(path)
    .resize(size, size, { fit: "contain", background: "#000000" })
    .png()
    .toBuffer();
}

async function buildCollectionPng() {
  const thumbSize = 168;
  const gap = 20;
  const rowWidth = PREVIEW_SEVEN_IDS.length * thumbSize + (PREVIEW_SEVEN_IDS.length - 1) * gap;
  const offsetX = Math.floor((CANVAS - rowWidth) / 2);
  const offsetY = Math.floor((CANVAS - thumbSize) / 2);

  const composites = [];
  for (let i = 0; i < PREVIEW_SEVEN_IDS.length; i += 1) {
    const thumb = await buildThumb(PREVIEW_SEVEN_IDS[i], thumbSize);
    composites.push({
      input: thumb,
      left: offsetX + i * (thumbSize + gap),
      top: offsetY,
    });
  }

  const titleSvg = Buffer.from(`<svg width="${CANVAS}" height="${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <text x="${CANVAS / 2}" y="180" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="42" font-weight="300" letter-spacing="12">THE67</text>
  <text x="${CANVAS / 2}" y="230" text-anchor="middle" fill="#888888" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="18" font-weight="300" letter-spacing="6">Genesis Citizens</text>
</svg>`);

  composites.push({ input: titleSvg, left: 0, top: 0 });

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 3,
      background: "#000000",
    },
  })
    .composite(composites)
    .png()
    .toFile(join(OUT_DIR, "collection.png"));
}

await buildHiddenPng();
await buildCollectionPng();
console.log("Created metadata/assets/hidden.png");
console.log("Created metadata/assets/collection.png");
