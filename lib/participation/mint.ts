export type MintStatus = "coming_soon" | "live";

export interface GenesisMintConfig {
  network: string;
  priceDisplay: string;
  /** Price in wei — wire to contract when deployed */
  priceWei: bigint;
  supply: number;
  publicSupply: number;
  creatorArchiveSupply: number;
  maxPerWallet: number;
  status: MintStatus;
  /** Set when contract is deployed on Base */
  contractAddress: `0x${string}` | null;
}

export const GENESIS_MINT_CONFIG: GenesisMintConfig = {
  network: "Base",
  priceDisplay: "0.0067 ETH",
  priceWei: BigInt("6700000000000000"),
  supply: 67,
  publicSupply: 63,
  creatorArchiveSupply: 4,
  maxPerWallet: 1,
  status: "coming_soon",
  contractAddress: null,
};

export function isMintLive(): boolean {
  return (
    GENESIS_MINT_CONFIG.status === "live" &&
    GENESIS_MINT_CONFIG.contractAddress !== null
  );
}

export function getMintStatusLabel(status: MintStatus): string {
  return status === "coming_soon" ? "Coming Soon" : "Live";
}

/**
 * Execute a Genesis Citizen mint on Base.
 * Wire to wagmi writeContract when the contract is deployed.
 */
export async function mintGenesisCitizen(_wallet: string): Promise<never> {
  if (!isMintLive()) {
    throw new Error("Genesis mint is not yet live.");
  }

  // TODO: connect contract write when deployed
  // const hash = await writeContractAsync({ ... });
  throw new Error("Mint transaction not yet implemented.");
}
