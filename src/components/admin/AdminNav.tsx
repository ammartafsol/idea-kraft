"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Inbox, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/visitors", label: "Visitors", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

export function AdminNav({ newInquiries, orientation = "vertical" }: { newInquiries: number; orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className={cn(orientation === "vertical" ? "space-y-0.5" : "flex gap-1 overflow-x-auto [scrollbar-width:none]")}>
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                  orientation === "vertical" ? "px-3 py-2" : "px-3 py-1.5",
                  active ? "bg-fg text-bg" : "text-muted hover:bg-surface hover:text-fg",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
                {href === "/admin/inquiries" && newInquiries > 0 && (
                  <span className={cn("ml-auto rounded-full px-1.5 text-[0.7rem] font-medium tabular-nums", active ? "bg-accent text-accent-ink" : "bg-accent text-accent-ink")}>
                    {newInquiries}
                    <span className="sr-only"> new</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
