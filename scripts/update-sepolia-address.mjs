#!/usr/bin/env node
/**
 * Post-deploy helper: wire Sepolia contract address into .env and mint config.
 * Usage: node scripts/update-sepolia-address.mjs 0xYourContractAddress
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const address = process.argv[2];

if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
  console.error("Usage: node scripts/update-sepolia-address.mjs 0xContractAddress");
  process.exit(1);
}

const envPath = path.join(root, ".env");
let envText = fs.readFileSync(envPath, "utf8");
envText = envText
  .replace(/^THE67_GENESIS_ADDRESS=.*$/m, `THE67_GENESIS_ADDRESS=${address}`)
  .replace(
    /^NEXT_PUBLIC_THE67_GENESIS_CONTRACT_ADDRESS=.*$/m,
    `NEXT_PUBLIC_THE67_GENESIS_CONTRACT_ADDRESS=${address}`,
  );
fs.writeFileSync(envPath, envText);

const mintPath = path.join(root, "lib", "participation", "mint.ts");
let mintText = fs.readFileSync(mintPath, "utf8");
mintText = mintText.replace(
  /const SEPOLIA_DEV_FALLBACK_ADDRESS: `0x\$\{string\}` \| null =[\s\S]*?null;/,
  `const SEPOLIA_DEV_FALLBACK_ADDRESS: \`0x\${string}\` | null =\n  process.env.NODE_ENV === "development"\n    ? "${address}"\n    : null;`,
);
fs.writeFileSync(mintPath, mintText);

console.log(`Updated deployment address to ${address}`);
