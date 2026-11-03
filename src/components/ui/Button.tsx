import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "solid" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-accent-ink",
  solid: "bg-fg text-bg",
  outline: "border border-line-strong text-fg hover:border-fg",
  ghost: "text-fg",
};

const fills: Record<Variant, string> = {
  accent: "bg-fg",
  solid: "bg-accent",
  outline: "bg-fg",
  ghost: "bg-surface",
};

const hoverText: Record<Variant, string> = {
  accent: "group-hover/btn:text-bg",
  solid: "group-hover/btn:text-accent-ink",
  outline: "group-hover/btn:text-bg",
  ghost: "",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses(variant: Variant = "accent", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Inner content shared by links and buttons: a fill that rises on hover and a rolling arrow. */
function ButtonInner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0",
          fills[variant],
        )}
      />
      <span className={cn("relative z-10 inline-flex items-center gap-2 transition-colors duration-300", hoverText[variant])}>
        {children}
        {arrow && (
          <span className="relative inline-flex size-4 overflow-hidden" aria-hidden>
            <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:-translate-y-full group-hover/btn:translate-x-full" />
            <ArrowUpRight className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
          </span>
        )}
      </span>
    </>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; arrow?: boolean };

export function ButtonLink({ variant = "accent", size = "md", arrow = true, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      <ButtonInner variant={variant} arrow={arrow}>
        {children}
      </ButtonInner>
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; arrow?: boolean };

export function Button({ variant = "accent", size = "md", arrow = false, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      <ButtonInner variant={variant} arrow={arrow}>
        {children}
      </ButtonInner>
    </button>
  );
}

/** Underlined text link with an animated rule, used for "View project" style links. */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link className={cn("group/tl inline-flex items-center gap-1.5 font-medium", className)} {...props}>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tl:origin-left group-hover/tl:scale-x-0" />
      </span>
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/tl:-translate-y-0.5 group-hover/tl:translate-x-0.5" aria-hidden />
    </Link>
  );
}
