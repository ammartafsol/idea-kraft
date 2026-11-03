"use client";

import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-28 pb-16">
      <p className="eyebrow text-muted">(500) · Something broke</p>
      <h1 className="display-lg mt-6 max-w-3xl">That wasn&apos;t supposed to happen.</h1>
      <p className="lede mt-6 text-muted">An unexpected error stopped this page from loading. Trying again usually fixes it.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={reset} variant="solid" size="lg">
          Try again
        </Button>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
