"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { SITE_NAV_LINKS } from "@/lib/site/navigation";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex justify-center pb-10"
      aria-label="Site"
    >
      <motion.div
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 2.5, delay: 0.6, ease: EASE.entrance },
        }}
      >
        <Link
          href="/"
          className="text-[10px] font-light tracking-[0.34em] text-white/25 uppercase transition-colors duration-1000 hover:text-white/70"
        >
          67
        </Link>

        {SITE_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[10px] font-light tracking-[0.34em] uppercase transition-colors duration-1000 hover:text-white/70 ${
              pathname === link.href ? "text-white/45" : "text-white/25"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </nav>
  );
}
