import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { patternProgress, progress } from "@/db/schema";
import type { PatternProgressMap, ProgressMap } from "@/lib/types";

/** Returns all rows stored for a device key, reshaped into the same
 * id -> ProgressEntry maps the client keeps in localStorage. Unknown/unused
 * device keys just come back as empty maps (200, not an error) - adopting
 * a fresh code is a valid case, not a failure. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceKey = searchParams.get("deviceKey")?.trim();

  if (!deviceKey) {
    return NextResponse.json({ error: "deviceKey required" }, { status: 400 });
  }

  const [wordRows, patternRows] = await Promise.all([
    db.select().from(progress).where(eq(progress.deviceKey, deviceKey)),
    db.select().from(patternProgress).where(eq(patternProgress.deviceKey, deviceKey)),
  ]);

  const words: ProgressMap = {};
  for (const row of wordRows) {
    words[row.wordId] = {
      ease: row.ease,
      interval: row.interval,
      due: row.due.toISOString(),
      reps: row.reps,
      lapses: row.lapses,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  const patterns: PatternProgressMap = {};
  for (const row of patternRows) {
    patterns[row.patternId] = {
      ease: row.ease,
      interval: row.interval,
      due: row.due.toISOString(),
      reps: row.reps,
      lapses: row.lapses,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  return NextResponse.json({ words, patterns });
}
