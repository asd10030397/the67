"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { STORY_TIMING, type StoryBeat } from "@/lib/the67/constants";

interface StoryDisplayProps {
  beat: StoryBeat;
  beatIndex: number;
}

const sentenceVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: STORY_TIMING.transitionDuration,
      delay: 0.2,
      ease: EASE.entrance,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: STORY_TIMING.transitionDuration * 0.8,
      ease: EASE.exit,
    },
  },
};

function getTextClasses(style: StoryBeat["style"]): string {
  switch (style) {
    case "emphasis":
      return "text-[clamp(5rem,18vw,12rem)] leading-none tracking-[-0.07em]";
    case "opening":
      return "max-w-[22rem] text-[clamp(1rem,2.5vw,1.5rem)] leading-[1.5] tracking-[-0.015em] text-white/65";
    case "revelation":
      return "max-w-[26rem] text-[clamp(1rem,2.4vw,1.55rem)] leading-[1.5] tracking-[-0.015em] text-white/90";
    case "question":
      return "max-w-[20rem] text-[clamp(1.05rem,2.6vw,1.65rem)] leading-[1.45] tracking-[-0.02em] text-white/75";
    case "pause":
      return "text-[clamp(1.2rem,3vw,1.9rem)] leading-[1.4] italic text-white/45";
    case "agreement":
      return "text-[clamp(1rem,2.5vw,1.6rem)] leading-[1.35] tracking-[-0.02em] text-white/80";
    case "manifesto":
      return "text-[clamp(0.95rem,2.2vw,1.4rem)] leading-[1.45] tracking-[-0.01em] text-white/65";
    default:
      return "max-w-[20rem] text-[clamp(0.95rem,2.3vw,1.45rem)] leading-[1.45] tracking-[-0.015em] text-white/75";
  }
}

export const StoryDisplay = memo(function StoryDisplay({
  beat,
  beatIndex,
}: StoryDisplayProps) {
  const textClasses = getTextClasses(beat.style);

  return (
    <div className="pointer-events-none flex min-h-[10rem] items-center justify-center px-14 md:px-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={beatIndex}
          variants={sentenceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex max-w-[26rem] flex-col items-center gap-4 text-center"
        >
          <p className={`font-light text-white ${textClasses}`}>{beat.primary}</p>
          {beat.secondary && (
            <p className="text-[clamp(0.9rem,2vw,1.25rem)] font-light leading-[1.45] text-white/35">
              {beat.secondary}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
