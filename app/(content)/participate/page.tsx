import type { Metadata } from "next";
import { ParticipatePageContent } from "@/components/participation/ParticipatePageContent";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Participate",
  description:
    "How to participate in THE67 — a voluntary, personal choice to be present and document what meaning you create.",
  path: "/participate",
});

export default function ParticipatePage() {
  return <ParticipatePageContent />;
}
