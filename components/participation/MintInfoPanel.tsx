"use client";

import {
  GENESIS_MINT_CONFIG,
  getMintOpensDisplay,
  getMintStatusLabel,
} from "@/lib/participation/mint";
import { shortenWallet } from "@/lib/participation/mock";
import type { ParticipationRecord } from "@/lib/participation/types";

interface MintInfoPanelProps {
  participationRecord: ParticipationRecord | null;
}

function MintField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-white/[0.06] py-3 max-md:gap-4 max-md:py-2">
      <p className="shrink-0 text-[10px] font-light tracking-[0.2em] text-white/25 uppercase max-md:text-white/45">
        {label}
      </p>
      <p className="text-right text-[11px] font-light tracking-[0.06em] text-white/78 max-md:text-white/92">
        {value}
      </p>
    </div>
  );
}

export function MintWindowPolicy() {
  const { mintWindowPolicy } = GENESIS_MINT_CONFIG;

  return (
    <div className="w-full max-w-[22rem] space-y-3 border-t border-white/[0.06] pt-5 text-left max-md:max-w-none max-md:space-y-2 max-md:pt-3">
      <p className="text-[10px] font-light tracking-[0.2em] text-white/25 uppercase max-md:text-white/40">
        Mint Window Policy
      </p>
      <ul className="space-y-2 max-md:space-y-1.5">
        {mintWindowPolicy.map((line) => (
          <li
            key={line}
            className="text-[10px] font-light leading-[1.65] tracking-[0.04em] text-white/40 max-md:text-white/55"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MintInfoPanel({ participationRecord }: MintInfoPanelProps) {
  const {
    network,
    priceDisplay,
    supply,
    publicSupply,
    creatorArchiveSupply,
    maxPerWallet,
    maxPerTransaction,
    status,
    initialMintWindowHours,
  } = GENESIS_MINT_CONFIG;

  return (
    <div className="w-full max-w-[22rem] text-left max-md:max-w-none">
      <div className="mb-6 space-y-2 text-center max-md:mb-3 max-md:space-y-1">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase max-md:text-white/45">
          Genesis Collection
        </p>
        <h3 className="text-[clamp(1.1rem,2.6vw,1.45rem)] font-light tracking-[-0.02em] text-white/85 max-md:text-white/92">
          Mint Information
        </h3>
      </div>

      <div className="flex flex-col">
        <MintField label="Network" value={network} />
        <MintField label="Price" value={priceDisplay} />
        <MintField label="Supply" value={String(supply)} />
        <MintField label="Public" value={String(publicSupply)} />
        <MintField label="Creator Reserve" value={String(creatorArchiveSupply)} />
        <MintField label="Per Wallet" value={String(maxPerWallet)} />
        <MintField label="Per Transaction" value={String(maxPerTransaction)} />
        <MintField label="Mint Opens" value={getMintOpensDisplay(GENESIS_MINT_CONFIG)} />
        <MintField
          label="Initial Window"
          value={`${initialMintWindowHours} hours`}
        />
        <MintField label="Mint Status" value={getMintStatusLabel(status)} />
      </div>

      {participationRecord ? (
        <p className="mt-6 text-center text-[10px] font-light tracking-[0.1em] text-white/25 max-md:mt-3 max-md:text-white/40">
          Participation signed — {shortenWallet(participationRecord.wallet)}
        </p>
      ) : null}
    </div>
  );
}
