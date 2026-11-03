"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarRange, LoaderCircle } from "lucide-react";
import { rangePresets, type RangeKey } from "@/lib/admin/range";
import { cn } from "@/lib/utils";

/** Date-range filter: presets as a segmented control plus a custom from/to range. Lives in the URL. */
export function RangePicker({ current, fromYmd, toYmd }: { current: RangeKey; fromYmd: string; toYmd: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [customOpen, setCustomOpen] = useState(current === "custom");
  const [from, setFrom] = useState(fromYmd);
  const [to, setTo] = useState(toYmd);

  function go(next: Record<string, string | null>) {
    const qs = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v === null ? qs.delete(k) : qs.set(k, v)));
    qs.delete("page"); // a new range starts at page 1
    startTransition(() => router.push(`${pathname}?${qs.toString()}`, { scroll: false }));
  }

  return (
    <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">
      <div role="group" aria-label="Date range" className="flex max-w-full overflow-x-auto rounded-lg border border-line bg-raised p-0.5 [scrollbar-width:none]">
        {rangePresets.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={current === p.key}
            onClick={() => {
              setCustomOpen(false);
              go({ range: p.key, from: null, to: null });
            }}
            className={cn(
              "h-8 shrink-0 rounded-md px-3 text-[0.8rem] whitespace-nowrap transition-colors",
              current === p.key ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={current === "custom"}
          aria-expanded={customOpen}
          onClick={() => setCustomOpen((o) => !o)}
          className={cn(
            "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-[0.8rem] transition-colors",
            current === "custom" ? "bg-fg text-bg" : "text-muted hover:text-fg",
          )}
        >
          <CalendarRange className="size-3.5" aria-hidden />
          Custom
        </button>
      </div>

      {customOpen && (
        <form
          className="flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            go({ range: "custom", from, to });
          }}
        >
          <label className="sr-only" htmlFor="range-from">From</label>
          <input id="range-from" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded-lg border border-line bg-raised px-2.5 text-sm" required />
          <span className="text-muted" aria-hidden>→</span>
          <label className="sr-only" htmlFor="range-to">To</label>
          <input id="range-to" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className="h-9 rounded-lg border border-line bg-raised px-2.5 text-sm" required />
          <button type="submit" className="h-9 rounded-lg bg-fg px-3.5 text-sm text-bg">
            Apply
          </button>
        </form>
      )}

      {pending && <LoaderCircle className="size-4 animate-spin text-muted" aria-label="Loading" />}
    </div>
  );
}
