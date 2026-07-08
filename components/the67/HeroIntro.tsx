"use client";

import { motion } from "framer-motion";
import { EASE, motionDuration } from "@/lib/the67/motion";

interface HeroIntroProps {
  prefersReducedMotion?: boolean;
}

export function HeroIntro({ prefersReducedMotion = false }: HeroIntroProps) {
  const transitionDuration = motionDuration(2.4, prefersReducedMotion);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-12 text-center"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: transitionDuration, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: motionDuration(1.4, prefersReducedMotion), ease: EASE.exit },
      }}
    >
      <motion.h1
        className="text-[clamp(3.5rem,14vw,9rem)] font-light leading-none tracking-[-0.06em] text-white"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: motionDuration(2, prefersReducedMotion),
            delay: prefersReducedMotion ? 0 : 0.2,
            ease: EASE.entrance,
          },
        }}
      >
        THE67
      </motion.h1>
      <motion.p
        className="text-[10px] font-light tracking-[0.5em] text-white/18 uppercase"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: motionDuration(1.6, prefersReducedMotion),
            delay: prefersReducedMotion ? 0 : 1.8,
            ease: EASE.entrance,
          },
        }}
      >
        Click Anywhere
      </motion.p>
    </motion.div>
  );
}
