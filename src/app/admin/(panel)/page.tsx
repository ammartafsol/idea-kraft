import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/session";
import { getBreakdown, getTimeseries, getTopPages, getTotals } from "@/lib/admin/analytics";
import { parseRange, rangeQuery, type DateRange } from "@/lib/admin/range";
import { countryFlag, countryName, delta, fmtDecimal, fmtDuration, fmtNumber, fmtPercent } from "@/lib/admin/format";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { RangePicker } from "@/components/admin/RangePicker";
import { AutoRefresh } from "@/components/admin/AdminControls";
import { KpiTile } from "@/components/admin/KpiTile";
import { TrafficChart } from "@/components/admin/TrafficChart";
import { BarList } from "@/components/admin/BarList";
import { OverviewBodySkeleton } from "@/components/admin/PageSkeletons";

export const metadata = { title: "Overview" };

export default async function OverviewPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const range = parseRange({ range: String(sp.range ?? ""), from: sp.from as string, to: sp.to as string });

  // The header renders instantly; the data section streams in. Keying the boundary by
  // range shows the skeleton whenever the range changes.
  return (
    <>
      <AdminHeader title="Overview" description={`${range.label} · compared with the previous ${range.days === 1 ? "day" : `${range.days} days`}`}>
        <RangePicker current={range.key} fromYmd={range.fromYmd} toYmd={range.toYmd} />
        <AutoRefresh />
      </AdminHeader>
      <Suspense key={rangeQuery(range)} fallback={<OverviewBodySkeleton />}>
        <OverviewBody range={range} />
      </Suspense>
    </>
  );
}

async function OverviewBody({ range }: { range: DateRange }) {
  const [{ current: c, previous: p }, series, pages, referrers, devices, browsers, countries] = await Promise.all([
    getTotals(range),
    getTimeseries(range),
    getTopPages(range, { limit: 8 }),
    getBreakdown(range, "referrer"),
    getBreakdown(range, "device", 4),
    getBreakdown(range, "browser", 5),
    getBreakdown(range, "country", 7),
  ]);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        <KpiTile label="Unique visitors" value={fmtNumber(c.visitors)} change={delta(c.visitors, p.visitors)} emphasis />
        <KpiTile label="Page views" value={fmtNumber(c.views)} change={delta(c.views, p.views)} />
        <KpiTile label="Sessions" value={fmtNumber(c.sessions)} change={delta(c.sessions, p.sessions)} />
        <KpiTile label="New visitors" value={fmtNumber(c.newVisitors)} change={delta(c.newVisitors, p.newVisitors)} />
        <KpiTile label="Returning visitors" value={fmtNumber(c.returningVisitors)} change={delta(c.returningVisitors, p.returningVisitors)} />
        <KpiTile label="Pages / session" value={fmtDecimal(c.pagesPerSession)} change={delta(c.pagesPerSession, p.pagesPerSession)} />
        <KpiTile label="Avg. time on page" value={fmtDuration(c.avgDuration)} change={delta(c.avgDuration, p.avgDuration)} />
        <KpiTile label="Bounce rate" value={fmtPercent(c.bounceRate)} change={delta(c.bounceRate, p.bounceRate)} invert />
        <KpiTile label="Inquiries" value={fmtNumber(c.inquiries)} change={delta(c.inquiries, p.inquiries)} />
        <KpiTile label="Conversion rate" value={fmtPercent(c.conversionRate, 2)} change={delta(c.conversionRate, p.conversionRate)} />
      </div>

      <div className="mt-3">
        <TrafficChart data={series} hourly={range.hourly} />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <section className="min-w-0 rounded-lg border border-line bg-raised p-4 sm:p-5 xl:col-span-2">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-medium">Top pages</h2>
            <Link href={`/admin/pages?${rangeQuery(range)}`} className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
              All pages →
            </Link>
          </div>
          {pages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No page views in this period yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-sm">
                <thead className="text-left text-xs text-muted">
                  <tr>
                    <th scope="col" className="py-2 pr-3 font-medium">Page</th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">Views</th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">Visitors</th>
                    <th scope="col" className="py-2 pl-3 text-right font-medium">Avg. time</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((pg) => (
                    <tr key={pg.path} className="border-t border-line">
                      <td className="max-w-0 truncate py-2 pr-3 font-mono text-[0.8rem]" title={pg.path}>{pg.path}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtNumber(pg.views)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtNumber(pg.visitors)}</td>
                      <td className="py-2 pl-3 text-right tabular-nums text-muted">{fmtDuration(pg.avgDuration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <BarList title="Sources" rows={referrers} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <BarList title="Devices" rows={devices} renderLabel={(l) => <span className="capitalize">{l}</span>} />
        <BarList title="Browsers" rows={browsers} />
        <BarList
          title="Countries"
          rows={countries}
          renderLabel={(code) => (
            <>
              <span aria-hidden className="mr-1.5">{countryFlag(code)}</span>
              {code === "Other" ? "Other" : countryName(code === "Unknown" ? "" : code)}
            </>
          )}
        />
      </div>

      <p className="mt-6 text-xs text-muted">
        Privacy-first analytics: visitors are counted with an anonymous ID stored in their own browser. No cookies, no IP
        addresses; visitors with Do Not Track or Global Privacy Control enabled are not counted. Countries are only available
        when hosted on Vercel.
      </p>
    </>
  );
}
