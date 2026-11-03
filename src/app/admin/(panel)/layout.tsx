import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/admin/session";
import { getLiveVisitors, getNewInquiryCount } from "@/lib/admin/analytics";
import { isDatabaseConfigured } from "@/lib/db/mongo";
import { logoutAction } from "@/lib/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ExcludeThisBrowser } from "@/components/admin/ExcludeThisBrowser";

export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  const dbReady = isDatabaseConfigured();
  const [newInquiries, live] = dbReady
    ? await Promise.all([getNewInquiryCount().catch(() => 0), getLiveVisitors().catch(() => 0)])
    : [0, 0];

  return (
    <div className="lg:grid lg:min-h-[100svh] lg:grid-cols-[15rem_1fr]">
      <ExcludeThisBrowser />
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-[100svh] flex-col border-r border-line bg-raised/50 p-4 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-1.5">
          <LogoMark className="size-7" />
          <span className="font-display text-[1.05rem] font-bold tracking-[-0.03em]">
            IDEA KRAFT <span className="font-mono text-[0.6rem] font-medium tracking-[0.16em] text-muted">ADMIN</span>
          </span>
        </Link>

        <p className="mt-5 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-muted">
          <span className="relative flex size-2" aria-hidden>
            {live > 0 && <span className="absolute inset-0 animate-ping rounded-full bg-[#3fbf2c] opacity-60" />}
            <span className={live > 0 ? "relative size-2 rounded-full bg-[#3fbf2c]" : "relative size-2 rounded-full bg-muted"} />
          </span>
          <span>
            <span className="font-medium text-fg tabular-nums">{live}</span> on site now
          </span>
        </p>

        <div className="mt-5 flex-1">
          <AdminNav newInquiries={newInquiries} />
        </div>

        <div className="space-y-1 border-t border-line pt-3 text-sm">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted hover:bg-surface hover:text-fg">
            <ExternalLink className="size-4" aria-hidden /> View website
          </a>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-muted hover:bg-surface hover:text-fg">
              <LogOut className="size-4" aria-hidden /> Log out
            </button>
          </form>
          <div className="flex items-center justify-between px-3 pt-2">
            <span className="text-xs text-muted">Signed in as {user}</span>
            <ThemeToggle className="size-9" />
          </div>
        </div>
      </aside>

      {/* Top bar (mobile/tablet) */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-display font-bold tracking-[-0.03em]">IDEA KRAFT</span>
            <span className="text-xs text-muted tabular-nums">· {live} live</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle className="size-9" />
            <form action={logoutAction}>
              <button type="submit" aria-label="Log out" className="grid size-9 place-items-center rounded-full border border-line text-muted">
                <LogOut className="size-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
        <div className="px-3 pb-2">
          <AdminNav newInquiries={newInquiries} orientation="horizontal" />
        </div>
      </header>

      <main id="main" className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {dbReady ? (
          children
        ) : (
          <div className="mx-auto mt-16 max-w-lg rounded-lg border border-line bg-raised p-6">
            <h1 className="font-display text-xl font-semibold">Database not connected</h1>
            <p className="mt-2 text-sm text-muted">
              Set <code className="rounded bg-surface px-1">MONGODB_URI</code> in the server environment to start collecting analytics
              and storing contact enquiries.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
