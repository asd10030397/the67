"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio/AudioManager";
import { EXPERIENCE_SCENES } from "@/lib/the67/constants";
import { initMouseTracker } from "@/lib/the67/mouse";
import { ParticleCanvas } from "./ParticleCanvas";
import { CustomCursor } from "./CustomCursor";
import { HeroIntro } from "./HeroIntro";
import { SceneDisplay } from "./SceneDisplay";
import { GenesisGalleryScene } from "./GenesisGalleryScene";
import { CreatorScene } from "./CreatorScene";
import { VisualOverlay } from "./VisualOverlay";

export function LandingExperience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const { startAmbient } = useAudio();

  const currentScene = EXPERIENCE_SCENES[sceneIndex];

  const storyProgress = useMemo(() => {
    if (sceneIndex <= 0) return 0;
    return sceneIndex / (EXPERIENCE_SCENES.length - 1);
  }, [sceneIndex]);

  useEffect(() => initMouseTracker(), []);

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

  return (
    <div
      className="the67-experience fixed inset-0 h-screen w-screen overflow-hidden bg-black"
      onPointerDown={isClickAdvance ? handlePointerDown : undefined}
      role="presentation"
    >
      <ParticleCanvas
        storyProgress={storyProgress}
        mouseEnabled={!isGallery && !isCreator}
        frozen={false}
        converge={false}
      />

      <VisualOverlay />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentScene?.type === "intro" && <HeroIntro key="intro" />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentScene?.type === "text" && (
            <SceneDisplay
              key={currentScene.id}
              sceneKey={currentScene.id}
              lines={currentScene.lines}
              style={currentScene.style}
              emphasisIndex={currentScene.emphasisIndex}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isGallery && (
            <GenesisGalleryScene
              key="gallery"
              onContinue={advanceScene}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isCreator && (
            <CreatorScene key="creator" lines={currentScene.lines} />
          )}
        </AnimatePresence>
      </div>

      <CustomCursor />
    </div>
  );
}
