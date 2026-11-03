"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useState } from "react";

function scrollToTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  // Move focus to the top of the document for keyboard and screen-reader users.
  document.getElementById("top")?.focus({ preventScroll: true });
}

/** Floating button with a ring that fills as you scroll down the page. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [visible, setVisible] = useState(false);

  // Show after the first screenful; step aside near the bottom where the footer has its own button.
  useMotionValueEvent(scrollY, "change", (y) => {
    const nearBottom = y > document.documentElement.scrollHeight - window.innerHeight - 320;
    setVisible(y > 900 && !nearBottom);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="group fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full bg-fg text-bg shadow-[0_8px_30px_rgb(0_0_0/0.18)] sm:right-6 sm:bottom-6"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
            <motion.circle cx="24" cy="24" r="22" fill="none" strokeWidth="2" className="stroke-accent" style={{ pathLength: progress }} />
          </svg>
          <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Plain text variant used in the footer. */
export function BackToTopLink() {
  return (
    <button type="button" onClick={scrollToTop} className="group inline-flex items-center gap-2 text-inverse-fg hover:text-accent">
      Back to top
      <span className="grid size-8 place-items-center rounded-full border border-inverse-line transition-colors group-hover:border-accent">
        <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </button>
  );
}
