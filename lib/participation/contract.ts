import { baseSepolia } from "wagmi/chains";
import { GENESIS_MINT_CONFIG } from "@/lib/participation/mint";

export const THE67_GENESIS_CHAIN = baseSepolia;

export function getGenesisContractAddress(): `0x${string}` | null {
  return GENESIS_MINT_CONFIG.contractAddress;
}

export function getBaseScanTxUrl(txHash: string): string {
  return `${THE67_GENESIS_CHAIN.blockExplorers.default.url}/tx/${txHash}`;
}

export function getBaseScanTokenUrl(
  contractAddress: string,
  tokenId: string | number | bigint,
): string {
  return `${THE67_GENESIS_CHAIN.blockExplorers.default.url}/nft/${contractAddress}/${tokenId.toString()}`;
}

export function getOpenSeaAssetUrl(
  contractAddress: string,
  tokenId: string | number | bigint,
): string {
  return `https://testnets.opensea.io/assets/base-sepolia/${contractAddress}/${tokenId.toString()}`;
}

export function shortenTxHash(hash: string): string {
  if (hash.length < 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}
