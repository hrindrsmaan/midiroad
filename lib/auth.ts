import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendMagicLinkEmail } from "@/lib/email";

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/**
 * Server auth: Google sign-in plus passwordless email (magic link).
 * Users and sessions live in Neon through Drizzle (lib/db/schema.ts).
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.BASE_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  account: {
    // One person, one account: Google and magic link with the same verified
    // email land on the same user.
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },
  plugins: [
    magicLink({
      sendMagicLink: ({ email, url }) => sendMagicLinkEmail(email, url),
    }),
    nextCookies(), // must stay last: lets server actions set the session cookie
  ],
});

export { googleConfigured };
export type Session = typeof auth.$Infer.Session;
