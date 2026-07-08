"use client";

import { useEffect, useRef, useState } from "react";

export interface MousePosition {
  x: number;
  y: number;
  active: boolean;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<MousePosition | null>(null);

  useEffect(() => {
    const flush = () => {
      if (pendingRef.current) {
        setPosition(pendingRef.current);
        pendingRef.current = null;
      }
      rafRef.current = null;
    };

    const handleMove = (e: MouseEvent) => {
      pendingRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(flush);
      }
    };

    const handleLeave = () => {
      setPosition((prev) => ({ ...prev, active: false }));
    };

    const handleEnter = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY, active: true });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mouseenter", handleEnter);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return position;
}
