import Link from "next/link";
import { mainNav, siteConfig, socialLinks } from "@/data/site";
import { services } from "@/data/services";
import { LogoMark } from "@/components/ui/Logo";
import { StatusPill } from "@/components/ui/StatusPill";
import { BackToTopLink } from "./BackToTop";
import { FooterWordmark } from "./FooterWordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-inverse text-inverse-fg">
      <div className="container-x pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="[&_path]:fill-accent-ink [&_rect]:fill-accent" />
              <span className="font-display text-xl font-bold tracking-[-0.04em]">IDEA KRAFT</span>
            </div>
            <p className="mt-6 max-w-sm text-inverse-muted">
              An independent creative digital agency. We turn bold ideas into websites, stores and digital products
              that people remember.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-8 inline-block font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.03em] underline decoration-inverse-line decoration-1 underline-offset-[0.2em] transition-colors hover:decoration-accent"
            >
              {siteConfig.email}
            </a>
            <StatusPill className="mt-8 border-inverse-line bg-transparent text-inverse-fg" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <h2 className="eyebrow text-inverse-muted">Navigate</h2>
              <ul className="mt-5 space-y-2.5">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-inverse-muted">Services</h2>
              <ul className="mt-5 space-y-2.5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services#${s.slug}`} className="transition-colors hover:text-accent">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-inverse-muted">Follow</h2>
              <ul className="mt-5 space-y-2.5">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                    >
                      {s.label}
                      <span aria-hidden className="text-inverse-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                      </span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <FooterWordmark />

        <div className="flex flex-col gap-4 border-t border-inverse-line pt-6 text-sm text-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="hidden md:block">{siteConfig.location}</p>
          <BackToTopLink />
        </div>
      </div>
    </footer>
  );
}
