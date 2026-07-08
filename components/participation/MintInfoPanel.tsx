"use client";

import {
  GENESIS_MINT_CONFIG,
  getMintStatusLabel,
} from "@/lib/participation/mint";
import { shortenWallet } from "@/lib/participation/mock";
import type { ParticipationRecord } from "@/lib/participation/types";

interface MintInfoPanelProps {
  participationRecord: ParticipationRecord | null;
}

function MintField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-white/[0.06] py-3">
      <p className="shrink-0 text-[10px] font-light tracking-[0.2em] text-white/25 uppercase">
        {label}
      </p>
      <p className="text-right text-[10px] font-light tracking-[0.08em] text-white/55">
        {value}
      </p>
    </div>
  );
}

export function MintInfoPanel({ participationRecord }: MintInfoPanelProps) {
  const { network, priceDisplay, supply, publicSupply, creatorArchiveSupply, maxPerWallet, status } =
    GENESIS_MINT_CONFIG;

  return (
    <div className="w-full max-w-[22rem] text-left">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          Genesis Collection
        </p>
        <h3 className="text-[clamp(1.1rem,2.6vw,1.45rem)] font-light tracking-[-0.02em] text-white/85">
          Mint Information
        </h3>
      </div>

      <div className="flex flex-col">
        <MintField label="Network" value={network} />
        <MintField label="Price" value={priceDisplay} />
        <MintField label="Supply" value={String(supply)} />
        <MintField label="Public" value={String(publicSupply)} />
        <MintField label="Creator Archive" value={String(creatorArchiveSupply)} />
        <MintField label="Per Wallet" value={String(maxPerWallet)} />
        <MintField label="Mint Status" value={getMintStatusLabel(status)} />
      </div>

      {participationRecord ? (
        <p className="mt-6 text-center text-[10px] font-light tracking-[0.1em] text-white/25">
          Participation signed — {shortenWallet(participationRecord.wallet)}
        </p>
      ) : null}
    </div>
  );
}
