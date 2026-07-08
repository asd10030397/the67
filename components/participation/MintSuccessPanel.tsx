"use client";

import {
  getBaseScanTokenUrl,
  getBaseScanTxUrl,
  getGenesisContractAddress,
  getOpenSeaTestnetAssetUrl,
  shortenTxHash,
} from "@/lib/participation/contract";
import { useParticipation } from "./ParticipationProvider";

export function MintSuccessPanel() {
  const { mintResult } = useParticipation();
  const contractAddress = getGenesisContractAddress();

  if (!mintResult || !contractAddress) return null;

  const tokenId = mintResult.tokenId.toString();

  return (
    <div className="flex w-full max-w-[22rem] flex-col items-center gap-5 text-center">
      <div className="space-y-2">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          Mint Complete
        </p>
        <h3 className="text-[clamp(1.1rem,2.6vw,1.45rem)] font-light tracking-[-0.02em] text-white/85">
          Genesis Citizen #{tokenId}
        </h3>
      </div>

      <p className="text-[10px] font-light leading-[1.6] tracking-[0.08em] text-white/45">
        Your Citizen has been minted on Base Sepolia.
      </p>

      <div className="flex w-full flex-col gap-3">
        <a
          href={getBaseScanTxUrl(mintResult.transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-light tracking-[0.12em] text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
        >
          Transaction — {shortenTxHash(mintResult.transactionHash)}
        </a>
        <a
          href={getBaseScanTokenUrl(contractAddress, tokenId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-light tracking-[0.12em] text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
        >
          View on BaseScan
        </a>
        <a
          href={getOpenSeaTestnetAssetUrl(contractAddress, tokenId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-light tracking-[0.12em] text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
        >
          View on OpenSea Testnet
        </a>
      </div>
    </div>
  );
}
