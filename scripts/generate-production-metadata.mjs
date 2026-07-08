#!/usr/bin/env node
/**
 * Generate production metadata/1.json … metadata/67.json from approved Genesis specs.
 * Does not upload to Pinata or modify deployment configuration.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const metadataDir = path.join(root, "metadata");
const productionDir = path.join(root, "genesis-production");

/** Production artwork directory CID (pinned to IPFS) */
const IMAGE_IPFS_BASE =
  "ipfs://bafybeiaelnp7fcq2l5xjakzc27lrejapg3gvigfg5tqv66fyufpghwmh5u";

const PREVIEW_SEVEN = [
  {
    tokenId: 1,
    id: "000001",
    name: "Genesis Prime",
    culture: "Nordic Still",
    origin: "Nordic Still",
    generation: "Genesis",
    material: "Matte Vinyl",
    bodyColors: "Pure white body, soft ash limb accents",
    clothing: "None — canonical founding form",
    accessories: "Single minimal star stud on 6 head (Slot A)",
    personality: "Still — upright neutral stance",
    quote: "The first to notice.",
    imagePath: "/genesis/000001.png",
  },
  {
    tokenId: 7,
    id: "000007",
    name: "Seventh Sun",
    culture: "Mediterranean Sun",
    origin: "Mediterranean Sun",
    generation: "Genesis",
    material: "Matte Vinyl with glazed ceramic trim",
    bodyColors: "Warm cream body, sand gold waist trim",
    clothing: "Thin gold collar wrap at waist seam only",
    accessories: "Small golden disc held in right capsule hand (Slot C)",
    personality: "Curious — slight forward lean",
    quote: "Luck is agreed upon.",
    imagePath: "/genesis/000007.png",
  },
  {
    tokenId: 17,
    id: "000017",
    name: "Tide Walker",
    culture: "Pacific Tide",
    origin: "Pacific Tide",
    generation: "Genesis",
    material: "Matte Vinyl",
    bodyColors: "Ocean teal body, soft white highlight on 6 belly",
    clothing: "Minimal teal wave-pattern sash at waist (12% coverage)",
    accessories: "Tiny pearl-white shell at waist belt (Slot B)",
    personality: "Gentle — soft relaxed stance",
    quote: "Meaning drifts until we anchor it.",
    imagePath: "/genesis/000017.png",
  },
  {
    tokenId: 27,
    id: "000027",
    name: "Canopy",
    culture: "Amazon Canopy",
    origin: "Amazon Canopy",
    generation: "Genesis",
    material: "Matte Vinyl body, wool felt limb texture",
    bodyColors: "Moss green body, darker green felt capsule limbs",
    clothing: "None on digit silhouette",
    accessories: "Small stylized leaf in left hand (Slot C)",
    personality: "Playful — one arm slightly raised",
    quote: "Growth is a collective act.",
    imagePath: "/genesis/000027.png",
  },
  {
    tokenId: 37,
    id: "000037",
    name: "Dune",
    culture: "Saharan Wind",
    origin: "Saharan Wind",
    generation: "Genesis",
    material: "Paper clay matte finish vinyl",
    bodyColors: "Clay terracotta body, sand gold accent dots",
    clothing: "Woven desert sash at waist seam",
    accessories: "Small pouch at waist (Slot B)",
    personality: "Bold — wide stance",
    quote: "Value waits in the silence.",
    imagePath: "/genesis/000037.png",
  },
  {
    tokenId: 47,
    id: "000047",
    name: "Lantern",
    culture: "Indigo Night",
    origin: "Indigo Night",
    generation: "Genesis",
    material: "Translucent resin with 15% inner glow",
    bodyColors: "Dusk violet body, soft internal violet glow",
    clothing: "None",
    accessories: "Tiny lantern held in hand (Slot C)",
    personality: "Dreamy — light float pose",
    quote: "We light what we choose.",
    imagePath: "/genesis/000047.png",
  },
  {
    tokenId: 67,
    id: "000067",
    name: "Horizon",
    culture: "Horizon Line",
    origin: "Horizon Line",
    generation: "Genesis",
    material: "Premium matte vinyl",
    bodyColors: "Pure white body, signal coral accent trim",
    clothing: "Single coral ribbon wrap at waist",
    accessories: "Minimal coral thread at 7 head (Slot A)",
    personality: "Neutral — canonical heroic presence",
    quote: "Together is where it begins.",
    imagePath: "/genesis/000067.png",
  },
];

