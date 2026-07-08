#!/usr/bin/env node
/**
 * Upload metadata-test assets to a public IPFS pinning endpoint.
 * Tries multiple endpoints. For Sepolia deployment testing only.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const metadataRoot = path.join(root, "metadata-test");

const endpoints = [
  { name: "filedrop", upload: "https://filedrop.besoeasy.com/upload", zip: "https://filedrop.besoeasy.com/uploadzip" },
  { name: "originless", upload: "https://originless.besoeasy.com/upload", zip: "https://originless.besoeasy.com/uploadzip" },
  { name: "ipfs.bot", upload: "https://ipfs.bot/api/publish", zip: null },
];

async function fetchUpload(url, filePath) {
  const form = new FormData();
  const blob = new Blob([fs.readFileSync(filePath)]);
  form.append("file", blob, path.basename(filePath));

  const response = await fetch(url, { method: "POST", body: form });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${url} -> ${response.status} ${text}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${url} returned non-JSON: ${text}`);
  }

  return json.cid || json.IpfsHash;
}

function curlUpload(url, filePath) {
  const curl = process.platform === "win32" ? "curl.exe" : "curl";
  const result = spawnSync(
    curl,
    ["-s", "-k", "-X", "POST", "-F", `file=@${filePath}`, url],
    { cwd: root, encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || `curl failed for ${filePath}`);
  }

  const json = JSON.parse(result.stdout.trim());
  return json.cid || json.IpfsHash;
}

async function uploadWithFallback(filePath, zip = false) {
  const errors = [];
  for (const endpoint of endpoints) {
    const url = zip ? endpoint.zip : endpoint.upload;
    if (!url) continue;

    try {
      try {
        const cid = await fetchUpload(url, filePath);
        if (cid) return { cid, endpoint: endpoint.name };
      } catch (fetchError) {
        const cid = curlUpload(url, filePath);
        if (cid) return { cid, endpoint: endpoint.name };
        throw fetchError;
      }
    } catch (error) {
      errors.push(`${endpoint.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`All upload endpoints failed:\n${errors.join("\n")}`);
}

function ensureRevealedZip() {
  const zipPath = path.join(metadataRoot, "revealed.zip");
  if (fs.existsSync(zipPath)) return zipPath;

  const result = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${path.join(metadataRoot, "revealed", "*")}' -DestinationPath '${zipPath}' -Force`,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || "Failed to create revealed.zip");
  }

  return zipPath;
}

const hidden = await uploadWithFallback(path.join(metadataRoot, "hidden.json"));
const contract = await uploadWithFallback(path.join(metadataRoot, "contract.json"));
const revealedZip = ensureRevealedZip();
const revealed = await uploadWithFallback(revealedZip, true);

console.log("Upload complete.");
console.log(`hidden via ${hidden.endpoint}: ipfs://${hidden.cid}`);
console.log(`contract via ${contract.endpoint}: ipfs://${contract.cid}`);
console.log(`revealed via ${revealed.endpoint}: ipfs://${revealed.cid}/`);
console.log("");
console.log(".env values:");
console.log(`HIDDEN_METADATA_URI=ipfs://${hidden.cid}`);
console.log(`CONTRACT_URI=ipfs://${contract.cid}`);
console.log(`REVEALED_BASE_URI=ipfs://${revealed.cid}/`);
