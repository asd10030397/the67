"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio/AudioManager";
import { useExperienceEnvironment } from "@/hooks/useExperienceEnvironment";
import { EXPERIENCE_SCENES } from "@/lib/the67/constants";
import { initMouseTracker } from "@/lib/the67/mouse";
import { ParticleCanvas } from "./ParticleCanvas";
import { CustomCursor } from "./CustomCursor";
import { HeroIntro } from "./HeroIntro";
import { SceneDisplay } from "./SceneDisplay";
import { GenesisGalleryScene } from "./GenesisGalleryScene";
import { CreatorScene } from "./CreatorScene";
import { VisualOverlay } from "./VisualOverlay";
import { SceneStage } from "./SceneStage";

export function LandingExperience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const { startAmbient } = useAudio();
  const environment = useExperienceEnvironment();

  const currentScene = EXPERIENCE_SCENES[sceneIndex];

  const storyProgress = useMemo(() => {
    if (sceneIndex <= 0) return 0;
    return sceneIndex / (EXPERIENCE_SCENES.length - 1);
  }, [sceneIndex]);

  useEffect(() => {
    if (!environment.mouseEffectsEnabled) return;
    return initMouseTracker();
  }, [environment.mouseEffectsEnabled]);

  const advanceScene = useCallback(() => {
    setSceneIndex((prev) => Math.min(prev + 1, EXPERIENCE_SCENES.length - 1));
  }, []);

  const beginExperience = useCallback(() => {
    startAmbient();
    advanceScene();
  }, [startAmbient, advanceScene]);

  const handlePointerDown = useCallback(() => {
    if (!currentScene) return;

    if (currentScene.type === "intro") {
      beginExperience();
      return;
    }

    if (
      currentScene.type === "text" ||
      currentScene.type === "creator"
    ) {
      if (currentScene.type === "creator") return;
      advanceScene();
    }
  }, [currentScene, beginExperience, advanceScene]);

  const isClickAdvance =
    currentScene?.type === "intro" ||
    currentScene?.type === "text";

  const isGallery = currentScene?.type === "gallery";
  const isCreator = currentScene?.type === "creator";

  const mouseEnabled =
    environment.mouseEffectsEnabled && !isGallery && !isCreator;

  return (
    <div
      className="the67-experience fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-black"
      onPointerDown={isClickAdvance ? handlePointerDown : undefined}
      role="presentation"
    >
      <ParticleCanvas
        storyProgress={storyProgress}
        particleScale={environment.particleScale}
        mouseEnabled={mouseEnabled}
        frozen={false}
        converge={false}
      />

      <VisualOverlay reducedEffects={environment.isMobile || environment.prefersReducedMotion} />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <SceneStage>
          <AnimatePresence mode="wait">
            {currentScene?.type === "intro" && (
              <HeroIntro
                key="intro"
                prefersReducedMotion={environment.prefersReducedMotion}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {currentScene?.type === "text" && (
              <SceneDisplay
                key={currentScene.id}
                sceneKey={currentScene.id}
                lines={currentScene.lines}
                style={currentScene.style}
                emphasisIndex={currentScene.emphasisIndex}
                prefersReducedMotion={environment.prefersReducedMotion}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isGallery && (
              <GenesisGalleryScene
                key="gallery"
                onContinue={advanceScene}
                prefersReducedMotion={environment.prefersReducedMotion}
                isTouchDevice={environment.isTouchDevice}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isCreator && (
              <CreatorScene
                key="creator"
                lines={currentScene.lines}
                prefersReducedMotion={environment.prefersReducedMotion}
                useExperienceCursor={environment.customCursorEnabled}
              />
            )}
          </AnimatePresence>
        </SceneStage>
      </div>

      {environment.customCursorEnabled ? <CustomCursor /> : null}
    </div>
  );
}
