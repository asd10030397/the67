"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";

interface JoinExperimentButtonProps {
  visible: boolean;
}

export function JoinExperimentButton({ visible }: JoinExperimentButtonProps) {
  if (!visible) return null;

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 2, delay: 0.5, ease: EASE.entrance },
      }}
    >
      <button
        type="button"
        className="cursor-none border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/80 uppercase transition-colors duration-1000 hover:border-white/30 hover:text-white md:px-14"
        aria-label="I Choose to Participate"
      >
        I Choose to Participate
      </button>

      <p className="text-[10px] font-light tracking-[0.1em] text-white/25">
        Document your participation.
      </p>
    </motion.div>
  );
}