function loadBatchCitizens() {
  const citizens = [];
  for (let batch = 1; batch <= 6; batch += 1) {
    const file = path.join(productionDir, `batch-0${batch}.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    citizens.push(...data.citizens);
  }
  return citizens;
}

function buildDescription(citizen) {
  return `${citizen.quote} — ${citizen.name} is a THE67 Genesis Citizen from ${citizen.culture}.`;
}

function buildAttributes(citizen) {
  return [
    { trait_type: "Citizen ID", value: citizen.id },
    { trait_type: "Culture", value: citizen.culture },
    { trait_type: "Generation", value: citizen.generation },
    { trait_type: "Material", value: citizen.material },
    { trait_type: "Body Colors", value: citizen.bodyColors },
    { trait_type: "Clothing", value: citizen.clothing },
    { trait_type: "Accessories", value: citizen.accessories },
    { trait_type: "Personality", value: citizen.personality },
    { trait_type: "Quote", value: citizen.quote },
  ];
}

function buildMetadata(citizen) {
  const imageFile = path.basename(citizen.imagePath);
  return {
    name: `THE67 Genesis Citizen #${citizen.tokenId} — ${citizen.name}`,
    description: buildDescription(citizen),
    image: `${IMAGE_IPFS_BASE}/${imageFile}`,
    attributes: buildAttributes(citizen),
  };
}

function findDuplicates(citizens) {
  const fields = ["name", "quote", "culture"];
  const duplicates = {};

  for (const field of fields) {
    const seen = new Map();
    const dups = [];
    for (const c of citizens) {
      const value = c[field];
      if (seen.has(value)) {
        dups.push({ field, value, tokens: [seen.get(value), c.tokenId] });
      } else {
        seen.set(value, c.tokenId);
      }
    }
    duplicates[field] = dups;
  }

  const attributeDuplicates = [];
  const attrMaps = {
    Material: new Map(),
    "Body Colors": new Map(),
    Clothing: new Map(),
    Accessories: new Map(),
    Personality: new Map(),
  };

  for (const c of citizens) {
    const attrs = buildAttributes(c);
    for (const attr of attrs) {
      const map = attrMaps[attr.trait_type];
      if (!map) continue;
      if (map.has(attr.value)) {
        attributeDuplicates.push({
          trait_type: attr.trait_type,
          value: attr.value,
          tokens: [map.get(attr.value), c.tokenId],
        });
      } else {
        map.set(attr.value, c.tokenId);
      }
    }
  }

  return { ...duplicates, attributes: attributeDuplicates };
}

function expectedImageUri(tokenId) {
  const padded = String(tokenId).padStart(6, "0");
  return `${IMAGE_IPFS_BASE}/${padded}.png`;
}

function validateMetadataFiles() {
  const errors = [];
  for (let tokenId = 1; tokenId <= 67; tokenId += 1) {
    const file = path.join(metadataDir, `${tokenId}.json`);
    if (!fs.existsSync(file)) {
      errors.push(`Missing file: ${tokenId}.json`);
      continue;
    }
    try {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      const required = ["name", "description", "image", "attributes"];
      for (const key of required) {
        if (!(key in data)) errors.push(`${tokenId}.json missing field: ${key}`);
      }
      if (!Array.isArray(data.attributes) || data.attributes.length === 0) {
        errors.push(`${tokenId}.json attributes must be a non-empty array`);
      }
      for (const attr of data.attributes ?? []) {
        if (!attr.trait_type || attr.value === undefined) {
          errors.push(`${tokenId}.json has invalid attribute entry`);
        }
      }
      if (!data.image.startsWith("ipfs://")) {
        errors.push(`${tokenId}.json image must use ipfs:// URI`);
      }
      const expected = expectedImageUri(tokenId);
      if (data.image !== expected) {
        errors.push(
          `${tokenId}.json image URI mismatch: expected ${expected}, got ${data.image}`,
        );
      }
    } catch (err) {
      errors.push(`${tokenId}.json parse error: ${err.message}`);
    }
  }
  return errors;
}

function main() {
  const batchCitizens = loadBatchCitizens();
  const allCitizens = [...PREVIEW_SEVEN, ...batchCitizens].sort(
    (a, b) => a.tokenId - b.tokenId,
  );

  if (allCitizens.length !== 67) {
    throw new Error(`Expected 67 citizens, found ${allCitizens.length}`);
  }

  const tokenIds = allCitizens.map((c) => c.tokenId);
  const uniqueIds = new Set(tokenIds);
  if (uniqueIds.size !== 67) {
    throw new Error("Duplicate token IDs in citizen registry");
  }
  for (let i = 1; i <= 67; i += 1) {
    if (!uniqueIds.has(i)) {
      throw new Error(`Missing token ID: ${i}`);
    }
  }

  fs.mkdirSync(metadataDir, { recursive: true });

  for (const citizen of allCitizens) {
    const metadata = buildMetadata(citizen);
    const outPath = path.join(metadataDir, `${citizen.tokenId}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(metadata, null, 2)}\n`);
  }

  const validationErrors = validateMetadataFiles();
  const duplicates = findDuplicates(allCitizens);

  const report = {
    generatedAt: new Date().toISOString(),
    totalFiles: 67,
    imageBase: IMAGE_IPFS_BASE,
    validation: {
      passed: validationErrors.length === 0,
      errors: validationErrors,
    },
    duplicates: {
      names: duplicates.name,
      quotes: duplicates.quote,
      cultures: duplicates.culture,
      attributes: duplicates.attributes,
    },
  };

  fs.writeFileSync(
    path.join(metadataDir, "validation-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  console.log("Production metadata generated.");
  console.log(`  Output: metadata/1.json … metadata/67.json`);
  console.log(`  Image base: ${IMAGE_IPFS_BASE}`);
  console.log(`  Validation: ${validationErrors.length === 0 ? "PASSED" : "FAILED"}`);

  if (validationErrors.length > 0) {
    for (const err of validationErrors) console.log(`    - ${err}`);
    process.exit(1);
  }

  console.log("");
  console.log("Duplicate report:");
  console.log(`  Names: ${duplicates.name.length}`);
  console.log(`  Quotes: ${duplicates.quote.length}`);
  console.log(`  Cultures: ${duplicates.culture.length}`);
  console.log(`  Attribute value pairs: ${duplicates.attributes.length}`);
  console.log("");
  console.log(`Full report: metadata/validation-report.json`);
}

main();
