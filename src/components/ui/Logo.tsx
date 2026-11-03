import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Idea Kraft mark is a four-point "north star" spark, paired with a tight wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <rect width="32" height="32" rx="7" className="fill-fg dark:fill-accent" />
      <path
        d="M16 5.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5-.6-5.6-4.9-9.9-10.5-10.5 5.6-.6 9.9-4.9 10.5-10.5Z"
        className="fill-accent dark:fill-accent-ink"
      />
    </svg>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Idea Kraft, home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <LogoMark className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-90" />
      <span className="font-display text-[1.15rem] font-bold leading-none tracking-[-0.04em]">
        IDEA KRAFT
      </span>
    </Link>
  );
}
