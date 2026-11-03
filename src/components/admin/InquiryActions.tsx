"use client";

import { useRef, useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { ConfirmDialog, type ConfirmDialogHandle } from "./ConfirmDialog";
import RenderToast from "@/components/ui/RenderToast";
import { deleteInquiry, setInquiryStatus } from "@/lib/admin/actions";
import type { InquiryStatus } from "@/lib/db/models";

const statuses: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

export function InquiryActions({ id, status, name }: { id: string; status: InquiryStatus; name: string }) {
  const [pending, startTransition] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const confirm = useRef<ConfirmDialogHandle>(null);

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`status-${id}`}>
        Status for {name}
      </label>
      <select
        id={`status-${id}`}
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const select = e.currentTarget;
          const next = select.value as InquiryStatus;
          const label = statuses.find((s) => s.value === next)?.label ?? next;
          startTransition(async () => {
            const res = await setInquiryStatus(id, next);
            if (res.ok) {
              RenderToast({ type: "success", message: `${name}'s enquiry marked as ${label}.` });
            } else {
              select.value = status; // show the value that's actually saved
              RenderToast({ type: "error", message: res.error });
            }
          });
        }}
        className="h-8 rounded-lg border border-line bg-raised px-2 text-[0.8rem]"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => confirm.current?.open()}
        aria-label={`Delete enquiry from ${name}`}
        aria-haspopup="dialog"
        className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:border-[#d03b3b] hover:text-[#d03b3b]"
      >
        {pending ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden /> : <Trash2 className="size-3.5" aria-hidden />}
      </button>

      <ConfirmDialog
        ref={confirm}
        title="Delete this enquiry?"
        description={
          <>
            The enquiry from <span className="font-medium text-fg">{name}</span>{" "}
            will be permanently removed. This can&apos;t be undone. Export to CSV first if you might need it.
          </>
        }
        pending={deleting}
        onConfirm={() =>
          startDeleting(async () => {
            const res = await deleteInquiry(id);
            confirm.current?.close();
            RenderToast(res.ok ? { type: "success", message: `Enquiry from ${name} deleted.` } : { type: "error", message: res.error });
          })
        }
      />
    </div>
  );
}

/** Marks an enquiry as read when it's opened for the first time. */
export function MarkReadOnOpen({ id, status, children }: { id: string; status: InquiryStatus; children: React.ReactNode }) {
  const [, startTransition] = useTransition();
  return (
    <details
      className="group"
      onToggle={(e) => {
        if ((e.currentTarget as HTMLDetailsElement).open && status === "new") startTransition(async () => {
            await setInquiryStatus(id, "read"); // silent: opening isn't a deliberate change
          });
      }}
    >
      {children}
    </details>
  );
}
