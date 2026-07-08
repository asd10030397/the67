"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/SiteShell";
import { CitizenProfile } from "@/components/participation/CitizenProfile";
import { getCitizen } from "@/lib/participation/storage";
import type { Citizen } from "@/lib/participation/types";

interface CitizenPageClientProps {
  id: string;
}

export function CitizenPageClient({ id }: CitizenPageClientProps) {
  const [citizen, setCitizen] = useState<Citizen | null | undefined>(undefined);

  useEffect(() => {
    setCitizen(getCitizen(id) ?? null);
  }, [id]);

  if (citizen === undefined) {
    return (
      <SiteShell>
        <div className="min-h-[40vh]" aria-hidden="true" />
      </SiteShell>
    );
  }

  if (citizen === null) {
    notFound();
  }

  return (
    <SiteShell>
      <CitizenProfile citizen={citizen} />
    </SiteShell>
  );
}
