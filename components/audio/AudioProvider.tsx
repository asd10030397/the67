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

export function AudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const fadeProgressRef = useRef(0);
  const mutedRef = useRef(false);
  const startedRef = useRef(false);
  const pendingRetryRef = useRef(false);
  const readyRef = useRef(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
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

  const beginFadeIn = useCallback(() => {
    fadeProgressRef.current = 0;
    applyVolume();
    runFade(0, 1, AUDIO_CONFIG.fadeInDurationMs, easeOutExpo);
  }, [applyVolume, runFade]);

  const attemptPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!startedRef.current) {
        audio.currentTime = 0;
      }

      if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        audio.load();
      }

      await audio.play();
      pendingRetryRef.current = false;

      if (!startedRef.current) {
        startedRef.current = true;
        setHasStarted(true);
        beginFadeIn();
      } else if (!mutedRef.current && audio.volume === 0) {
        fadeProgressRef.current = 1;
        applyVolume();
      }

      setIsPlaying(true);
    } catch {
      pendingRetryRef.current = true;
      setIsPlaying(false);
    }
  }, [applyVolume, beginFadeIn]);

  const startAmbient = useCallback(() => {
    void attemptPlayback();
  }, [attemptPlayback]);

  const handleInteraction = useCallback(() => {
    if (!startedRef.current || pendingRetryRef.current) {
      void attemptPlayback();
    }
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
    mutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const audio = new Audio(AUDIO_CONFIG.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const onCanPlay = () => {
      readyRef.current = true;
    };

    const onError = () => {
      readyRef.current = false;
      pendingRetryRef.current = true;
    };

    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    audio.load();

    window.addEventListener("pointerdown", handleInteraction, { passive: true });

    return () => {
      cancelFade();
      window.removeEventListener("pointerdown", handleInteraction);
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [handleInteraction, cancelFade]);

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
    <AudioContext.Provider value={value}>
      <audio
        src={AUDIO_CONFIG.src}
        preload="auto"
        loop
        className="hidden"
        aria-hidden="true"
      />
      {children}
    </AudioContext.Provider>
  );
}
