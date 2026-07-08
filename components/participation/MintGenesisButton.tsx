"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { useParticipation } from "@/components/participation/ParticipationManager";

interface MintGenesisButtonProps {
  className?: string;
  useExperienceCursor?: boolean;
}

export function MintGenesisButton({
  className = "",
  useExperienceCursor = false,
}: MintGenesisButtonProps) {
  const { startMintFlow } = useParticipation();

  return (
    <motion.div
      className={`flex flex-col items-center gap-8 ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 2, delay: 0.5, ease: EASE.entrance },
      }}
    >
      <button
        type="button"
        onClick={startMintFlow}
        className={`border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/80 uppercase transition-colors duration-1000 hover:border-white/30 hover:text-white md:px-14 ${
          useExperienceCursor ? "cursor-none" : "cursor-pointer"
        }`}
        aria-label="Mint Genesis Citizen"
      >
        Mint Genesis Citizen
      </button>

      <p className="text-[10px] font-light tracking-[0.1em] text-white/25">
        Connect wallet and sign to prepare.
      </p>
    </motion.div>
  );
}
