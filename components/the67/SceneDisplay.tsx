"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EASE, motionDuration, motionOffset } from "@/lib/the67/motion";
import { SCENE_TIMING, type SceneStyle } from "@/lib/the67/constants";

interface SceneDisplayProps {
  lines: string[];
  style: SceneStyle;
  emphasisIndex?: number;
  sceneKey: number;
  prefersReducedMotion?: boolean;
}

function getLineClasses(
  style: SceneStyle,
  isEmphasis: boolean,
  isEmpty: boolean,
): string {
  if (isEmpty) return "h-3";

  if (isEmphasis || style === "emphasis") {
    if (isEmphasis) {
      return "text-[clamp(3rem,12vw,7rem)] leading-none tracking-[-0.07em] text-white";
    }
  }

  switch (style) {
    case "opening":
      return "text-[clamp(1rem,2.5vw,1.45rem)] leading-[1.5] tracking-[-0.015em] text-white/65";
    case "revelation":
      return "text-[clamp(1rem,2.4vw,1.5rem)] leading-[1.5] tracking-[-0.015em] text-white/85";
    case "welcome":
      return "text-[clamp(0.95rem,2.2vw,1.35rem)] leading-[1.55] tracking-[-0.015em] text-white/60";
    case "manifesto":
      return "text-[clamp(0.95rem,2.2vw,1.3rem)] leading-[1.45] tracking-[-0.01em] text-white/55";
    case "creator":
      return "text-[clamp(0.88rem,2vw,1.15rem)] leading-[1.65] text-white/55";
    default:
      return "text-[clamp(0.95rem,2.3vw,1.4rem)] leading-[1.5] tracking-[-0.015em] text-white/70";
  }
}

export const SceneDisplay = memo(function SceneDisplay({
  lines,
  style,
  emphasisIndex,
  sceneKey,
  prefersReducedMotion = false,
}: SceneDisplayProps) {
  const transitionDuration = motionDuration(
    SCENE_TIMING.transitionDuration,
    prefersReducedMotion,
  );

  return (
    <motion.div
      key={sceneKey}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 md:px-20"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: transitionDuration, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: transitionDuration * 0.8,
          ease: EASE.exit,
        },
      }}
    >
      <div className="flex max-w-[28rem] flex-col items-center gap-3 text-center">
        {lines.map((line, index) => {
          const isEmpty = line === "";
          const isEmphasis = emphasisIndex === index;

          return (
            <motion.p
              key={`${sceneKey}-${index}`}
              className={`font-light ${getLineClasses(style, isEmphasis, isEmpty)}`}
              initial={{ opacity: 0, y: motionOffset(6, prefersReducedMotion) }}
              animate={{
                opacity: isEmpty ? 0 : 1,
                y: 0,
                transition: {
                  duration: transitionDuration,
                  delay: prefersReducedMotion
                    ? 0
                    : index * SCENE_TIMING.lineStagger,
                  ease: EASE.entrance,
                },
              }}
            >
              {isEmpty ? "\u00A0" : line}
            </motion.p>
          );
        })}
      </div>
    </motion.div>
  );
});
