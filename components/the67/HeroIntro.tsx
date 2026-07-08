"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";

export function HeroIntro() {
  return (
    <motion.div
      className="pointer-events-none flex flex-col items-center gap-10 text-center"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1.8, delay: 0.3, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 1.2, ease: EASE.exit },
      }}
    >
      <h1 className="text-[clamp(5rem,16vw,11rem)] font-light leading-none tracking-[-0.06em] text-white">
        67
      </h1>
      <p className="text-[10px] font-light tracking-[0.48em] text-white/22 uppercase">
        Click Anywhere
      </p>
    </motion.div>
  );
}
