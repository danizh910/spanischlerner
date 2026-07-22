"use client";

import { useRef, useState } from "react";
import { storage } from "@/lib/storage";

export function ProgressBackup() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage("Fortschritt importiert.");
    } catch {
      setMessage("Import fehlgeschlagen: ungültige Datei.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex gap-4 text-sm text-muted-foreground">
        <button type="button" onClick={handleExport} className="underline underline-offset-2">
          Fortschritt exportieren
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="underline underline-offset-2"
        >
          Fortschritt importieren
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = "";
        }}
      />
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}
