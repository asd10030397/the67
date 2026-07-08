#!/usr/bin/env node
/**
 * Generate minimal deployment placeholder assets for Sepolia testing.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const genesisDir = path.join(root, "public", "genesis");
const audioDir = path.join(root, "public", "audio");

const GENESIS_IDS = [
  "000001",
  "000007",
  "000017",
  "000027",
  "000037",
  "000047",
  "000067",
];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crc]);
}

function createPlaceholderPng(label) {
  const width = 512;
  const height = 512;
  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);

  const isFigurePixel = (x, y) => {
    const cx = 228;
    const cy = 286;
    const inSix =
      (x - cx) ** 2 + (y - cy) ** 2 <= 88 ** 2 ||
      (x >= 168 && x <= 288 && y >= 220 && y <= 360);
    const inSeven =
      (x >= 292 && x <= 372 && y >= 168 && y <= 212) ||
      (x >= 332 && x <= 372 && y >= 168 && y <= 392);
    return inSix || inSeven;
  };

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 3;
      if (isFigurePixel(x, y)) {
        raw[offset] = 228;
        raw[offset + 1] = 228;
        raw[offset + 2] = 228;
      } else {
        raw[offset] = 0;
        raw[offset + 1] = 0;
        raw[offset + 2] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const textData = Buffer.from(`Genesis ${label} (Sepolia test placeholder)`, "ascii");
  const textChunkData = Buffer.concat([
    Buffer.from("Description\0", "ascii"),
    textData,
  ]);

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("tEXt", textChunkData),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function createAmbientWav() {
  const sampleRate = 44100;
  const durationSeconds = 8;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8, "ascii");
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate;
    const sample =
      Math.sin(2 * Math.PI * 110 * t) * 0.015 +
      Math.sin(2 * Math.PI * 165 * t) * 0.01;
    const value = Math.max(-1, Math.min(1, sample));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }

  return buffer;
}

fs.mkdirSync(genesisDir, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });

for (const id of GENESIS_IDS) {
  const filePath = path.join(genesisDir, `${id}.png`);
  fs.writeFileSync(filePath, createPlaceholderPng(id));
  console.log(`Wrote ${path.relative(root, filePath)}`);
}

const wavPath = path.join(audioDir, "ambient.wav");
fs.writeFileSync(wavPath, createAmbientWav());
console.log(`Wrote ${path.relative(root, wavPath)}`);
