"use client";

import dynamic from "next/dynamic";
import { motion, useInView } from "motion/react";
import { useRef, useSyncExternalStore, type PointerEvent } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* The WebGL scene only downloads on desktop, where this panel is visible. */
const DataScene = dynamic(() => import("@/components/three/DataScene"), { ssr: false, loading: () => <StaticBars /> });

let webglCache: boolean | undefined;
function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Brand panel art for the sign-in screen: a living 3D "data landscape". */
export function LoginArt() {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const rippleAt = useRef(0);
  const visible = useInView(ref);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webgl = useSyncExternalStore(() => () => {}, () => (webglCache ??= supportsWebGL()), () => false);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerDown={() => (rippleAt.current = performance.now())}
      className="absolute inset-x-0 top-[4%] bottom-[36%] cursor-pointer"
      title="Click to send a ripple"
    >
      <motion.div
        className="size-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {desktop && webgl ? (
          <DataScene pointer={pointer} rippleAt={rippleAt} still={reduce} active={visible} />
        ) : (
          <StaticBars />
        )}
      </motion.div>
    </div>
  );
}

/** Lightweight stand-in: a bar field drawn in SVG. */
function StaticBars() {
  const heights = [0.3, 0.5, 0.8, 0.55, 0.95, 0.7, 0.4, 0.65, 0.85, 0.5, 0.3];
  return (
    <svg viewBox="0 0 440 260" aria-hidden className="absolute inset-0 m-auto h-3/5 w-auto opacity-90">
      {heights.map((h, i) => {
        const height = 40 + h * 170;
        return (
          <rect key={i} x={20 + i * 38} y={240 - height} width="26" height={height} rx="3" fill={h > 0.7 ? "#c6ff4d" : h > 0.5 ? "#3a4a1c" : "#262626"} />
        );
      })}
      <line x1="10" x2="430" y1="241" y2="241" stroke="#2a2a2a" />
    </svg>
  );
}
