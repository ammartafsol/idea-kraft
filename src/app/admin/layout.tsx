import type { Metadata } from "next";

/** The admin area is private: never indexed, never linked from the public site. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Idea Kraft Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-[100svh] bg-bg text-fg">{children}</div>;
}
