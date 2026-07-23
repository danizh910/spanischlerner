import type { ProgressEntry, Rating } from "./types";

export const DEFAULT_EASE = 2.5;
export const MIN_EASE = 1.3;
export const INITIAL_INTERVAL_DAYS = 1;

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function roundEase(ease: number): number {
  return Math.round(ease * 100) / 100;
}

export function createProgressEntry(now: Date = new Date()): ProgressEntry {
  return {
    ease: DEFAULT_EASE,
    interval: 0,
    due: now.toISOString(),
    reps: 0,
    lapses: 0,
    updatedAt: now.toISOString(),
  };
}

/**
 * SM-2 based scheduler with a 4-button (again/hard/good/easy) rating scheme.
 * "again" resets reps/interval and marks a lapse; other ratings grow the
 * interval based on the current ease factor.
 */
export function reviewCard(
  entry: ProgressEntry,
  rating: Rating,
  now: Date = new Date(),
): ProgressEntry {
  let ease = entry.ease;
  let interval = entry.interval;
  let reps = entry.reps;
  let lapses = entry.lapses;

  switch (rating) {
    case "again": {
      lapses += 1;
      reps = 0;
      ease = Math.max(MIN_EASE, ease - 0.2);
      interval = INITIAL_INTERVAL_DAYS;
      break;
    }
    case "hard": {
      ease = Math.max(MIN_EASE, ease - 0.15);
      interval =
        reps === 0 ? INITIAL_INTERVAL_DAYS : Math.max(1, Math.round(interval * 1.2));
      reps += 1;
      break;
    }
    case "good": {
      if (reps === 0) {
        interval = INITIAL_INTERVAL_DAYS;
      } else if (reps === 1) {
        interval = 3;
      } else {
        interval = Math.max(1, Math.round(interval * ease));
      }
      reps += 1;
      break;
    }
    case "easy": {
      ease = ease + 0.15;
      interval =
        reps === 0 ? 4 : Math.max(1, Math.round(interval * ease * 1.3));
      reps += 1;
      break;
    }
  }

  return {
    ease: roundEase(ease),
    interval,
    due: addDays(now, interval).toISOString(),
    reps,
    lapses,
    updatedAt: now.toISOString(),
  };
}

export function isDue(entry: ProgressEntry, now: Date = new Date()): boolean {
  return new Date(entry.due).getTime() <= now.getTime();
}
