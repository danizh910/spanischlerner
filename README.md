# Spanischlerner

Eine ruhige, werbefreie Spanisch-Lern-App für Anfänger (Deutsch → Spanisch).
Kein Duolingo-Klon: keine XP, keine Herzen, keine Ligen. Zwei Module:

- **Vokabeln** (`/learn`): frequenzbasierter Wortschatz mit Spaced Repetition (SM-2).
- **Sätze** (`/build`): Satzmuster-Baukasten zum Erkunden und Üben.

Next.js 15 (App Router) · TypeScript · Tailwind · PWA. Kein Auth — Zugang und
Geräte-Zuordnung laufen ausschliesslich über einen lokal erzeugten
**Gerätecode** (siehe unten).

## Design

Terminal/Brutalist: durchgehend Monospace (JetBrains Mono, self-hosted über
`next/font`), keine `border-radius`, keine Schatten/Gradients/Icons. Alle
Farben sind CSS-Variablen in `src/app/globals.css` (`--bg`, `--surface`,
`--border`, `--text`, `--text-dim`, `--accent`, `--error`) — ein einziges
festes Theme, kein Light/Dark-Umschalten. Buttons sind durchgehend
transparent mit 1px Border; der aktive/gedrückte Zustand wechselt nur die
Border-Farbe auf `--accent` (80ms Transition), nie eine Füllung.

## Setup

```bash
npm install
cp .env.example .env.local   # DATABASE_URL / DATABASE_URL_UNPOOLED eintragen, siehe unten
npm run dev
```

