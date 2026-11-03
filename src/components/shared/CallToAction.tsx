import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/animation/SplitText";
import { Magnetic } from "@/components/animation/Magnetic";
import { Reveal } from "@/components/animation/Reveal";
import { Marquee } from "@/components/animation/Marquee";
import { siteConfig } from "@/data/site";

/** Full-bleed lime closing section, used at the end of most pages. */
export function CallToAction({
  title = ["Ready to build", "something", "extraordinary?"],
  text = "Have an idea? Let's turn it into something people remember.",
}: {
  title?: string[];
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-accent text-accent-ink">
      <Marquee duration={30} className="border-b border-accent-ink/15 py-4" reverse>
        {["Let's talk", "Start a project", "Say hello", "Book a call"].map((w) => (
          <span key={w} className="flex items-center gap-8 px-4 font-mono text-xs tracking-[0.18em] uppercase">
            {w}
            <span aria-hidden>✦</span>
          </span>
        ))}
      </Marquee>

      <div className="container-x py-24 md:py-36">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-9">
            <SplitText id="cta-title" lines={title} className="display-xl uppercase max-md:text-[11.4vw]" />
            <Reveal delay={0.3}>
              <p className="lede mt-8 text-accent-ink/75">{text}</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-6 inline-block font-medium underline decoration-1 underline-offset-4"
              >
                {siteConfig.email}
              </a>
            </Reveal>
          </div>

          <div className="md:col-span-3 md:justify-self-end">
            <Magnetic strength={0.4}>
              <Link
                href="/contact"
                className="group relative grid size-40 place-items-center overflow-hidden rounded-full bg-accent-ink text-center text-accent md:size-52"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 scale-0 rounded-full bg-bg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-100"
                />
                <span className="relative flex flex-col items-center gap-2 font-display text-xl font-semibold tracking-[-0.02em] transition-colors duration-500 group-hover:text-fg md:text-2xl">
                  <ArrowUpRight className="size-7 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                  Let&apos;s Talk
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
