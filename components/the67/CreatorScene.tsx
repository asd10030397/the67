"use client";

import { motion } from "framer-motion";
import { EASE, motionDuration, motionOffset } from "@/lib/the67/motion";
import { SCENE_TIMING } from "@/lib/the67/constants";
import { MintGenesisButton } from "@/components/participation/MintGenesisButton";

interface CreatorSceneProps {
  lines: string[];
  prefersReducedMotion?: boolean;
  useExperienceCursor?: boolean;
}

export function CreatorScene({
  lines,
  prefersReducedMotion = false,
  useExperienceCursor = false,
}: CreatorSceneProps) {
  const transitionDuration = motionDuration(1.8, prefersReducedMotion);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 md:px-24"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: transitionDuration, ease: EASE.entrance },
      }}
    >
      <div className="flex max-w-[26rem] flex-col items-center gap-4 text-center">
        {lines.map((line, index) => (
          <motion.p
            key={line}
            className="text-[clamp(0.88rem,2vw,1.15rem)] font-light leading-[1.65] text-white/55"
            initial={{ opacity: 0, y: motionOffset(6, prefersReducedMotion) }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: motionDuration(
                  SCENE_TIMING.transitionDuration,
                  prefersReducedMotion,
                ),
                delay: prefersReducedMotion
                  ? 0
                  : 0.3 + index * SCENE_TIMING.lineStagger,
                ease: EASE.entrance,
              },
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="pointer-events-auto mt-14">
        <MintGenesisButton useExperienceCursor={useExperienceCursor} />
      </div>
    </motion.div>
  );
}
