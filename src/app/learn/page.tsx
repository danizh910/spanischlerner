"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { FlashCard } from "@/components/FlashCard";
import { RatingButtons } from "@/components/RatingButtons";
import { Progress } from "@/components/ui/progress";
import { buildLearnSession, getSessionStats } from "@/lib/session";
import { createProgressEntry, reviewCard } from "@/lib/srs";
import { storage } from "@/lib/storage";
import type { CardDirection, Rating, Word } from "@/lib/types";

export default function LearnPage() {
  const [session, setSession] = useState<Word[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setSession(buildLearnSession());
  }, []);

  const currentWord = session?.[index];
  const direction: CardDirection = index % 2 === 0 ? "es-de" : "de-es";

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!session || !currentWord) return;
      const entry = storage.getProgress(currentWord.id) ?? createProgressEntry();
      storage.setProgress(currentWord.id, reviewCard(entry, rating));

      if (index + 1 >= session.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }
    },
    [session, currentWord, index],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!session || finished) return;
      if (e.code === "Space" && !revealed) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        const map: Record<string, Rating> = {
          "1": "again",
          "2": "hard",
          "3": "good",
          "4": "easy",
        };
        const rating = map[e.key];
        if (rating) handleRate(rating);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [session, finished, revealed, handleRate]);

  const stats = useMemo(() => (finished ? getSessionStats() : null), [finished]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/"
          className="flex size-11 items-center justify-center rounded-full active:bg-muted"
          aria-label="Zurück"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <span className="text-sm font-medium text-muted-foreground">Vokabeln</span>
      </div>

      {!session ? null : session.length === 0 ? (
        <EmptyState />
      ) : finished ? (
        <SessionSummary
          studied={session.length}
          activeWords={stats?.activeWords ?? 0}
          dueTomorrow={stats?.dueTomorrow ?? 0}
        />
      ) : (
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <Progress value={(index / session.length) * 100} />
            {currentWord ? (
              <FlashCard
                word={currentWord}
                direction={direction}
                revealed={revealed}
                onReveal={() => setRevealed(true)}
              />
            ) : null}
          </div>

          <div className="pb-2">
            {revealed ? (
              <RatingButtons onRate={handleRate} />
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="h-14 w-full rounded-xl bg-primary text-primary-foreground active:opacity-80"
              >
                Aufdecken
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <p className="text-lg font-medium">Keine Karten verfügbar</p>
      <p className="text-sm text-muted-foreground">Schau später wieder vorbei.</p>
    </div>
  );
}

function SessionSummary({
  studied,
  activeWords,
  dueTomorrow,
}: {
  studied: number;
  activeWords: number;
  dueTomorrow: number;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div>
        <p className="text-2xl font-semibold">Session beendet</p>
        <p className="mt-1 text-sm text-muted-foreground">Gut gemacht!</p>
      </div>

      <dl className="grid w-full grid-cols-3 gap-3">
        <Stat label="Heute gelernt" value={studied} />
        <Stat label="Fällig morgen" value={dueTomorrow} />
        <Stat label="Aktive Wörter" value={activeWords} />
      </dl>

      <Link
        href="/"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-primary-foreground active:opacity-80"
      >
        Zur Startseite
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-card p-3 ring-1 ring-foreground/10">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-xl font-semibold">{value}</dd>
    </div>
  );
}
