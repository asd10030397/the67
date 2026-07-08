"use client";

import { MintGenesisButton } from "@/components/participation/MintGenesisButton";

interface JoinExperimentButtonProps {
  visible: boolean;
}

export function JoinExperimentButton({ visible }: JoinExperimentButtonProps) {
  if (!visible) return null;

  return <MintGenesisButton useExperienceCursor />;
}
