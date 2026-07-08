import type { Metadata } from "next";
import { PRIVACY_COPY } from "@/lib/site/copy";
import { createPageMetadata } from "@/lib/site/metadata";
import {
  PageMeta,
  PageSection,
  PageTitle,
} from "@/components/site/SiteTypography";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description: "Privacy policy for THE67 — what we collect, how we use it, and your rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageTitle>{PRIVACY_COPY.title}</PageTitle>
      <PageMeta>Last updated {PRIVACY_COPY.lastUpdated}</PageMeta>

      {PRIVACY_COPY.sections.map((section) => (
        <PageSection key={section.title} title={section.title}>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </PageSection>
      ))}
    </>
  );
}
