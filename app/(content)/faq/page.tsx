import type { Metadata } from "next";
import { FAQ_COPY } from "@/lib/site/copy";
import { createPageMetadata } from "@/lib/site/metadata";
import { FaqItem, PageTitle } from "@/components/site/SiteTypography";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about THE67 — what it is, what it is not, and how participation works.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageTitle>{FAQ_COPY.title}</PageTitle>

      <div className="mt-4">
        {FAQ_COPY.items.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </>
  );
}
