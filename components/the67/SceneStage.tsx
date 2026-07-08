"use client";

import { type ReactNode } from "react";

interface SceneStageProps {
  children: ReactNode;
  variant?: "default" | "gallery";
}

export function SceneStage({ children, variant = "default" }: SceneStageProps) {
  const widthClass =
    variant === "gallery"
      ? "w-full max-w-[min(96vw,90rem)]"
      : "max-w-4xl lg:max-w-5xl";

  return (
    <div
      className={`the67-scene-stage relative mx-auto flex w-full items-center justify-center px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 ${widthClass} ${
        variant === "gallery"
          ? "the67-scene-stage--gallery overflow-visible"
          : ""
      }`}
    >
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
