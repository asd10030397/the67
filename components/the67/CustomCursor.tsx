"use client";

import { useEffect, useRef } from "react";
import { CURSOR_LERP } from "@/lib/the67/constants";
import { mouseState } from "@/lib/the67/mouse";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const animate = () => {
      const target = mouseState;
      const pos = posRef.current;

      pos.x += (target.x - pos.x) * CURSOR_LERP;
      pos.y += (target.y - pos.y) * CURSOR_LERP;

      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

      if (visibleRef.current !== target.active) {
        visibleRef.current = target.active;
        cursor.style.opacity = target.active ? "0.5" : "0";
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] select-none font-light tracking-tight text-white"
      style={{
        fontSize: "10px",
        opacity: 0,
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      67
    </div>
  );
}
