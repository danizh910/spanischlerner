import { storage } from "./storage";
import { WORDS, getWordsByIds } from "./words";
import type { Word } from "./types";

export const SESSION_SIZE = 20;

export function getDueCount(now: Date = new Date()): number {
  return storage.getAllDue(now).length;
}

/**
 * Builds the queue for a /learn session: due cards first (earliest due
 * first), then new (never-studied) words by rank, capped at SESSION_SIZE.
 */
export function buildLearnSession(now: Date = new Date()): Word[] {
  const progress = storage.getAllProgress();
  const dueIds = storage.getAllDue(now);
  const dueWords = getWordsByIds(dueIds).sort((a, b) => {
    const dueA = progress[a.id]?.due ?? "";
    const dueB = progress[b.id]?.due ?? "";
    return dueA.localeCompare(dueB);
  });

  const remaining = Math.max(0, SESSION_SIZE - dueWords.length);
  const newWords = WORDS.filter((w) => !progress[w.id])
    .sort((a, b) => a.rank - b.rank)
    .slice(0, remaining);

  return [...dueWords.slice(0, SESSION_SIZE), ...newWords];
}

export function getSessionStats(now: Date = new Date()) {
  const progress = storage.getAllProgress();
  const entries = Object.values(progress);
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const dueTomorrow = entries.filter((e) => {
    const due = new Date(e.due).getTime();
    return due > now.getTime() && due <= in24h.getTime();
  }).length;

  return {
    activeWords: entries.length,
    dueTomorrow,
  };
}
