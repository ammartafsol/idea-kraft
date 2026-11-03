"use client";

import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/* The globe (and its land data) only downloads once the section is close to the viewport. */
const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false, loading: () => <StaticGlobe /> });

let webglCache: boolean | undefined;
function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function GlobeVisual({ lat, lng, label, sublabel, className }: { lat: number; lng: number; label: string; sublabel: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "400px" });
  const visible = useInView(ref, { margin: "100px" });
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compact = !useMediaQuery("(min-width: 768px)");
  const webgl = useSyncExternalStore(() => () => {}, () => (webglCache ??= supportsWebGL()), () => false);

  return (
    <div ref={ref} className={cn("relative select-none", className)}>
      {near && webgl ? (
        <>
          <GlobeScene lat={lat} lng={lng} still={reduce} active={visible} compact={compact} labelRef={labelRef} />
          {/* Label anchored to the pin head; position and opacity are written every frame by the scene. */}
          <div ref={labelRef} aria-hidden className="pointer-events-none absolute top-0 left-0 opacity-0 will-change-transform">
            <div className="-translate-y-1/2 translate-x-4 rounded-full border border-accent/40 bg-[#101010]/85 py-1.5 pr-3.5 pl-2.5 whitespace-nowrap backdrop-blur">
              <span className="flex items-center gap-2 text-[0.78rem] text-[#f2f2ee]">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative size-2 rounded-full bg-accent" />
                </span>
                <span className="font-medium">{label}</span>
                <span className="hidden text-[#9d9d98] sm:inline">{sublabel}</span>
              </span>
            </div>
          </div>
        </>
      ) : (
        <StaticGlobe />
      )}
    </div>
  );
}

/** Lightweight stand-in (no WebGL / before load): outline globe with graticule and a pin. */
function StaticGlobe() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="absolute inset-0 m-auto size-[82%]">
      <circle cx="200" cy="200" r="160" fill="#0e0e0e" stroke="rgb(198 255 77 / 0.35)" />
      {[-60, -30, 0, 30, 60].map((lat) => {
        const ry = 160 * Math.cos((lat * Math.PI) / 180);
        const cy = 200 - 160 * Math.sin((lat * Math.PI) / 180);
        return <ellipse key={lat} cx="200" cy={cy} rx={ry} ry={ry * 0.18} fill="none" stroke="rgb(255 255 255 / 0.08)" />;
      })}
      {[0.25, 0.55, 0.85].map((k) => (
        <ellipse key={k} cx="200" cy="200" rx={160 * k} ry="160" fill="none" stroke="rgb(255 255 255 / 0.08)" />
      ))}
      <circle cx="168" cy="132" r="14" fill="none" stroke="#c6ff4d" opacity="0.5" />
      <line x1="168" y1="132" x2="168" y2="104" stroke="#c6ff4d" strokeWidth="2" />
      <circle cx="168" cy="102" r="6" fill="#c6ff4d" />
    </svg>
  );
}
