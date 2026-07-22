import { integer, pgTable, primaryKey, real, text, timestamp } from "drizzle-orm/pg-core";

export const progress = pgTable(
  "progress",
  {
    deviceKey: text("device_key").notNull(),
    wordId: text("word_id").notNull(),
    ease: real("ease").notNull(),
    interval: integer("interval").notNull(),
    due: timestamp("due", { withTimezone: true }).notNull(),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.deviceKey, table.wordId] })],
);

export const patternProgress = pgTable(
  "pattern_progress",
  {
    deviceKey: text("device_key").notNull(),
    patternId: text("pattern_id").notNull(),
    ease: real("ease").notNull(),
    interval: integer("interval").notNull(),
    due: timestamp("due", { withTimezone: true }).notNull(),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.deviceKey, table.patternId] })],
);
