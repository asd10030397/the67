"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import {
  GENESIS_PREVIEW_SEVEN,
  type GenesisPreviewCitizen,
} from "@/lib/the67/genesis/preview-seven";

interface GenesisGallerySceneProps {
  onContinue: () => void;
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

export function GenesisGalleryScene({ onContinue }: GenesisGallerySceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    GENESIS_PREVIEW_SEVEN[0]?.id ?? null,
  );
  const selected =
    GENESIS_PREVIEW_SEVEN.find((c) => c.id === selectedId) ?? null;

  return (
    <motion.div
      className="pointer-events-auto flex h-full w-full flex-col items-center justify-center px-6 py-6 md:px-14"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1.6, ease: EASE.entrance },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 1.2, ease: EASE.exit },
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 1.2, ease: EASE.entrance },
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
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-light tracking-[0.14em] text-white/30 uppercase"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1.2, delay: 0.15, ease: EASE.entrance },
          }}
        >
          <span>63 Public</span>
          <span className="text-white/15">·</span>
          <span>4 Creator Archive</span>
          <span className="text-white/15">·</span>
          <span>Base Network</span>
          <span className="text-white/15">·</span>
          <span>0.0067 ETH</span>
          <span className="text-white/15">·</span>
          <span>Max 1 per wallet</span>
        </motion.div>

        <div className="relative h-[clamp(10rem,28vw,16rem)] w-[clamp(10rem,28vw,16rem)]">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="relative h-full w-full overflow-hidden border border-white/10"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 1.1, ease: EASE.entrance },
                }}
                exit={{
                  opacity: 0,
                  scale: 1.02,
                  transition: { duration: 0.7, ease: EASE.exit },
                }}
              >
                <Image
                  src={selected.imagePath}
                  alt={selected.name}
                  fill
                  sizes="(max-width: 768px) 40vw, 256px"
                  className="object-cover"
                  priority
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex w-full justify-center gap-2 overflow-x-auto pb-1 md:gap-3">
          {GENESIS_PREVIEW_SEVEN.map((citizen, index) => (
            <motion.div
              key={citizen.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.9,
                  delay: 0.25 + index * 0.06,
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

        <div className="min-h-[7.5rem] w-full max-w-md">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="space-y-2.5 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, ease: EASE.entrance },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.6, ease: EASE.exit },
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
          className="cursor-none border border-white/10 bg-transparent px-10 py-3 text-[10px] font-light tracking-[0.34em] text-white/50 uppercase transition-colors duration-1000 hover:border-white/25 hover:text-white/75"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1.2, delay: 0.5, ease: EASE.entrance },
          }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}
