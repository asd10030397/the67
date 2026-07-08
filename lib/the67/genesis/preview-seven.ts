/**
 * Genesis Preview Seven — official announcement campaign citizens.
 * Each derives strictly from MASCOT_SPEC silhouette.
 */

export const GENESIS_PREVIEW_IDS = [
  "000001",
  "000007",
  "000017",
  "000027",
  "000037",
  "000047",
  "000067",
] as const;

export type GenesisPreviewId = (typeof GENESIS_PREVIEW_IDS)[number];

export interface GenesisPreviewCitizen {
  id: GenesisPreviewId;
  name: string;
  origin: string;
  quote: string;
  culture: string;
  generation: string;
  material: string;
  bodyColors: string;
  clothing: string;
  accessories: string;
  personality: string;
  imagePrompt: string;
  imagePath: string;
}

export const GENESIS_PREVIEW_SEVEN: GenesisPreviewCitizen[] = [
  {
    id: "000001",
    name: "Genesis Prime",
    origin: "Nordic Still",
    quote: "The first to notice.",
    culture: "Nordic Still",
    generation: "Genesis",
    material: "Matte Vinyl",
    bodyColors: "Pure white body, soft ash limb accents",
    clothing: "None — canonical founding form",
    accessories: "Single minimal star stud on 6 head (Slot A)",
    personality: "Still — upright neutral stance",
    imagePrompt:
      "Professional museum product photography of a premium matte vinyl designer collectible toy. THE67 Genesis Citizen 000001. Body formed entirely by cute inflated digits 6 and 7 as one mascot — 6 is left round belly digit, 7 is right diagonal digit, connected at soft waist seam. Pure white matte vinyl body, tiny black dot eyes only (four dots total), no mouth no nose no eyebrows no human face. Short rounded capsule arms and legs. One tiny star stud accessory on the 6 head only. No clothing. Front three-quarter view, centered full figure. Pure black studio background. Soft museum gallery product lighting, subtle matte highlights. High-end designer art toy aesthetic. One figure only. Square 1:1 composition.",
    imagePath: "/genesis/000001.png",
  },
  {
    id: "000007",
    name: "Seventh Sun",
    origin: "Mediterranean Sun",
    quote: "Luck is agreed upon.",
    culture: "Mediterranean Sun",
    generation: "Genesis",
    material: "Matte Vinyl with glazed ceramic trim",
    bodyColors: "Warm cream body, sand gold waist trim",
    clothing: "Thin gold collar wrap at waist seam only",
    accessories: "Small golden disc held in right capsule hand (Slot C)",
    personality: "Curious — slight forward lean",
    imagePrompt:
      "Professional museum product photography of a premium matte vinyl designer collectible toy. THE67 Genesis Citizen 000007. Body formed entirely by inflated digits 6 and 7 mascot character — 6 left round torso, 7 right diagonal torso, waist connected. Warm cream matte vinyl body with subtle sand gold trim at waist collar only. Tiny black dot eyes only, no mouth no nose. Rounded capsule limbs. Holds one small golden disc in stub hand. Slight curious forward lean pose. Front three-quarter view, centered. Pure black studio background. Museum product photography lighting. High-end designer toy. One figure only. Square composition.",
    imagePath: "/genesis/000007.png",
  },
  {
    id: "000017",
    name: "Tide Walker",
    origin: "Pacific Tide",
    quote: "Meaning drifts until we anchor it.",
    culture: "Pacific Tide",
    generation: "Genesis",
    material: "Matte Vinyl",
    bodyColors: "Ocean teal body, soft white highlight on 6 belly",
    clothing: "Minimal teal wave-pattern sash at waist (12% coverage)",
    accessories: "Tiny pearl-white shell at waist belt (Slot B)",
    personality: "Gentle — soft relaxed stance",
    imagePrompt:
      "Professional museum product photography of premium matte vinyl designer collectible toy. THE67 Genesis Citizen 000017. Digit 6 and 7 form entire cute mascot body — recognizable 67 silhouette unchanged. Ocean teal matte vinyl, soft white highlight on round 6 belly. Tiny black dot eyes only, no face features. Rounded capsule arms and legs. Minimal teal wave sash at waist only. Tiny white shell accessory on waist. Gentle relaxed standing pose. Front three-quarter view. Pure black studio background. Museum gallery lighting. Designer art toy quality. One figure. Square composition.",
    imagePath: "/genesis/000017.png",
  },
  {
    id: "000027",
    name: "Canopy",
    origin: "Amazon Canopy",
    quote: "Growth is a collective act.",
    culture: "Amazon Canopy",
    generation: "Genesis",
    material: "Matte Vinyl body, wool felt limb texture",
    bodyColors: "Moss green body, darker green felt capsule limbs",
    clothing: "None on digit silhouette",
    accessories: "Small stylized leaf in left hand (Slot C)",
    personality: "Playful — one arm slightly raised",
    imagePrompt:
      "Professional museum product photography of premium matte vinyl designer collectible toy. THE67 Genesis Citizen 000027. Body is digits 6 and 7 forming cute mascot — unchanged official 67 silhouette. Moss green matte vinyl digit body, slightly darker green felt-textured capsule arms and legs. Four tiny black dot eyes only, no mouth. Holds small simple leaf in one stub hand. Playful pose one arm raised. Front three-quarter view. Pure black studio background. Museum product lighting. High-end collectible toy. One figure only. Square 1:1.",
    imagePath: "/genesis/000027.png",
  },
  {
    id: "000037",
    name: "Dune",
    origin: "Saharan Wind",
    quote: "Value waits in the silence.",
    culture: "Saharan Wind",
    generation: "Genesis",
    material: "Paper clay matte finish vinyl",
    bodyColors: "Clay terracotta body, sand gold accent dots",
    clothing: "Woven desert sash at waist seam",
    accessories: "Small pouch at waist (Slot B)",
    personality: "Bold — wide stance",
    imagePrompt:
      "Professional museum product photography of premium designer collectible toy. THE67 Genesis Citizen 000037. Entire body formed by digits 6 and 7 as cute vinyl mascot, official silhouette preserved. Clay terracotta matte paper-clay texture body, sand gold micro accents. Tiny black dot eyes only. Rounded capsule limbs. Woven desert sash at waist, small waist pouch accessory. Bold wide stance. Front three-quarter view. Pure black studio background. Museum photography lighting. Art toy collectible. One figure. Square composition.",
    imagePath: "/genesis/000037.png",
  },
  {
    id: "000047",
    name: "Lantern",
    origin: "Indigo Night",
    quote: "We light what we choose.",
    culture: "Indigo Night",
    generation: "Genesis",
    material: "Translucent resin with 15% inner glow",
    bodyColors: "Dusk violet body, soft internal violet glow",
    clothing: "None",
    accessories: "Tiny lantern held in hand (Slot C)",
    personality: "Dreamy — light float pose",
    imagePrompt:
      "Professional museum product photography of premium designer collectible toy. THE67 Genesis Citizen 000047. Body formed by digits 6 and 7 mascot — canonical 67 shape. Dusk violet translucent matte resin with subtle inner glow at 15% opacity. Tiny black dot eyes only, no mouth. Capsule limbs. Holds tiny minimalist lantern in stub hand. Dreamy slight floating balanced pose. Front three-quarter view. Pure black studio background. Museum gallery lighting with soft violet rim light. High-end art toy. One figure. Square 1:1.",
    imagePath: "/genesis/000047.png",
  },
  {
    id: "000067",
    name: "Horizon",
    origin: "Horizon Line",
    quote: "Together is where it begins.",
    culture: "Horizon Line",
    generation: "Genesis",
    material: "Premium matte vinyl",
    bodyColors: "Pure white body, signal coral accent trim",
    clothing: "Single coral ribbon wrap at waist",
    accessories: "Minimal coral thread at 7 head (Slot A)",
    personality: "Neutral — canonical heroic presence",
    imagePrompt:
      "Professional museum product photography of premium matte vinyl designer collectible toy. THE67 Genesis Citizen 000067 — capstone genesis figure. Body entirely formed by digits 6 and 7 as iconic cute mascot, official THE67 silhouette unchanged. Pure white premium matte vinyl with signal coral accent trim at waist ribbon and tiny coral mark on 7 head. Four tiny black dot eyes only. No mouth nose or human features. Rounded capsule limbs. Upright heroic neutral stance. Front three-quarter view, centered, commanding presence. Pure black studio background. Museum product photography lighting. Ultimate high-end designer toy aesthetic. One figure only. Square composition.",
    imagePath: "/genesis/000067.png",
  },
];

export function getGenesisPreviewCitizen(
  id: string,
): GenesisPreviewCitizen | undefined {
  return GENESIS_PREVIEW_SEVEN.find((citizen) => citizen.id === id);
}
