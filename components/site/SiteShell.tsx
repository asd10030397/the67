"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { VisualOverlay } from "@/components/the67/VisualOverlay";
import { EASE } from "@/lib/the67/motion";
import { SiteNav } from "./SiteNav";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="the67-site relative min-h-screen bg-black text-white">
      <VisualOverlay />

      <motion.main
        className="relative z-10 mx-auto max-w-[34rem] px-14 py-24 pb-32 md:px-20 md:py-28"
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
