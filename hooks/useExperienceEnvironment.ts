"use client";

import { useEffect, useState } from "react";
import {
  hasFinePointer,
  isMobileViewport,
  isTouchDevice,
  prefersReducedMotion,
} from "@/lib/the67/device";
import { MOBILE_PARTICLE_SCALE, REDUCED_MOTION_PARTICLE_SCALE } from "@/lib/the67/constants";

export interface ExperienceEnvironment {
  isTouchDevice: boolean;
  isMobile: boolean;
  hasFinePointer: boolean;
  prefersReducedMotion: boolean;
  particleScale: number;
  mouseEffectsEnabled: boolean;
  customCursorEnabled: boolean;
}

function computeEnvironment(): ExperienceEnvironment {
  const touch = isTouchDevice();
  const mobile = isMobileViewport();
  const finePointer = hasFinePointer();
  const reducedMotion = prefersReducedMotion();

  let particleScale = 1;
  if (reducedMotion) {
    particleScale = REDUCED_MOTION_PARTICLE_SCALE;
  } else if (touch || mobile) {
    particleScale = MOBILE_PARTICLE_SCALE;
  }

  return {
    isTouchDevice: touch,
    isMobile: mobile,
    hasFinePointer: finePointer,
    prefersReducedMotion: reducedMotion,
    particleScale,
    mouseEffectsEnabled: finePointer && !touch && !reducedMotion,
    customCursorEnabled: finePointer && !touch,
  };
}

export function useExperienceEnvironment(): ExperienceEnvironment {
  const [environment, setEnvironment] = useState<ExperienceEnvironment>(() => {
    if (typeof window === "undefined") {
      return {
        isTouchDevice: false,
        isMobile: false,
        hasFinePointer: true,
        prefersReducedMotion: false,
        particleScale: 1,
        mouseEffectsEnabled: true,
        customCursorEnabled: true,
      };
    }
    return computeEnvironment();
  });

  useEffect(() => {
    const update = () => setEnvironment(computeEnvironment());

    update();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    motionQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);
    fineQuery.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
      fineQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return environment;
}
