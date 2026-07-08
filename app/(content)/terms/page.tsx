import type { Metadata } from "next";
import { TERMS_COPY } from "@/lib/site/copy";
import { createPageMetadata } from "@/lib/site/metadata";
import {
  PageMeta,
  PageSection,
  PageTitle,
} from "@/components/site/SiteTypography";

export const metadata: Metadata = createPageMetadata({
  title: "Terms",
  description: "Terms of use for THE67 — agreement, participation, and limitations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageTitle>{TERMS_COPY.title}</PageTitle>
      <PageMeta>Last updated {TERMS_COPY.lastUpdated}</PageMeta>

      {TERMS_COPY.sections.map((section) => (
        <PageSection key={section.title} title={section.title}>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </PageSection>
      ))}
    </>
  );
}
