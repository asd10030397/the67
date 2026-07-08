"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { VisualOverlay } from "@/components/the67/VisualOverlay";
import { EASE } from "@/lib/the67/motion";
import { SiteNav } from "./SiteNav";

type SiteShellLayout = "narrow" | "wide";

interface SiteShellProps {
  children: ReactNode;
  layout?: SiteShellLayout;
}

const MAIN_LAYOUT: Record<SiteShellLayout, string> = {
  narrow:
    "mx-auto max-w-[34rem] px-8 py-20 pb-28 sm:px-12 md:px-16 md:py-24 lg:max-w-[40rem] lg:px-20",
  wide:
    "mx-auto w-full max-w-[90rem] px-8 py-20 pb-28 sm:px-12 md:px-16 md:py-24 lg:px-20 xl:px-24 2xl:px-28",
};

export function SiteShell({ children, layout = "narrow" }: SiteShellProps) {
  return (
    <div className="the67-site relative min-h-screen bg-black text-white">
      <VisualOverlay />

      <motion.main
        className={`relative z-10 ${MAIN_LAYOUT[layout]}`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 1.8, ease: EASE.entrance },
        }}
      >
        {children}
      </motion.main>

      <SiteNav />
    </div>
  );
}
