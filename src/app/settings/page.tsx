"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { getDeviceKey } from "@/lib/deviceCode";
import { storage } from "@/lib/storage";
import { adoptDeviceKey, getLastSyncedAt, getQueueSize } from "@/lib/sync";
import { WORDS } from "@/lib/words";

type AdoptStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "ok"; message: string }
  | { type: "error"; message: string };

export default function SettingsPage() {
  const [deviceKey, setDeviceKeyState] = useState<string | null>(null);
  const [learnedCount, setLearnedCount] = useState(0);
  const [foreignCode, setForeignCode] = useState("");
  const [adoptStatus, setAdoptStatus] = useState<AdoptStatus>({ type: "idle" });
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [queueSize, setQueueSize] = useState(0);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDeviceKeyState(getDeviceKey());
    setLearnedCount(Object.keys(storage.getAllProgress()).length);
    setLastSynced(getLastSyncedAt());
    setQueueSize(getQueueSize());
  }, []);

  async function handleAdopt() {
    if (!foreignCode.trim()) return;
    setAdoptStatus({ type: "loading" });
    const result = await adoptDeviceKey(foreignCode);
    if (result.ok) {
      setDeviceKeyState(getDeviceKey());
      setLearnedCount(Object.keys(storage.getAllProgress()).length);
      setForeignCode("");
      setAdoptStatus({ type: "ok", message: "Übernommen und zusammengeführt." });
      setLastSynced(getLastSyncedAt());
      setQueueSize(getQueueSize());
    } else {
      setAdoptStatus({ type: "error", message: result.error });
    }
  }

  function handleExport() {
    const json = storage.exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spanischlerner-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      storage.importJson(text);
      setLearnedCount(Object.keys(storage.getAllProgress()).length);
      setImportMessage("Fortschritt importiert.");
    } catch {
      setImportMessage("Import fehlgeschlagen: ungültige Datei.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
      <Link
        href="/"
        className="-my-3 inline-block self-start py-3 text-xs uppercase tracking-widest text-text-dim"
      >
        Zurück
      </Link>

      <Section title="Gerätecode">
        <p className="select-all border border-border bg-surface px-4 py-4 text-center text-xl tracking-widest text-text">
          {deviceKey ?? "..."}
        </p>
        <p className="text-xs text-text-dim">
          Mit diesem Code lässt sich der Fortschritt auf einem anderen Gerät laden.
        </p>
      </Section>

      <Section title="Fremden Code übernehmen">
        <input
          type="text"
          value={foreignCode}
          onChange={(e) => setForeignCode(e.target.value.toUpperCase())}
          placeholder="PERRO-7F2K"
          className="h-12 border border-border bg-transparent px-3 text-sm uppercase tracking-widest text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdopt}
          disabled={adoptStatus.type === "loading" || !foreignCode.trim()}
          className="h-12 w-full border border-border bg-transparent text-xs uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent disabled:opacity-40"
        >
          {adoptStatus.type === "loading" ? "Lädt ..." : "Übernehmen"}
        </button>
        {adoptStatus.type === "ok" || adoptStatus.type === "error" ? (
          <p className={`text-xs ${adoptStatus.type === "error" ? "text-error" : "text-accent"}`}>
            {adoptStatus.message}
          </p>
        ) : null}
      </Section>

      <Section title="Fortschritt">
        <Row label="Gelernte Wörter" value={`${learnedCount} / ${WORDS.length}`} />
      </Section>

      <Section title="Synchronisation">
        <Row
          label="Zuletzt synchronisiert"
          value={lastSynced ? new Date(lastSynced).toLocaleString("de-DE") : "noch nie"}
        />
        <Row label="Offene Änderungen" value={String(queueSize)} />
      </Section>

      <Section title="Export / Import">
        <button
          type="button"
          onClick={handleExport}
          className="h-12 w-full border border-border bg-transparent text-xs uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent"
        >
          Exportieren
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-12 w-full border border-border bg-transparent text-xs uppercase tracking-widest text-text transition-colors duration-[80ms] active:border-accent"
        >
          Importieren
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = "";
          }}
        />
        {importMessage ? <p className="text-xs text-text-dim">{importMessage}</p> : null}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-widest text-text-dim">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border py-2">
      <span className="text-sm text-text-dim">{label}</span>
      <span className="text-sm text-text">{value}</span>
    </div>
  );
}
