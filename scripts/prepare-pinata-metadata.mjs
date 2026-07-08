#!/usr/bin/env node
/**
 * Prepare metadata-test assets for manual Pinata upload.
 * No local IPFS daemon required.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const metadataRoot = path.join(root, "metadata-test");
const zipPath = path.join(metadataRoot, "revealed.zip");
const cidsTemplatePath = path.join(metadataRoot, "pinata-cids.json");

function ensureRevealedZip() {
  if (fs.existsSync(zipPath)) return;

  const revealedDir = path.join(metadataRoot, "revealed");
  const result = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${path.join(revealedDir, "*")}' -DestinationPath '${zipPath}' -Force`,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || "Failed to create metadata-test/revealed.zip");
  }
}

if (!fs.existsSync(cidsTemplatePath)) {
  fs.writeFileSync(
    cidsTemplatePath,
    `${JSON.stringify(
      {
        hidden: "",
        contract: "",
        revealedDirectory: "",
      },
      null,
      2,
    )}\n`,
  );
}

ensureRevealedZip();

console.log("Pinata upload package ready.");
console.log("");
console.log("Upload these three assets in Pinata (https://app.pinata.cloud):");
console.log("  1. metadata-test/hidden.json");
console.log("  2. metadata-test/contract.json");
console.log("  3. metadata-test/revealed.zip  (directory upload — must contain 1.json, 2.json, 3.json)");
console.log("");
console.log("After each upload, copy the returned CID into:");
console.log("  metadata-test/pinata-cids.json");
console.log("");
console.log("Then run:");
console.log("  npm run pinata:apply-metadata-uris");
console.log("");
console.log("Or pass CIDs directly:");
console.log(
  "  npm run pinata:apply-metadata-uris -- <hiddenCid> <contractCid> <revealedDirectoryCid>",
);
