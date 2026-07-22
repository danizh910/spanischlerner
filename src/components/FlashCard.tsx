"use client";

import type { CardDirection, Word } from "@/lib/types";

const POS_LABELS: Record<Word["pos"], string> = {
  sust: "Substantiv",
  verbo: "Verb",
  adj: "Adjektiv",
  adv: "Adverb",
  prep: "Präposition",
  conj: "Konjunktion",
  pron: "Pronomen",
};

type FlashCardProps = {
  word: Word;
  direction: CardDirection;
  revealed: boolean;
  onReveal: () => void;
};

export function FlashCard({ word, direction, revealed, onReveal }: FlashCardProps) {
  const front = direction === "es-de" ? word.es : word.de.join(", ");
  const back = direction === "es-de" ? word.de.join(", ") : word.es;
  const genderLabel = word.gender === "m" ? "der" : word.gender === "f" ? "die" : null;

  return (
    <button
      type="button"
      onClick={onReveal}
      className="flex min-h-[16rem] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-card p-6 text-center ring-1 ring-foreground/10 active:bg-muted"
    >
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {POS_LABELS[word.pos]}
        {genderLabel ? ` · ${genderLabel}` : ""}
      </span>

      <span className="text-3xl font-semibold">{front}</span>

      {revealed ? (
        <div className="flex flex-col items-center gap-3 border-t border-border pt-4">
          <span className="text-xl text-primary">{back}</span>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>{word.example_es}</span>
            <span>{word.example_de}</span>
          </div>
          {word.note ? (
            <span className="mt-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {word.note}
            </span>
          ) : null}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">
          Tippen oder Leertaste zum Aufdecken
        </span>
      )}
    </button>
  );
}
