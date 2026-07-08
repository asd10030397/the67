export interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

export const mouseState: MouseState = { x: 0, y: 0, active: false };

let initialized = false;

export function initMouseTracker(): () => void {
  if (initialized || typeof window === "undefined") {
    return () => {};
  }
  initialized = true;

  const handleMove = (e: MouseEvent) => {
    mouseState.x = e.clientX;
    mouseState.y = e.clientY;
    mouseState.active = true;
  };

  const handleLeave = () => {
    mouseState.active = false;
  };

  const handleEnter = (e: MouseEvent) => {
    mouseState.x = e.clientX;
    mouseState.y = e.clientY;
    mouseState.active = true;
  };

  window.addEventListener("mousemove", handleMove, { passive: true });
  window.addEventListener("mouseleave", handleLeave);
  window.addEventListener("mouseenter", handleEnter);

  return () => {
    initialized = false;
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseleave", handleLeave);
    window.removeEventListener("mouseenter", handleEnter);
  };
}
