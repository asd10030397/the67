import { MOCK_PARTICIPATION_COUNT } from "./constants";
import type { Citizen, ParticipationRecord } from "./types";

export const SEED_CITIZENS: Citizen[] = [
  {
    id: "67-A1F9C2",
    joinDate: "2026-06-12T14:22:00.000Z",
    wallet: "0x7a3f8b2e91c4d5f6a8b9c0d1e2f3a4b5c6d7e8f9",
    generation: "Genesis",
    status: "Active",
  },
  {
    id: "67-B4E821",
    joinDate: "2026-06-28T09:11:00.000Z",
    wallet: "0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
    generation: "Genesis",
    status: "Active",
  },
  {
    id: "67-C90357",
    joinDate: "2026-07-01T18:45:00.000Z",
    wallet: "0x9f8e7d6c5b4a392817161514131211100908070605",
    generation: "Gen II",
    status: "Recorded",
  },
];

export function shortenWallet(wallet: string): string {
  if (wallet.length < 10) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export function formatJoinDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function getGenerationForCount(count: number): string {
  if (count <= 67) return "Genesis";
  if (count <= 670) return "Gen II";
  return "Gen III";
}

export function generateMockWallet(): string {
  const hex = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i += 1) {
    address += hex[Math.floor(Math.random() * hex.length)];
  }
  return address;
}

export function generateCitizenId(): string {
  const chars = "0123456789ABCDEF";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `67-${suffix}`;
}

export function createCitizen(
  count: number,
  wallet: string,
  participation: ParticipationRecord,
): Citizen {
  return {
    id: generateCitizenId(),
    joinDate: participation.timestamp,
    wallet,
    generation: getGenerationForCount(count),
    status: "Active",
    participation,
  };
}

/** @deprecated Use createCitizen */
export function createMockCitizen(
  count: number,
  wallet: string,
  participation?: ParticipationRecord,
): Citizen {
  return createCitizen(
    count,
    wallet,
    participation ?? {
      wallet,
      signature: "",
      timestamp: new Date().toISOString(),
      nonce: crypto.randomUUID(),
    },
  );
}

export function getSeedCitizen(id: string): Citizen | undefined {
  return SEED_CITIZENS.find((citizen) => citizen.id === id);
}

export function getInitialParticipationCount(): number {
  return MOCK_PARTICIPATION_COUNT;
}
