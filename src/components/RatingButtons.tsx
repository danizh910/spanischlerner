"use client";

import type { Rating } from "@/lib/types";

const RATINGS: { value: Rating; label: string; classes: string }[] = [
  { value: "again", label: "Nochmal", classes: "bg-destructive/15 text-destructive" },
  { value: "hard", label: "Schwer", classes: "bg-muted text-foreground" },
  { value: "good", label: "Gut", classes: "bg-secondary text-secondary-foreground" },
  { value: "easy", label: "Leicht", classes: "bg-primary/15 text-primary" },
];

type RatingButtonsProps = {
  onRate: (rating: Rating) => void;
};

export function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {RATINGS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onRate(r.value)}
          className={`flex h-14 flex-col items-center justify-center rounded-xl text-sm font-medium active:opacity-80 ${r.classes}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
