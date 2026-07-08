"use client";

import { PARTICIPATE_COPY } from "@/lib/site/copy";
import {
  PageClosing,
  PageIntro,
  PageSection,
  PageTitle,
} from "@/components/site/SiteTypography";
import { ParticipationCounter } from "@/components/participation/ParticipationCounter";
import { ParticipateButton } from "@/components/participation/ParticipateButton";
import { useParticipation } from "@/components/participation/ParticipationManager";

export function ParticipatePageContent() {
  const { participantCount } = useParticipation();

  return (
    <>
      <PageTitle>{PARTICIPATE_COPY.title}</PageTitle>
      <PageIntro>{PARTICIPATE_COPY.intro}</PageIntro>

      <ParticipationCounter value={participantCount} className="mb-16" />

      {PARTICIPATE_COPY.sections.map((section) => (
        <PageSection key={section.title} title={section.title}>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </PageSection>
      ))}

      <ParticipateButton className="mt-16" />

      <PageClosing>{PARTICIPATE_COPY.closing}</PageClosing>
    </>
  );
}
