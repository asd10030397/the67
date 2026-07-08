import type { ReactNode } from "react";
import {
  MascotExpressionSheet,
  MascotTurnaround,
  The67Mascot,
} from "@/components/the67/mascot/The67Mascot";
import { MASCOT_ANATOMY, MASCOT_SCALE, MASCOT_SPEC } from "@/lib/the67/mascot/constants";

const DELIVERABLES = [
  { id: "front", label: "01 — Front View", view: "front" as const },
  { id: "side", label: "02 — Side View", view: "side" as const },
  { id: "back", label: "03 — Back View", view: "back" as const },
  { id: "threeQuarter", label: "04 — Three-Quarter View", view: "threeQuarter" as const },
];

function DeliverableFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
        {label}
      </p>
      <div className="aspect-[5/7] w-full overflow-hidden border border-white/10 bg-black">
        {children}
      </div>
    </div>
  );
}

export function MascotReferenceSheet() {
  return (
    <div className="space-y-20">
      <header className="space-y-6">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          Official Brand Character
        </p>
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-light leading-none tracking-[-0.05em] text-white">
          THE67 Mascot
        </h1>
        <p className="max-w-[28rem] text-[clamp(1rem,2.4vw,1.2rem)] font-light leading-[1.55] tracking-[-0.015em] text-white/55">
          The canonical visual identity of THE67. Not a citizen — the permanent
          brand character from which every Genesis Citizen derives.
        </p>
        <div className="flex flex-wrap gap-6 text-[10px] font-light tracking-[0.14em] text-white/25 uppercase">
          <span>v{MASCOT_SPEC.version}</span>
          <span>Height {MASCOT_SPEC.heightTier}</span>
          <span>{MASCOT_ANATOMY.material}</span>
          <span>{MASCOT_SCALE.heightMm}mm</span>
        </div>
      </header>

      <section className="grid gap-10 md:grid-cols-2">
        {DELIVERABLES.map((item) => (
          <DeliverableFrame key={item.id} label={item.label}>
            <The67Mascot view={item.view} />
          </DeliverableFrame>
        ))}
      </section>

      <section className="space-y-4">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          05 — Turnaround Sheet
        </p>
        <div className="overflow-hidden border border-white/10 bg-black">
          <MascotTurnaround />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          06 — Expression Sheet (Pose Only)
        </p>
        <p className="text-[10px] font-light tracking-[0.1em] text-white/25">
          Facial features never change. Personality reads through pose only.
        </p>
        <div className="overflow-hidden border border-white/10 bg-black">
          <MascotExpressionSheet />
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <DeliverableFrame label="07 — Material Reference">
          <The67Mascot view="material" />
        </DeliverableFrame>
        <DeliverableFrame label="08 — Scale Reference">
          <The67Mascot view="scale" />
        </DeliverableFrame>
      </section>

      <section className="border-t border-white/10 pt-12">
        <p className="mb-6 text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          Canonical Invariants
        </p>
        <ul className="space-y-3 text-[clamp(0.9rem,2vw,1.05rem)] font-light leading-[1.6] text-white/50">
          <li>Body formed entirely by digits 6 and 7</li>
          <li>Pure white matte vinyl — no clothing, no accessories</li>
          <li>Tiny black dot eyes only — no mouth, nose, or eyebrows</li>
          <li>Rounded capsule limbs — medium height, premium toy proportions</li>
          <li>No cultural references on the brand mascot</li>
          <li>Every Genesis Citizen must derive from this exact design</li>
        </ul>
      </section>
    </div>
  );
}
