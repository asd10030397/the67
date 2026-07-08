"use client";

import { type ReactNode } from "react";

interface SceneStageProps {
  children: ReactNode;
}

export function SceneStage({ children }: SceneStageProps) {
  return (
    <div className="the67-scene-stage relative mx-auto flex w-full max-w-4xl items-center justify-center px-6 md:px-10">
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
