"use client";

import { useEffect, useRef } from "react";
import { PARTICLE_CONFIG } from "@/lib/the67/constants";
import { mouseState } from "@/lib/the67/mouse";
import { assignTargets, sampleTextPoints } from "@/lib/the67/convergence";
import {
  createParticle,
  createParticles,
  getParticleCountForProgress,
  type Particle,
} from "@/lib/the67/particles";

type InternalPhase = "drift" | "converge" | "hold" | "dissolve";

interface ParticleCanvasProps {
  storyProgress: number;
  mouseEnabled: boolean;
  converge: boolean;
  onHoldComplete?: () => void;
  onDissolveComplete?: () => void;
}

export function ParticleCanvas({
  storyProgress,
  mouseEnabled,
  converge,
  onHoldComplete,
  onDissolveComplete,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const progressRef = useRef(0);
  const mouseEnabledRef = useRef(mouseEnabled);
  const phaseRef = useRef<InternalPhase>("drift");
  const convergeRef = useRef(false);
  const holdStartRef = useRef<number | null>(null);
  const targetsAssignedRef = useRef(false);
  const dissolveCompleteRef = useRef(false);
  const holdCompleteRef = useRef(false);
  const onHoldCompleteRef = useRef(onHoldComplete);
  const onDissolveCompleteRef = useRef(onDissolveComplete);

  useEffect(() => {
    onHoldCompleteRef.current = onHoldComplete;
  }, [onHoldComplete]);

  useEffect(() => {
    onDissolveCompleteRef.current = onDissolveComplete;
  }, [onDissolveComplete]);

  useEffect(() => {
    mouseEnabledRef.current = mouseEnabled;
  }, [mouseEnabled]);

  useEffect(() => {
    progressRef.current = storyProgress;
  }, [storyProgress]);

  useEffect(() => {
    if (converge && !convergeRef.current) {
      convergeRef.current = true;
      phaseRef.current = "converge";
      holdStartRef.current = null;
      targetsAssignedRef.current = false;
      dissolveCompleteRef.current = false;
      holdCompleteRef.current = false;
    }
  }, [converge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const assignConvergenceTargets = (
      particles: Particle[],
      width: number,
      height: number,
    ) => {
      const fontSize =
        Math.min(width, height) * PARTICLE_CONFIG.convergeFontScale;
      const points = sampleTextPoints("67", width, height, fontSize);
      const targets = assignTargets(particles.length, points);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.originX = p.baseX + p.offsetX;
        p.originY = p.baseY + p.offsetY;
        p.targetX = targets[i].x;
        p.targetY = targets[i].y;
        p.offsetX = 0;
        p.offsetY = 0;
      }

      targetsAssignedRef.current = true;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width, height, dpr };

      const targetCount = getParticleCountForProgress(progressRef.current);
      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles(targetCount, width, height);
      } else if (particlesRef.current.length < targetCount) {
        const toAdd = targetCount - particlesRef.current.length;
        for (let i = 0; i < toAdd; i++) {
          particlesRef.current.push(createParticle(width, height));
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const {
      repulsionRadius,
      repulsionStrength,
      returnDamping,
      maxOpacity,
      convergeLerp,
      dissolveLerp,
      formedHoldMs,
      parallaxStrength,
    } = PARTICLE_CONFIG;

    const animate = (timestamp: number) => {
      const { width, height } = sizeRef.current;
      const particles = particlesRef.current;
      const { x: mx, y: my, active } = mouseState;
      const progress = progressRef.current;
      const currentPhase = phaseRef.current;
      const parallaxEnabled = mouseEnabledRef.current && active;

      const targetCount = getParticleCountForProgress(progress);
      while (particles.length < targetCount) {
        particles.push(createParticle(width, height));
      }

      if (currentPhase === "converge" && !targetsAssignedRef.current) {
        assignConvergenceTargets(particles, width, height);
      }

      const densityBoost = 1 + progress * 0.35;
      const repulsionRadiusSq = repulsionRadius * repulsionRadius;
      const isDrifting = currentPhase === "drift";
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const parallaxDx = parallaxEnabled ? mx - centerX : 0;
      const parallaxDy = parallaxEnabled ? my - centerY : 0;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      particles.sort((a, b) => a.depth - b.depth);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (currentPhase === "converge") {
          p.baseX += (p.targetX - p.baseX) * convergeLerp;
          p.baseY += (p.targetY - p.baseY) * convergeLerp;
        } else if (currentPhase === "hold") {
          p.baseX = p.targetX;
          p.baseY = p.targetY;
        } else if (currentPhase === "dissolve") {
          p.baseX += (p.originX - p.baseX) * dissolveLerp;
          p.baseY += (p.originY - p.baseY) * dissolveLerp;
        } else {
          const driftScale = 0.55 + p.depth * 0.45;
          p.baseX += Math.cos(p.angle) * p.speed * driftScale;
          p.baseY += Math.sin(p.angle) * p.speed * 0.7 * driftScale;

          if (p.baseX < -60) p.baseX = width + 60;
          else if (p.baseX > width + 60) p.baseX = -60;
          if (p.baseY < -40) p.baseY = height + 40;
          else if (p.baseY > height + 40) p.baseY = -40;

          if (active && mouseEnabledRef.current) {
            const dx = p.baseX - mx;
            const dy = p.baseY - my;
            const distSq = dx * dx + dy * dy;

            if (distSq < repulsionRadiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force =
                (1 - dist / repulsionRadius) *
                repulsionStrength *
                (0.5 + p.depth * 0.5);
              p.offsetX += (dx / dist) * force;
              p.offsetY += (dy / dist) * force;
            }
          }

          p.offsetX *= returnDamping;
          p.offsetY *= returnDamping;
        }

        let x = p.baseX;
        let y = p.baseY;

        if (isDrifting) {
          x += p.offsetX + parallaxDx * p.depth * parallaxStrength;
          y += p.offsetY + parallaxDy * p.depth * parallaxStrength;
        }

        let opacity = Math.min(
          maxOpacity * densityBoost,
          p.opacity * densityBoost,
        );

        if (currentPhase === "hold") {
          opacity = Math.min(0.38, opacity * 2.8);
        } else if (currentPhase === "converge") {
          opacity = Math.min(0.28, opacity * 2.2);
        } else if (currentPhase === "dissolve") {
          opacity *= 0.96;
        }

        const depthAlpha = 0.55 + p.depth * 0.45;
        opacity *= depthAlpha;

        ctx.font = `300 ${p.size}px "Space Grotesk", sans-serif`;
        ctx.fillStyle = `rgba(${p.gray}, ${p.gray}, ${p.gray}, ${opacity})`;
        ctx.fillText("67", x, y);
      }

      if (currentPhase === "converge" && targetsAssignedRef.current) {
        const first = particles[0];
        const dist = Math.hypot(
          first.targetX - first.baseX,
          first.targetY - first.baseY,
        );
        if (dist < 2) {
          phaseRef.current = "hold";
          holdStartRef.current = timestamp;
        }
      }

      if (currentPhase === "hold" && holdStartRef.current !== null) {
        if (timestamp - holdStartRef.current >= formedHoldMs) {
          if (!holdCompleteRef.current) {
            holdCompleteRef.current = true;
            onHoldCompleteRef.current?.();
          }

          phaseRef.current = "dissolve";
          holdStartRef.current = null;

          for (const p of particles) {
            p.originX = Math.random() * width;
            p.originY = Math.random() * height;
            p.angle = Math.random() * Math.PI * 2;
          }
        }
      }

      if (currentPhase === "dissolve" && !dissolveCompleteRef.current) {
        const avgDist =
          particles.reduce(
            (sum, p) =>
              sum + Math.hypot(p.originX - p.baseX, p.originY - p.baseY),
            0,
          ) / particles.length;

        if (avgDist < 6) {
          phaseRef.current = "drift";
          dissolveCompleteRef.current = true;
          onDissolveCompleteRef.current?.();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
