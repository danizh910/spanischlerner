"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATTERNS, fillTemplate } from "@/lib/patterns";

export function PatternExplorer() {
  const [patternId, setPatternId] = useState(PATTERNS[0].id);
  const [optionIndex, setOptionIndex] = useState(0);

  const pattern = PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0];
  const slot = pattern.slots[0];
  const option = slot.options[optionIndex] ?? slot.options[0];

  const sentenceEs = fillTemplate(pattern.template_es, { [slot.key]: option.es });
  const sentenceDe = fillTemplate(pattern.template_de, { [slot.key]: option.de });

  return (
    <div className="flex flex-col gap-5">
      <Select
        value={patternId}
        onValueChange={(id: string | null) => {
          if (!id) return;
          setPatternId(id);
          setOptionIndex(0);
        }}
      >
        <SelectTrigger className="h-12 w-full">
          <SelectValue>{pattern.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PATTERNS.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <p className="text-xl font-medium">{sentenceEs}</p>
        <p className="mt-1 text-muted-foreground">{sentenceDe}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {slot.options.map((opt, i) => (
          <button
            key={opt.es}
            type="button"
            onClick={() => setOptionIndex(i)}
            className={`min-h-11 rounded-full px-4 text-sm font-medium ${
              i === optionIndex
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground active:bg-muted/70"
            }`}
          >
            {opt.es}
          </button>
        ))}
      </div>
    </div>
  );
}
