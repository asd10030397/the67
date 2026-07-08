"use client";

import { type ReactNode } from "react";
import { Web3Provider } from "@/components/web3/Web3Provider";
import { ParticipationProvider } from "./ParticipationProvider";

interface ParticipationManagerProps {
  children: ReactNode;
}

export function ParticipationManager({ children }: ParticipationManagerProps) {
  return (
    <Web3Provider>
      <ParticipationProvider>{children}</ParticipationProvider>
    </Web3Provider>
  );
}

export { useParticipation } from "./ParticipationProvider";
