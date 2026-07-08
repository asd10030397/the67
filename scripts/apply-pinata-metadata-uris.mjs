#!/usr/bin/env node
/**
 * Apply Pinata CIDs to .env and verify public gateways.
 * No local IPFS daemon required.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const cidsPath = path.join(root, "metadata-test", "pinata-cids.json");

function normalizeCid(value) {
  if (!value) return null;
  const trimmed = value.trim().replace(/^ipfs:\/\//, "").replace(/\/$/, "");
  return trimmed.length > 0 ? trimmed : null;
}

function loadCidsFromFile() {
  if (!fs.existsSync(cidsPath)) {
    throw new Error(
      "metadata-test/pinata-cids.json not found. Run npm run pinata:prepare-metadata first.",
    );
  }

  const json = JSON.parse(fs.readFileSync(cidsPath, "utf8"));
  return {
    hidden: normalizeCid(json.hidden),
    contract: normalizeCid(json.contract),
    revealed: normalizeCid(json.revealedDirectory || json.revealed),
  };
}

function loadCidsFromArgs() {
  const [hidden, contract, revealed] = process.argv.slice(2).map(normalizeCid);
  return { hidden, contract, revealed };
}

async function verifyGateway(cid, suffix = "") {
  const url = `https://ipfs.io/ipfs/${cid}${suffix}`;
  const response = await fetch(url, { redirect: "follow" });
  const text = await response.text();

  if (!response.ok || !text || text.length < 2) {
    throw new Error(`${url} -> ${response.status}`);
  }

  return url;
}

function updateEnv(hiddenCid, contractCid, revealedCid) {
  if (!fs.existsSync(envPath)) {
    throw new Error(".env not found");
  }

  let envText = fs.readFileSync(envPath, "utf8");
  envText = envText
    .replace(/^HIDDEN_METADATA_URI=.*$/m, `HIDDEN_METADATA_URI=ipfs://${hiddenCid}`)
    .replace(/^CONTRACT_URI=.*$/m, `CONTRACT_URI=ipfs://${contractCid}`)
    .replace(
      /^REVEALED_BASE_URI=.*$/m,
      `REVEALED_BASE_URI=ipfs://${revealedCid}/`,
    );
  fs.writeFileSync(envPath, envText);
}

const fromArgs = process.argv.slice(2);
const cids =
  fromArgs.length >= 3 ? loadCidsFromArgs() : loadCidsFromFile();

if (!cids.hidden || !cids.contract || !cids.revealed) {
  console.error("Missing one or more CIDs.");
  console.error("Fill metadata-test/pinata-cids.json or pass:");
  console.error(
    "  npm run pinata:apply-metadata-uris -- <hiddenCid> <contractCid> <revealedDirectoryCid>",
  );
  process.exit(1);
}

updateEnv(cids.hidden, cids.contract, cids.revealed);

const verified = [];
const failures = [];

for (const [label, cid, suffix] of [
  ["hidden", cids.hidden, ""],
  ["contract", cids.contract, ""],
  ["revealed/1.json", cids.revealed, "/1.json"],
]) {
  try {
    verified.push(await verifyGateway(cid, suffix));
  } catch (error) {
    failures.push(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

console.log("Updated .env:");
console.log(`  HIDDEN_METADATA_URI=ipfs://${cids.hidden}`);
console.log(`  CONTRACT_URI=ipfs://${cids.contract}`);
console.log(`  REVEALED_BASE_URI=ipfs://${cids.revealed}/`);
console.log("");
console.log("Verified gateways:");
for (const url of verified) console.log(`  ${url}`);

if (failures.length > 0) {
  console.log("");
  console.log("Gateway checks failed:");
  for (const failure of failures) console.log(`  ${failure}`);
  process.exit(1);
}
