import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { ClientMarquee } from "@/components/sections/home/ClientMarquee";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { Process } from "@/components/sections/home/Process";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { CallToAction } from "@/components/shared/CallToAction";
import { JsonLd } from "@/components/shared/JsonLd";
import { siteConfig, socialLinks } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          email: siteConfig.email,
          description: siteConfig.description,
          slogan: siteConfig.tagline,
          sameAs: socialLinks.map((s) => s.href),
        }}
      />
      <Hero />
      <ClientMarquee />
      <ServicesOverview />
      <FeaturedProjects />
      <Process />
      <WhyUs />
      <Testimonials />
      <CallToAction />
    </>
  );
}
