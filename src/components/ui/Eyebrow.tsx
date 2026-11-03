import { cn } from "@/lib/utils";

/** Mono, letter-spaced section label: "(02) — Services". */
export function Eyebrow({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-muted", className)}>
      {index && <span className="text-fg">({index})</span>}
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}

/** Small bracketed disclaimer used on illustrative or placeholder content. */
export function PlaceholderNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[0.68rem] tracking-[0.08em] text-muted uppercase", className)}>
      [ {children} ]
    </p>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-line px-3 py-1 text-xs whitespace-nowrap text-muted", className)}>
      {children}
    </span>
  );
}
