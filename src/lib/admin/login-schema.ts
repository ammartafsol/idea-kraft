import { z } from "zod";

/**
 * Sign-in rules, shared by the login form (instant feedback) and the server
 * action (authoritative check), so client and server can never disagree.
 * Mirrors the account rules enforced by scripts/create-admin.mjs.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Enter your username.")
    .min(3, "Usernames are at least 3 characters.")
    .max(40, "Usernames are at most 40 characters.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Use only letters, numbers, dots, dashes or underscores."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .min(12, "Admin passwords are at least 12 characters.")
    .max(200, "That password is too long."),
});

export type LoginFields = keyof z.infer<typeof loginSchema>;
export type LoginFieldErrors = Partial<Record<LoginFields, string>>;

/** First error per field, in a shape that's easy to render. */
export function validateLogin(input: { username: unknown; password: unknown }) {
  const result = loginSchema.safeParse(input);
  if (result.success) return { data: result.data, errors: {} as LoginFieldErrors };
  const errors: LoginFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as LoginFields;
    errors[key] ??= issue.message;
  }
  return { data: null, errors };
}
