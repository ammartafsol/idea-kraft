"use client";

import { useActionState, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type KeyboardEvent } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, Lock, User } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/admin/actions";
import { validateLogin, type LoginFieldErrors, type LoginFields } from "@/lib/admin/login-schema";
import { cn } from "@/lib/utils";

const field =
  "h-12 w-full rounded-xl border bg-raised pr-3 pl-10 text-[0.95rem] outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:ring-4";
const fieldOk = "border-line-strong focus:border-fg focus:ring-fg/8";
const fieldBad = "border-[#d03b3b] focus:border-[#d03b3b] focus:ring-[#d03b3b]/15";

export function LoginForm({ next, prefill }: { next: string; prefill: { username: string; password: string } }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const form = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  // Client-side errors appear once a field has been touched (blurred) or the form submitted.
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<LoginFields, boolean>>>({});

  // Server field errors are copied into local state when a new response arrives,
  // so editing a field can clear its message. (Adjusting state during render is
  // React's recommended alternative to an effect here.)
  const [lastState, setLastState] = useState(state);
  const [serverErrors, setServerErrors] = useState<LoginFieldErrors>(state.fieldErrors ?? {});
  if (state !== lastState) {
    setLastState(state);
    setServerErrors(state.fieldErrors ?? {});
  }

  const trackCaps = (e: KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  function readValues() {
    const fd = new FormData(form.current ?? undefined);
    return { username: String(fd.get("username") ?? ""), password: String(fd.get("password") ?? "") };
  }

  function validateField(name: LoginFields) {
    const message = validateLogin(readValues()).errors[name];
    setErrors((prev) => ({ ...prev, [name]: message }));
  }

  function onBlur(e: FocusEvent<HTMLInputElement>) {
    const name = e.target.name as LoginFields;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as LoginFields;
    setServerErrors((s) => ({ ...s, [name]: undefined }));
    // Re-validate live only after the field has been touched, so we never nag while someone is still typing for the first time.
    if (touched[name]) validateField(name);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const { errors: next } = validateLogin(readValues());
    setErrors(next);
    setTouched({ username: true, password: true });
    if (Object.keys(next).length > 0) {
      e.preventDefault(); // stops the server action; nothing is sent
      const first = (["username", "password"] as const).find((k) => next[k]);
      if (first) form.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
    }
  }

  const errorFor = (name: LoginFields) => (touched[name] ? errors[name] : undefined) ?? serverErrors[name];
  const usernameError = errorFor("username");
  const passwordError = errorFor("password");
  const passwordDescribedBy = [passwordError && "password-error", capsLock && "caps-warning"].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={form} action={formAction} onSubmit={onSubmit} noValidate className="mt-9 space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <div className="relative mt-2">
          <User
            className={cn("pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2", usernameError ? "text-[#d03b3b]" : "text-muted")}
            aria-hidden
          />
          <input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={40}
            defaultValue={state.username ?? prefill.username}
            placeholder="admin"
            onBlur={onBlur}
            onChange={onChange}
            aria-invalid={Boolean(usernameError)}
            aria-describedby={usernameError ? "username-error" : undefined}
            className={cn(field, usernameError ? fieldBad : fieldOk)}
          />
        </div>
        <FieldError id="username-error" message={usernameError} />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative mt-2">
          <Lock
            className={cn("pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2", passwordError ? "text-[#d03b3b]" : "text-muted")}
            aria-hidden
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            defaultValue={prefill.password}
            autoComplete="current-password"
            required
            maxLength={200}
            autoFocus={Boolean(state.error)}
            placeholder="••••••••••••"
            onKeyDown={trackCaps}
            onKeyUp={trackCaps}
            onBlur={onBlur}
            onChange={onChange}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordDescribedBy}
            className={cn(field, "pr-12", passwordError ? fieldBad : fieldOk)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        <FieldError id="password-error" message={passwordError} />
        {capsLock && (
          <p id="caps-warning" className="mt-2 text-xs font-medium text-[#a86b00] dark:text-[#fab219]">
            Caps Lock is on
          </p>
        )}
      </div>

      {state.error && (
        <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#d03b3b]/35 bg-[#d03b3b]/[0.07] p-3.5 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#d03b3b]" aria-hidden />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-fg text-[0.95rem] font-medium text-bg transition-transform active:scale-[0.99] disabled:opacity-80"
      >
        <span aria-hidden className="absolute inset-0 translate-y-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-disabled:translate-y-full" />
        <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-accent-ink group-disabled:text-bg">
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </span>
      </button>
    </form>
  );
}

/** Inline field error, announced to screen readers as it appears. */
function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    // The live region always exists (only its content changes), which is what screen readers need to announce it.
    <p id={id} aria-live="polite" className={cn("flex items-center gap-1.5 text-[0.8rem] text-[#c23a26] dark:text-[#ff7a66]", message && "mt-2")}>
      {message && (
        <>
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {message}
        </>
      )}
    </p>
  );
}
