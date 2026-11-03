import { requireAdmin } from "@/lib/admin/session";
import { getBreakdown, getSessions, getTotals } from "@/lib/admin/analytics";
import { parseRange, TZ } from "@/lib/admin/range";
import { countryFlag, countryName, fmtDateTime, fmtDuration, fmtNumber, fmtPercent } from "@/lib/admin/format";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { RangePicker } from "@/components/admin/RangePicker";
import { ParamLink } from "@/components/admin/AdminControls";
import { BarList } from "@/components/admin/BarList";
import { cn } from "@/lib/utils";

export const metadata = { title: "Visitors" };

const chip = "inline-flex h-8 items-center rounded-lg border border-line px-3 text-[0.8rem] text-muted hover:text-fg";
const chipActive = "border-fg bg-fg !text-bg";

export default async function VisitorsPage({ searchParams }: PageProps<"/admin/visitors">) {
  await requireAdmin();
  const sp = await searchParams;
  const range = parseRange({ range: String(sp.range ?? ""), from: sp.from as string, to: sp.to as string });
  const type = sp.type === "new" || sp.type === "returning" ? sp.type : undefined;
  const device = typeof sp.device === "string" ? sp.device : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ current: c }, { rows, total, pageSize }, os, utm] = await Promise.all([
    getTotals(range),
    getSessions(range, { page, type, device }),
    getBreakdown(range, "os", 5),
    getBreakdown(range, "utmSource", 5),
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <AdminHeader title="Visitors" description={`Sessions and visitor journeys · ${range.label}`}>
        <RangePicker current={range.key} fromYmd={range.fromYmd} toYmd={range.toYmd} />
      </AdminHeader>

      {/* New vs returning: a part-to-whole of one total, shown as a single segmented bar. */}
      <section className="rounded-lg border border-line bg-raised p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-medium">New vs returning</h2>
          <p className="text-sm text-muted">
            <span className="font-medium text-fg tabular-nums">{fmtNumber(c.visitors)}</span> unique visitors ·{" "}
            <span className="font-medium text-fg tabular-nums">{fmtNumber(c.sessions)}</span> sessions
          </p>
        </div>
        <div className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded" role="img" aria-label={`${c.newVisitors} new and ${c.returningVisitors} returning visitors`}>
          <span className="bg-[#2a78d6] dark:bg-[#3987e5]" style={{ flexGrow: Math.max(c.newVisitors, 0.0001) }} />
          <span className="bg-[#eb6834] dark:bg-[#d95926]" style={{ flexGrow: Math.max(c.returningVisitors, 0.0001) }} />
        </div>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-[#2a78d6] dark:bg-[#3987e5]" aria-hidden />
            <dt className="text-muted">New</dt>
            <dd className="font-medium tabular-nums">
              {fmtNumber(c.newVisitors)} <span className="font-normal text-muted">({fmtPercent(c.visitors ? c.newVisitors / c.visitors : 0, 0)})</span>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-[#eb6834] dark:bg-[#d95926]" aria-hidden />
            <dt className="text-muted">Returning</dt>
            <dd className="font-medium tabular-nums">
              {fmtNumber(c.returningVisitors)} <span className="font-normal text-muted">({fmtPercent(c.visitors ? c.returningVisitors / c.visitors : 0, 0)})</span>
            </dd>
          </div>
        </dl>
      </section>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <BarList title="Operating systems" rows={os} />
        <BarList title="Campaigns (utm_source)" rows={utm.filter((r) => r.label !== "Unknown")} empty="No tagged campaign traffic. Add ?utm_source=… to links you share." />
      </div>

      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="mr-2 text-sm font-medium">Sessions</h2>
          <ParamLink name="type" value={null} className={chip} activeClassName={chipActive}>All</ParamLink>
          <ParamLink name="type" value="new" className={chip} activeClassName={chipActive}>New</ParamLink>
          <ParamLink name="type" value="returning" className={chip} activeClassName={chipActive}>Returning</ParamLink>
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          <ParamLink name="device" value={null} className={chip} activeClassName={chipActive}>Any device</ParamLink>
          {["desktop", "mobile", "tablet"].map((d) => (
            <ParamLink key={d} name="device" value={d} className={cn(chip, "capitalize")} activeClassName={chipActive}>
              {d}
            </ParamLink>
          ))}
          <span className="ml-auto text-sm text-muted">{fmtNumber(total)} sessions</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line bg-raised">
          <table className="w-full min-w-[52rem] text-sm">
            <thead className="border-b border-line text-left text-xs text-muted">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-medium">Started ({TZ.split("/")[1].replace("_", " ")})</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Visitor</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Location · device</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Source</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Journey</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Pages</th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-muted">No sessions match these filters.</td>
                </tr>
              ) : (
                rows.map((s) => (
                  <tr key={s.sessionId} className="border-t border-line align-top hover:bg-surface/60">
                    <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">{fmtDateTime(new Date(s.start), TZ)}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn("rounded px-1.5 py-0.5 text-[0.7rem] font-medium", s.isNewVisitor ? "bg-[#2a78d6]/12 text-[#1f5fae] dark:text-[#86b6ef]" : "bg-[#eb6834]/12 text-[#b4471c] dark:text-[#f2a07e]")}>
                        {s.isNewVisitor ? "New" : "Returning"}
                      </span>
                      <span className="mt-1 block font-mono text-[0.7rem] text-muted" title={s.visitorId}>#{s.visitorId.slice(0, 6)}</span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span aria-hidden className="mr-1">{countryFlag(s.country)}</span>
                      {countryName(s.country)}
                      <span className="block text-xs text-muted capitalize">{s.device} · {s.browser}</span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted">{s.referrer || "Direct"}</td>
                    <td className="px-3 py-2.5">
                      <ol className="flex max-w-md flex-wrap items-center gap-1 font-mono text-[0.72rem]">
                        {s.pages.slice(0, 6).map((p, i) => (
                          <li key={i} className="flex items-center gap-1">
                            {i > 0 && <span className="text-muted" aria-hidden>→</span>}
                            <span className="rounded bg-surface px-1.5 py-0.5">{p}</span>
                          </li>
                        ))}
                        {s.pages.length > 6 && <li className="text-muted">+{s.pages.length - 6} more</li>}
                      </ol>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{s.views}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted">{fmtDuration(s.duration)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">Page {page} of {pages}</span>
            <div className="flex gap-2">
              {page > 1 && <ParamLink name="page" value={String(page - 1)} className={chip}>← Newer</ParamLink>}
              {page < pages && <ParamLink name="page" value={String(page + 1)} className={chip}>Older →</ParamLink>}
            </div>
          </nav>
        )}
      </section>
    </>
  );
}
