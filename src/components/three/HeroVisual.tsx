"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "@/hooks/useTheme";
import type { OrbInteraction } from "./HeroScene";
import { cn } from "@/lib/utils";

/* Three.js is only downloaded on devices that will actually render it. */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => <StaticOrb /> });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

let webglCache: boolean | undefined;
const noop = () => () => {};

/**
 * Hero centrepiece.
 * - Desktop: mouse-follow tilt (pointer comes from the hero section).
 * - Touch: drag sideways to spin with momentum, tap to make it ripple and bounce.
 *   Vertical swipes still scroll the page (touch-action: pan-y).
 * Reduced-motion users and browsers without WebGL get a static, CSS-rendered orb.
 */
export function HeroVisual({
  pointer,
  className,
  touchable = false,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  className?: string;
  /** Enable drag/tap gestures and the "drag to spin" hint (used on phones). */
  touchable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const motionOk = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const desktop = useMediaQuery("(min-width: 768px) and (pointer: fine)");
  const webgl = useSyncExternalStore(noop, () => (webglCache ??= supportsWebGL()), () => false);
  const { theme } = useTheme();

  const interaction = useRef<OrbInteraction>({ velocity: 0, velocityAt: 0, pulseAt: 0 });
  const drag = useRef<{ x: number; t: number; moved: number } | null>(null);
  const [touched, setTouched] = useState(false);

  const live = motionOk && webgl;

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    drag.current = { x: e.clientX, t: performance.now(), moved: 0 };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dx = e.clientX - d.x;
    const dt = Math.max(8, now - d.t);
    // Convert finger velocity (px/ms) into angular velocity (rad/s), clamped so a flick feels lively but not chaotic.
    interaction.current.velocity = Math.max(-14, Math.min(14, (dx / dt) * 9));
    interaction.current.velocityAt = now;
    d.moved += Math.abs(dx);
    d.x = e.clientX;
    d.t = now;
    if (!touched) setTouched(true);
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (d && d.moved < 8) {
      // A tap: ripple + bounce, a little haptic tick where supported.
      const now = performance.now();
      interaction.current.pulseAt = now;
      interaction.current.velocity = 3;
      interaction.current.velocityAt = now;
      navigator.vibrate?.(10);
      if (!touched) setTouched(true);
    }
  }

  return (
    <div
      ref={ref}
      className={cn("relative", touchable && "cursor-grab touch-pan-y select-none active:cursor-grabbing", className)}
      {...(touchable && live
        ? { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: () => (drag.current = null) }
        : {})}
    >
      {live ? (
        <HeroScene pointer={pointer} interaction={interaction} dark={theme === "dark"} active={inView} compact={!desktop} />
      ) : (
        <StaticOrb />
      )}

      <AnimatePresence>
        {touchable && live && !touched && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3, delay: 0 } }}
            transition={{ duration: 0.6, delay: 2.4 }}
            className="pointer-events-none absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-bg/80 px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.14em] whitespace-nowrap uppercase backdrop-blur"
          >
            <motion.span
              className="inline-block"
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ↔
            </motion.span>
            Drag · Tap
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** CSS-only stand-in: a lit sphere with a lime rim and an orbit line. */
function StaticOrb() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div className="relative aspect-square w-[62%]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 32% 28%, #3a3a3a 0%, #151515 42%, #0c0c0c 70%), #101010",
            boxShadow: "inset -14px -18px 40px rgb(198 255 77 / 0.55), inset 6px 8px 24px rgb(255 255 255 / 0.08)",
          }}
        />
        <div className="absolute -inset-[18%] rotate-[-18deg] rounded-[50%] border border-line-strong [transform:rotateX(68deg)]" />
        <div className="absolute top-[8%] -right-[6%] size-3 rounded-full bg-accent" />
      </div>
    </div>
  );
}
