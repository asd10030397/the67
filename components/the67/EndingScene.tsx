"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import {
  ENDING_BEATS,
  ENDING_TIMING,
  getEndingBeatDuration,
  type EndingBeat,
} from "@/lib/the67/constants";
import { JoinExperimentButton } from "./JoinExperimentButton";

const beatVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ENDING_TIMING.transitionDuration,
      delay: 0.4,
      ease: EASE.entrance,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ENDING_TIMING.transitionDuration * 0.9,
      ease: EASE.exit,
    },
  },
};

function getLineClasses(beat: EndingBeat, lineIndex: number): string {
  const { style } = beat;

  if (style === "epitaph") {
    return lineIndex === 0
      ? "text-[clamp(1.1rem,2.8vw,1.75rem)] leading-[1.58] tracking-[-0.02em] text-white/70"
      : "mt-3 text-[clamp(1.15rem,3vw,1.85rem)] leading-[1.55] tracking-[-0.02em] text-white";
  }

  if (style === "creator") {
    return "text-[clamp(0.9rem,2.1vw,1.25rem)] leading-[1.75] tracking-[-0.003em] text-white/65";
  }

  if (style === "welcome" && lineIndex === beat.lines.length - 1) {
    return "mt-2 text-[clamp(1rem,2.4vw,1.45rem)] leading-[1.6] tracking-[-0.01em] text-white/90";
  }

  if (style === "understanding" && lineIndex === 2) {
    return "text-[clamp(0.95rem,2.2vw,1.35rem)] leading-[1.65] italic text-white/45";
  }

  if (style === "understanding" && lineIndex === beat.lines.length - 1) {
    return "mt-1 text-[clamp(1rem,2.4vw,1.45rem)] leading-[1.6] text-white/85";
  }

  return "text-[clamp(0.95rem,2.2vw,1.35rem)] leading-[1.7] tracking-[-0.006em] text-white/70";
}

const EndingBeatDisplay = memo(function EndingBeatDisplay({
  beat,
  beatIndex,
}: {
  beat: EndingBeat;
  beatIndex: number;
}) {
  return (
    <motion.div
      key={beatIndex}
      variants={beatVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex flex-col items-center text-center ${
        beat.style === "creator"
          ? "max-w-[30rem] gap-3.5"
          : beat.style === "epitaph"
            ? "max-w-[28rem] gap-2"
            : "max-w-[32rem] gap-5"
      }`}
    >
      {beat.lines.map((line, i) => (
        <p key={i} className={`font-light ${getLineClasses(beat, i)}`}>
          {line}
        </p>
      ))}
    </motion.div>
  );
});

export function EndingScene() {
  const [beatIndex, setBeatIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleAdvance = useCallback(
    (index: number) => {
      clearTimer();
      const beat = ENDING_BEATS[index];
      const duration = getEndingBeatDuration(beat.style);

      if (index >= ENDING_BEATS.length - 1) {
        timerRef.current = setTimeout(() => {
          setShowButton(true);
        }, duration + ENDING_TIMING.epitaphHoldBeforeButtonMs);
        return;
      }

      timerRef.current = setTimeout(() => {
        setBeatIndex(index + 1);
      }, duration);
    },
    [clearTimer],
  );

  useEffect(() => {
    scheduleAdvance(beatIndex);
    return clearTimer;
  }, [beatIndex, scheduleAdvance, clearTimer]);

  const currentBeat = ENDING_BEATS[beatIndex];

  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-14 md:px-24">
      <div className="flex min-h-[18rem] items-center justify-center">
        <AnimatePresence mode="wait">
          {currentBeat && !showButton && (
            <EndingBeatDisplay
              key={beatIndex}
              beat={currentBeat}
              beatIndex={beatIndex}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex min-h-[8rem] items-start justify-center">
        <JoinExperimentButton visible={showButton} />
      </div>
    </div>
  );
}
