"use client";

import { useCallback, useState } from "react";
import { PATTERNS, fillTemplate } from "@/lib/patterns";
import { createProgressEntry, reviewCard } from "@/lib/srs";
import { storage } from "@/lib/storage";
import { recordPatternProgress } from "@/lib/sync";
import { shuffle } from "@/lib/utils";
import type { Pattern } from "@/lib/types";

type Chip = { id: string; text: string };

type Round = {
  pattern: Pattern;
  targetEs: string;
  targetDe: string;
  chips: Chip[];
};

function generateRound(): Round {
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const slot = pattern.slots[0];
  const option = slot.options[Math.floor(Math.random() * slot.options.length)];
  const targetEs = fillTemplate(pattern.template_es, { [slot.key]: option.es });
  const targetDe = fillTemplate(pattern.template_de, { [slot.key]: option.de });
  const tokens = targetEs.split(" ");
  const chips = shuffle(tokens.map((text, i) => ({ id: `${i}-${text}`, text })));
  return { pattern, targetEs, targetDe, chips };
}

export function PatternDrill() {
  const [round, setRound] = useState<Round>(() => generateRound());
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const chipById = useCallback(
    (id: string) => round.chips.find((c) => c.id === id)!,
    [round],
  );

  const availableChips = round.chips.filter((c) => !placedIds.includes(c.id));
  const placedChips = placedIds.map(chipById);
  const allPlaced = placedIds.length === round.chips.length;

  function place(id: string) {
    if (checked) return;
    setPlacedIds((prev) => [...prev, id]);
  }

  function unplace(id: string) {
    if (checked) return;
    setPlacedIds((prev) => prev.filter((x) => x !== id));
  }

  function check() {
    const assembled = placedChips.map((c) => c.text).join(" ");
    const correct = assembled === round.targetEs;
    setIsCorrect(correct);
    setChecked(true);

    const entry = storage.getPatternProgress(round.pattern.id) ?? createProgressEntry();
    recordPatternProgress(round.pattern.id, reviewCard(entry, correct ? "good" : "again"));
  }

  function next() {
    setRound(generateRound());
    setPlacedIds([]);
    setChecked(false);
    setIsCorrect(false);
  }

  const sentenceBorder = !checked
    ? "border-border"
    : isCorrect
      ? "border-accent"
      : "border-error";

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-border bg-surface p-5 text-center">
        <p className="text-xs uppercase tracking-widest text-text-dim">Übersetze ins Spanische</p>
        <p className="mt-2 text-xl text-text">{round.targetDe}</p>
      </div>

      <div
        className={`flex min-h-14 flex-wrap gap-2 border p-3 transition-colors duration-[80ms] ${sentenceBorder}`}
      >
        {placedChips.length === 0 ? (
          <span className="p-2 text-sm text-text-dim">
            Tippe die Wörter unten in der richtigen Reihenfolge an.
          </span>
        ) : (
          placedChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => unplace(chip.id)}
              className="h-12 border border-accent bg-transparent px-3 text-sm text-text"
            >
              {chip.text}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => place(chip.id)}
            className="h-12 border border-border bg-transparent px-3 text-sm text-text transition-colors duration-[80ms] active:border-accent"
          >
            {chip.text}
          </button>
        ))}
      </div>

      {checked && !isCorrect ? (
        <div className="border border-error p-4 text-sm">
          <p className="text-error">Nicht ganz.</p>
          <p className="mt-1 text-text">{round.targetEs}</p>
        </div>
      ) : null}

      <button
        type="button"
        disabled={!allPlaced && !checked}
        onClick={checked ? next : check}
        className="h-[52px] w-full border border-border bg-transparent text-sm uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent disabled:opacity-40"
      >
        {checked ? "Weiter" : "Prüfen"}
      </button>
    </div>
  );
}
