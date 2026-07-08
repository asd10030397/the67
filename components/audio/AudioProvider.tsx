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

export function AudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const fadeProgressRef = useRef(0);
  const mutedRef = useRef(false);
  const startedRef = useRef(false);
  const pendingRetryRef = useRef(false);
  const readyRef = useRef(false);
  const isInitializedRef = useRef(false);
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

        await waitUntilReady(audio);
        await audio.play();
        pendingRetryRef.current = false;

        if (!startedRef.current) {
          startedRef.current = true;
          setHasStarted(true);
          fadeProgressRef.current = AUDIO_CONFIG.initialVolume;
          applyVolume();
          runFade(AUDIO_CONFIG.initialVolume, 1, AUDIO_CONFIG.fadeInDurationMs, easeOutExpo);
        } else if (!mutedRef.current && audio.volume === 0) {
          fadeProgressRef.current = 1;
          applyVolume();
        }

        isPlayingRef.current = true;
        setIsPlaying(true);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError" &&
          !audio.paused
        ) {
          isPlayingRef.current = true;
          setIsPlaying(true);
          pendingRetryRef.current = false;
          return;
        }

        pendingRetryRef.current = true;
        isPlayingRef.current = false;
        setIsPlaying(false);
        console.error(
          `[THE67 Audio] Playback failed for ${AUDIO_CONFIG.src}.`,
          error,
        );
      } finally {
        playInFlightRef.current = null;
      }
    })();

    playInFlightRef.current = playAttempt;
    return playAttempt;
  }, [applyVolume, runFade, waitUntilReady]);

  const startAmbient = useCallback(() => {
    if (startedRef.current || isPlayingRef.current || playInFlightRef.current) {
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
      isInitializedRef.current = true;
      audioRef.current = persistentAudio;
      return;
    }

    console.log("[THE67 Audio] Audio created");
    const audio = new Audio(AUDIO_CONFIG.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;

    persistentAudio = audio;
    audioRef.current = audio;
    isAudioInitialized = true;
    isInitializedRef.current = true;
    console.log("[THE67 Audio] Audio initialized");

    const onCanPlay = () => {
      readyRef.current = true;
      console.log(`[THE67 Audio] Loaded ${AUDIO_CONFIG.src}`);
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

    const onPointerDown = () => {
      if (pendingRetryRef.current) {
        void attemptPlaybackRef.current();
      }
    };

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      readyRef.current = true;
    }
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
