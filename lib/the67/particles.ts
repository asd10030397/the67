import { PARTICLE_CONFIG } from "./constants";

export interface Particle {
  baseX: number;
  baseY: number;
  offsetX: number;
  offsetY: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  gray: number;
  depth: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function createParticle(width: number, height: number): Particle {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const depth = Math.random();

  return {
    baseX: x,
    baseY: y,
    offsetX: 0,
    offsetY: 0,
    angle: Math.random() * Math.PI * 2,
    speed: randomBetween(PARTICLE_CONFIG.minSpeed, PARTICLE_CONFIG.maxSpeed) * (0.5 + depth * 0.5),
    size: randomBetween(PARTICLE_CONFIG.minSize, PARTICLE_CONFIG.maxSize) * (0.65 + depth * 0.55),
    opacity: randomBetween(PARTICLE_CONFIG.minOpacity, PARTICLE_CONFIG.maxOpacity) * (0.4 + depth * 0.6),
    gray: Math.round(randomBetween(60, 150)),
    depth,
    targetX: x,
    targetY: y,
    originX: x,
    originY: y,
  };
}

export function createParticles(
  count: number,
  width: number,
  height: number,
): Particle[] {
  return Array.from({ length: count }, () => createParticle(width, height));
}

export function getParticleCountForProgress(progress: number): number {
  const { baseCount, maxCount } = PARTICLE_CONFIG;
  return Math.round(baseCount + (maxCount - baseCount) * progress);
}
