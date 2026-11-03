import { requireAdmin } from "@/lib/admin/session";
import { getTopPages, type PageSort } from "@/lib/admin/analytics";
import { parseRange } from "@/lib/admin/range";
import { fmtDuration, fmtNumber } from "@/lib/admin/format";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { RangePicker } from "@/components/admin/RangePicker";
import { SearchBox, SortHeader } from "@/components/admin/AdminControls";

export const metadata = { title: "Pages" };

export default async function PagesPage({ searchParams }: PageProps<"/admin/pages">) {
  await requireAdmin();
  const sp = await searchParams;
  const range = parseRange({ range: String(sp.range ?? ""), from: sp.from as string, to: sp.to as string });
  const q = typeof sp.q === "string" ? sp.q : "";
  const rows = await getTopPages(range, { sort: sp.sort as PageSort, dir: sp.dir === "asc" ? "asc" : "desc", q, limit: 500 });
  const totalViews = rows.reduce((s, r) => s + r.views, 0);

  return (
    <>
      <AdminHeader title="Pages" description={`Every page viewed · ${range.label}`}>
        <RangePicker current={range.key} fromYmd={range.fromYmd} toYmd={range.toYmd} />
      </AdminHeader>

      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox placeholder="Filter by path, e.g. /work" />
        <p className="text-sm text-muted">
          {rows.length} {rows.length === 1 ? "page" : "pages"} · {fmtNumber(totalViews)} views
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-raised">
        <table className="w-full min-w-[40rem] text-sm">
          <caption className="sr-only">Pages sorted by {String(sp.sort ?? "views")}</caption>
          <thead className="border-b border-line text-left text-xs">
            <tr>
              <SortHeader field="path" label="Page" defaultDir="asc" />
              <SortHeader field="views" label="Views" align="right" />
              <SortHeader field="visitors" label="Unique visitors" align="right" />
              <SortHeader field="entries" label="Entrances" align="right" />
              <SortHeader field="avgDuration" label="Avg. time" align="right" />
              <th scope="col" className="px-3 py-2.5 text-right font-medium text-muted">Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">
                  {q ? `No pages match “${q}”.` : "No page views in this period yet."}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.path} className="border-t border-line hover:bg-surface/60">
                  <td className="px-3 py-2.5">
                    <a href={r.path} target="_blank" rel="noopener" className="font-mono text-[0.8rem] hover:underline">
                      {r.path}
                    </a>
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium tabular-nums">{fmtNumber(r.views)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{fmtNumber(r.visitors)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{fmtNumber(r.entries)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{fmtDuration(r.avgDuration)}</td>
                  <td className="px-3 py-2.5">
                    <div className="ml-auto flex w-28 items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                        <span className="block h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" style={{ width: `${(r.views / Math.max(1, totalViews)) * 100}%` }} />
                      </span>
                      <span className="w-9 text-right text-xs text-muted tabular-nums">{Math.round((r.views / Math.max(1, totalViews)) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">Entrances = sessions that started on this page. Avg. time counts only visible-tab time.</p>
    </>
  );
}
