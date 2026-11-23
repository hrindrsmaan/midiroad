import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Better Auth's core tables (user, session, account, verification).
 * Column names follow Better Auth's defaults so its Drizzle adapter maps
 * them without extra config. App tables (subscriptions, credits) go below.
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** Set by the Better Auth Stripe plugin. */
  stripeCustomerId: text("stripe_customer_id"),
  /** Spendable credits. Changed only through lib/credits.ts. */
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/** Better Auth Stripe plugin: one row per subscription. referenceId is the user id. */
export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    plan: text("plan").notNull(),
    referenceId: text("reference_id").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text("status").default("incomplete"),
    periodStart: timestamp("period_start"),
    periodEnd: timestamp("period_end"),
    trialStart: timestamp("trial_start"),
    trialEnd: timestamp("trial_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    cancelAt: timestamp("cancel_at"),
    canceledAt: timestamp("canceled_at"),
    endedAt: timestamp("ended_at"),
    seats: integer("seats"),
    billingInterval: text("billing_interval"),
    stripeScheduleId: text("stripe_schedule_id"),
  },
  (t) => [index("subscription_reference_id_idx").on(t.referenceId)],
);

/**
 * Every credit top-up (signup bonus, subscription invoice). The unique ref
 * (e.g. the Stripe invoice id) makes a grant happen once even if Stripe
 * retries the webhook.
 */
export const creditGrant = pgTable(
  "credit_grant",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    ref: text("ref").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("credit_grant_user_id_idx").on(t.userId)],
);

/**
 * What a user has spent a credit on. item is "lib:<library id>" or
 * "gen:<pattern id>". Re-downloading an unlocked item is free.
 */
export const unlock = pgTable(
  "unlock",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    item: text("item").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.item] })],
);

/**
 * Email signups (the free MIDI kit). Separate from `user`: a signup is not an
 * account, gets no credits, and has no password. One row per email; a repeat
 * signup keeps the first source and refreshes the latest one.
 */
export const subscriber = pgTable("subscriber", {
  id: text("id").primaryKey(),
  /** Lowercased and trimmed. */
  email: text("email").notNull().unique(),
  /** Where they signed up first: "free-kit-page", "beat-maker", "pattern-page", … */
  source: text("source").notNull(),
  /** Where the latest signup came from. */
  lastSource: text("last_source").notNull(),
  /** ?ref= on the landing URL (e.g. "youtube"). */
  ref: text("ref"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  /** The page that carried the ref/utm tags. */
  landingPath: text("landing_path"),
  signups: integer("signups").notNull().default(1),
  downloads: integer("downloads").notNull().default(0),
  lastDownloadAt: timestamp("last_download_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * Beats shared from the beat maker, at /b/<id>. `data` is the beat maker
 * state (lib/shared-beat.ts), validated before it is stored. parentId links a
 * remix to the beat it came from.
 */
export const sharedBeat = pgTable(
  "shared_beat",
  {
    id: text("id").primaryKey(),
    parentId: text("parent_id").references((): AnyPgColumn => sharedBeat.id, { onDelete: "set null" }),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("shared_beat_parent_id_idx").on(t.parentId)],
);

/** Fixed-window counters for rate limits (lib/rate-limit.ts). Keys hold hashed IPs, never raw ones. */
export const rateLimit = pgTable("rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});
