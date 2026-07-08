"use client";

import { useAudio } from "./AudioProvider";

export function AudioMuteButton() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleMute();
      }}
      className="fixed bottom-6 right-6 z-[200] flex h-10 w-10 cursor-none items-center justify-center border border-white/10 bg-black/40 text-white/40 backdrop-blur-sm transition-colors duration-500 hover:border-white/25 hover:text-white/70"
      aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
      aria-pressed={isMuted}
    >
      {isMuted ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6.5v3h2.5L9 13.5V2.5L5.5 6.5H3z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 6l3 3M14.5 6l-3 3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6.5v3h2.5L9 13.5V2.5L5.5 6.5H3z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 5.5c.8.8 1.2 1.7 1.2 2.5s-.4 1.7-1.2 2.5M12 4c1.4 1.4 2.1 3 2.1 4.5S13.4 11.6 12 13"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
