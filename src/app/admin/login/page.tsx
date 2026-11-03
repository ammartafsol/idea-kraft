import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3, Inbox, Users } from "lucide-react";
import { getAdmin, getLoginPrefill } from "@/lib/admin/session";
import { LoginForm } from "./LoginForm";
import { LoginArt } from "./LoginArt";
import { SignedOutToast } from "./SignedOutToast";
import { Suspense } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const metadata: Metadata = { title: "Sign in" };

const features = [
  { icon: BarChart3, label: "Traffic & conversions" },
  { icon: Users, label: "Visitor journeys" },
  { icon: Inbox, label: "Project enquiries" },
];

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" && next.startsWith("/admin") ? next : "/admin";
  if (await getAdmin()) redirect(nextPath);

  // Pre-filled sign-in, at the owner's request (test site): anyone who opens this page can sign in.
  // Source: env vars first, else the "loginPrefill" setting in MongoDB (npm run admin:prefill).
  const stored = await getLoginPrefill().catch(() => null);
  const prefill = {
    username: process.env.ADMIN_LOGIN_PREFILL_USERNAME ?? stored?.username ?? "admin",
    password: process.env.ADMIN_LOGIN_PREFILL_PASSWORD ?? stored?.password ?? "",
  };

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[1.15fr_1fr]">
      <Suspense>
        <SignedOutToast />
      </Suspense>
      {/* Brand panel: always dark, regardless of theme */}
      <aside className="relative hidden overflow-hidden bg-[#0c0c0c] text-[#f2f2ee] lg:block" aria-hidden>
        {/* Hairline grid, echoing the public site */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-6 px-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="border-l border-white/[0.06] last:border-r" />
          ))}
        </div>
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-[36rem] rounded-full bg-[#c6ff4d]/[0.07] blur-3xl" />

        <LoginArt />

        <div className="pointer-events-none relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-8 [&_path]:fill-[#101010] [&_rect]:fill-[#c6ff4d]" />
            <span className="font-display text-lg font-bold tracking-[-0.03em]">IDEA KRAFT</span>
          </div>

          <div>
            <p className="font-mono text-[0.7rem] tracking-[0.16em] text-[#9d9d98] uppercase">Studio dashboard</p>
            <p className="mt-4 max-w-md font-display text-[clamp(2.4rem,3.6vw,3.6rem)] leading-[0.95] font-bold tracking-[-0.035em]">
              Every visit, every enquiry, <span className="text-[#c6ff4d]">in one place.</span>
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.8rem] text-[#d8d8d3] backdrop-blur">
                  <Icon className="size-3.5 text-[#c6ff4d]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            Back to website
          </Link>
          <ThemeToggle className="size-10" />
        </div>

        <div className="mx-auto flex w-full max-w-[24rem] flex-1 flex-col justify-center py-12">
          <div className="flex items-center gap-2.5 lg:hidden">
            <LogoMark className="size-9" />
            <span className="font-display text-xl font-bold tracking-[-0.03em]">IDEA KRAFT</span>
          </div>
          <p className="mt-10 font-mono text-[0.7rem] tracking-[0.16em] text-muted uppercase lg:mt-0">Admin</p>
          <h1 className="mt-3 font-display text-[2.6rem] leading-none font-bold tracking-[-0.035em]">Welcome back.</h1>
          <p className="mt-3 text-muted">Sign in to see how the site is performing.</p>
          <LoginForm next={nextPath} prefill={prefill} />
        </div>

        <p className="text-center text-xs text-muted">
          Private area · Sessions are encrypted and expire after 7 days.
        </p>
      </main>
    </div>
  );
}
