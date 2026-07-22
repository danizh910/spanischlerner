import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_WORD_LIST } from "./data/base-word-list";
import { ENRICHMENT } from "./data/enrichment";
import type { Word } from "../src/lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOTAL_WORDS = 1000;
const BATCH_SIZE = 50;
// Lives under public/ (not repo-root /data/) so the file is servable as a
// static asset at /data/words.json and the service worker can cache it.
const OUTPUT_PATH = path.resolve(__dirname, "../public/data/words.json");

const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function loadExisting(): Word[] {
  if (!existsSync(OUTPUT_PATH)) return [];
  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, "utf-8")) as Word[];
  } catch {
    console.warn("Konnte bestehende data/words.json nicht lesen, starte neu.");
    return [];
  }
}

function saveWords(words: Word[]): void {
  const dir = path.dirname(OUTPUT_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const sorted = [...words].sort((a, b) => a.rank - b.rank);
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(sorted, null, 2)}\n`, "utf-8");
}

/**
 * Resume-safe, batched word generation: enriches words from the curated
 * base frequency list using the hand-authored lookup table in
 * scripts/data/enrichment.ts, writing to disk after every batch of 50 so an
 * interrupted run can simply be restarted (already-generated ids are
 * skipped). Words without an enrichment entry are left for a future run.
 */
/**
 * Accented and unaccented homographs (el/él, tu/tú, que/qué, cual/cuál,
 * quien/quién, ...) share the same ASCII slug once diacritics are stripped.
 * Disambiguate deterministically (by processing order) with a numeric
 * suffix instead of silently dropping one of the words.
 */
function uniqueId(es: string, usedIds: Set<string>): string {
  const base = slugify(es);
  if (!usedIds.has(base)) return base;
  let n = 2;
  while (usedIds.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function main(): void {
  const rankedWords = BASE_WORD_LIST.slice(0, TOTAL_WORDS);
  const existing = loadExisting();
  const byId = new Map(existing.map((w) => [w.id, w]));
  const esToId = new Map(existing.map((w) => [w.es, w.id]));
  const usedIds = new Set(existing.map((w) => w.id));

  let processedInBatch = 0;
  let addedTotal = 0;
  let skippedTotal = 0;

  for (let i = 0; i < rankedWords.length; i++) {
    const es = rankedWords[i];
    const rank = i + 1;

    if (esToId.has(es)) continue;

    const enrichment = ENRICHMENT[es];
    if (!enrichment) {
      skippedTotal++;
      continue;
    }

    const id = uniqueId(es, usedIds);

    const word: Word = {
      id,
      rank,
      es,
      de: enrichment.de,
      pos: enrichment.pos,
      example_es: enrichment.example_es,
      example_de: enrichment.example_de,
      ...(enrichment.gender ? { gender: enrichment.gender } : {}),
      ...(enrichment.note ? { note: enrichment.note } : {}),
    };

    byId.set(id, word);
    esToId.set(es, id);
    usedIds.add(id);
    addedTotal++;
    processedInBatch++;

    if (processedInBatch >= BATCH_SIZE) {
      saveWords(Array.from(byId.values()));
      console.log(`Batch gespeichert (${byId.size} Wörter insgesamt).`);
      processedInBatch = 0;
    }
  }

  saveWords(Array.from(byId.values()));

  console.log(
    `Fertig: ${addedTotal} neue Wörter hinzugefügt, ${byId.size} insgesamt in data/words.json.`,
  );
  if (skippedTotal > 0) {
    console.log(
      `${skippedTotal} Wörter aus der Basisliste haben noch keine Enrichment-Daten und wurden ` +
        "übersprungen. Ergänze sie in scripts/data/enrichment.ts und führe das Script erneut aus.",
    );
  }
}

main();
