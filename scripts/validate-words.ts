import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PartOfSpeech, Word } from "../src/lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WORDS_PATH = path.resolve(__dirname, "../public/data/words.json");
const MAX_EXAMPLE_LENGTH = 100;
const VALID_POS: PartOfSpeech[] = [
  "sust",
  "verbo",
  "adj",
  "adv",
  "prep",
  "conj",
  "pron",
];
const VALID_GENDER = ["m", "f"];

function main(): void {
  const raw = readFileSync(WORDS_PATH, "utf-8");
  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    console.error("data/words.json muss ein Array sein.");
    process.exit(1);
  }

  const words = parsed as Partial<Word>[];
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenRanks = new Set<number>();

  words.forEach((word, index) => {
    const prefix = `[${index}] id=${word?.id ?? "?"}`;

    if (!word || typeof word !== "object") {
      errors.push(`${prefix}: kein gültiges Objekt.`);
      return;
    }

    const requiredStringFields: (keyof Word)[] = [
      "id",
      "es",
      "example_es",
      "example_de",
    ];
    for (const field of requiredStringFields) {
      const value = word[field];
      if (typeof value !== "string" || value.trim() === "") {
        errors.push(`${prefix}: Feld '${field}' fehlt oder ist leer.`);
      }
    }

    if (typeof word.rank !== "number" || word.rank <= 0) {
      errors.push(`${prefix}: 'rank' fehlt oder ist ungültig.`);
    }

    if (
      !Array.isArray(word.de) ||
      word.de.length === 0 ||
      word.de.some((d) => typeof d !== "string" || d.trim() === "")
    ) {
      errors.push(`${prefix}: 'de' muss ein nicht-leeres Array von Strings sein.`);
    }

    if (!word.pos || !VALID_POS.includes(word.pos)) {
      errors.push(`${prefix}: 'pos' ist ungültig ('${word.pos}').`);
    }

    if (word.gender !== undefined && !VALID_GENDER.includes(word.gender)) {
      errors.push(`${prefix}: 'gender' ist ungültig ('${word.gender}').`);
    }

    if (word.pos === "sust" && !word.gender) {
      errors.push(`${prefix}: Substantiv ohne 'gender'.`);
    }

    if (
      typeof word.example_es === "string" &&
      word.example_es.length > MAX_EXAMPLE_LENGTH
    ) {
      errors.push(
        `${prefix}: 'example_es' ist zu lang (${word.example_es.length} Zeichen, max ${MAX_EXAMPLE_LENGTH}).`,
      );
    }

    if (
      typeof word.example_de === "string" &&
      word.example_de.length > MAX_EXAMPLE_LENGTH
    ) {
      errors.push(
        `${prefix}: 'example_de' ist zu lang (${word.example_de.length} Zeichen, max ${MAX_EXAMPLE_LENGTH}).`,
      );
    }

    if (typeof word.id === "string") {
      if (seenIds.has(word.id)) {
        errors.push(`${prefix}: doppelte id '${word.id}'.`);
      }
      seenIds.add(word.id);
    }

    if (typeof word.rank === "number") {
      if (seenRanks.has(word.rank)) {
        errors.push(`${prefix}: doppelter rank '${word.rank}'.`);
      }
      seenRanks.add(word.rank);
    }
  });

  if (errors.length > 0) {
    console.error(`Validierung fehlgeschlagen (${errors.length} Fehler):`);
    for (const message of errors) console.error(`  - ${message}`);
    process.exit(1);
  }

  console.log(`OK: ${words.length} Wörter validiert, keine Fehler gefunden.`);
}

main();
