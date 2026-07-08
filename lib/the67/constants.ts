export type BeatStyle =
  | "opening"
  | "question"
  | "statement"
  | "pause"
  | "emphasis"
  | "manifesto"
  | "agreement"
  | "revelation";

export interface StoryBeat {
  primary: string;
  secondary?: string;
  style: BeatStyle;
}

export const STORY_BEATS: StoryBeat[] = [
  { primary: "You've probably seen this before.", style: "opening" },
  { primary: "You just didn't notice.", style: "opening" },
  { primary: "67.", style: "emphasis" },
  { primary: "What is 67?", style: "question" },

  { primary: "Nobody knows.", style: "statement" },
  { primary: "No definition.", secondary: "No purpose.", style: "statement" },
  { primary: "67 is simply...", style: "pause" },
  { primary: "67.", style: "emphasis" },

  { primary: "Why did millions repeat it?", style: "question" },
  { primary: "Why imitate the meaningless?", style: "question" },
  { primary: "Maybe...", style: "pause" },
  { primary: "Meaning was never required.", style: "revelation" },

  {
    primary: "Gold has value",
    secondary: "because people agree.",
    style: "agreement",
  },
  {
    primary: "Money has value",
    secondary: "because people agree.",
    style: "agreement",
  },
  {
    primary: "Symbols spread",
    secondary: "because people agree.",
    style: "agreement",
  },
  { primary: "Value begins with belief.", style: "revelation" },

  { primary: "Every generation creates symbols.", style: "manifesto" },
  { primary: "Some become flags.", secondary: "Some become currencies.", style: "manifesto" },
  { primary: "Some disappear.", style: "manifesto" },
  { primary: "67 became one.", style: "revelation" },

  { primary: "This isn't about a number.", style: "statement" },
  {
    primary: "Can the meaningless become meaningful",
    secondary: "if enough people believe together?",
    style: "revelation",
  },
];

export type EndingBeatStyle =
  | "reflection"
  | "welcome"
  | "understanding"
  | "invitation"
  | "creator"
  | "epitaph";

export interface EndingBeat {
  lines: [string] | [string, string];
  style: EndingBeatStyle;
}

export const ENDING_BEATS: EndingBeat[] = [
  {
    lines: [
      "Meaning doesn't appear on its own.",
      "It appears when people create it together.",
    ],
    style: "reflection",
  },
  {
    lines: [
      "If life has ever felt meaningless...",
      "or you've wanted something to change...",
    ],
    style: "welcome",
  },
  { lines: ["you're welcome here."], style: "welcome" },
  {
    lines: [
      "You don't have to understand 67.",
      "You don't have to believe in it.",
    ],
    style: "understanding",
  },
  {
    lines: ["Sometimes...", "people simply create something together."],
    style: "understanding",
  },
  { lines: ["And that's enough."], style: "understanding" },
  {
    lines: [
      "THE67 isn't asking you to buy something.",
      "It isn't asking you to believe in a number.",
    ],
    style: "invitation",
  },
  { lines: ["It's simply an invitation."], style: "invitation" },
  {
    lines: [
      "I don't know where THE67 will end.",
      "I don't know what it will become.",
    ],
    style: "creator",
  },
  {
    lines: [
      "But if you choose to become part of it,",
      "I sincerely hope...",
    ],
    style: "creator",
  },
  {
    lines: ["that one day,", "you find what you've been looking for."],
    style: "creator",
  },
  {
    lines: ["No reason.", "No promise."],
    style: "creator",
  },
  { lines: ["I simply hope you do."], style: "creator" },
  {
    lines: [
      "Maybe meaning was never discovered.",
      "Maybe we created it together.",
    ],
    style: "epitaph",
  },
];

export function getEndingBeatDuration(style: EndingBeatStyle): number {
  return ENDING_TIMING.beatDurations[style];
}

export const ENDING_TIMING = {
  beatDurations: {
    reflection: 9000,
    welcome: 8000,
    understanding: 8500,
    invitation: 8000,
    creator: 9000,
    epitaph: 14000,
  },
  blackoutFadeMs: 2800,
  epitaphHoldBeforeButtonMs: 7000,
  transitionDuration: 1.8,
} as const;

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

export const STORY_TIMING = {
  displayDuration: 4500,
  openingDuration: 3800,
  pauseDuration: 4000,
  emphasisDuration: 3500,
  revelationDuration: 5500,
  transitionDuration: 1.4,
  introFadeDuration: 1.6,
} as const;

export const CURSOR_LERP = 0.34;

export function getBeatDuration(style: BeatStyle): number {
  switch (style) {
    case "opening":
      return STORY_TIMING.openingDuration;
    case "pause":
      return STORY_TIMING.pauseDuration;
    case "emphasis":
      return STORY_TIMING.emphasisDuration;
    case "revelation":
      return STORY_TIMING.revelationDuration;
    default:
      return STORY_TIMING.displayDuration;
  }
}
