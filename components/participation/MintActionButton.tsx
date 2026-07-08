"use client";

import { useCallback } from "react";
import { isMintLive, mintGenesisCitizen } from "@/lib/participation/mint";
import { useParticipation } from "./ParticipationProvider";
import { MintNotLiveButton } from "./MintNotLiveButton";

interface MintActionButtonProps {
  useExperienceCursor?: boolean;
}

export function MintActionButton({
  useExperienceCursor = false,
}: MintActionButtonProps) {
  const { participationRecord } = useParticipation();
  const live = isMintLive();

  const handleMint = useCallback(async () => {
    if (!participationRecord?.wallet) return;
    await mintGenesisCitizen(participationRecord.wallet);
  }, [participationRecord?.wallet]);

  if (!live) {
    return <MintNotLiveButton useExperienceCursor={useExperienceCursor} />;
  }

  return (
    <button
      type="button"
      onClick={() => void handleMint()}
      className={`border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/80 uppercase transition-colors duration-1000 hover:border-white/30 hover:text-white md:px-14 ${
        useExperienceCursor ? "cursor-none" : "cursor-pointer"
      }`}
    >
      Mint Genesis Citizen
    </button>
  );
}
