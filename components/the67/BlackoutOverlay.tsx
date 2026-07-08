"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { ENDING_TIMING } from "@/lib/the67/constants";

interface BlackoutOverlayProps {
  active: boolean;
}

export function BlackoutOverlay({ active }: BlackoutOverlayProps) {
  if (!active) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[8] bg-black"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: ENDING_TIMING.blackoutFadeMs / 1000,
          ease: EASE.cinematic,
        },
      }}
      aria-hidden="true"
    />
  );
}
