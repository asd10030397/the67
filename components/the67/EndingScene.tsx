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

interface EndingSceneProps {
  onParticleFreeze: (frozen: boolean) => void;
}

const beatVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ENDING_TIMING.transitionDuration,
      delay: 0.35,
      ease: EASE.entrance,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ENDING_TIMING.transitionDuration,
      ease: EASE.exit,
    },
  },
};

function getLineClasses(style: EndingBeat["style"]): string {
  if (style === "creator") {
    return "text-[clamp(0.88rem,2vw,1.2rem)] leading-[1.7] text-white/60";
  }

  if (style === "welcome") {
    return "text-[clamp(0.95rem,2.2vw,1.3rem)] leading-[1.5] text-white/65";
  }

  if (style === "emphasis") {
    return "text-[clamp(1.1rem,2.8vw,1.7rem)] leading-[1.48] text-white";
  }

  return "text-[clamp(0.9rem,2.1vw,1.3rem)] leading-[1.5] text-white/68";
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
      className="flex max-w-[26rem] flex-col items-center gap-4 text-center"
    >
      {beat.lines.map((line, i) => (
        <p key={i} className={`font-light ${getLineClasses(beat.style)}`}>
          {line}
        </p>
      ))}
    </motion.div>
  );
});

export function EndingScene({ onParticleFreeze }: EndingSceneProps) {
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
          onParticleFreeze(true);
          timerRef.current = setTimeout(() => {
            setShowButton(true);
            onParticleFreeze(false);
          }, ENDING_TIMING.particleFreezeMs);
        }, duration);
        return;
      }

      timerRef.current = setTimeout(() => {
        setBeatIndex(index + 1);
      }, duration);
    },
    [clearTimer, onParticleFreeze],
  );

  useEffect(() => {
    scheduleAdvance(beatIndex);
    return clearTimer;
  }, [beatIndex, scheduleAdvance, clearTimer]);

  useEffect(() => {
    return () => onParticleFreeze(false);
  }, [onParticleFreeze]);

  const currentBeat = ENDING_BEATS[beatIndex];

  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-14 md:px-24">
      <div className="flex min-h-[10rem] items-center justify-center">
        <AnimatePresence mode="wait">
          {currentBeat && (
            <EndingBeatDisplay
              key={beatIndex}
              beat={currentBeat}
              beatIndex={beatIndex}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex min-h-[7rem] items-start justify-center">
        <JoinExperimentButton visible={showButton} />
      </div>
    </div>
  );
}
