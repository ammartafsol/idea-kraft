"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

/** True until the app has hydrated once. Never flips on the server. */
let isInitialLoad = true;

/**
 * A template re-mounts on every navigation, which makes it the natural place
 * for the page-enter transition: a curtain sweeps up and the new page settles
 * in beneath it. The very first load is left untouched so server-rendered
 * content is visible immediately (the intro loader handles that moment).
 */
export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
  const [animateIn] = useState(() => !isInitialLoad);

  useEffect(() => {
    isInitialLoad = false;
  }, []);

  if (!animateIn) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-inverse"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
