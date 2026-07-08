import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const GENESIS_DIR = join(ROOT, "public", "genesis");
const OUTPUT = join(__dirname, "review-sheet-batch1.png");

const PREVIEW_SEVEN = [
  { token: 1, id: "000001", name: "Genesis Prime", culture: "Nordic Still", quote: "The first to notice." },
  { token: 7, id: "000007", name: "Seventh Sun", culture: "Mediterranean Sun", quote: "Luck is agreed upon." },
  { token: 17, id: "000017", name: "Tide Walker", culture: "Pacific Tide", quote: "Meaning drifts until we anchor it." },
  { token: 27, id: "000027", name: "Canopy", culture: "Amazon Canopy", quote: "Growth is a collective act." },
  { token: 37, id: "000037", name: "Dune", culture: "Saharan Wind", quote: "Value waits in the silence." },
  { token: 47, id: "000047", name: "Lantern", culture: "Indigo Night", quote: "We light what we choose." },
  { token: 67, id: "000067", name: "Horizon", culture: "Horizon Line", quote: "Together is where it begins." },
];

const BATCH_ONE = [
  { token: 2, id: "000002", name: "Ridge", culture: "Andean Stone", quote: "Stone remembers what we share." },
  { token: 3, id: "000003", name: "Mist", culture: "Baltic Fog", quote: "Clarity comes when we wait." },
  { token: 4, id: "000004", name: "Mirage", culture: "Sahel Horizon", quote: "Distance is agreed upon." },
  { token: 5, id: "000005", name: "Summit", culture: "Himalayan Quiet", quote: "Stillness is a kind of answer." },
  { token: 6, id: "000006", name: "Hush", culture: "Arctic Hush", quote: "Silence holds what we mean." },
  { token: 8, id: "000008", name: "Drift", culture: "Steppe Drift", quote: "Movement finds us together." },
  { token: 9, id: "000009", name: "Rhythm", culture: "Monsoon Rhythm", quote: "Rain arrives when we listen." },
  { token: 10, id: "000010", name: "Atoll", culture: "Coral Atoll", quote: "Beauty needs no proof." },
  { token: 11, id: "000011", name: "Loom", culture: "Highland Wool", quote: "Warmth is woven slowly." },
  { token: 12, id: "000012", name: "Delta", culture: "Delta Clay", quote: "Form follows what we hold." },
];

const THUMB = 280;
const COL_WIDTH = 300;
const LABEL_HEIGHT = 108;
const ROW_GAP = 56;
const SECTION_HEADER = 36;
const TITLE_HEIGHT = 52;
const PADDING = 48;
const CELL_TOP_PAD = 12;

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapQuote(quote, maxChars = 34) {
  const words = quote.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function rowWidth(cols) {
  return cols * COL_WIDTH;
}

function centerOffset(rowCols, canvasWidth) {
  return Math.floor((canvasWidth - rowWidth(rowCols)) / 2);
}

const maxCols = Math.max(PREVIEW_SEVEN.length, BATCH_ONE.length);
const canvasWidth = rowWidth(maxCols) + PADDING * 2;
const rowHeight = THUMB + LABEL_HEIGHT + CELL_TOP_PAD;
const canvasHeight =
  PADDING +
  TITLE_HEIGHT +
  SECTION_HEADER +
  rowHeight +
  ROW_GAP +
  SECTION_HEADER +
  rowHeight +
  PADDING;

const previewOffsetX = centerOffset(PREVIEW_SEVEN.length, canvasWidth - PADDING * 2) + PADDING;
const batchOffsetX = centerOffset(BATCH_ONE.length, canvasWidth - PADDING * 2) + PADDING;

const previewRowY = PADDING + TITLE_HEIGHT + SECTION_HEADER;
const batchRowY = previewRowY + rowHeight + ROW_GAP + SECTION_HEADER;

async function buildThumb(id) {
  const path = join(GENESIS_DIR, `${id}.png`);
  return sharp(path).resize(THUMB, THUMB, { fit: "contain", background: "#000000" }).png().toBuffer();
}

const composites = [];
const svgParts = [];

svgParts.push(
  `<text x="${canvasWidth / 2}" y="${PADDING + 34}" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600" letter-spacing="4">THE67 GENESIS — VISUAL CONSISTENCY REVIEW</text>`,
);

svgParts.push(
  `<text x="${PADDING}" y="${PADDING + TITLE_HEIGHT + 24}" fill="#888888" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="3">PREVIEW SEVEN</text>`,
);

for (let i = 0; i < PREVIEW_SEVEN.length; i++) {
  const c = PREVIEW_SEVEN[i];
  const x = previewOffsetX + i * COL_WIDTH;
  const imgX = x + Math.floor((COL_WIDTH - THUMB) / 2);
  const imgY = previewRowY + CELL_TOP_PAD;

  const thumb = await buildThumb(c.id);
  composites.push({ input: thumb, left: imgX, top: imgY });

  const labelX = x + COL_WIDTH / 2;
  const labelY = imgY + THUMB + 18;
  const quoteLines = wrapQuote(c.quote);

  svgParts.push(
    `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600">#${c.token} · ${escapeXml(c.name)}</text>`,
  );
  svgParts.push(
    `<text x="${labelX}" y="${labelY + 18}" text-anchor="middle" fill="#aaaaaa" font-family="Segoe UI, Arial, sans-serif" font-size="11">${escapeXml(c.culture)}</text>`,
  );
  quoteLines.forEach((line, li) => {
    svgParts.push(
      `<text x="${labelX}" y="${labelY + 38 + li * 16}" text-anchor="middle" fill="#666666" font-family="Segoe UI, Arial, sans-serif" font-size="10" font-style="italic">${escapeXml(line)}</text>`,
    );
  });
}

svgParts.push(
  `<text x="${PADDING}" y="${previewRowY + rowHeight + ROW_GAP + 24}" fill="#888888" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="3">BATCH 1</text>`,
);

for (let i = 0; i < BATCH_ONE.length; i++) {
  const c = BATCH_ONE[i];
  const x = batchOffsetX + i * COL_WIDTH;
  const imgX = x + Math.floor((COL_WIDTH - THUMB) / 2);
  const imgY = batchRowY + CELL_TOP_PAD;

  const thumb = await buildThumb(c.id);
  composites.push({ input: thumb, left: imgX, top: imgY });

  const labelX = x + COL_WIDTH / 2;
  const labelY = imgY + THUMB + 18;
  const quoteLines = wrapQuote(c.quote);

  svgParts.push(
    `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600">#${c.token} · ${escapeXml(c.name)}</text>`,
  );
  svgParts.push(
    `<text x="${labelX}" y="${labelY + 18}" text-anchor="middle" fill="#aaaaaa" font-family="Segoe UI, Arial, sans-serif" font-size="11">${escapeXml(c.culture)}</text>`,
  );
  quoteLines.forEach((line, li) => {
    svgParts.push(
      `<text x="${labelX}" y="${labelY + 38 + li * 16}" text-anchor="middle" fill="#666666" font-family="Segoe UI, Arial, sans-serif" font-size="10" font-style="italic">${escapeXml(line)}</text>`,
    );
  });
}

const svg = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">${svgParts.join("")}</svg>`;

await sharp({
  create: {
    width: canvasWidth,
    height: canvasHeight,
    channels: 3,
    background: "#000000",
  },
})
  .composite([...composites, { input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toFile(OUTPUT);

console.log(`Review sheet written: ${OUTPUT}`);
console.log(`Dimensions: ${canvasWidth} × ${canvasHeight}px`);
