import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't load .env itself; Node does with --env-file (see package.json scripts).
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
