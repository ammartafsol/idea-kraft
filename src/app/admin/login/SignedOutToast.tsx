"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RenderToast from "@/components/ui/RenderToast";

/**
 * Confirms a sign-out with a toast, once, then removes the flag from the URL so
 * a refresh or a shared link doesn't show it again. Toasts are a browser side
 * effect, hence the effect.
 */
export function SignedOutToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const signedOut = params.get("signedOut") === "1";

  useEffect(() => {
    if (!signedOut) return;
    RenderToast({ type: "success", message: "You've been signed out." });
    const next = new URLSearchParams(params.toString());
    next.delete("signedOut");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [signedOut, params, pathname, router]);

  return null;
}
