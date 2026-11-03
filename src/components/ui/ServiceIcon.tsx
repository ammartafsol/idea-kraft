import type { ServiceIconKey } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Custom geometric line icons drawn for Novara, on a shared 48px grid with a
 * 1.5px stroke. Each one uses `currentColor` and adds a single solid accent
 * shape, which stays visible on any theme or hover state.
 */
const paths: Record<ServiceIconKey, React.ReactNode> = {
  code: (
    <>
      <path d="M17 14 7 24l10 10M31 14l10 10-10 10" />
      <path d="m27 10-6 28" />
      <circle cx="24" cy="24" r="2.5" className="fill-accent stroke-none" />
    </>
  ),
  wordpress: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M12 16h9M27 16h9M15 16l7 20 3-9M24 16l7 20 4-12" />
      <circle cx="35.5" cy="12.5" r="2.5" className="fill-accent stroke-none" />
    </>
  ),
  layers: (
    <>
      <path d="m24 8 17 9-17 9-17-9 17-9Z" />
      <path d="m7 25 17 9 17-9M7 32l17 9 17-9" />
      <path d="m24 13 7.5 4-7.5 4-7.5-4 7.5-4Z" className="fill-accent stroke-none" />
    </>
  ),
  refresh: (
    <>
      <path d="M38 22a14 14 0 0 0-25.5-6.5M10 26a14 14 0 0 0 25.5 6.5" />
      <path d="M12 9v7h7M36 39v-7h-7" />
      <rect x="21" y="21" width="6" height="6" className="fill-accent stroke-none" />
    </>
  ),
  cart: (
    <>
      <path d="M6 9h6l4.5 21h20L41 15H14" />
      <circle cx="19" cy="38" r="2.5" />
      <circle cx="34" cy="38" r="2.5" />
      <path d="M22 22h9" className="stroke-accent" strokeWidth="4" />
    </>
  ),
  target: (
    <>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="9" />
      <path d="M24 4v8M24 36v8M4 24h8M36 24h8" />
      <circle cx="24" cy="24" r="3.5" className="fill-accent stroke-none" />
    </>
  ),
  brand: (
    <>
      <path d="M10 38V10l14 18 14-18v28" />
      <path d="M6 38h36" />
      <circle cx="24" cy="10" r="3.5" className="fill-accent stroke-none" />
    </>
  ),
  mail: (
    <>
      <rect x="6" y="11" width="36" height="26" rx="2" />
      <path d="m6 13 18 13 18-13" />
      <rect x="32" y="29" width="6" height="4" className="fill-accent stroke-none" />
    </>
  ),
  spark: (
    <>
      <path d="M24 5c1 9 6 14 15 15-9 1-14 6-15 15-1-9-6-14-15-15 9-1 14-6 15-15Z" />
      <path d="M38 33c.4 3 2 4.6 5 5-3 .4-4.6 2-5 5-.4-3-2-4.6-5-5 3-.4 4.6-2 5-5Z" className="fill-accent stroke-none" />
    </>
  ),
  cube: (
    <>
      <path d="m24 6 16 9v18l-16 9-16-9V15l16-9Z" />
      <path d="m8 15 16 9 16-9M24 24v18" />
      <path d="m24 6 16 9-16 9-16-9 16-9Z" className="fill-accent stroke-none opacity-90" />
    </>
  ),
};

export function ServiceIcon({ name, className }: { name: ServiceIconKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-12", className)}
    >
      {paths[name]}
    </svg>
  );
}
