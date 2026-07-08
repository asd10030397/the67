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
  maxPerTransaction: number;
  status: MintStatus;
  contractAddress: `0x${string}` | null;
  /** Fixed UTC open time for the public mint window. */
  mintOpensAtUtc: string | null;
  /** Display label when `mintOpensAtUtc` is not set. */
  mintOpensLabel: string;
  /** Initial on-chain mint window length in hours. */
  initialMintWindowHours: number;
  mintWindowPolicy: readonly string[];
}

/**
 * Local development fallback only — never used in production builds.
 * Production must set NEXT_PUBLIC_THE67_GENESIS_CONTRACT_ADDRESS on Vercel.
 */
const MAINNET_DEV_FALLBACK_ADDRESS: `0x${string}` | null =
  process.env.NODE_ENV === "development"
    ? "0xbee686cf9b2a4771c3eb6c000a23939dffe1c00c"
    : null;

/** Base mainnet launch — 2026-07-10 15:00 UTC. */
export const MAINNET_MINT_START_UNIX = 1_783_695_600;
export const MAINNET_MINT_OPENS_AT_UTC = "2026-07-10T15:00:00.000Z";

export const MAINNET_MINT_WINDOW_POLICY = [
  "The initial public mint runs for 48 hours.",
  "If all 63 public Citizens are minted, the sale ends automatically.",
  "If the collection is not sold out, the owner may extend the mint end time on-chain without redeploying the contract.",
  "Creator reserve Citizens (4) are never minted automatically and are only available through reserveMint() by the owner.",
] as const;

function isValidContractAddress(
  value: string | undefined,
): value is `0x${string}` {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}

/**
 * Resolve the active Genesis contract.
 * Production: NEXT_PUBLIC_THE67_GENESIS_CONTRACT_ADDRESS (required on Vercel).
 * Development: env var, then local mainnet fallback for testing without .env.
 */
function resolveGenesisContractAddress(): `0x${string}` | null {
  const envAddress = process.env.NEXT_PUBLIC_THE67_GENESIS_CONTRACT_ADDRESS;
  if (isValidContractAddress(envAddress)) {
    return envAddress;
  }
  return MAINNET_DEV_FALLBACK_ADDRESS;
}

const resolvedContractAddress = resolveGenesisContractAddress();

/** Active website mint config — Base mainnet deployment. */
export const GENESIS_MINT_CONFIG: GenesisMintConfig = {
  network: "Base",
  chainId: 8453,
  priceDisplay: "0.0067 ETH",
  priceWei: BigInt("6700000000000000"),
  supply: 67,
  publicSupply: 63,
  creatorArchiveSupply: 4,
  maxPerWallet: 1,
  maxPerTransaction: 1,
  status: resolvedContractAddress ? "live" : "coming_soon",
  contractAddress: resolvedContractAddress,
  mintOpensAtUtc: MAINNET_MINT_OPENS_AT_UTC,
  mintOpensLabel: "",
  initialMintWindowHours: 48,
  mintWindowPolicy: MAINNET_MINT_WINDOW_POLICY,
};

export const MAINNET_LAUNCH_SCHEDULE = {
  network: GENESIS_MINT_CONFIG.network,
  chainId: GENESIS_MINT_CONFIG.chainId,
  mintOpensAtUtc: MAINNET_MINT_OPENS_AT_UTC,
  mintStartUnix: MAINNET_MINT_START_UNIX,
  initialMintWindowHours: GENESIS_MINT_CONFIG.initialMintWindowHours,
  mintWindowPolicy: MAINNET_MINT_WINDOW_POLICY,
} as const;

export const THE67_GENESIS_ABI_EXPORT = THE67_GENESIS_ABI;

export function isMintLive(): boolean {
  return GENESIS_MINT_CONFIG.contractAddress !== null;
}

export function getMintStatusLabel(status: MintStatus): string {
  return status === "coming_soon" ? "Coming Soon" : "Live";
}

export function getMintPriceDisplay(priceWei: bigint): string {
  return `${formatEther(priceWei)} ETH`;
}

export function formatMintOpensAt(isoUtc: string): string {
  const date = new Date(isoUtc);
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);

  return `${formatted} · ${time} UTC`;
}

export function getMintOpensDisplay(config: GenesisMintConfig): string {
  return config.mintOpensAtUtc
    ? formatMintOpensAt(config.mintOpensAtUtc)
    : config.mintOpensLabel;
}
