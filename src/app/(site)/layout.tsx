import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { PageLoader } from "@/components/layout/PageLoader";
import { CursorFollower } from "@/components/layout/CursorFollower";
import { Analytics } from "@/components/analytics/Analytics";

/** Chrome for the public marketing site. The admin panel has its own layout. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-fg px-5 py-3 text-sm text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200]"
      >
        Skip to content
      </a>
      <span id="top" tabIndex={-1} className="sr-only">
        Top of page
      </span>
      <PageLoader />
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <CursorFollower />
      <Analytics />
    </>
  );
}