App läuft unter [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # Production-Build
npm run test    # Vitest (SM-2-Algorithmus, Merge-Algorithmus)
npm run lint    # ESLint
```

## Neon Postgres

Der Lernfortschritt liegt **primär in `localStorage`** (offline-first, siehe
unten) und wird darüber hinaus mit Neon Postgres synchronisiert, damit er
sich über den Gerätecode auf ein anderes Gerät übertragen lässt.

### Environment-Variablen

```
DATABASE_URL            # gepoolte Connection (Laufzeit/API-Routes)
DATABASE_URL_UNPOOLED    # direkte Connection (nur für Migrationen)
```

Beide aus dem Neon-Dashboard (oder `neonctl connection-string`) holen und in
`.env.local` eintragen. `.env.local` ist über `.gitignore` (`.env*`) vom
Commit ausgeschlossen; `.env.example` (ohne Werte) ist versioniert und zeigt,
welche Variablen benötigt werden. Auf Vercel müssen beide Variablen für
Production, Preview und Development gesetzt sein (Project Settings →
Environment Variables).

### Schema & Migrationen

```bash
npm run db:generate   # erzeugt SQL-Migration aus src/db/schema.ts nach /drizzle
npm run db:migrate    # führt ausstehende Migrationen gegen Neon aus
```

`drizzle.config.ts` verwendet für Migrationen bewusst `DATABASE_URL_UNPOOLED`
(direkte Verbindung, unproblematisch bei Prepared Statements); die Laufzeit
(`src/db/index.ts`, importiert von den Route Handlern) nutzt die gepoolte
`DATABASE_URL`. Zwei Tabellen, beide mit zusammengesetztem Primärschlüssel:

```
progress          (device_key, word_id)    — Modul A (Vokabeln)
pattern_progress  (device_key, pattern_id) — Modul B (Sätze), identisches Schema
```

Beide Tabellen speichern denselben SM-2-Zustand (`ease`, `interval`, `due`,
`reps`, `lapses`, `updated_at`) — auch für Sätze, obwohl `/build` aktuell
keine fällig-basierte Session anbietet; die Drill-Auswertung (richtig/falsch)
wird intern auf `reviewCard(entry, "good" | "again")` abgebildet, damit
Wörter und Muster über denselben Merge-Mechanismus synchronisiert werden
können.

**Wichtig:** `DATABASE_URL` wird ausschliesslich von Route Handlern unter
`src/app/api/sync/` gelesen (`src/db/index.ts`). Kein Client-Component
importiert `src/db/*`; nach `npm run build` lässt sich das explizit
verifizieren:

```bash
grep -r "DATABASE_URL" .next/static   # muss leer sein
```

### Gerätecode-Konzept

Beim ersten Start erzeugt `src/lib/deviceCode.ts` einen Code nach dem Muster
`SPANISCHESWORT-XXXX` (z. B. `PERRO-7F2K`, Zufallsteil ohne `O`/`0`/`I`/`1`
zur eindeutigen Lesbarkeit) und legt ihn in `localStorage` ab. Der Code ist
in `/settings` gross und selektierbar sichtbar und dient als einziger
"Login": Wer den Code auf einem anderen Gerät einträgt, lädt darüber seinen
Fortschritt.

Beim Übernehmen eines fremden Codes (`adoptDeviceKey` in `src/lib/sync.ts`):

1. Fortschritt für den fremden Code wird per `GET /api/sync/pull` geladen.
2. Lokaler und geladener Fortschritt werden zusammengeführt
   (`src/lib/merge.ts`, **last-write-wins über `updated_at`**, getestet in
   `src/lib/merge.test.ts`).
3. Das Merge-Ergebnis wird lokal gespeichert, der fremde Code wird zum
   eigenen Gerätecode, und der gesamte gemergte Stand wird umgehend an den
   Server gepusht (damit der Code serverseitig konsistent ist).

### Offline-first Sync

- **Lesen** geht immer gegen `localStorage`, nie gegen das Netz (`/learn`,
  `/build`, Fälligkeits-Zählung etc. funktionieren identisch offline).
- **Schreiben** (`recordWordProgress` / `recordPatternProgress` in
  `src/lib/sync.ts`) schreibt sofort lokal und legt zusätzlich einen Eintrag
  in einer Sync-Queue in `localStorage` ab.
- Die Queue wird von `src/components/SyncManager.tsx` gebündelt geflusht:
  debounced 10s nach der letzten Änderung, zusätzlich sofort bei
  Session-Ende (`/learn`, wenn die Session fertig ist), bei
  `visibilitychange` → `hidden` und beim `online`-Event.
- Ohne Netz wächst die Queue einfach weiter (kein Fehler, keine
  Blockierung); der nächste Trigger synchronisiert sie.
- `/settings` zeigt den Sync-Status dezent an: Zeitpunkt der letzten
  erfolgreichen Synchronisation und Anzahl offener (noch nicht
  übertragener) Änderungen.

## Content-Scripts

Der Wortschatz liegt in `public/data/words.json`, die Satzmuster in
`public/data/patterns.json` (unter `public/`, damit sie sowohl beim Build
importierbar als auch zur Laufzeit unter `/data/*.json` abrufbar/vom Service
Worker cachebar sind). Beide werden von Scripts in `scripts/` erzeugt, nicht
von Hand gepflegt.

### Wortschatz erweitern

```bash
npm run generate:words     # erzeugt/aktualisiert public/data/words.json
npm run validate:words     # prüft Schema, doppelte IDs, zu lange Sätze
```

`scripts/data/base-word-list.ts` enthält eine kuratierte Liste von rund 1200
spanischen Wörtern (Artikel/Pronomen/Verben zuerst, dann Substantive nach
Themen), aus der die ersten 1000 als Frequenzrang-Basis dienen. Es handelt
sich **nicht** um eine Kopie einer bestimmten proprietären Frequenzliste
(z. B. Davies' "A Frequency Dictionary of Spanish"), sondern um eine eigene
Zusammenstellung aus allgemein bekanntem A1/A2-Grundwortschatz, deren
Reihenfolge die reale Häufigkeit approximiert.

`scripts/data/enrichment.ts` enthält die eigentliche Anreicherung (deutsche
Übersetzung, Wortart, Genus, Beispielsatz ES/DE, optionale Notiz) — aktuell
für die ersten **150 Wörter** von Hand verfasst. `generate-words.ts`:

- verarbeitet die Basisliste in Batches von 50 Wörtern,
- schreibt nach jedem Batch den Zwischenstand nach `public/data/words.json`,
- ist **resume-fähig**: bereits erzeugte Wörter (per `es`-Feld erkannt)
  werden übersprungen, ein Abbruch mitten im Lauf ist also unproblematisch,
- überspringt Wörter ohne Eintrag in `enrichment.ts` und meldet sie am Ende.

Um die App über die ersten 150 Wörter hinaus auszubauen: weitere Einträge in
`scripts/data/enrichment.ts` ergänzen (Key = exakte Schreibweise aus
`base-word-list.ts`) und `npm run generate:words` erneut ausführen.

Homographe, die sich nur durch Akzent unterscheiden (`el`/`él`, `tu`/`tú`,
`que`/`qué`, `cual`/`cuál`, `quien`/`quién`, …), erhalten automatisch
eindeutige IDs (`el`, `el-2`, …) — die Zuordnung ist deterministisch anhand
der Verarbeitungsreihenfolge.

### Satzmuster erweitern

```bash
npm run generate:patterns  # erzeugt public/data/patterns.json neu aus scripts/generate-patterns.ts
```

Die 10 Muster sind dort vollständig hart kodiert (kein Batching nötig, da
klein und stabil). Neue Muster einfach dem `PATTERNS`-Array hinzufügen.

### PWA-Icons neu erzeugen

```bash
npm run generate:icons     # schreibt public/icons/*.png und src/app/apple-icon.png
```

Abhängigkeitsfreier PNG-Encoder (Node `zlib` + eigenes CRC32), damit keine
native Bildbibliothek (sharp/canvas) im Repo nötig ist.

## Architektur-Hinweise

- **SRS-Algorithmus**: `src/lib/srs.ts`, eigene SM-2-Implementierung
  (again/hard/good/easy), getestet in `src/lib/srs.test.ts`. Jeder Eintrag
  trägt zusätzlich `updatedAt` (ISO-Timestamp), das den Merge-Algorithmus
  antreibt.
- **Storage**: `src/lib/storage.ts` definiert das `ProgressStorage`-Interface
  (`getProgress` / `setProgress` / `getAllDue` / `exportJson` / `importJson`
  u. a.) gegen `localStorage`. UI-Code ruft nicht direkt `storage.setProgress`
  auf, sondern `recordWordProgress` / `recordPatternProgress` aus
  `src/lib/sync.ts`, die zusätzlich die Sync-Queue befüllen.
- **Merge**: `src/lib/merge.ts`, reine Funktion (last-write-wins über
  `updatedAt`), unabhängig testbar (`src/lib/merge.test.ts`).
- **PWA**: `src/app/manifest.ts` (Next-Manifest-Route), `public/sw.js`
  (handgeschriebener Service Worker, cached App-Shell + `/data/*.json` +
  `/settings` für volle Offline-Nutzung, `/api/*` explizit ausgenommen),
  Registrierung über `src/components/ServiceWorkerRegister.tsx`.
- Alle vier Seiten (`/`, `/learn`, `/build`, `/settings`) sind statisch
  vorgerendert (kein Server-State beim Rendern); nur die beiden Route
  Handler unter `/api/sync/` sind dynamisch.

## Deployment (Vercel)

1. Repo mit Vercel verbinden (Framework wird automatisch als Next.js erkannt).
2. `DATABASE_URL` und `DATABASE_URL_UNPOOLED` für Production, Preview und
   Development in den Project Settings setzen.
3. Migrationen einmalig gegen die Neon-DB ausführen (`npm run db:migrate`,
   lokal mit den Produktions-Zugangsdaten oder via Neon-Branching).
4. Build-Command/Output sind Standard (`next build`), keine Anpassung nötig.

Lokal geprüft vor dem Push: `npm run build`, `npm run lint`, `npm run test`
und `npm run validate:words` laufen fehlerfrei durch; der Client-Bundle
enthält nachweislich kein `DATABASE_URL`.
