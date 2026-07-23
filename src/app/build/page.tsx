"use client";

import Link from "next/link";
import { useState } from "react";
import { PatternDrill } from "@/components/PatternDrill";
import { PatternExplorer } from "@/components/PatternExplorer";

type Mode = "erkunden" | "drill";

export default function BuildPage() {
  const [mode, setMode] = useState<Mode>("erkunden");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
      <Link
        href="/"
        className="-my-3 mb-1 inline-block self-start py-3 text-xs uppercase tracking-widest text-text-dim"
      >
        Zurück
      </Link>

      <div className="mb-6 flex">
        <button
          type="button"
          onClick={() => setMode("erkunden")}
          className={`h-12 flex-1 border bg-transparent text-xs uppercase tracking-widest transition-colors duration-[80ms] active:border-accent ${
            mode === "erkunden" ? "border-accent text-text" : "border-border text-text-dim"
          }`}
        >
          Erkunden
        </button>
        <button
          type="button"
          onClick={() => setMode("drill")}
          className={`-ml-px h-12 flex-1 border bg-transparent text-xs uppercase tracking-widest transition-colors duration-[80ms] active:border-accent ${
            mode === "drill" ? "border-accent text-text" : "border-border text-text-dim"
          }`}
        >
          Drill
        </button>
      </div>

      {mode === "erkunden" ? <PatternExplorer /> : <PatternDrill />}
    </main>
  );
}
