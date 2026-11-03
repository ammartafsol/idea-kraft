import { fmtNumber } from "@/lib/admin/format";

/**
 * Horizontal bar list for one dimension (single series, so one colour and no
 * legend). Labels and values use text tokens; the bar carries magnitude only.
 */
export function BarList({
  title,
  rows,
  unit = "visitors",
  renderLabel,
  empty = "No data for this period yet.",
}: {
  title: string;
  rows: { label: string; visitors: number }[];
  unit?: string;
  renderLabel?: (label: string) => React.ReactNode;
  empty?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  const total = rows.reduce((s, r) => s + r.visitors, 0);

  return (
    <section className="min-w-0 rounded-lg border border-line bg-raised p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-muted">{unit}</span>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.label} className="group relative flex items-center justify-between gap-3 rounded px-2 py-1.5 text-sm" title={`${r.label}: ${fmtNumber(r.visitors)} ${unit} (${Math.round((r.visitors / Math.max(1, total)) * 100)}%)`}>
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-[4px] bg-[#2a78d6]/14 transition-colors group-hover:bg-[#2a78d6]/24 dark:bg-[#3987e5]/20 dark:group-hover:bg-[#3987e5]/30"
                style={{ width: `${(r.visitors / max) * 100}%` }}
              />
              <span className="relative truncate">{renderLabel ? renderLabel(r.label) : r.label}</span>
              <span className="relative shrink-0 font-medium tabular-nums">
                {fmtNumber(r.visitors)}
                <span className="ml-2 w-9 text-right text-xs font-normal text-muted">{Math.round((r.visitors / Math.max(1, total)) * 100)}%</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
