import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav } from "@/data/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="container-x relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16">
      <p
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(14rem,48vw,46rem)] leading-none font-bold tracking-[-0.06em] text-outline select-none"
      >
        404
      </p>
      <div className="relative max-w-3xl">
        <p className="eyebrow text-muted">(404) · Lost in the grid</p>
        <h1 id="nf-title" className="display-lg mt-6">
          This page took a different direction.
        </h1>
        <p className="lede mt-6 text-muted">
          The link may be broken, or the page may have moved. Here are some good places to land instead.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="solid" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/work" variant="outline" size="lg">
            See our work
          </ButtonLink>
        </div>
        <nav aria-label="Popular pages" className="mt-14">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-muted">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline decoration-line-strong underline-offset-4 hover:text-fg hover:decoration-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
