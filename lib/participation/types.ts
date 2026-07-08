export type CitizenStatus = "Active" | "Recorded" | "Dormant";

export type ParticipationStep = "idle" | "connect" | "sign" | "mint";

export interface ParticipationRecord {
  wallet: string;
  signature: string;
  timestamp: string;
  nonce: string;
}

export interface Citizen {
  id: string;
  joinDate: string;
  wallet: string;
  generation: string;
  status: CitizenStatus;
  participation?: ParticipationRecord;
}
