import {
  CITIZENS_STORAGE_KEY,
  MOCK_PARTICIPATION_COUNT,
  PARTICIPATION_STORAGE_KEY,
} from "./constants";
import { getSeedCitizen, SEED_CITIZENS } from "./mock";
import type { Citizen } from "./types";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readCitizensMap(): Record<string, Citizen> {
  if (!isBrowser()) return {};

  try {
    const raw = window.sessionStorage.getItem(CITIZENS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Citizen>;
  } catch {
    return {};
  }
}

function writeCitizensMap(citizens: Record<string, Citizen>): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(CITIZENS_STORAGE_KEY, JSON.stringify(citizens));
}

export function getParticipationCount(): number {
  if (!isBrowser()) return MOCK_PARTICIPATION_COUNT;

  try {
    const raw = window.sessionStorage.getItem(PARTICIPATION_STORAGE_KEY);
    if (!raw) return MOCK_PARTICIPATION_COUNT;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : MOCK_PARTICIPATION_COUNT;
  } catch {
    return MOCK_PARTICIPATION_COUNT;
  }
}

export function setParticipationCount(count: number): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(PARTICIPATION_STORAGE_KEY, String(count));
}

export function incrementParticipationCount(): number {
  const next = getParticipationCount() + 1;
  setParticipationCount(next);
  return next;
}

export function saveCitizen(citizen: Citizen): void {
  const citizens = readCitizensMap();
  citizens[citizen.id] = citizen;
  writeCitizensMap(citizens);
}

export function getCitizen(id: string): Citizen | undefined {
  const stored = readCitizensMap()[id];
  if (stored) return stored;
  return getSeedCitizen(id);
}

export function getAllCitizenIds(): string[] {
  const seedIds = SEED_CITIZENS.map((citizen) => citizen.id);
  if (!isBrowser()) return seedIds;

  const storedIds = Object.keys(readCitizensMap());
  return [...new Set([...seedIds, ...storedIds])];
}
