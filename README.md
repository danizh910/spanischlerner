# Spanischlerner

Eine ruhige, werbefreie Spanisch-Lern-App für Anfänger (Deutsch → Spanisch).
Kein Duolingo-Klon: keine XP, keine Herzen, keine Ligen. Zwei Module:

- **Vokabeln** (`/learn`): frequenzbasierter Wortschatz mit Spaced Repetition (SM-2).
- **Sätze** (`/build`): Satzmuster-Baukasten zum Erkunden und Üben.

Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui · PWA. Kein Auth,
keine Datenbank — der Lernfortschritt liegt lokal im Browser (`localStorage`).

## Setup

```bash
npm install
npm run dev
```

App läuft unter [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # Production-Build
npm run test    # Vitest (SM-2-Algorithmus)
npm run lint    # ESLint
```

## Content-Scripts

Der Wortschatz liegt in `data/words.json`, die Satzmuster in
`data/patterns.json`. Beide werden von Scripts in `scripts/` erzeugt, nicht
von Hand gepflegt.

### Wortschatz erweitern

```bash
npm run generate:words     # erzeugt/aktualisiert data/words.json
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
- schreibt nach jedem Batch den Zwischenstand nach `data/words.json`,
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
npm run generate:patterns  # erzeugt data/patterns.json neu aus scripts/generate-patterns.ts
```

Die 10 Muster sind dort vollständig hart kodiert (kein Batching nötig, da
klein und stabil). Neue Muster einfach dem `PATTERNS`-Array hinzufügen.

### PWA-Icons neu erzeugen

```bash
npm run generate:icons     # schreibt public/icons/icon-192.png und icon-512.png
```

Abhängigkeitsfreier PNG-Encoder (Node `zlib` + eigenes CRC32), damit keine
native Bildbibliothek (sharp/canvas) im Repo nötig ist.

## Architektur-Hinweise

- **SRS-Algorithmus**: `src/lib/srs.ts`, eigene SM-2-Implementierung
  (again/hard/good/easy), getestet in `src/lib/srs.test.ts`.
- **Storage**: `src/lib/storage.ts` definiert das `ProgressStorage`-Interface
  (`getProgress` / `setProgress` / `getAllDue` / `exportJson` / `importJson`
  u. a.). Aktuell gibt es nur den `localStorage`-Adapter. Export/Import als
  JSON-Datei ist auf der Startseite verlinkt, damit Fortschritt manuell
  zwischen Geräten übertragen werden kann.
- **PWA**: `src/app/manifest.ts` (Next-Manifest-Route), `public/sw.js`
  (handgeschriebener Service Worker, cached App-Shell + `/data/*.json` für
  volle Offline-Nutzung), Registrierung über
  `src/components/ServiceWorkerRegister.tsx`.
- Alle drei Seiten (`/`, `/learn`, `/build`) sind statisch (kein
  Server-State), was den Service Worker deutlich einfacher hält.

## Später: Migration auf Neon/Postgres

Sobald mehrgeräte-fähige Synchronisation gebraucht wird, kann das
`ProgressStorage`-Interface aus `src/lib/storage.ts` durch einen zweiten
Adapter implementiert werden (z. B. `src/lib/storage-neon.ts`), der die
gleichen Methoden gegen eine Postgres-Tabelle (`word_id`, `ease`, `interval`,
`due`, `reps`, `lapses`, ...) umsetzt. Die UI-Komponenten importieren nur das
`storage`-Objekt und die `ProgressStorage`-Typen — an ihnen muss sich dafür
nichts ändern, es wird lediglich der Export in `storage.ts` ausgetauscht
(z. B. hinter einem Feature-Flag oder Auth-Check, falls dann doch ein
Login eingeführt wird).

## Deployment (Vercel)

1. Repo mit Vercel verbinden (Framework wird automatisch als Next.js erkannt).
2. Keine Umgebungsvariablen nötig (kein Auth, keine Datenbank in v1).
3. Build-Command/Output sind Standard (`next build`), keine Anpassung nötig.

Lokal geprüft vor dem Push: `npm run build`, `npm run lint`, `npm run test`
und `npm run validate:words` laufen fehlerfrei durch.
