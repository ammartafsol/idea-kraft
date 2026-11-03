import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Headline number with change vs the previous period. Direction is always
 * shown by an icon + sign, never by colour alone; `invert` flips which
 * direction counts as good (e.g. bounce rate).
 */
export function KpiTile({
  label,
  value,
  change,
  hint,
  invert = false,
  emphasis = false,
}: {
  label: string;
  value: string;
  change?: number | null;
  hint?: string;
  invert?: boolean;
  emphasis?: boolean;
}) {
  const good = change == null || change === 0 ? null : invert ? change < 0 : change > 0;
  const Icon = change == null || change === 0 ? Minus : change > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={cn("flex flex-col justify-between gap-4 rounded-lg border bg-raised p-4 sm:p-5", emphasis ? "border-line-strong" : "border-line")}>
      <p className="text-[0.8rem] text-muted">{label}</p>
      <div>
        <p className={cn("font-display font-semibold tracking-[-0.03em] tabular-nums", emphasis ? "text-[2.6rem] leading-none" : "text-[1.9rem] leading-none")}>
          {value}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
          {change === undefined ? (
            hint
          ) : (
            <>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded px-1 py-0.5 font-medium tabular-nums",
                  good === true && "bg-[#0ca30c]/12 text-[#0a7d0a] dark:text-[#5fd35f]",
                  good === false && "bg-[#d03b3b]/12 text-[#b02f2f] dark:text-[#ff8a8a]",
                  good === null && "bg-surface",
                )}
              >
                <Icon className="size-3" aria-hidden />
                {change == null ? "new" : `${change > 0 ? "+" : ""}${(change * 100).toFixed(0)}%`}
                <span className="sr-only">{good === null ? "" : good ? "(improvement)" : "(decline)"}</span>
              </span>
              <span>vs previous period</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
