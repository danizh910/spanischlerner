"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDueCount } from "@/lib/session";

export default function HomePage() {
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    setDueCount(getDueCount());
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10 px-5 py-10 pb-[calc(env(safe-area-inset-bottom)+2.5rem)]">
      <p className="h-4 text-center text-xs uppercase tracking-widest text-accent">
        {dueCount !== null
          ? dueCount > 0
            ? `${dueCount} Karte${dueCount === 1 ? "" : "n"} heute fällig`
            : "Keine Karten heute fällig"
          : ""}
      </p>

      <div className="flex flex-col">
        <Link
          href="/learn"
          className="border border-border bg-transparent px-6 py-8 transition-colors duration-[80ms] active:border-accent"
        >
          <p className="text-lg uppercase tracking-widest text-text">Vokabeln</p>
          <p className="mt-1 text-sm text-text-dim">Wortschatz mit Spaced Repetition üben</p>
        </Link>
        <Link
          href="/build"
          className="-mt-px border border-border bg-transparent px-6 py-8 transition-colors duration-[80ms] active:border-accent"
        >
          <p className="text-lg uppercase tracking-widest text-text">Sätze</p>
          <p className="mt-1 text-sm text-text-dim">Satzmuster erkunden und üben</p>
        </Link>
      </div>

      <Link
        href="/settings"
        className="-my-3 inline-block self-center py-3 text-center text-xs uppercase tracking-widest text-text-dim"
      >
        Einstellungen
      </Link>
    </main>
  );
}
