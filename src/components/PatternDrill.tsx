"use client";

import { useCallback, useState } from "react";
import { PATTERNS, fillTemplate } from "@/lib/patterns";
import { storage } from "@/lib/storage";
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

    const prev = storage.getPatternProgress(round.pattern.id) ?? {
      attempts: 0,
      correct: 0,
      lastPracticed: new Date().toISOString(),
    };
    storage.setPatternProgress(round.pattern.id, {
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
      lastPracticed: new Date().toISOString(),
    });
  }

  function next() {
    setRound(generateRound());
    setPlacedIds([]);
    setChecked(false);
    setIsCorrect(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-card p-5 text-center ring-1 ring-foreground/10">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Übersetze ins Spanische
        </p>
        <p className="mt-2 text-xl font-medium">{round.targetDe}</p>
      </div>

      <div className="flex min-h-14 flex-wrap gap-2 rounded-xl border border-dashed border-border p-3">
        {placedChips.length === 0 ? (
          <span className="p-2 text-sm text-muted-foreground">
            Tippe die Wörter unten in der richtigen Reihenfolge an.
          </span>
        ) : (
          placedChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => unplace(chip.id)}
              className="min-h-11 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
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
            className="min-h-11 rounded-lg bg-muted px-3 text-sm font-medium active:bg-muted/70"
          >
            {chip.text}
          </button>
        ))}
      </div>

      {checked ? (
        <div
          className={`rounded-xl p-4 text-sm ${
            isCorrect
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          <p className="font-medium">{isCorrect ? "Richtig!" : "Nicht ganz."}</p>
          <p className="mt-1 text-foreground">{round.targetEs}</p>
        </div>
      ) : null}

      <button
        type="button"
        disabled={!allPlaced && !checked}
        onClick={checked ? next : check}
        className="h-14 w-full rounded-xl bg-primary text-primary-foreground disabled:opacity-40 active:opacity-80"
      >
        {checked ? "Weiter" : "Prüfen"}
      </button>
    </div>
  );
}
