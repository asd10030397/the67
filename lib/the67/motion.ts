export const EASE = {
  cinematic: [0.22, 0.03, 0.26, 1] as const,
  entrance: [0.16, 1, 0.3, 1] as const,
  exit: [0.4, 0, 0.2, 1] as const,
} as const;

export const MOTION = {
  enterDelay: 0.35,
  exitPause: 0.2,
} as const;
