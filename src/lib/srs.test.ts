import { describe, expect, it } from "vitest";
import {
  DEFAULT_EASE,
  INITIAL_INTERVAL_DAYS,
  MIN_EASE,
  createProgressEntry,
  isDue,
  reviewCard,
} from "./srs";

const NOW = new Date("2026-01-01T00:00:00.000Z");

describe("createProgressEntry", () => {
  it("starts with default ease and zero interval", () => {
    const entry = createProgressEntry(NOW);
    expect(entry.ease).toBe(DEFAULT_EASE);
    expect(entry.interval).toBe(0);
    expect(entry.reps).toBe(0);
    expect(entry.lapses).toBe(0);
    expect(entry.due).toBe(NOW.toISOString());
  });
});

describe("reviewCard", () => {
  it("schedules a first 'good' review one day out", () => {
    const entry = createProgressEntry(NOW);
    const next = reviewCard(entry, "good", NOW);
    expect(next.interval).toBe(INITIAL_INTERVAL_DAYS);
    expect(next.reps).toBe(1);
    expect(next.due).toBe("2026-01-02T00:00:00.000Z");
  });

  it("schedules the second consecutive 'good' review three days out", () => {
    let entry = createProgressEntry(NOW);
    entry = reviewCard(entry, "good", NOW);
    const next = reviewCard(entry, "good", new Date(entry.due));
    expect(next.interval).toBe(3);
    expect(next.reps).toBe(2);
  });

  it("grows the interval by the ease factor on later reviews", () => {
    let entry = createProgressEntry(NOW);
    entry = reviewCard(entry, "good", NOW);
    entry = reviewCard(entry, "good", new Date(entry.due));
    const next = reviewCard(entry, "good", new Date(entry.due));
    expect(next.interval).toBe(Math.round(3 * entry.ease));
    expect(next.reps).toBe(3);
  });

  it("resets reps and interval and records a lapse on 'again'", () => {
    let entry = createProgressEntry(NOW);
    entry = reviewCard(entry, "good", NOW);
    entry = reviewCard(entry, "good", new Date(entry.due));
    const next = reviewCard(entry, "again", new Date(entry.due));
    expect(next.interval).toBe(INITIAL_INTERVAL_DAYS);
    expect(next.reps).toBe(0);
    expect(next.lapses).toBe(1);
    expect(next.ease).toBeCloseTo(entry.ease - 0.2, 5);
  });

  it("never lowers ease below MIN_EASE", () => {
    let entry = createProgressEntry(NOW);
    for (let i = 0; i < 50; i++) {
      entry = reviewCard(entry, "again", NOW);
    }
    expect(entry.ease).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it("increases ease and applies the easy bonus on 'easy'", () => {
    const entry = createProgressEntry(NOW);
    const next = reviewCard(entry, "easy", NOW);
    expect(next.ease).toBeCloseTo(DEFAULT_EASE + 0.15, 5);
    expect(next.interval).toBe(4);
  });

  it("grows the interval more slowly on 'hard' than on 'good'", () => {
    let entryGood = createProgressEntry(NOW);
    let entryHard = createProgressEntry(NOW);
    entryGood = reviewCard(entryGood, "good", NOW);
    entryGood = reviewCard(entryGood, "good", new Date(entryGood.due));
    entryHard = reviewCard(entryHard, "good", NOW);
    entryHard = reviewCard(entryHard, "good", new Date(entryHard.due));

    const nextGood = reviewCard(entryGood, "good", new Date(entryGood.due));
    const nextHard = reviewCard(entryHard, "hard", new Date(entryHard.due));
    expect(nextHard.interval).toBeLessThan(nextGood.interval);
  });
});

describe("isDue", () => {
  it("is true when due date is in the past or now", () => {
    const entry = createProgressEntry(NOW);
    expect(isDue(entry, NOW)).toBe(true);
    expect(isDue(entry, new Date(NOW.getTime() + 1000))).toBe(true);
  });

  it("is false when due date is in the future", () => {
    const entry = reviewCard(createProgressEntry(NOW), "good", NOW);
    expect(isDue(entry, NOW)).toBe(false);
  });
});
