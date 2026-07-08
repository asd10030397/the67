"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EASE, motionDuration, motionOffset } from "@/lib/the67/motion";
import {
  GENESIS_PREVIEW_SEVEN,
  type GenesisPreviewCitizen,
} from "@/lib/the67/genesis/preview-seven";

interface GenesisGallerySceneProps {
  onContinue: () => void;
  prefersReducedMotion?: boolean;
  isTouchDevice?: boolean;
}

function CollectionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 lg:items-start">
      <span className="text-[9px] font-light tracking-[0.18em] text-white/45 uppercase">
        {label}
      </span>
      <span className="text-[11px] font-light tracking-[0.06em] text-white/88">
        {value}
      </span>
    </div>
  );
}

function CitizenThumb({
  citizen,
  selected,
  onSelect,
}: {
  citizen: GenesisPreviewCitizen;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative h-14 w-14 shrink-0 overflow-hidden border bg-black transition-all duration-700 md:h-16 md:w-16 lg:h-[4.5rem] lg:w-[4.5rem] ${
        selected
          ? "border-white/50 opacity-100"
          : "border-white/10 opacity-50 hover:border-white/25 hover:opacity-80"
      }`}
      aria-label={`View ${citizen.name}`}
      aria-pressed={selected}
    >
      <Image
        src={citizen.imagePath}
        alt={citizen.name}
        fill
        sizes="(max-width: 1024px) 64px, 72px"
        className="object-contain"
      />
    </button>
  );
}

function CitizenPreviewImage({ citizen }: { citizen: GenesisPreviewCitizen }) {
  return (
    <motion.div
      key={citizen.id}
      className="w-full"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1.1, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.7, ease: EASE.exit },
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden border border-white/10 bg-black">
        <Image
          src={citizen.imagePath}
          alt={citizen.name}
          width={512}
          height={512}
          sizes="(max-width: 1024px) 280px, (max-width: 1536px) 420px, 520px"
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}

export function GenesisGalleryScene({
  onContinue,
  prefersReducedMotion = false,
  isTouchDevice = false,
}: GenesisGallerySceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    GENESIS_PREVIEW_SEVEN[0]?.id ?? null,
  );
  const selected =
    GENESIS_PREVIEW_SEVEN.find((c) => c.id === selectedId) ?? null;

  const transitionDuration = motionDuration(1.6, prefersReducedMotion);

  return (
    <motion.div
      className="pointer-events-auto absolute inset-0 flex items-start justify-center overflow-y-auto px-4 py-4 md:px-10 lg:items-center lg:px-12 lg:py-5 xl:px-16 2xl:px-20"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: transitionDuration, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: motionDuration(1.2, prefersReducedMotion),
          ease: EASE.exit,
        },
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="grid w-full max-w-none grid-cols-1 items-center gap-8 py-2 lg:grid-cols-[minmax(12rem,1fr)_minmax(18rem,32rem)_minmax(12rem,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(14rem,1fr)_minmax(22rem,36rem)_minmax(14rem,1fr)] xl:gap-10 2xl:gap-12">
        <motion.div
          className="space-y-4 text-center lg:pt-4 lg:text-left"
          initial={{ opacity: 0, y: motionOffset(10, prefersReducedMotion) }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: motionDuration(1.2, prefersReducedMotion),
              ease: EASE.entrance,
            },
          }}
        >
          <div className="space-y-2">
            <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
              Genesis Collection
            </p>
            <h2 className="text-[clamp(1.4rem,4vw,2.6rem)] font-light leading-none tracking-[-0.04em] text-white">
              67 Citizens
            </h2>
          </div>

          <div className="sticky top-0 z-20 -mx-1 bg-black/30 px-1 py-3 backdrop-blur-[6px]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-2 lg:gap-x-6 xl:grid-cols-3">
              <CollectionStat label="Public" value="63" />
              <CollectionStat label="Creator Archive" value="4" />
              <CollectionStat label="Network" value="Base" />
              <CollectionStat label="Price" value="0.0067 ETH" />
              <CollectionStat label="Per Wallet" value="1" />
            </div>
          </div>
        </motion.div>

        <div className="flex w-full flex-col items-center gap-4 lg:gap-5">
          <div className="relative w-full max-w-[min(80vw,20rem)] sm:max-w-sm md:max-w-md lg:max-w-none lg:w-full">
            <AnimatePresence mode="wait">
              {selected ? <CitizenPreviewImage citizen={selected} /> : null}
            </AnimatePresence>
          </div>

          <div className="flex w-full justify-center gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:gap-3 lg:overflow-visible">
            {GENESIS_PREVIEW_SEVEN.map((citizen, index) => (
              <motion.div
                key={citizen.id}
                initial={{ opacity: 0, y: motionOffset(8, prefersReducedMotion) }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: motionDuration(0.9, prefersReducedMotion),
                    delay: prefersReducedMotion ? 0 : 0.25 + index * 0.06,
                    ease: EASE.entrance,
                  },
                }}
              >
                <CitizenThumb
                  citizen={citizen}
                  selected={selectedId === citizen.id}
                  onSelect={() => setSelectedId(citizen.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex min-h-[8rem] flex-col items-center justify-between gap-5 text-center lg:items-start lg:pt-4 lg:text-left">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  className="space-y-2.5"
                  initial={{ opacity: 0, y: motionOffset(8, prefersReducedMotion) }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: motionDuration(1, prefersReducedMotion),
                      ease: EASE.entrance,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: motionDuration(0.6, prefersReducedMotion),
                      ease: EASE.exit,
                    },
                  }}
                >
                  <p className="text-[10px] font-light tracking-[0.2em] text-white/25 uppercase">
                    {selected.id}
                  </p>
                  <p className="text-[clamp(1.1rem,2.8vw,1.75rem)] font-light tracking-[-0.02em] text-white/85">
                    {selected.name}
                  </p>
                  <p className="text-[10px] font-light tracking-[0.14em] text-white/35 uppercase">
                    Origin — {selected.origin}
                  </p>
                  <p className="max-w-md text-[clamp(0.9rem,2vw,1.1rem)] font-light italic leading-[1.55] text-white/45">
                    &ldquo;{selected.quote}&rdquo;
                  </p>
                  <p className="text-[10px] font-light tracking-[0.1em] text-white/25">
                    {selected.material}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  className="text-[10px] font-light tracking-[0.14em] text-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Select a Citizen
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className={`border border-white/10 bg-transparent px-10 py-3 text-[10px] font-light tracking-[0.34em] text-white/50 uppercase transition-colors duration-1000 hover:border-white/25 hover:text-white/75 lg:self-start ${
              isTouchDevice ? "cursor-pointer" : "cursor-none"
            }`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: motionDuration(1.2, prefersReducedMotion),
                delay: prefersReducedMotion ? 0 : 0.5,
                ease: EASE.entrance,
              },
            }}
          >
            Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
