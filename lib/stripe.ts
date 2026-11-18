import Stripe from "stripe";
import logger from "@/lib/logger";

// The placeholder only lets the build run without the key. At runtime a
// missing key makes every checkout and download fail, so say so plainly.
if (!process.env.STRIPE_SECRET_KEY && process.env.NEXT_PHASE !== "phase-production-build") {
  logger.error(
    "STRIPE_SECRET_KEY is not set for this environment: checkout and downloads will fail. Add it in Vercel → Settings → Environment Variables and redeploy.",
  );
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_dummy",
  {
    apiVersion: "2026-01-28.clover",
  },
);
