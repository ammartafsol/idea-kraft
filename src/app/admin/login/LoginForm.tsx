"use client";

import { useActionState, useState, type KeyboardEvent } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, Lock, User } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/admin/actions";

const field =
  "h-12 w-full rounded-xl border border-line-strong bg-raised pr-3 pl-10 text-[0.95rem] outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-fg focus:ring-4 focus:ring-fg/8";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const trackCaps = (e: KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  return (
    <form action={formAction} className="mt-9 space-y-5">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <div className="relative mt-2">
          <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            defaultValue={state.username}
            placeholder="admin"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            autoFocus={Boolean(state.error)}
            placeholder="••••••••••••"
            onKeyDown={trackCaps}
            onKeyUp={trackCaps}
            aria-describedby={capsLock ? "caps-warning" : undefined}
            className={`${field} pr-12`}
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
