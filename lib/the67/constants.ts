export type SceneStyle =
  | "intro"
  | "opening"
  | "emphasis"
  | "manifesto"
  | "revelation"
  | "welcome"
  | "creator";

export type SceneType = "intro" | "text" | "gallery" | "creator";

export interface TextScene {
  id: number;
  type: "text";
  lines: string[];
  style: SceneStyle;
  /** Line index rendered with emphasis styling */
  emphasisIndex?: number;
}

export interface GalleryScene {
  id: number;
  type: "gallery";
}

export interface CreatorScene {
  id: number;
  type: "creator";
  lines: string[];
}

export interface IntroScene {
  id: number;
  type: "intro";
}

export type ExperienceScene =
  | IntroScene
  | TextScene
  | GalleryScene
  | CreatorScene;

export const EXPERIENCE_SCENES: ExperienceScene[] = [
  { id: 1, type: "intro" },
  {
    id: 2,
    type: "text",
    style: "opening",
    lines: [
      "You've probably seen 67 before.",
      "You just never noticed.",
      "67 is simply...",
      "67.",
    ],
    emphasisIndex: 3,
  },
  {
    id: 3,
    type: "text",
    style: "revelation",
    lines: [
      "People search for meaning.",
      "Sometimes meaning already exists.",
      "Sometimes people create it together.",
    ],
  },
  {
    id: 4,
    type: "text",
    style: "manifesto",
    lines: [
      "Gold.",
      "Money.",
      "Collectibles.",
      "Memes.",
      "",
      "None of them have value",
      "until enough people agree.",
    ],
  },
  {
    id: 5,
    type: "text",
    style: "emphasis",
    lines: [
      "THE67 is an experiment.",
      "",
      "Not about money.",
      "Not about promises.",
      "",
      "About participation.",
    ],
    emphasisIndex: 0,
  },
  { id: 6, type: "gallery" },
  {
    id: 7,
    type: "text",
    style: "welcome",
    lines: [
      "If life feels meaningless...",
      "or if you're simply looking for something different...",
      "",
      "You're welcome here.",
      "",
      "Meaning doesn't always exist first.",
      "",
      "Sometimes...",
      "it begins because people choose to create it together.",
    ],
  },
  {
    id: 8,
    type: "creator",
    lines: [
      "I don't know where THE67 will go.",
      "I don't know what it will become.",
      "But if you decide to stay...",
      "I sincerely hope you find what you're looking for.",
      "That's all.",
    ],
  },
];

export const SCENE_TIMING = {
  transitionDuration: 1.4,
  lineStagger: 0.12,
  introFadeDuration: 1.6,
} as const;

/** @deprecated Legacy ending flow — replaced by CreatorScene */
export const ENDING_TIMING = {
  transitionDuration: SCENE_TIMING.transitionDuration,
  blackoutFadeMs: 1400,
  particleFreezeMs: 2000,
} as const;

/** @deprecated */
export interface EndingBeat {
  lines: string[];
  style: SceneStyle;
}

/** @deprecated */
export const ENDING_BEATS: EndingBeat[] = (() => {
  const creator = EXPERIENCE_SCENES.find((scene) => scene.type === "creator");
  if (creator?.type === "creator") {
    return [{ lines: creator.lines, style: "creator" }];
  }
  return [];
})();

/** @deprecated */
export function getEndingBeatDuration(style: SceneStyle): number {
  return style === "creator" ? 8000 : 5000;
}

/** @deprecated Legacy story beats — replaced by EXPERIENCE_SCENES */
export type BeatStyle =
  | SceneStyle
  | "question"
  | "pause"
  | "agreement"
  | "attribution"
  | "prelude"
  | "epitaph";

/** @deprecated */
export interface StoryBeat {
  primary: string;
  secondary?: string;
  style: BeatStyle;
}

/** @deprecated */
export const STORY_BEATS: StoryBeat[] = [];

/** @deprecated */
export const STORY_TIMING = SCENE_TIMING;

export const PARTICLE_CONFIG = {
  baseCount: 140,
  maxCount: 300,
  repulsionRadius: 100,
  repulsionStrength: 6,
  returnDamping: 0.94,
  minSize: 6,
  maxSize: 28,
  minOpacity: 0.02,
  maxOpacity: 0.1,
  minSpeed: 0.08,
  maxSpeed: 0.35,
  convergeLerp: 0.032,
  dissolveLerp: 0.028,
  formedHoldMs: 3000,
  convergeFontScale: 0.42,
  parallaxStrength: 0.008,
} as const;

export const CURSOR_LERP = 0.52;

export function getSceneCount(): number {
  return EXPERIENCE_SCENES.length;
}
