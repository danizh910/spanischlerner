import type {
  PatternProgressEntry,
  PatternProgressMap,
  ProgressEntry,
  ProgressMap,
} from "./types";

const WORDS_KEY = "spanischlerner:progress:words:v1";
const PATTERNS_KEY = "spanischlerner:progress:patterns:v1";

/**
 * Storage abstraction for learning progress. The localStorage adapter below
 * is the only implementation for v1; a future Neon/Postgres adapter can
 * implement the same interface without any UI changes.
 */
export interface ProgressStorage {
  getProgress(wordId: string): ProgressEntry | undefined;
  setProgress(wordId: string, entry: ProgressEntry): void;
  getAllProgress(): ProgressMap;
  /** IDs of words whose stored progress entry is due at or before `now`. */
  getAllDue(now?: Date): string[];
  getPatternProgress(patternId: string): PatternProgressEntry | undefined;
  setPatternProgress(patternId: string, entry: PatternProgressEntry): void;
  getAllPatternProgress(): PatternProgressMap;
  exportJson(): string;
  importJson(json: string): void;
  clearAll(): void;
}

type ExportShape = {
  version: 1;
  exportedAt: string;
  words: ProgressMap;
  patterns: PatternProgressMap;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

class LocalStorageProgressStorage implements ProgressStorage {
  private readWords(): ProgressMap {
    if (typeof window === "undefined") return {};
    return safeParse<ProgressMap>(window.localStorage.getItem(WORDS_KEY), {});
  }

  private writeWords(map: ProgressMap): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WORDS_KEY, JSON.stringify(map));
  }

  private readPatterns(): PatternProgressMap {
    if (typeof window === "undefined") return {};
    return safeParse<PatternProgressMap>(
      window.localStorage.getItem(PATTERNS_KEY),
      {},
    );
  }

  private writePatterns(map: PatternProgressMap): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PATTERNS_KEY, JSON.stringify(map));
  }

  getProgress(wordId: string): ProgressEntry | undefined {
    return this.readWords()[wordId];
  }

  setProgress(wordId: string, entry: ProgressEntry): void {
    const map = this.readWords();
    map[wordId] = entry;
    this.writeWords(map);
  }

  getAllProgress(): ProgressMap {
    return this.readWords();
  }

  getAllDue(now: Date = new Date()): string[] {
    const map = this.readWords();
    return Object.keys(map).filter(
      (id) => new Date(map[id].due).getTime() <= now.getTime(),
    );
  }

  getPatternProgress(patternId: string): PatternProgressEntry | undefined {
    return this.readPatterns()[patternId];
  }

  setPatternProgress(patternId: string, entry: PatternProgressEntry): void {
    const map = this.readPatterns();
    map[patternId] = entry;
    this.writePatterns(map);
  }

  getAllPatternProgress(): PatternProgressMap {
    return this.readPatterns();
  }

  exportJson(): string {
    const payload: ExportShape = {
      version: 1,
      exportedAt: new Date().toISOString(),
      words: this.readWords(),
      patterns: this.readPatterns(),
    };
    return JSON.stringify(payload, null, 2);
  }

  importJson(json: string): void {
    const parsed = JSON.parse(json) as Partial<ExportShape>;
    if (parsed.words) this.writeWords(parsed.words);
    if (parsed.patterns) this.writePatterns(parsed.patterns);
  }

  clearAll(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(WORDS_KEY);
    window.localStorage.removeItem(PATTERNS_KEY);
  }
}

export const storage: ProgressStorage = new LocalStorageProgressStorage();
