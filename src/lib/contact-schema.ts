import { z } from "zod";

export const projectTypes = [
  "Website design & build",
  "WordPress development",
  "E-commerce",
  "UI/UX design",
  "Website redesign",
  "Landing page",
  "Branding & identity",
  "Email templates",
  "Something else",
] as const;

export const budgetRanges = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $40k",
  "$40k – $80k",
  "$80k+",
  "Not sure yet",
] as const;

/** Shared between the client form (React Hook Form) and the API route. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80, "That name is a little long."),
  email: z.email("Please enter a valid email address.").trim().max(120),
  company: z.string().trim().max(100, "Keep the company name under 100 characters.").optional().or(z.literal("")),
  projectType: z.enum(projectTypes, { error: "Choose the option closest to your project." }),
  budget: z.enum(budgetRanges, { error: "Pick a budget range. 'Not sure yet' is fine." }),
  message: z
    .string()
    .trim()
    .min(20, "A couple of sentences helps us prepare. At least 20 characters, please.")
    .max(4000, "Please keep it under 4,000 characters. We can go deeper on a call."),
  /** Honeypot: invisible to people, irresistible to bots. Must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Timestamp of when the form was rendered, used as a time-trap. */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Client-side shape: the anti-spam timestamp is attached at submit time. */
export const contactFormSchema = contactSchema.omit({ startedAt: true });
export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Maps /services section slugs to a pre-selected project type on /contact?service=… */
export const serviceToProjectType: Record<string, (typeof projectTypes)[number]> = {
  "custom-web-development": "Website design & build",
  "wordpress-development": "WordPress development",
  "ui-ux-design": "UI/UX design",
  "website-redesign": "Website redesign",
  "ecommerce-solutions": "E-commerce",
  "landing-page-development": "Landing page",
  "branding-creative-design": "Branding & identity",
  "email-template-development": "Email templates",
};
