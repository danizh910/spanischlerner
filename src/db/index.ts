import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

// Runtime queries use the pooled connection; migrations use the unpooled
// one directly (see drizzle.config.ts).
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
