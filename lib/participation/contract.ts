import { base } from "wagmi/chains";
import { GENESIS_MINT_CONFIG } from "@/lib/participation/mint";

export const THE67_GENESIS_CHAIN = base;

export function getGenesisContractAddress(): `0x${string}` | null {
  return GENESIS_MINT_CONFIG.contractAddress;
}

export function getBaseScanTxUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`;
}

export function getBaseScanTokenUrl(
  contractAddress: string,
  tokenId: string | number | bigint,
): string {
  return `https://basescan.org/nft/${contractAddress}/${tokenId.toString()}`;
}

export function getOpenSeaAssetUrl(
  contractAddress: string,
  tokenId: string | number | bigint,
): string {
  return `https://opensea.io/assets/base/${contractAddress}/${tokenId.toString()}`;
}

export function shortenTxHash(hash: string): string {
  if (hash.length < 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}
