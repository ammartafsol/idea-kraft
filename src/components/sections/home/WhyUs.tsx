import { reasons, stats } from "@/data/studio";
import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { Counter } from "@/components/animation/Counter";
import { TouchActive } from "@/components/animation/TouchActive";
import { PlaceholderNote } from "@/components/ui/Eyebrow";
import { cn, pad } from "@/lib/utils";

/** Inverted block: reasons to work with us, then the (illustrative) numbers. */
export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="relative overflow-hidden bg-inverse text-inverse-fg">
      <div className="container-x section-y">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-inverse-muted">
              <span className="text-inverse-fg">(04)</span>
              <span aria-hidden className="h-px w-8 bg-inverse-line" />
              Why Idea Kraft
            </p>
            <SplitText id="why-title" lines={["Details are", "the design."]} className="display-lg mt-6" />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-sm text-inverse-muted">
                Plenty of studios can make something look good in a mock-up. We care about how it behaves on a
                real phone, for a real customer, a year after launch.
              </p>
            </Reveal>
          </div>

          <ol className="grid border-t border-inverse-line sm:grid-cols-2 md:col-span-7">
            {reasons.map((r, i) => (
              <Reveal
                as="li"
                key={r.title}
                delay={(i % 2) * 0.08 + Math.floor(i / 2) * 0.06}
                className="group relative border-b border-inverse-line p-7 transition-colors sm:even:border-l duration-500 hover:bg-[color-mix(in_srgb,var(--inverse-bg)_92%,var(--accent))] md:p-9"
              >
                <TouchActive>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100 touch-active:scale-x-100"
                  />
                  <span className="font-mono text-xs text-inverse-muted transition-colors group-hover:text-accent touch-active:text-accent">
                    {pad(i + 1)}
                  </span>
                  <h3 className="display-sm mt-8 transition-colors duration-500 touch-active:text-accent md:mt-14">{r.title}</h3>
                  <p className="mt-3 text-[0.95rem] text-inverse-muted">{r.text}</p>
                </TouchActive>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-24 border-t border-inverse-line pt-10 md:mt-36">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="eyebrow text-inverse-muted">Studio in numbers</h3>
            <PlaceholderNote className="text-inverse-muted">Illustrative placeholders: replace with verified figures</PlaceholderNote>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col-reverse",
                  i % 2 === 1 && "border-l border-inverse-line pl-6 lg:pl-8",
                  i === 2 && "lg:border-l lg:border-inverse-line lg:pl-8",
                )}
              >
                <dt className="mt-3 text-inverse-muted">{s.label}</dt>
                <dd className="font-display text-[clamp(3.25rem,8vw,7.5rem)] leading-none font-bold tracking-[-0.05em] text-accent">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
