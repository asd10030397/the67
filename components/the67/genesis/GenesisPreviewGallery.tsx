"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import {
  GENESIS_PREVIEW_SEVEN,
  type GenesisPreviewCitizen,
} from "@/lib/the67/genesis/preview-seven";

function CitizenCard({
  citizen,
  index,
}: {
  citizen: GenesisPreviewCitizen;
  index: number;
}) {
  return (
    <motion.article
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1.6,
          delay: index * 0.12,
          ease: EASE.entrance,
        },
      }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        <Image
          src={citizen.imagePath}
          alt={`THE67 Genesis Citizen ${citizen.id}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority={index < 2}
        />
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          Genesis Citizen
        </p>
        <h2 className="text-[clamp(1.4rem,4vw,2rem)] font-light leading-none tracking-[-0.04em] text-white">
          {citizen.id}
        </h2>
        <p className="text-[10px] font-light tracking-[0.2em] text-white/25 uppercase">
          {citizen.culture} · {citizen.generation}
        </p>
        <p className="text-[clamp(0.85rem,1.9vw,0.95rem)] font-light leading-[1.6] text-white/45">
          {citizen.material}. {citizen.bodyColors}. {citizen.accessories}.
        </p>
      </div>
    </motion.article>
  );
}

export function GenesisPreviewGallery() {
  return (
    <div className="space-y-20">
      <header className="space-y-6 text-center">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          Genesis Preview Seven
        </p>
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-light leading-none tracking-[-0.05em] text-white">
          The First Seven
        </h1>
        <p className="mx-auto max-w-[30rem] text-[clamp(1rem,2.4vw,1.15rem)] font-light leading-[1.55] tracking-[-0.015em] text-white/55">
          Seven collectible citizens. One shared silhouette. The official Genesis
          announcement campaign — derived strictly from the THE67 mascot.
        </p>
      </header>

      <div className="grid gap-16 md:grid-cols-2">
        {GENESIS_PREVIEW_SEVEN.map((citizen, index) => (
          <CitizenCard key={citizen.id} citizen={citizen} index={index} />
        ))}
      </div>

      <p className="text-center text-[10px] font-light tracking-[0.14em] text-white/20">
        3000×3000 · Front three-quarter · Museum studio · Matte vinyl
      </p>
    </div>
  );
}
