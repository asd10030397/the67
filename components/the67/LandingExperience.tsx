"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  getBeatDuration,
  STORY_BEATS,
  STORY_TIMING,
  ENDING_TIMING,
} from "@/lib/the67/constants";
import { initMouseTracker } from "@/lib/the67/mouse";
import { ParticleCanvas } from "./ParticleCanvas";
import { CustomCursor } from "./CustomCursor";
import { HeroIntro } from "./HeroIntro";
import { MemeGallery } from "./MemeGallery";
import { StoryDisplay } from "./StoryDisplay";
import { EndingScene } from "./EndingScene";
import { VisualOverlay } from "./VisualOverlay";
import { BlackoutOverlay } from "./BlackoutOverlay";

type ScenePhase =
  | "intro"
  | "gallery"
  | "story"
  | "convergence"
  | "blackout"
  | "ending";

export function LandingExperience() {
  const [scene, setScene] = useState<ScenePhase>("intro");
  const [beatIndex, setBeatIndex] = useState(0);
  const [shouldConverge, setShouldConverge] = useState(false);
  const [blackoutActive, setBlackoutActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const galleryEnteredRef = useRef<number | null>(null);

  const storyProgress = useMemo(() => {
    switch (scene) {
      case "intro":
        return 0;
      case "gallery":
        return 0.08;
      case "story":
        return 0.1 + (beatIndex / (STORY_BEATS.length - 1)) * 0.75;
      case "convergence":
        return 0.92;
      case "blackout":
      case "ending":
        return 1;
      default:
        return 0;
    }
  }, [scene, beatIndex]);

  useEffect(() => initMouseTracker(), []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startConvergence = useCallback(() => {
    clearTimer();
    setScene("convergence");
    setShouldConverge(true);
  }, [clearTimer]);

  const scheduleBeatAdvance = useCallback(
    (index: number) => {
      clearTimer();

      if (index >= STORY_BEATS.length - 1) {
        timerRef.current = setTimeout(() => {
          startConvergence();
        }, getBeatDuration(STORY_BEATS[index].style));
        return;
      }

      timerRef.current = setTimeout(() => {
        setBeatIndex(index + 1);
      }, getBeatDuration(STORY_BEATS[index].style));
    },
    [clearTimer, startConvergence],
  );

  const advanceFromIntro = useCallback(() => {
    setScene("gallery");
    galleryEnteredRef.current = Date.now();
  }, []);

  const advanceFromGallery = useCallback(() => {
    const entered = galleryEnteredRef.current;
    const elapsed = entered
      ? Date.now() - entered
      : STORY_TIMING.galleryMinDuration;

    if (elapsed < STORY_TIMING.galleryMinDuration) return;

    setScene("story");
    setBeatIndex(0);
  }, []);

  const advanceStoryBeat = useCallback(() => {
    clearTimer();

    if (beatIndex >= STORY_BEATS.length - 1) {
      startConvergence();
      return;
    }

    setBeatIndex((prev) => prev + 1);
  }, [beatIndex, clearTimer, startConvergence]);

  const handleClick = useCallback(() => {
    switch (scene) {
      case "intro":
        advanceFromIntro();
        break;
      case "gallery":
        advanceFromGallery();
        break;
      case "story":
        advanceStoryBeat();
        break;
      default:
        break;
    }
  }, [scene, advanceFromIntro, advanceFromGallery, advanceStoryBeat]);

  useEffect(() => {
    if (scene === "story") {
      scheduleBeatAdvance(beatIndex);
    }
    return clearTimer;
  }, [scene, beatIndex, scheduleBeatAdvance, clearTimer]);

  const handleHoldComplete = useCallback(() => {
    setBlackoutActive(true);
    setScene("blackout");
  }, []);

  useEffect(() => {
    if (scene !== "blackout") return;

    const timer = setTimeout(() => {
      setScene("ending");
    }, ENDING_TIMING.blackoutFadeMs);

    return () => clearTimeout(timer);
  }, [scene]);

  const currentBeat = scene === "story" ? STORY_BEATS[beatIndex] : null;
  const isInteractive =
    scene === "intro" || scene === "gallery" || scene === "story";

  return (
    <div
      className="fixed inset-0 h-screen w-screen overflow-hidden bg-black"
      onClick={isInteractive ? handleClick : undefined}
      role="presentation"
    >
      <ParticleCanvas
        storyProgress={storyProgress}
        mouseEnabled={!shouldConverge}
        converge={shouldConverge}
        onHoldComplete={handleHoldComplete}
      />

      <VisualOverlay />

      <BlackoutOverlay active={blackoutActive} />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {scene === "intro" && <HeroIntro key="intro" />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {scene === "gallery" && <MemeGallery key="gallery" />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {scene === "story" && currentBeat && (
            <StoryDisplay key="story" beat={currentBeat} beatIndex={beatIndex} />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {scene === "ending" && <EndingScene key="ending" />}
        </AnimatePresence>
      </div>

      <CustomCursor />
    </div>
  );
}
