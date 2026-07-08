"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { SCENE_TIMING, type SceneStyle } from "@/lib/the67/constants";

interface SceneDisplayProps {
  lines: string[];
  style: SceneStyle;
  emphasisIndex?: number;
  sceneKey: number;
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
}: SceneDisplayProps) {
  return (
    <motion.div
      key={sceneKey}
      className="pointer-events-none flex min-h-[12rem] items-center justify-center px-14 md:px-20"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: SCENE_TIMING.transitionDuration, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: SCENE_TIMING.transitionDuration * 0.8, ease: EASE.exit },
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
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: isEmpty ? 0 : 1,
                y: 0,
                transition: {
                  duration: SCENE_TIMING.transitionDuration,
                  delay: index * SCENE_TIMING.lineStagger,
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
