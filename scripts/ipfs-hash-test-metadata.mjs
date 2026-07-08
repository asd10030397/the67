#!/usr/bin/env node
/**
 * Print deterministic IPFS CIDs for metadata-test assets.
 * CIDs are valid once the same bytes are pinned to IPFS.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const metadataRoot = path.join(root, "metadata-test");

function hash(paths, extraArgs = []) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(
    npx,
    ["--yes", "ipfs-only-hash@4.0.0", ...extraArgs, ...paths],
    { cwd: root, encoding: "utf8", shell: process.platform === "win32" },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  return result.stdout
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const hidden = hash([path.join(metadataRoot, "hidden.json")])[0];
const contract = hash([path.join(metadataRoot, "contract.json")])[0];
const revealedFiles = ["1.json", "2.json", "3.json"].map((name) =>
  path.join(metadataRoot, "revealed", name),
);
const revealedHashes = hash(revealedFiles, ["--wrap-with-directory"]);
const revealedDir = revealedHashes[revealedHashes.length - 1];

console.log("THE67 Sepolia test metadata CIDs");
console.log("--------------------------------");
console.log(`HIDDEN_METADATA_URI=ipfs://${hidden}`);
console.log(`CONTRACT_URI=ipfs://${contract}`);
console.log(`REVEALED_BASE_URI=ipfs://${revealedDir}/`);
console.log("");
console.log("Gateway checks (after upload/pin):");
console.log(`https://ipfs.io/ipfs/${hidden}`);
console.log(`https://ipfs.io/ipfs/${contract}`);
console.log(`https://ipfs.io/ipfs/${revealedDir}/1.json`);
