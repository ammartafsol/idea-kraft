"use client";

export default function AdminError({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-lg border border-line bg-raised p-6">
      <h1 className="font-display text-xl font-semibold">Couldn&apos;t load this view</h1>
      <p className="mt-2 text-sm text-muted">
        The database may be unreachable. Check that MongoDB Atlas allows connections from this server (Network Access) and that
        MONGODB_URI is correct.
      </p>
      <button type="button" onClick={reset} className="mt-5 h-9 rounded-lg bg-fg px-4 text-sm text-bg">
        Try again
      </button>
    </div>
  );
}
