"use client";

import { type ReactNode } from "react";
import { AudioProvider } from "./AudioProvider";
import { AudioMuteButton } from "./AudioMuteButton";

interface AudioManagerProps {
  children: ReactNode;
}

export function AudioManager({ children }: AudioManagerProps) {
  return (
    <AudioProvider>
      {children}
      <AudioMuteButton />
    </AudioProvider>
  );
}

export { useAudio } from "./AudioProvider";