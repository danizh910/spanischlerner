"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Layers } from "lucide-react";
import { getDueCount } from "@/lib/session";
import { ProgressBackup } from "@/components/ProgressBackup";

export default function HomePage() {
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    setDueCount(getDueCount());
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-5 py-10 pb-[calc(env(safe-area-inset-bottom)+2.5rem)]">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Spanischlerner</h1>
        <p className="mt-2 h-5 text-sm text-muted-foreground">
          {dueCount !== null &&
            (dueCount > 0
              ? `${dueCount} Karte${dueCount === 1 ? "" : "n"} heute fällig`
              : "Keine Karten heute fällig")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/learn"
          className="flex min-h-[7.5rem] flex-col justify-center gap-2 rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-colors active:bg-muted"
        >
          <Layers className="size-7 text-primary" aria-hidden />
          <span className="text-lg font-medium">Vokabeln</span>
          <span className="text-sm text-muted-foreground">
            Wortschatz mit Spaced Repetition üben
          </span>
        </Link>

        <Link
          href="/build"
          className="flex min-h-[7.5rem] flex-col justify-center gap-2 rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-colors active:bg-muted"
        >
          <BookOpen className="size-7 text-primary" aria-hidden />
          <span className="text-lg font-medium">Sätze</span>
          <span className="text-sm text-muted-foreground">
            Satzmuster erkunden und üben
          </span>
        </Link>
      </div>

      <ProgressBackup />
    </main>
  );
}
