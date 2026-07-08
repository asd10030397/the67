import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { MascotReferenceSheet } from "@/components/the67/mascot/MascotReferenceSheet";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Mascot",
  description:
    "The official THE67 brand mascot — canonical matte vinyl character formed by the digits 6 and 7.",
  path: "/brand/mascot",
});

export default function MascotPage() {
  return (
    <SiteShell>
      <MascotReferenceSheet />
    </SiteShell>
  );
}
