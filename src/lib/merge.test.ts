import { describe, expect, it } from "vitest";
import { mergeProgressMaps } from "./merge";
import type { ProgressEntry } from "./types";

function entry(overrides: Partial<ProgressEntry> = {}): ProgressEntry {
  return {
    ease: 2.5,
    interval: 1,
    due: "2026-01-02T00:00:00.000Z",
    reps: 1,
    lapses: 0,
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("mergeProgressMaps", () => {
  it("keeps entries that only exist locally", () => {
    const local = { a: entry() };
    const merged = mergeProgressMaps(local, {});
    expect(merged).toEqual(local);
  });

  it("adopts entries that only exist remotely", () => {
    const remote = { a: entry() };
    const merged = mergeProgressMaps({}, remote);
    expect(merged).toEqual(remote);
  });

  it("prefers the remote entry when it was updated more recently", () => {
    const local = { a: entry({ updatedAt: "2026-01-01T00:00:00.000Z", reps: 1 }) };
    const remote = { a: entry({ updatedAt: "2026-01-02T00:00:00.000Z", reps: 5 }) };
    const merged = mergeProgressMaps(local, remote);
    expect(merged.a.reps).toBe(5);
    expect(merged.a.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("keeps the local entry when it was updated more recently", () => {
    const local = { a: entry({ updatedAt: "2026-01-03T00:00:00.000Z", reps: 9 }) };
    const remote = { a: entry({ updatedAt: "2026-01-02T00:00:00.000Z", reps: 5 }) };
    const merged = mergeProgressMaps(local, remote);
    expect(merged.a.reps).toBe(9);
  });

  it("keeps the local entry on an exact timestamp tie", () => {
    const tie = "2026-01-01T00:00:00.000Z";
    const local = { a: entry({ updatedAt: tie, reps: 1 }) };
    const remote = { a: entry({ updatedAt: tie, reps: 99 }) };
    const merged = mergeProgressMaps(local, remote);
    expect(merged.a.reps).toBe(1);
  });

  it("merges disjoint keys from both sides without touching unrelated entries", () => {
    const local = { a: entry({ reps: 1 }), shared: entry({ updatedAt: "2026-01-01T00:00:00.000Z", reps: 1 }) };
    const remote = { b: entry({ reps: 2 }), shared: entry({ updatedAt: "2026-01-05T00:00:00.000Z", reps: 42 }) };
    const merged = mergeProgressMaps(local, remote);
    expect(Object.keys(merged).sort()).toEqual(["a", "b", "shared"]);
    expect(merged.a.reps).toBe(1);
    expect(merged.b.reps).toBe(2);
    expect(merged.shared.reps).toBe(42);
  });

  it("does not mutate the input maps", () => {
    const local = { a: entry({ reps: 1 }) };
    const remote = { a: entry({ updatedAt: "2026-01-02T00:00:00.000Z", reps: 5 }) };
    mergeProgressMaps(local, remote);
    expect(local.a.reps).toBe(1);
    expect(remote.a.reps).toBe(5);
  });
});
