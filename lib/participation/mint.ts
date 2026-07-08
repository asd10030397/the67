import { formatEther } from "viem";
import { THE67_GENESIS_ABI } from "@/lib/participation/abi/the67-genesis";

export type MintStatus = "coming_soon" | "live";

export interface GenesisMintConfig {
  network: string;
  chainId: number;
  priceDisplay: string;
  priceWei: bigint;
  supply: number;
  publicSupply: number;
  creatorArchiveSupply: number;
  maxPerWallet: number;
  status: MintStatus;
  contractAddress: `0x${string}` | null;
}

/**
 * Set after Base Sepolia deployment. Env var overrides for CI/preview deploys.
 */
const SEPOLIA_DEPLOYED_CONTRACT_ADDRESS: `0x${string}` | null = null;

/**
 * Base Sepolia production testing deployment.
 * Update `SEPOLIA_DEPLOYED_CONTRACT_ADDRESS` after `forge script script/DeployBaseSepolia.s.sol`.
 */
export const GENESIS_MINT_CONFIG: GenesisMintConfig = {
  network: "Base Sepolia",
  chainId: 84532,
  priceDisplay: "0.0067 ETH",
  priceWei: BigInt("6700000000000000"),
  supply: 67,
  publicSupply: 63,
  creatorArchiveSupply: 4,
  maxPerWallet: 1,
  status: "live",
  contractAddress:
    SEPOLIA_DEPLOYED_CONTRACT_ADDRESS ??
    (process.env.NEXT_PUBLIC_THE67_GENESIS_CONTRACT_ADDRESS as
      | `0x${string}`
      | undefined) ??
    null,
};

export const THE67_GENESIS_ABI_EXPORT = THE67_GENESIS_ABI;

export function isMintLive(): boolean {
  return (
    GENESIS_MINT_CONFIG.status === "live" &&
    GENESIS_MINT_CONFIG.contractAddress !== null
  );
}

export function getMintStatusLabel(status: MintStatus): string {
  return status === "coming_soon" ? "Coming Soon" : "Live";
}

export function getMintPriceDisplay(priceWei: bigint): string {
  return `${formatEther(priceWei)} ETH`;
}
