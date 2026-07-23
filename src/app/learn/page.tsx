"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlashCard } from "@/components/FlashCard";
import { RatingButtons } from "@/components/RatingButtons";
import { buildLearnSession, getSessionStats } from "@/lib/session";
import { createProgressEntry, reviewCard } from "@/lib/srs";
import { storage } from "@/lib/storage";
import { flushQueue, recordWordProgress } from "@/lib/sync";
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
      recordWordProgress(currentWord.id, reviewCard(entry, rating));

      if (index + 1 >= session.length) {
        setFinished(true);
        void flushQueue();
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
  const progressPct = session && session.length > 0 ? (index / session.length) * 100 : 0;

  return (
    <main className="flex w-full flex-1 flex-col">
      <div className="h-[3px] w-full bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-[80ms]"
          style={{ width: `${finished ? 100 : progressPct}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
        <Link
          href="/"
          className="-my-3 mb-1 inline-block self-start py-3 text-xs uppercase tracking-widest text-text-dim"
        >
          Zurück
        </Link>

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
            {currentWord ? (
              <FlashCard
                word={currentWord}
                direction={direction}
                revealed={revealed}
                onReveal={() => setRevealed(true)}
              />
            ) : null}

            <div className="pb-2">
              {revealed ? (
                <RatingButtons onRate={handleRate} />
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="h-[52px] w-full border border-border bg-transparent text-sm uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent"
                >
                  Aufdecken
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <p className="text-text">Keine Karten verfügbar.</p>
      <p className="text-sm text-text-dim">Schau später wieder vorbei.</p>
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
    <div className="flex flex-1 flex-col justify-center gap-8">
      <div className="flex flex-col gap-1 border border-border bg-surface p-5">
        <Stat label="Heute gelernt" value={studied} />
        <Stat label="Fällig morgen" value={dueTomorrow} />
        <Stat label="Aktive Wörter" value={activeWords} />
      </div>

      <Link
        href="/"
        className="flex h-[52px] w-full items-center justify-center border border-border bg-transparent text-sm uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent"
      >
        Zur Startseite
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border py-2 last:border-b-0">
      <span className="text-sm text-text-dim">{label}</span>
      <span className="text-xl text-text">{value}</span>
    </div>
  );
}
