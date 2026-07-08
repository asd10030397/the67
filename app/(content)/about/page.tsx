import type { Metadata } from "next";
import { ABOUT_COPY } from "@/lib/site/copy";
import { createPageMetadata } from "@/lib/site/metadata";
import {
  PageIntro,
  PageSection,
  PageTitle,
} from "@/components/site/SiteTypography";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "What THE67 is, what it is not, and why an ordinary number became an experiment in collective meaning.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageTitle>{ABOUT_COPY.title}</PageTitle>
      <PageIntro>{ABOUT_COPY.intro}</PageIntro>

      {ABOUT_COPY.sections.map((section) => (
        <PageSection key={section.title} title={section.title}>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </PageSection>
      ))}
    </>
  );
}
