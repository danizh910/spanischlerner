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
};

export type ProgressMap = Record<string, ProgressEntry>;

export type CardDirection = "es-de" | "de-es";

export type PatternProgressEntry = {
  attempts: number;
  correct: number;
  lastPracticed: string;
};

export type PatternProgressMap = Record<string, PatternProgressEntry>;
