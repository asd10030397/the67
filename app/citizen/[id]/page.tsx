import type { Metadata } from "next";
import { CitizenPageClient } from "@/components/participation/CitizenPageClient";
import { getAllCitizenIds } from "@/lib/participation/storage";
import { createPageMetadata } from "@/lib/site/metadata";

interface CitizenPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllCitizenIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: CitizenPageProps): Promise<Metadata> {
  const { id } = await params;

  return createPageMetadata({
    title: `Citizen ${id}`,
    description: `THE67 citizen profile for ${id}.`,
    path: `/citizen/${id}`,
  });
}

export default async function CitizenPage({ params }: CitizenPageProps) {
  const { id } = await params;
  return <CitizenPageClient id={id} />;
}
