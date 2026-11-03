import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { PageLoader } from "@/components/layout/PageLoader";
import { CursorFollower } from "@/components/layout/CursorFollower";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: Creative Digital Agency`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "creative digital agency",
    "web development",
    "UI/UX design",
    "Next.js agency",
    "WordPress development",
    "e-commerce development",
    "branding",
    "HTML email development",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name}: Creative Digital Agency`,
    description: siteConfig.tagline,
    url: "/",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: Creative Digital Agency`,
    description: siteConfig.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/* Sets the theme before first paint, so there's no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
