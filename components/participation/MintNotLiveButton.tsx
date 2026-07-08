"use client";

import { isMintLive } from "@/lib/participation/mint";

interface MintNotLiveButtonProps {
  className?: string;
  useExperienceCursor?: boolean;
}

export function MintNotLiveButton({
  className = "",
  useExperienceCursor = false,
}: MintNotLiveButtonProps) {
  const live = isMintLive();

  if (live) {
    // Future: enabled mint button wired to mintGenesisCitizen()
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-label="Mint not yet live"
        className={`border border-white/[0.08] bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/25 uppercase md:px-14 ${
          useExperienceCursor ? "cursor-none" : "cursor-not-allowed"
        }`}
      >
        Mint Not Yet Live
      </button>
      <p className="max-w-[18rem] text-center text-[10px] font-light leading-[1.6] tracking-[0.06em] text-white/20">
        Minting will open once the Genesis contract address is configured for
        this deployment.
      </p>
    </div>
  );
}
