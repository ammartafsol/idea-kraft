"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sortable column header that toggles ?sort=&dir= in the URL. */
export function SortHeader({ field, label, align = "left", defaultDir = "desc" }: { field: string; label: string; align?: "left" | "right"; defaultDir?: "asc" | "desc" }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = (params.get("sort") ?? "views") === field;
  const dir = params.get("dir") ?? "desc";
  const nextDir = active ? (dir === "desc" ? "asc" : "desc") : defaultDir;
  const qs = new URLSearchParams(params.toString());
  qs.set("sort", field);
  qs.set("dir", nextDir);
  const Icon = !active ? ArrowUpDown : dir === "desc" ? ArrowDown : ArrowUp;

  return (
    <th scope="col" aria-sort={active ? (dir === "desc" ? "descending" : "ascending") : "none"} className={cn("px-3 py-2.5 font-medium", align === "right" && "text-right")}>
      <Link href={`${pathname}?${qs.toString()}`} scroll={false} className={cn("inline-flex items-center gap-1 hover:text-fg", active ? "text-fg" : "text-muted")}>
        {label}
        <Icon className="size-3" aria-hidden />
      </Link>
    </th>
  );
}

/** Search box synced to ?q= (debounced), used by Pages and Inquiries. */
export function SearchBox({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const [, startTransition] = useTransition();

  // Debounce URL updates while typing: the timer is a side effect tied to the value.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (value === current) return;
    const t = window.setTimeout(() => {
      const qs = new URLSearchParams(params.toString());
      if (value) qs.set("q", value);
      else qs.delete("q");
      qs.delete("page");
      startTransition(() => router.replace(`${pathname}?${qs.toString()}`, { scroll: false }));
    }, 300);
    return () => window.clearTimeout(t);
  }, [value, params, pathname, router]);

  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        type="search"
        aria-label={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-line bg-raised pr-3 pl-9 text-sm outline-none placeholder:text-muted focus:border-fg"
      />
    </div>
  );
}

/** Re-fetches the server-rendered dashboard every minute, plus a manual refresh button. */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Polling is an external timer subscription.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") startTransition(() => router.refresh());
    }, seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-raised px-3 text-sm text-muted hover:text-fg"
      title={`Refreshes automatically every ${seconds} seconds`}
    >
      <RefreshCw className={cn("size-3.5", pending && "animate-spin")} aria-hidden />
      Refresh
    </button>
  );
}

/** Builds a link that changes one query param while keeping the rest (filters, range, sort). */
export function ParamLink({ name, value, children, className, activeClassName }: { name: string; value: string | null; children: React.ReactNode; className?: string; activeClassName?: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const qs = new URLSearchParams(params.toString());
  if (value === null) qs.delete(name);
  else qs.set(name, value);
  if (name !== "page") qs.delete("page");
  const active = (params.get(name) ?? null) === value;
  return (
    <Link href={`${pathname}?${qs.toString()}`} scroll={false} aria-current={active ? "true" : undefined} className={cn(className, active && activeClassName)}>
      {children}
    </Link>
  );
}
