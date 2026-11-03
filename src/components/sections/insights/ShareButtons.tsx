"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

const pill = "inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm transition-colors hover:border-fg";

/** Copy-link plus LinkedIn / X share. Every button performs a real action. */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  }

  function open(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className={pill}>
        {copied ? <Check className="size-4 text-accent-text" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      <button
        type="button"
        className={pill}
        onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
      >
        Share on LinkedIn
      </button>
      <button
        type="button"
        className={pill}
        onClick={() =>
          open(`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`)
        }
      >
        Share on X
      </button>
    </div>
  );
}
