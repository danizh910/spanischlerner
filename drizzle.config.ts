import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// dotenv's default export only auto-loads ".env"; this repo follows the
// Next.js convention of keeping local secrets in ".env.local" instead.
config({ path: ".env.local" });

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error("DATABASE_URL_UNPOOLED is not set (check .env.local).");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations run once and don't benefit from pooling; the direct
  // connection avoids pooler-related issues (e.g. prepared statements).
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
});
