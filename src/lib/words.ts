import rawWords from "../../public/data/words.json";
import type { Word } from "./types";

export const WORDS: Word[] = rawWords as Word[];

const WORDS_BY_ID = new Map(WORDS.map((w) => [w.id, w]));

export function getWordById(id: string): Word | undefined {
  return WORDS_BY_ID.get(id);
}

export function getWordsByIds(ids: string[]): Word[] {
  return ids
    .map((id) => WORDS_BY_ID.get(id))
    .filter((w): w is Word => w !== undefined);
}
