import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="mb-16 text-[clamp(2rem,6vw,3.5rem)] font-light leading-none tracking-[-0.05em] text-white">
      {children}
    </h1>
  );
}

interface PageIntroProps {
  children: ReactNode;
}

export function PageIntro({ children }: PageIntroProps) {
  return (
    <p className="mb-16 max-w-[28rem] text-[clamp(1rem,2.4vw,1.25rem)] font-light leading-[1.55] tracking-[-0.015em] text-white/65">
      {children}
    </p>
  );
}

interface PageSectionProps {
  title?: string;
  children: ReactNode;
}

export function PageSection({ title, children }: PageSectionProps) {
  return (
    <section className="mb-12">
      {title ? (
        <h2 className="mb-5 text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
          {title}
        </h2>
      ) : null}
      <div className="space-y-4 text-[clamp(0.95rem,2.2vw,1.1rem)] font-light leading-[1.65] tracking-[-0.01em] text-white/60">
        {children}
      </div>
    </section>
  );
}

interface PageClosingProps {
  children: ReactNode;
}

export function PageClosing({ children }: PageClosingProps) {
  return (
    <p className="mt-16 text-[clamp(1rem,2.4vw,1.2rem)] font-light leading-[1.5] tracking-[-0.02em] text-white/45 italic">
      {children}
    </p>
  );
}

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="border-t border-white/10 py-8 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-[clamp(1rem,2.4vw,1.15rem)] font-light leading-[1.4] tracking-[-0.02em] text-white/80">
        {question}
      </h2>
      <p className="text-[clamp(0.95rem,2.2vw,1.05rem)] font-light leading-[1.65] tracking-[-0.01em] text-white/55">
        {answer}
      </p>
    </div>
  );
}

interface PageMetaProps {
  children: ReactNode;
}

export function PageMeta({ children }: PageMetaProps) {
  return (
    <p className="mb-12 text-[10px] font-light tracking-[0.2em] text-white/25 uppercase">
      {children}
    </p>
  );
}
