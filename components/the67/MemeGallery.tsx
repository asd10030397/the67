"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { STORY_TIMING } from "@/lib/the67/constants";

export function MemeGallery() {
  return (
    <motion.div
      className="relative z-10 flex h-full w-full flex-col items-center justify-center px-14 md:px-24"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: STORY_TIMING.sceneFadeDuration, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: STORY_TIMING.sceneFadeDuration, ease: EASE.exit },
      }}
      role="presentation"
    >
      <div className="flex max-w-lg flex-col gap-10 text-center">
        <motion.div
          className="flex flex-col gap-7"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 2, delay: 0.6, ease: EASE.entrance },
          }}
        >
          <p className="text-[clamp(1.05rem,2.5vw,1.55rem)] font-light leading-[1.62] tracking-[-0.015em] text-white/75">
            Before THE67, the number 67 already existed.
          </p>
          <p className="text-[clamp(1rem,2.3vw,1.4rem)] font-light leading-[1.65] tracking-[-0.01em] text-white/50">
            A symbol without origin.
            <br />
            Without definition.
          </p>
          <p className="text-[clamp(1rem,2.3vw,1.4rem)] font-light leading-[1.65] tracking-[-0.01em] text-white/40">
            Recognized by millions.
            <br />
            Owned by no one.
          </p>
        </motion.div>

        <motion.p
          className="text-[10px] font-light tracking-[0.42em] text-white/20 uppercase"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2.5, duration: 1.5, ease: EASE.entrance },
          }}
        >
          Click to continue
        </motion.p>
      </div>
    </motion.div>
  );
}
