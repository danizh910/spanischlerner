"use client";

import type { Rating } from "@/lib/types";

const RATINGS: { value: Rating; label: string }[] = [
  { value: "again", label: "Nochmal" },
  { value: "hard", label: "Schwer" },
  { value: "good", label: "Gut" },
  { value: "easy", label: "Einfach" },
];

type RatingButtonsProps = {
  onRate: (rating: Rating) => void;
};

export function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      {RATINGS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onRate(r.value)}
          className={`h-[52px] w-full border border-border bg-transparent text-sm uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent ${
            r.value === "again" ? "border-l-[3px] border-l-error" : ""
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
