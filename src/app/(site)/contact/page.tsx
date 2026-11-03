import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { siteConfig, socialLinks } from "@/data/site";
import { serviceToProjectType } from "@/lib/contact-schema";
import { SplitText } from "@/components/animation/SplitText";
import { Reveal } from "@/components/animation/Reveal";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { FindUs } from "@/components/sections/contact/FindUs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusPill } from "@/components/ui/StatusPill";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Idea Kraft. Tell us about your website, store, brand or product, and we'll reply with next steps.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service } = await searchParams;
  const defaultProjectType = typeof service === "string" ? serviceToProjectType[service] : undefined;

  return (
    <>
    <section aria-labelledby="contact-title" className="container-x pt-36 pb-28 md:pt-48 md:pb-40">
      <Eyebrow index="01">Contact</Eyebrow>
      <SplitText
        as="h1"
        id="contact-title"
        immediate
        delay={0.25}
        lines={["Let's make", "something people", "remember."]}
        className="display-xl mt-8 uppercase max-md:text-[11vw]"
      />

      <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal delay={0.4}>
            <p className="lede mb-14 text-muted">
              Tell us a little about what you&apos;re building. Every enquiry is read by a senior member of the team,
              not a sales funnel.
            </p>
            <ContactForm defaultProjectType={defaultProjectType} />
          </Reveal>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.5} className="space-y-10 lg:sticky lg:top-28">
            <StatusPill />

            <div>
              <h2 className="eyebrow flex items-center gap-2 text-muted">
                <Mail className="size-3.5" aria-hidden /> Email
              </h2>
              <a href={`mailto:${siteConfig.email}`} className="display-sm mt-3 block break-all underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-fg">
                {siteConfig.email}
              </a>
              <CopyEmail email={siteConfig.email} />
            </div>

            <div>
              <h2 className="eyebrow flex items-center gap-2 text-muted">
                <Clock className="size-3.5" aria-hidden /> Response time
              </h2>
              <p className="mt-3 text-lg">{siteConfig.responseTime}</p>
            </div>

            <div>
              <h2 className="eyebrow flex items-center gap-2 text-muted">
                <MapPin className="size-3.5" aria-hidden /> Location
              </h2>
              <a href="#find-us-title" className="mt-3 block text-lg underline decoration-line-strong decoration-1 underline-offset-4 hover:decoration-fg">
                {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.region}
              </a>
            </div>

            <div>
              <h2 className="eyebrow text-muted">Elsewhere</h2>
              <ul className="mt-3 border-t border-line">
                {socialLinks.map((s) => (
                  <li key={s.label} className="border-b border-line">
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-3.5">
                      <span>{s.label}</span>
                      <span className="text-sm text-muted transition-colors group-hover:text-fg">
                        {s.handle} <span aria-hidden>↗</span>
                      </span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>
      </div>
    </section>
    <FindUs />
    </>
  );
}
