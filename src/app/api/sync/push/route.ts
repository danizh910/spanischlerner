import { NextResponse } from "next/server";
import { db } from "@/db";
import { patternProgress, progress } from "@/db/schema";

type QueueItem = {
  kind: "word" | "pattern";
  id: string;
  entry: {
    ease: number;
    interval: number;
    due: string;
    reps: number;
    lapses: number;
    updatedAt: string;
  };
};

type PushBody = {
  deviceKey?: unknown;
  items?: unknown;
};

function isQueueItem(value: unknown): value is QueueItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.kind !== "word" && v.kind !== "pattern") return false;
  if (typeof v.id !== "string" || !v.id) return false;
  const e = v.entry as Record<string, unknown> | undefined;
  if (!e) return false;
  return (
    typeof e.ease === "number" &&
    typeof e.interval === "number" &&
    typeof e.due === "string" &&
    typeof e.reps === "number" &&
    typeof e.lapses === "number" &&
    typeof e.updatedAt === "string"
  );
}

/**
 * Bulk-upserts queued progress rows for a device key. Client-side the sync
 * queue already keeps only the latest entry per id, so this is a plain
 * upsert (no extra last-write-wins guard needed here); cross-device
 * conflicts are resolved client-side in adoptDeviceKey via mergeProgressMaps.
 */
export async function POST(request: Request) {
  let body: PushBody;
  try {
    body = (await request.json()) as PushBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const deviceKey = typeof body.deviceKey === "string" ? body.deviceKey.trim() : "";
  const items = Array.isArray(body.items) ? body.items : [];

  if (!deviceKey) {
    return NextResponse.json({ error: "deviceKey required" }, { status: 400 });
  }
  if (!items.every(isQueueItem)) {
    return NextResponse.json({ error: "invalid items" }, { status: 400 });
  }

  for (const item of items as QueueItem[]) {
    const row = {
      deviceKey,
      ease: item.entry.ease,
      interval: item.entry.interval,
      due: new Date(item.entry.due),
      reps: item.entry.reps,
      lapses: item.entry.lapses,
      updatedAt: new Date(item.entry.updatedAt),
    };

    if (item.kind === "word") {
      await db
        .insert(progress)
        .values({ ...row, wordId: item.id })
        .onConflictDoUpdate({
          target: [progress.deviceKey, progress.wordId],
          set: {
            ease: row.ease,
            interval: row.interval,
            due: row.due,
            reps: row.reps,
            lapses: row.lapses,
            updatedAt: row.updatedAt,
          },
        });
    } else {
      await db
        .insert(patternProgress)
        .values({ ...row, patternId: item.id })
        .onConflictDoUpdate({
          target: [patternProgress.deviceKey, patternProgress.patternId],
          set: {
            ease: row.ease,
            interval: row.interval,
            due: row.due,
            reps: row.reps,
            lapses: row.lapses,
            updatedAt: row.updatedAt,
          },
        });
    }
  }

  return NextResponse.json({ ok: true, synced: items.length });
}
