import { getDeviceKey, setDeviceKey } from "./deviceCode";
import { mergeProgressMaps } from "./merge";
import { storage } from "./storage";
import type { PatternProgressMap, ProgressEntry, ProgressMap } from "./types";

const QUEUE_KEY = "spanischlerner:sync:queue:v1";
const LAST_SYNCED_KEY = "spanischlerner:sync:last-synced:v1";

/** Fired on the window whenever an item is queued, so SyncManager can
 * (re)start its debounce timer without storage.ts depending on it. */
export const QUEUE_CHANGED_EVENT = "spanischlerner:queue-changed";

export type QueueItem = {
  kind: "word" | "pattern";
  id: string;
  entry: ProgressEntry;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<QueueItem[]>(window.localStorage.getItem(QUEUE_KEY), []);
}

function writeQueue(items: QueueItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

/** Queues a write for sync, keeping only the latest entry per kind+id
 * (no point pushing stale intermediate states). */
function enqueue(item: QueueItem): void {
  const queue = readQueue().filter((q) => !(q.kind === item.kind && q.id === item.id));
  queue.push(item);
  writeQueue(queue);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
  }
}

export function getQueueSize(): number {
  return readQueue().length;
}

export function getLastSyncedAt(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_SYNCED_KEY);
}

function setLastSyncedAt(iso: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_SYNCED_KEY, iso);
}

/** Writes local progress for a word AND queues it for sync. UI code should
 * call this (not storage.setProgress directly) so nothing skips the queue. */
export function recordWordProgress(wordId: string, entry: ProgressEntry): void {
  storage.setProgress(wordId, entry);
  enqueue({ kind: "word", id: wordId, entry });
}

export function recordPatternProgress(patternId: string, entry: ProgressEntry): void {
  storage.setPatternProgress(patternId, entry);
  enqueue({ kind: "pattern", id: patternId, entry });
}

/**
 * Sends everything currently queued to the server. Offline-first: reads
 * never touch the network, and a failed push simply leaves the queue
 * intact for the next trigger (debounce timer, online event, etc).
 */
export async function flushQueue(): Promise<{ ok: boolean; synced: number }> {
  const queue = readQueue();
  if (queue.length === 0) return { ok: true, synced: 0 };
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { ok: false, synced: 0 };
  }

  try {
    const deviceKey = getDeviceKey();
    const res = await fetch("/api/sync/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceKey, items: queue }),
    });
    if (!res.ok) return { ok: false, synced: 0 };

    // Only drop items that were actually part of this flush; anything
    // queued concurrently while the request was in flight stays queued.
    const remaining = readQueue().filter(
      (q) => !queue.some((sent) => sent.kind === q.kind && sent.id === q.id && sent.entry.updatedAt === q.entry.updatedAt),
    );
    writeQueue(remaining);
    setLastSyncedAt(new Date().toISOString());
    return { ok: true, synced: queue.length };
  } catch {
    return { ok: false, synced: 0 };
  }
}

type PullResponse = { words: ProgressMap; patterns: PatternProgressMap };

/**
 * Adopts a foreign device code: pulls its remote progress, merges with
 * whatever is stored locally (last-write-wins via updatedAt), writes the
 * merged result back to localStorage, switches the active device key, and
 * queues the merged rows so they land under the new key on the server too.
 */
export async function adoptDeviceKey(
  foreignKey: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = foreignKey.trim().toUpperCase();
  if (!trimmed) return { ok: false, error: "Bitte einen Code eingeben." };

  let remote: PullResponse;
  try {
    const res = await fetch(`/api/sync/pull?deviceKey=${encodeURIComponent(trimmed)}`);
    if (!res.ok) return { ok: false, error: "Code nicht gefunden oder Serverfehler." };
    remote = (await res.json()) as PullResponse;
  } catch {
    return { ok: false, error: "Netzwerkfehler. Bitte später erneut versuchen." };
  }

  const mergedWords = mergeProgressMaps(storage.getAllProgress(), remote.words ?? {});
  const mergedPatterns = mergeProgressMaps(storage.getAllPatternProgress(), remote.patterns ?? {});

  for (const [id, entry] of Object.entries(mergedWords)) {
    storage.setProgress(id, entry);
  }
  for (const [id, entry] of Object.entries(mergedPatterns)) {
    storage.setPatternProgress(id, entry);
  }

  setDeviceKey(trimmed);

  for (const [id, entry] of Object.entries(mergedWords)) {
    enqueue({ kind: "word", id, entry });
  }
  for (const [id, entry] of Object.entries(mergedPatterns)) {
    enqueue({ kind: "pattern", id, entry });
  }
  await flushQueue();

  return { ok: true };
}
