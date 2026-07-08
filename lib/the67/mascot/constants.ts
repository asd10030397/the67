/**
 * Canonical THE67 brand mascot specification.
 * All Genesis Citizens derive from this exact design.
 * This is NOT a citizen — it is the permanent brand character.
 */

/**
 * Genesis Citizens derive from this spec.
 * Citizens add culture, clothing, accessories, and materials on top of
 * the canonical mascot silhouette — never replacing digit anatomy.
 */
export const MASCOT_SPEC = {
  name: "THE67 Mascot",
  version: "1.0.0",
  type: "brand" as const,
  heightTier: "M" as const,
  heightScale: 1.0,
  proportionProfile: "P1",
} as const;

/** Matte vinyl collectible — canonical brand colors only */
export const MASCOT_COLORS = {
  body: "#FFFFFF",
  bodyHighlight: "#F5F5F5",
  bodyShadow: "#E6E6E6",
  bodySeam: "#D4D4D4",
  eye: "#000000",
  void: "#000000",
} as const;

/** Physical scale reference (premium vinyl figure) */
export const MASCOT_SCALE = {
  /** Canonical production height */
  heightMm: 72,
  /** Reference unit for SVG (maps to heightMm) */
  svgUnits: 280,
  eyeDiameterMm: 1.8,
  limbCapsuleWidthMm: 8,
  seamWidthMm: 0.4,
} as const;

/** Anatomy invariants — never change across citizens at base layer */
export const MASCOT_ANATOMY = {
  digitForms: ["6", "7"] as const,
  maxEyes: 4,
  eyesPerDigit: 2,
  hasMouth: false,
  hasNose: false,
  hasEyebrows: false,
  hasClothing: false,
  hasAccessories: false,
  limbStyle: "capsule" as const,
  material: "matte-vinyl" as const,
} as const;

export type MascotView =
  | "front"
  | "side"
  | "back"
  | "threeQuarter"
  | "turnaround"
  | "expression"
  | "material"
  | "scale";

export type MascotPose =
  | "neutral"
  | "curious"
  | "playful"
  | "bold"
  | "gentle"
  | "dreamy";

export const MASCOT_POSES: ReadonlyArray<{
  id: MascotPose;
  label: string;
  description: string;
}> = [
  { id: "neutral", label: "Neutral", description: "Upright canonical stance" },
  { id: "curious", label: "Curious", description: "3° forward lean, one arm raised" },
  { id: "playful", label: "Playful", description: "Slight bounce, both arms lifted" },
  { id: "bold", label: "Bold", description: "Wide stance, squared shoulders" },
  { id: "gentle", label: "Gentle", description: "Soft slump, arms at rest" },
  { id: "dreamy", label: "Dreamy", description: "Light float, weightless balance" },
];

export const TURNAROUND_ANGLES = [
  { label: "Front", view: "front" as const },
  { label: "3/4", view: "threeQuarter" as const },
  { label: "Side", view: "side" as const },
  { label: "3/4 Back", view: "threeQuarter" as const, flip: true },
  { label: "Back", view: "back" as const },
];
