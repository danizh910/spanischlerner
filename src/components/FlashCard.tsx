"use client";

import type { CardDirection, Word } from "@/lib/types";

const POS_LABELS: Record<Word["pos"], string> = {
  sust: "sust.",
  verbo: "verbo",
  adj: "adj.",
  adv: "adv.",
  prep: "prep.",
  conj: "conj.",
  pron: "pron.",
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
  const posLine = word.gender ? `${POS_LABELS[word.pos]} ${word.gender}` : POS_LABELS[word.pos];

  return (
    <div className="flex min-h-[20rem] w-full flex-col border border-border bg-surface">
      <div className="flex flex-col items-center gap-1 px-6 pt-8 text-center">
        <span className="text-xs text-text-dim">{posLine}</span>
        {/* Original spelling on purpose - accents and case are part of what's being learned. */}
        <span className="text-3xl font-medium text-text">{front}</span>
      </div>

      {revealed ? (
        <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
          <div className="border-t border-border" />
          <span className="text-center text-xl text-accent">{back}</span>
          <div className="flex flex-col gap-1 text-center">
            <span className="text-text">{word.example_es}</span>
            <span className="text-text-dim">{word.example_de}</span>
          </div>
          {word.note ? (
            <span className="text-center text-xs text-accent">{word.note}</span>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={onReveal}
          className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10"
        >
          <span className="text-xs uppercase tracking-widest text-text-dim">
            Tippen zum Aufdecken
          </span>
        </button>
      )}
    </div>
  );
}
