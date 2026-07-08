"use client";

import { useEffect, useRef } from "react";
import { CURSOR_LERP } from "@/lib/the67/constants";
import { mouseState } from "@/lib/the67/mouse";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const initializedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const animate = () => {
      const target = mouseState;
      const pos = posRef.current;

      if (!initializedRef.current && target.active) {
        pos.x = target.x;
        pos.y = target.y;
        initializedRef.current = true;
      }

      pos.x += (target.x - pos.x) * CURSOR_LERP;
      pos.y += (target.y - pos.y) * CURSOR_LERP;

      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = target.active ? "0.55" : "0";

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
      className="pointer-events-none fixed left-0 top-0 z-[100] select-none font-light text-white"
      style={{
        fontSize: "9px",
        letterSpacing: "-0.02em",
        opacity: 0,
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      67
    </div>
  );
}
