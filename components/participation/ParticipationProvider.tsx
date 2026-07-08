"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getParticipationCount } from "@/lib/participation/storage";
import type { ParticipationRecord, ParticipationStep } from "@/lib/participation/types";
import { ParticipationFlow } from "./ParticipationFlow";

interface ParticipationContextValue {
  step: ParticipationStep;
  isFlowOpen: boolean;
  walletAddress: string | null;
  participantCount: number;
  participationRecord: ParticipationRecord | null;
  startMintFlow: () => void;
  /** @deprecated Use startMintFlow */
  startParticipation: () => void;
  closeFlow: () => void;
  setStep: (step: ParticipationStep) => void;
  setWalletAddress: (address: string | null) => void;
  setParticipantCount: (count: number) => void;
  setParticipationRecord: (record: ParticipationRecord | null) => void;
}

const ParticipationContext = createContext<ParticipationContextValue | null>(
  null,
);

export function useParticipation(): ParticipationContextValue {
  const context = useContext(ParticipationContext);
  if (!context) {
    throw new Error("useParticipation must be used within ParticipationManager");
  }
  return context;
}

interface ParticipationProviderProps {
  children: ReactNode;
}

export function ParticipationProvider({ children }: ParticipationProviderProps) {
  const [step, setStep] = useState<ParticipationStep>("idle");
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [participationRecord, setParticipationRecord] =
    useState<ParticipationRecord | null>(null);

  useEffect(() => {
    setParticipantCount(getParticipationCount());
  }, []);

  const startMintFlow = useCallback(() => {
    setStep("connect");
    setIsFlowOpen(true);
  }, []);

  const closeFlow = useCallback(() => {
    setIsFlowOpen(false);
    setStep("idle");
    setWalletAddress(null);
    setParticipationRecord(null);
  }, []);

  const value = useMemo(
    () => ({
      step,
      isFlowOpen,
      walletAddress,
      participantCount,
      participationRecord,
      startMintFlow,
      startParticipation: startMintFlow,
      closeFlow,
      setStep,
      setWalletAddress,
      setParticipantCount,
      setParticipationRecord,
    }),
    [
      step,
      isFlowOpen,
      walletAddress,
      participantCount,
      participationRecord,
      startMintFlow,
      closeFlow,
    ],
  );

  return (
    <ParticipationContext.Provider value={value}>
      {children}
      <ParticipationFlow />
    </ParticipationContext.Provider>
  );
}
