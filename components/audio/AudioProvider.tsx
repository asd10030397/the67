"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AUDIO_CONFIG } from "@/lib/audio/constants";
import { easeInOutSine, easeOutExpo } from "@/lib/audio/easing";

interface AudioContextValue {
  isMuted: boolean;
  isPlaying: boolean;
  hasStarted: boolean;
  toggleMute: () => void;
  startAmbient: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioManager");
  }
  return context;
}

interface AudioProviderProps {
  children: ReactNode;
}

// Survives React Strict Mode remounts so only one element is ever created.
let persistentAudio: HTMLAudioElement | null = null;
let isAudioInitialized = false;

function configureAudioElement(audio: HTMLAudioElement) {
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "");
}

function markPlaybackStarted(
  startedRef: { current: boolean },
  setHasStarted: (value: boolean) => void,
  fadeProgressRef: { current: number },
  applyVolume: () => void,
  runFade: (
    from: number,
    to: number,
    durationMs: number,
    easing?: (t: number) => number,
    onComplete?: () => void,
  ) => void,
) {
  if (!startedRef.current) {
    startedRef.current = true;
    setHasStarted(true);
    fadeProgressRef.current = AUDIO_CONFIG.initialVolume;
    applyVolume();
    runFade(AUDIO_CONFIG.initialVolume, 1, AUDIO_CONFIG.fadeInDurationMs, easeOutExpo);
  }
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const fadeProgressRef = useRef(0);
  const mutedRef = useRef(false);
  const startedRef = useRef(false);
  const pendingRetryRef = useRef(false);
  const readyRef = useRef(false);
  const isPlayingRef = useRef(false);
  const playInFlightRef = useRef<Promise<void> | null>(null);
  const attemptPlaybackRef = useRef<() => Promise<void>>(async () => {});

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }, []);

  const waitUntilReady = useCallback((audio: HTMLAudioElement) => {
    if (readyRef.current || audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanup();
        readyRef.current = true;
        resolve();
      };

      const onErr = () => {
        cleanup();
        reject(audio.error ?? new Error("Audio failed to load"));
      };

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onReady);
        audio.removeEventListener("error", onErr);
      };

      audio.addEventListener("canplaythrough", onReady);
      audio.addEventListener("error", onErr);
    });
  }, []);

  const applyVolume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (mutedRef.current) {
      audio.volume = 0;
      return;
    }

    const eased = easeInOutSine(fadeProgressRef.current);
    audio.volume = AUDIO_CONFIG.targetVolume * eased;
  }, []);

  const runFade = useCallback(
    (
      from: number,
      to: number,
      durationMs: number,
      easing: (t: number) => number = easeOutExpo,
      onComplete?: () => void,
    ) => {
      cancelFade();
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const linear = Math.min(elapsed / durationMs, 1);
        const eased = easing(linear);
        fadeProgressRef.current = from + (to - from) * eased;
        applyVolume();

        if (linear < 1) {
          fadeRafRef.current = requestAnimationFrame(tick);
        } else {
          fadeRafRef.current = null;
          onComplete?.();
        }
      };

      fadeRafRef.current = requestAnimationFrame(tick);
    },
    [applyVolume, cancelFade],
  );

  const handlePlaybackSuccess = useCallback(() => {
    pendingRetryRef.current = false;
    markPlaybackStarted(
      startedRef,
      setHasStarted,
      fadeProgressRef,
      applyVolume,
      runFade,
    );

    const audio = audioRef.current;
    if (startedRef.current && !mutedRef.current && audio && audio.volume === 0) {
      fadeProgressRef.current = 1;
      applyVolume();
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
  }, [applyVolume, runFade]);

  const attemptPlayback = useCallback(async () => {
    if (playInFlightRef.current) {
      return playInFlightRef.current;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const playAttempt = (async () => {
      try {
        if (!startedRef.current) {
          audio.currentTime = 0;
        }

        // iOS Safari: call play() immediately while the user gesture is active.
        try {
          await audio.play();
          handlePlaybackSuccess();
          return;
        } catch (immediateError) {
          if (
            immediateError instanceof DOMException &&
            immediateError.name === "AbortError" &&
            !audio.paused
          ) {
            handlePlaybackSuccess();
            return;
          }

          if (
            immediateError instanceof DOMException &&
            immediateError.name === "NotAllowedError"
          ) {
            pendingRetryRef.current = true;
            isPlayingRef.current = false;
            setIsPlaying(false);
            return;
          }
        }

        await waitUntilReady(audio);
        await audio.play();
        handlePlaybackSuccess();
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError" &&
          audio.paused === false
        ) {
          handlePlaybackSuccess();
          return;
        }

        if (
          error instanceof DOMException &&
          error.name === "NotAllowedError"
        ) {
          pendingRetryRef.current = true;
        } else {
          pendingRetryRef.current = true;
          console.error(
            `[THE67 Audio] Playback failed for ${AUDIO_CONFIG.src}.`,
            error,
          );
        }

        isPlayingRef.current = false;
        setIsPlaying(false);
      } finally {
        playInFlightRef.current = null;
      }
    })();

    playInFlightRef.current = playAttempt;
    return playAttempt;
  }, [handlePlaybackSuccess, waitUntilReady]);

  const startAmbient = useCallback(() => {
    if (startedRef.current && !pendingRetryRef.current) {
      return;
    }
    void attemptPlayback();
  }, [attemptPlayback]);

  const toggleMute = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    const audio = audioRef.current;
    if (!audio || !startedRef.current) return;

    cancelFade();

    if (nextMuted) {
      audio.volume = 0;
      return;
    }

    if (fadeProgressRef.current >= 1) {
      audio.volume = AUDIO_CONFIG.targetVolume;
      return;
    }

    runFade(
      fadeProgressRef.current,
      1,
      AUDIO_CONFIG.unmuteFadeDurationMs,
      easeInOutSine,
    );
  }, [cancelFade, runFade]);

  useEffect(() => {
    attemptPlaybackRef.current = attemptPlayback;
  }, [attemptPlayback]);

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (isAudioInitialized) {
      audioRef.current = persistentAudio;
      return;
    }

    const audio = new Audio(AUDIO_CONFIG.src);
    configureAudioElement(audio);

    persistentAudio = audio;
    audioRef.current = audio;
    isAudioInitialized = true;

    const onCanPlay = () => {
      readyRef.current = true;
    };

    const onError = () => {
      readyRef.current = false;
      pendingRetryRef.current = true;
      const mediaError = audio.error;
      console.error(
        `[THE67 Audio] Failed to load ambient soundtrack at ${AUDIO_CONFIG.src}. Place the file at public${AUDIO_CONFIG.src}.`,
        mediaError
          ? { code: mediaError.code, message: mediaError.message }
          : undefined,
      );
    };

    const onPause = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    };

    const onPlay = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
    };

    const onUserInteraction = () => {
      if (!startedRef.current || pendingRetryRef.current) {
        void attemptPlaybackRef.current();
      }
    };

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      readyRef.current = true;
    }

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
    };
  }, []);

  const value = useMemo(
    () => ({
      isMuted,
      isPlaying,
      hasStarted,
      toggleMute,
      startAmbient,
    }),
    [isMuted, isPlaying, hasStarted, toggleMute, startAmbient],
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}
