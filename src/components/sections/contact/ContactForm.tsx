"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowUpRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import {
  budgetRanges,
  contactFormSchema,
  projectTypes,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/** The anonymous analytics ID, if tracking is allowed in this browser. */
function readVisitorId() {
  try {
    return localStorage.getItem("novara-vid") ?? undefined;
  } catch {
    return undefined;
  }
}

const fieldBase =
  "peer w-full border-0 border-b border-line-strong bg-transparent px-0 pt-7 pb-3 text-lg outline-none transition-colors placeholder:text-transparent focus:border-fg aria-[invalid=true]:border-[#d4402b]";

export function ContactForm({ defaultProjectType }: { defaultProjectType?: ContactFormValues["projectType"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  // Time-trap: recorded on first interaction; humans take more than a few seconds to fill the form in.
  const [startedAt, setStartedAt] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      website: "",
      projectType: defaultProjectType,
    },
  });

  const markStarted = () => {
    if (!startedAt) setStartedAt(Date.now());
  };

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, startedAt, visitorId: readVisitorId() }),
      });
      const data: { ok: boolean; error?: string; fieldErrors?: Record<string, string> } = await res.json().catch(() => ({ ok: false }));

      if (res.ok && data.ok) {
        setStatus("success");
        reset();
        setStartedAt(0);
        return;
      }
      if (data.fieldErrors) {
        Object.entries(data.fieldErrors).forEach(([field, message]) =>
          setError(field as keyof ContactFormValues, { type: "server", message }),
        );
      }
      setServerError(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  function onInvalid(errs: FieldErrors<ContactFormValues>) {
    const first = (["name", "email", "company", "projectType", "budget", "message"] as const).find((k) => errs[k]);
    if (first && first !== "projectType" && first !== "budget") setFocus(first);
    else if (first) document.getElementById(`group-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[32rem] flex-col items-start justify-center"
          >
            <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
              <motion.circle cx="40" cy="40" r="38" className="fill-accent" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ originX: "40px", originY: "40px" }} />
              <motion.path
                d="M25 41l10 10 21-22"
                fill="none"
                stroke="#101010"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              />
            </svg>
            <h2 className="display-md mt-8">Message received.</h2>
            <p className="lede mt-4 text-muted">
              Thanks for reaching out. A real person (not a bot) will read your brief and reply soon. Keep an eye on
              your inbox, and your spam folder, just in case.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 underline decoration-1 underline-offset-4 hover:text-accent-text"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            onFocus={markStarted}
            noValidate
            className="grid gap-x-8 gap-y-8 sm:grid-cols-2"
            aria-describedby={serverError ? "form-error" : undefined}
          >
            <Field label="Your name" error={errors.name?.message} id="name" required>
              <input id="name" type="text" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={fieldBase} {...register("name")} />
            </Field>
            <Field label="Email address" error={errors.email?.message} id="email" required>
              <input id="email" type="email" autoComplete="email" inputMode="email" placeholder="Email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={fieldBase} {...register("email")} />
            </Field>
            <Field label="Company (optional)" error={errors.company?.message} id="company" className="sm:col-span-2">
              <input id="company" type="text" autoComplete="organization" placeholder="Company" aria-invalid={!!errors.company} className={fieldBase} {...register("company")} />
            </Field>

            <ChoiceGroup
              name="projectType"
              legend="What are you planning?"
              options={projectTypes}
              register={register("projectType")}
              error={errors.projectType?.message}
            />
            <ChoiceGroup
              name="budget"
              legend="Estimated budget"
              options={budgetRanges}
              register={register("budget")}
              error={errors.budget?.message}
            />

            <Field label="Tell us about the project" error={errors.message?.message} id="message" required className="sm:col-span-2">
              <textarea
                id="message"
                rows={5}
                placeholder="Project details"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : "message-hint"}
                className={cn(fieldBase, "resize-y leading-relaxed")}
                {...register("message")}
              />
              {!errors.message && (
                <p id="message-hint" className="mt-2 text-sm text-muted">
                  Goals, timeline, links to anything relevant. The more context, the better our first reply.
                </p>
              )}
            </Field>

            {/* Honeypot: hidden from people and assistive tech, often filled by bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm text-muted">
                We&apos;ll only use your details to reply to this enquiry. No newsletters, no sharing.
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-fg px-9 text-lg font-medium text-bg transition-transform active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
              >
                <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-disabled:translate-y-full" />
                <span className="relative z-10 inline-flex items-center gap-3 transition-colors duration-300 group-hover:text-accent-ink group-disabled:text-bg">
                  {status === "submitting" ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
                    </>
                  )}
                </span>
              </button>
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.p
                  id="form-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-[3px] border border-[#d4402b]/40 bg-[#d4402b]/8 p-4 text-sm sm:col-span-2"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#d4402b]" aria-hidden />
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  id,
  error,
  required,
  className,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {/* Label sits above the input text; the field has top padding to make room. */}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-0 left-0 font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase"
      >
        {label}
        {required && <span aria-hidden className="text-accent-text"> *</span>}
      </label>
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 flex items-center gap-1.5 text-sm text-[#c23a26] dark:text-[#ff7a66]"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function ChoiceGroup({
  name,
  legend,
  options,
  register,
  error,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  register: ReturnType<ReturnType<typeof useForm<ContactFormValues>>["register"]>;
  error?: string;
}) {
  return (
    <fieldset id={`group-${name}`} className="sm:col-span-2" aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase">
        {legend}
        <span aria-hidden className="text-accent-text"> *</span>
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((opt) => {
          const optId = `${name}-${opt.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
          return (
            <div key={opt}>
              <input type="radio" id={optId} value={opt} className="peer sr-only" {...register} />
              <label
                htmlFor={optId}
                className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line-strong px-4 text-sm transition-colors select-none peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg hover:border-fg"
              >
                {opt}
              </label>
            </div>
          );
        })}
      </div>
      <ErrorText id={`${name}-error`} message={error} />
    </fieldset>
  );
}
