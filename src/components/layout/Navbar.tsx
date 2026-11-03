"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useState } from "react";
import { mainNav } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/animation/Magnetic";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { cn, isActivePath } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close the mobile menu when the route changes. Adjusting state during
  // render (instead of in an effect) is the React-recommended pattern.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Solid background after leaving the top; hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || menuOpen ? "border-line bg-bg/80 backdrop-blur-xl" : "border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Main"
            className={cn(
              "container-x flex items-center justify-between gap-6 transition-[height] duration-500",
              scrolled ? "h-16" : "h-20",
            )}
          >
            <Logo onClick={closeMenu} />

            <ul className="hidden items-center gap-1 lg:flex">
              {mainNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative flex h-10 items-center px-3.5 text-[0.94rem]"
                    >
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
                          {item.label}
                        </span>
                        <span aria-hidden className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
                          {item.label}
                        </span>
                      </span>
                      <AnimatePresence>
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent-text"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          />
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <Magnetic className="hidden sm:inline-flex" strength={0.25}>
                <ButtonLink href="/contact" variant="accent">
                  Let&apos;s Talk
                </ButtonLink>
              </Magnetic>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="relative grid size-11 place-items-center rounded-full bg-fg text-bg lg:hidden"
              >
                <span aria-hidden className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-full bg-current transition-all duration-500 ease-[var(--ease-out-expo)]",
                      menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-full bg-current transition-all duration-500 ease-[var(--ease-out-expo)]",
                      menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full -translate-y-full",
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  );
}
