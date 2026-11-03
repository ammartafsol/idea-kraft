import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/* -----------------------------------------------------------------------------
   PageView: one document per page view.
   Privacy: no IP address or personal data is stored. `visitorId` is a random
   ID generated in the visitor's own browser (localStorage); `sessionId` lives
   in sessionStorage and rotates after 30 minutes of inactivity.
----------------------------------------------------------------------------- */
const pageViewSchema = new Schema(
  {
    _id: { type: String, required: true }, // client-generated view id (used to record time on page)
    path: { type: String, required: true },
    title: { type: String, default: "" },
    visitorId: { type: String, required: true },
    sessionId: { type: String, required: true },
    isNewVisitor: { type: Boolean, default: false }, // first ever page view from this browser
    isNewSession: { type: Boolean, default: false }, // first page view of the session (an "entry")
    referrer: { type: String, default: "" }, // referring host only, e.g. "google.com"; "" = direct
    utmSource: { type: String, default: "" },
    device: { type: String, enum: ["desktop", "mobile", "tablet"], default: "desktop" },
    browser: { type: String, default: "Other" },
    os: { type: String, default: "Other" },
    country: { type: String, default: "" }, // ISO code from the hosting platform's geo header
    duration: { type: Number, default: 0 }, // ms spent on the page (capped), set on leave
    ts: { type: Date, required: true },
  },
  { versionKey: false },
);
pageViewSchema.index({ ts: -1 });
pageViewSchema.index({ path: 1, ts: -1 });
pageViewSchema.index({ sessionId: 1, ts: 1 });
pageViewSchema.index({ visitorId: 1 });

/* -----------------------------------------------------------------------------
   Inquiry: a contact-form submission.
----------------------------------------------------------------------------- */
export const inquiryStatuses = ["new", "read", "replied", "archived"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

const inquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, default: "" },
    projectType: { type: String, required: true },
    budget: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: inquiryStatuses, default: "new" },
    country: { type: String, default: "" },
    visitorId: { type: String, default: "" }, // links an enquiry to its analytics visitor, when known
  },
  { timestamps: true, versionKey: false },
);
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });

/* -----------------------------------------------------------------------------
   Admin: dashboard login. Passwords are stored ONLY as scrypt hashes
   (see src/lib/admin/password-hash.mjs). Create/reset with: npm run admin:create
----------------------------------------------------------------------------- */
const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, versionKey: false, collection: "admins" },
);

export type AdminDoc = InferSchemaType<typeof adminSchema> & { _id: mongoose.Types.ObjectId };

export type PageViewDoc = InferSchemaType<typeof pageViewSchema> & { _id: string };
export type InquiryDoc = InferSchemaType<typeof inquirySchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };

// Reuse compiled models across hot reloads.
export const PageView: Model<PageViewDoc> =
  (mongoose.models.PageView as Model<PageViewDoc>) ?? mongoose.model<PageViewDoc>("PageView", pageViewSchema);
export const Admin: Model<AdminDoc> =
  (mongoose.models.Admin as Model<AdminDoc>) ?? mongoose.model<AdminDoc>("Admin", adminSchema);
export const Inquiry: Model<InquiryDoc> =
  (mongoose.models.Inquiry as Model<InquiryDoc>) ?? mongoose.model<InquiryDoc>("Inquiry", inquirySchema);
