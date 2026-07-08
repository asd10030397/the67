import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { GenesisPreviewGallery } from "@/components/the67/genesis/GenesisPreviewGallery";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Genesis Preview",
  description:
    "The Genesis Preview Seven — official THE67 collectible citizens for the Genesis announcement campaign.",
  path: "/genesis",
});

export default function GenesisPage() {
  return (
    <SiteShell layout="wide">
      <GenesisPreviewGallery />
    </SiteShell>
  );
}
