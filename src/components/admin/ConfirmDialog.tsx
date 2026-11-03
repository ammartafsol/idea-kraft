"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";

export type ConfirmDialogHandle = { open: () => void; close: () => void };

/**
 * Accessible confirmation modal built on the native <dialog> element:
 * focus is trapped, Escape and backdrop clicks cancel, and focus returns to the
 * triggering button on close. The confirm button shows a spinner while the
 * action runs and the dialog can't be dismissed mid-action.
 */
export const ConfirmDialog = forwardRef<
  ConfirmDialogHandle,
  {
    title: string;
    description: React.ReactNode;
    confirmLabel?: string;
    pending?: boolean;
    onConfirm: () => void;
  }
>(function ConfirmDialog({ title, description, confirmLabel = "Delete", pending = false, onConfirm }, ref) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialog.current?.showModal(),
    close: () => dialog.current?.close(),
  }));

  return (
    <dialog
      ref={dialog}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      onCancel={(e) => pending && e.preventDefault()}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (e.target === e.currentTarget && !pending) dialog.current?.close();
      }}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-line bg-raised p-0 text-fg shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-[2px] open:animate-[dialog-in_180ms_ease-out]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d03b3b]/12 text-[#d03b3b]" aria-hidden>
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <h2 id="confirm-title" className="font-display text-lg font-semibold tracking-[-0.02em]">
              {title}
            </h2>
            <div id="confirm-desc" className="mt-1.5 text-sm text-muted">
              {description}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            disabled={pending}
            onClick={() => dialog.current?.close()}
            className="h-10 rounded-lg border border-line px-4 text-sm font-medium hover:bg-surface disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#d03b3b] px-4 text-sm font-medium text-white hover:bg-[#b83333] disabled:opacity-80"
          >
            {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            {pending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
});
