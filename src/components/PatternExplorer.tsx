"use client";

import { useState } from "react";
import { PATTERNS, fillTemplate } from "@/lib/patterns";

function withBlank(template: string, key: string): string {
  return template.replace(`{{${key}}}`, "...");
}

export function PatternExplorer() {
  const [patternId, setPatternId] = useState(PATTERNS[0].id);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);

  const pattern = PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0];
  const slot = pattern.slots[0];
  const option = optionIndex !== null ? slot.options[optionIndex] : null;

  const placeholder = `{{${slot.key}}}`;
  const [beforeEs, afterEs] = pattern.template_es.split(placeholder);
  const sentenceDe = option
    ? fillTemplate(pattern.template_de, { [slot.key]: option.de })
    : withBlank(pattern.template_de, slot.key);

  function selectPattern(id: string) {
    setPatternId(id);
    setOptionIndex(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => selectPattern(p.id)}
            className={`h-12 border bg-transparent px-3 text-xs transition-colors duration-[80ms] active:border-accent ${
              p.id === patternId ? "border-accent text-text" : "border-border text-text-dim"
            }`}
          >
            {p.name.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="border-b border-border pb-3">
        <p className="text-sm text-text">{pattern.name.toLowerCase()}</p>
        <p className="text-xs text-text-dim">{withBlank(pattern.template_de, slot.key)}</p>
      </div>

      <div className="border border-border bg-surface p-6 text-center">
        <p className="text-2xl text-text">
          {beforeEs}
          <span className="text-accent">{option ? option.es : "____"}</span>
          {afterEs}
        </p>
        <p className="mt-2 text-sm text-text-dim">{sentenceDe}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {slot.options.map((opt, i) => (
          <button
            key={opt.es}
            type="button"
            onClick={() => setOptionIndex(i)}
            className={`h-12 border bg-transparent px-4 text-sm transition-colors duration-[80ms] active:border-accent ${
              i === optionIndex ? "border-accent text-text" : "border-border text-text-dim"
            }`}
          >
            {opt.es}
          </button>
        ))}
      </div>
    </div>
  );
}
