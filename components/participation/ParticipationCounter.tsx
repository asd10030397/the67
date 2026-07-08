"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { EASE } from "@/lib/the67/motion";

interface ParticipationCounterProps {
  value: number;
  label?: string;
  className?: string;
}

export function ParticipationCounter({
  value,
  label = "Participants",
  className = "",
}: ParticipationCounterProps) {
  const motionCount = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionCount, value, {
      duration: 2,
      ease: EASE.entrance,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, motionCount]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
        {label}
      </p>
      <p
        className="text-[clamp(2.5rem,8vw,4rem)] font-light leading-none tracking-[-0.05em] text-white tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {displayValue.toLocaleString()}
      </p>
    </div>
  );
}
