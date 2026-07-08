"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";

export function HeroIntro() {
  return (
    <motion.div
      className="pointer-events-none flex flex-col items-center gap-12 text-center"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 2.4, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 1.4, ease: EASE.exit },
      }}
    >
      <motion.h1
        className="text-[clamp(3.5rem,14vw,9rem)] font-light leading-none tracking-[-0.06em] text-white"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 2, delay: 0.2, ease: EASE.entrance },
        }}
      >
        THE67
      </motion.h1>
      <motion.p
        className="text-[10px] font-light tracking-[0.5em] text-white/18 uppercase"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 1.6, delay: 1.8, ease: EASE.entrance },
        }}
      >
        Click Anywhere
      </motion.p>
    </motion.div>
  );
}
