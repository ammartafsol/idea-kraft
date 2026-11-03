import { Suspense } from "react";
import { Download, Mail } from "lucide-react";
import { requireAdmin } from "@/lib/admin/session";
import { getInquiries, getVisitorJourney } from "@/lib/admin/analytics";
import { TZ } from "@/lib/admin/range";
import { countryFlag, countryName, fmtDateTime, fmtNumber } from "@/lib/admin/format";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ParamLink, SearchBox } from "@/components/admin/AdminControls";
import { InquiryActions, MarkReadOnOpen } from "@/components/admin/InquiryActions";
import { cn } from "@/lib/utils";
import { InquiriesBodySkeleton } from "@/components/admin/PageSkeletons";

export const metadata = { title: "Inquiries" };

const tab = "inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[0.8rem] text-muted hover:text-fg";
const tabActive = "border-fg bg-fg !text-bg";

const statusStyle: Record<string, string> = {
  new: "bg-accent text-accent-ink",
  read: "bg-surface text-fg",
  replied: "bg-[#2a78d6]/14 text-[#1f5fae] dark:text-[#86b6ef]",
  archived: "bg-surface text-muted",
};

export default async function InquiriesPage({ searchParams }: PageProps<"/admin/inquiries">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = sp.sort === "oldest" ? "oldest" : "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  return (
    <>
      <AdminHeader title="Inquiries" description="Every contact-form submission, newest first.">
        <a href="/admin/inquiries/export" className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-raised px-3 text-sm text-muted hover:text-fg">
          <Download className="size-3.5" aria-hidden /> Export CSV
        </a>
      </AdminHeader>

      {/* Search stays outside the boundary so it keeps focus while results update. */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBox placeholder="Search name, email, company, message" />
        <ParamLink name="sort" value={sort === "newest" ? "oldest" : null} className={tab}>
          {sort === "newest" ? "Newest first" : "Oldest first"} ⇅
        </ParamLink>
      </div>

      <Suspense key={`${status}|${sort}|${page}`} fallback={<InquiriesBodySkeleton />}>
        <InquiriesBody status={status} q={q} sort={sort} page={page} />
      </Suspense>
    </>
  );
}

async function InquiriesBody({ status, q, sort, page }: { status?: string; q: string; sort: "newest" | "oldest"; page: number }) {
  const { rows, total, pageSize, counts } = await getInquiries({ status, q, page, sort });
  const journeys = await Promise.all(rows.map((r) => getVisitorJourney(r.visitorId, r.createdAt).catch(() => [])));
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <ParamLink name="status" value={null} className={tab} activeClassName={tabActive}>
          All <span className="tabular-nums opacity-70">{counts.all}</span>
        </ParamLink>
        {(["new", "read", "replied", "archived"] as const).map((s) => (
          <ParamLink key={s} name="status" value={s} className={cn(tab, "capitalize")} activeClassName={tabActive}>
            {s} <span className="tabular-nums opacity-70">{counts[s]}</span>
          </ParamLink>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-medium">{q || status ? "No enquiries match these filters." : "No enquiries yet."}</p>
          <p className="mt-1 text-sm text-muted">Submissions from the contact form appear here automatically.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r, i) => (
            <li key={r.id} className={cn("rounded-lg border bg-raised", r.status === "new" ? "border-accent/60" : "border-line")}>
              <MarkReadOnOpen id={r.id} status={r.status}>
                <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded px-1.5 py-0.5 text-[0.68rem] font-medium uppercase", statusStyle[r.status])}>{r.status}</span>
                      <span className="font-medium">{r.name}</span>
                      {r.company && <span className="text-sm text-muted">· {r.company}</span>}
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">
                      {r.projectType} · {r.budget} · {r.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted tabular-nums">{fmtDateTime(new Date(r.createdAt), TZ)}</span>
                </summary>

                <div className="grid gap-6 border-t border-line p-4 lg:grid-cols-[1fr_18rem]">
                  <div>
                    <p className="text-sm whitespace-pre-line">{r.message}</p>
                    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                      <div><dt className="text-xs text-muted">Email</dt><dd className="truncate"><a href={`mailto:${r.email}`} className="underline underline-offset-2">{r.email}</a></dd></div>
                      <div><dt className="text-xs text-muted">Project</dt><dd>{r.projectType}</dd></div>
                      <div><dt className="text-xs text-muted">Budget</dt><dd>{r.budget}</dd></div>
                      <div><dt className="text-xs text-muted">Country</dt><dd>{countryFlag(r.country)} {countryName(r.country)}</dd></div>
                    </dl>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <a
                        href={`mailto:${r.email}?subject=${encodeURIComponent(`Re: your ${r.projectType.toLowerCase()} enquiry`)}`}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-fg px-3 text-[0.8rem] text-bg"
                      >
                        <Mail className="size-3.5" aria-hidden /> Reply by email
                      </a>
                      <InquiryActions key={r.status} id={r.id} status={r.status} name={r.name} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted">Visitor journey before enquiring</h3>
                    {journeys[i].length === 0 ? (
                      <p className="mt-2 text-xs text-muted">Not available (tracking was off for this visitor or before analytics began).</p>
                    ) : (
                      <ol className="mt-2 space-y-1 border-l border-line pl-3 font-mono text-[0.72rem]">
                        {[...journeys[i]].reverse().map((v, j) => (
                          <li key={j} className="flex justify-between gap-3">
                            <span className="truncate">{v.path}</span>
                            <span className="shrink-0 text-muted">{fmtDateTime(new Date(v.ts), TZ)}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </MarkReadOnOpen>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {page} of {pages} · {fmtNumber(total)} enquiries
          </span>
          <div className="flex gap-2">
            {page > 1 && <ParamLink name="page" value={String(page - 1)} className={tab}>← Previous</ParamLink>}
            {page < pages && <ParamLink name="page" value={String(page + 1)} className={tab}>Next →</ParamLink>}
          </div>
        </nav>
      )}
    </>
  );
}
