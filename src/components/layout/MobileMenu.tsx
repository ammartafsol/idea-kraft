"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { mainNav, siteConfig, socialLinks } from "@/data/site";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn, isActivePath, pad } from "@/lib/utils";

const ease = [0.76, 0, 0.24, 1] as const;

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock page scroll, close on Escape and keep keyboard focus inside the menu.
  // These are browser side effects tied to the menu being open, which is what effects are for.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg pt-24 pb-8 lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.5, ease } }}
          transition={{ duration: 0.7, ease }}
        >
          <nav aria-label="Mobile" className="container-x flex-1">
            <ul className="border-t border-line">
              {mainNav.map((item, i) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%", transition: { duration: 0.3, ease } }}
                      transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className="flex items-baseline justify-between py-3.5"
                      >
                        <span className={cn("display-md", active && "text-accent-text")}>{item.label}</span>
                        <span className="font-mono text-xs text-muted">{pad(i + 1)}</span>
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            className="container-x mt-10 grid gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <StatusPill className="w-fit" />
            <a href={`mailto:${siteConfig.email}`} className="display-sm underline decoration-1 underline-offset-4">
              {siteConfig.email}
            </a>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
