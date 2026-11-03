"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy our email address:", email);
    }
  }

  return (
    <button type="button" onClick={copy} className="mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
      {copied ? <Check className="size-3.5 text-accent-text" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied to clipboard" : "Copy address"}</span>
    </button>
  );
}
