import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

/** Drizzle over Neon's HTTP driver: no connection pool to manage on serverless. */
export const db = drizzle(neon(process.env.DATABASE_URL), { schema });
