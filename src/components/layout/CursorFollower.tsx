"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Mode = "default" | "link" | "view" | "hidden";

/**
 * Desktop-only ring that trails the native cursor (which stays visible, so
 * nothing about pointing accuracy changes). Over project imagery
 * ([data-cursor="view"]) it grows into a "View" badge.
 */
export function CursorFollower() {
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  return enabled ? <Ring /> : null;
}

function Ring() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<Mode>("hidden");

  // Global pointer listeners are an external subscription, so they live in an effect.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const viewEl = target?.closest?.("[data-cursor='view']");
      const interactive = target?.closest?.("a, button, [role='button'], label, summary");
      const field = target?.closest?.("input, textarea, select, [contenteditable]");
      setMode(field ? "hidden" : viewEl ? "view" : interactive ? "link" : "default");
    }
    const onLeave = () => setMode("hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  const size = mode === "view" ? 96 : mode === "link" ? 56 : 28;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: mode === "hidden" ? 0 : 1,
          backgroundColor: mode === "view" ? "var(--accent)" : "rgba(0,0,0,0)",
          borderColor: mode === "view" ? "var(--accent)" : "var(--line-strong)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        <motion.span
          className="font-mono text-[0.7rem] font-medium tracking-[0.14em] text-accent-ink uppercase"
          animate={{ opacity: mode === "view" ? 1 : 0, scale: mode === "view" ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
