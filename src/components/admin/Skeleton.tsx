import { cn } from "@/lib/utils";

/**
 * Loading placeholder with a soft shimmer. Purely decorative: the wrapping
 * region announces "Loading…" once, so screen readers don't hear every block.
 * The global reduced-motion rule stops the shimmer.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-md bg-surface", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-fg/[0.06] to-transparent" />
    </div>
  );
}

/** Accessible wrapper for a skeleton screen. */
export function SkeletonScreen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function HeaderSkeleton({ controls = true }: { controls?: boolean }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      {controls && <Skeleton className="h-9 w-full max-w-[26rem] rounded-lg" />}
    </div>
  );
}

export function CardSkeleton({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn("min-w-0 rounded-lg border border-line bg-raised p-4 sm:p-5", className)}>{children}</div>;
}

export function KpiSkeleton() {
  return (
    <CardSkeleton className="flex flex-col justify-between gap-6">
      <Skeleton className="h-3.5 w-24" />
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </CardSkeleton>
  );
}

export function BarListSkeleton({ rows = 5, title = "w-24" }: { rows?: number; title?: string }) {
  return (
    <CardSkeleton>
      <Skeleton className={cn("mb-4 h-4", title)} />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    </CardSkeleton>
  );
}

/** Table placeholder: header row + N body rows with varied cell widths. */
export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-1/3", "w-5/6"];
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-raised">
      <div className="flex gap-4 border-b border-line px-3 py-3">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className={cn("h-3", c === 0 ? "flex-[2]" : "flex-1")} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-line px-3 py-3.5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={c === 0 ? "flex-[2]" : "flex-1"}>
              <Skeleton className={cn("h-3.5", widths[(r + c) % widths.length])} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
