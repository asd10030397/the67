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
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-[9px] font-light tracking-[0.18em] text-white/30 uppercase">
        {label}
      </span>
      <span className="text-[11px] font-light tracking-[0.06em] text-white/75">
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
      className={`relative h-14 w-14 shrink-0 overflow-hidden border transition-all duration-700 md:h-[4.5rem] md:w-[4.5rem] ${
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
        sizes="72px"
        className="object-cover"
      />
    </button>
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
      className="pointer-events-auto absolute inset-0 flex items-center justify-center overflow-y-auto px-4 py-4 md:px-8"
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
      <div className="flex w-full max-w-4xl flex-col items-center gap-5 text-center md:gap-6">
        <motion.div
          className="space-y-2"
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
          <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
            Genesis Collection
          </p>
          <h2 className="text-[clamp(1.4rem,4vw,2.2rem)] font-light leading-none tracking-[-0.04em] text-white">
            67 Citizens
          </h2>
        </motion.div>

        <motion.div
          className="grid w-full max-w-xl grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: motionDuration(1.2, prefersReducedMotion),
              delay: prefersReducedMotion ? 0 : 0.15,
              ease: EASE.entrance,
            },
          }}
        >
          <CollectionStat label="Public" value="63" />
          <CollectionStat label="Creator Archive" value="4" />
          <CollectionStat label="Network" value="Base" />
          <CollectionStat label="Price" value="0.0067 ETH" />
          <CollectionStat label="Per Wallet" value="1" />
        </motion.div>

        <div className="relative h-40 w-40 shrink-0 md:h-64 md:w-64">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="relative h-full w-full overflow-hidden border border-white/10"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: motionDuration(1.1, prefersReducedMotion),
                    ease: EASE.entrance,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: prefersReducedMotion ? 1 : 1.02,
                  transition: {
                    duration: motionDuration(0.7, prefersReducedMotion),
                    ease: EASE.exit,
                  },
                }}
              >
                <Image
                  src={selected.imagePath}
                  alt={selected.name}
                  width={256}
                  height={256}
                  sizes="(max-width: 768px) 160px, 256px"
                  className="h-full w-full object-cover"
                  priority
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex w-full max-w-[22rem] justify-center gap-2 overflow-x-auto pb-1 md:max-w-none md:gap-3">
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

        <div className="h-[7.5rem] w-full max-w-md shrink-0">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="space-y-2.5 text-center"
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
                <p className="text-[clamp(1.1rem,2.8vw,1.5rem)] font-light tracking-[-0.02em] text-white/85">
                  {selected.name}
                </p>
                <p className="text-[10px] font-light tracking-[0.14em] text-white/35 uppercase">
                  Origin — {selected.origin}
                </p>
                <p className="text-[clamp(0.9rem,2vw,1.05rem)] font-light italic leading-[1.5] text-white/45">
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
          className={`border border-white/10 bg-transparent px-10 py-3 text-[10px] font-light tracking-[0.34em] text-white/50 uppercase transition-colors duration-1000 hover:border-white/25 hover:text-white/75 ${
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
    </motion.div>
  );
}
