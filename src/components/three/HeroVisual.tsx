"use client";

import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "@/hooks/useTheme";
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
 * Hero centrepiece. Desktop with a fine pointer gets the interactive WebGL
 * form. Phones, tablets, reduced-motion users and browsers without WebGL get
 * a lightweight, art-directed static orb instead.
 */
export function HeroVisual({
  pointer,
  className,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const capable = useMediaQuery("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const webgl = useSyncExternalStore(
    noop,
    () => (webglCache ??= supportsWebGL()),
    () => false,
  );
  const { theme } = useTheme();

  return (
    <div ref={ref} className={cn("relative", className)}>
      {capable && webgl ? <HeroScene pointer={pointer} dark={theme === "dark"} active={inView} /> : <StaticOrb />}
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
            background:
              "radial-gradient(circle at 32% 28%, #3a3a3a 0%, #151515 42%, #0c0c0c 70%), #101010",
            boxShadow: "inset -14px -18px 40px rgb(198 255 77 / 0.55), inset 6px 8px 24px rgb(255 255 255 / 0.08)",
          }}
        />
        <div className="absolute -inset-[18%] rotate-[-18deg] rounded-[50%] border border-line-strong [transform:rotateX(68deg)]" />
        <div className="absolute top-[8%] -right-[6%] size-3 rounded-full bg-accent" />
      </div>
    </div>
  );
}
