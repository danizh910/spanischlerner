export type PartOfSpeech =
  | "sust"
  | "verbo"
  | "adj"
  | "adv"
  | "prep"
  | "conj"
  | "pron";

export type Word = {
  id: string;
  rank: number;
  es: string;
  de: string[];
  pos: PartOfSpeech;
  gender?: "m" | "f";
  example_es: string;
  example_de: string;
  note?: string;
};

export type PatternSlotOption = {
  es: string;
  de: string;
};

export type PatternSlot = {
  key: string;
  options: PatternSlotOption[];
};

export type PatternExample = {
  es: string;
  de: string;
};

export type Pattern = {
  id: string;
  name: string;
  template_es: string;
  template_de: string;
  slots: PatternSlot[];
  examples: PatternExample[];
};

export type Rating = "again" | "hard" | "good" | "easy";

export type ProgressEntry = {
  ease: number;
  interval: number;
  due: string;
  reps: number;
  lapses: number;
  /** ISO timestamp of the last local change; drives last-write-wins sync merges. */
  updatedAt: string;
};

export type ProgressMap = Record<string, ProgressEntry>;

export type CardDirection = "es-de" | "de-es";

/**
 * Same shape as ProgressEntry (mirrors the `pattern_progress` DB table,
 * which is "analog" to `progress`). Patterns are graded correct/incorrect
 * in the drill UI, mapped onto the same again/good ratings the SM-2
 * scheduler uses for words.
 */
export type PatternProgressEntry = ProgressEntry;

export type PatternProgressMap = Record<string, PatternProgressEntry>;
