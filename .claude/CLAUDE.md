# HostStack – Gemeinsame Projektbasis

## Projektbeschreibung

**HostStack** ist ein zweisprachiges (Deutsch/Englisch) statisches Hosting-Vergleichsportal mit Affiliate-Monetarisierung. Ziel ist es, Nutzern die Wahl des passenden Hosting-Anbieters zu erleichtern und über Affiliate-Links Provisionen zu generieren.

Aktueller Status: **Prototype** – Architektur ist solid, aber Daten sind Platzhalter und Affiliate-URLs sind leer.

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Astro 5.x (SSG, kein SSR) |
| CSS | Tailwind CSS 4 via `@tailwindcss/vite` |
| Sprache | TypeScript (Astro built-in) |
| Testing | Playwright E2E |
| Build | Vite (via Astro) |
| Node | ESM (`"type": "module"`) |

**Keine externen UI-Libraries**, keine Datenbank, kein CMS, keine API-Endpunkte.

---

## Projektstruktur

```
src/
├── pages/
│   ├── index.astro              # Redirect → /de
│   ├── de/                      # Deutsche Seiten
│   │   ├── index.astro          # Homepage
│   │   ├── compare.astro        # Pläne-Vergleich
│   │   └── providers/
│   │       ├── index.astro      # Anbieterverzeichnis
│   │       └── [slug].astro     # Anbieter-Detailseite
│   └── en/                      # Englische Seiten (gleiche Struktur)
├── components/
│   ├── ProviderDirectory.astro  # Filter-UI + Pagination (880 Zeilen)
│   └── AiHosterComparison.astro # KI-Hoster-Vergleichstabelle
├── layouts/
│   └── BaseLayout.astro         # Nav, Footer, Currency-Toggle
├── lib/
│   ├── types.ts                 # TypeScript-Interfaces
│   └── providerIndex.ts         # Filter-/Sort-/Paginierungslogik
├── data/
│   ├── providers.json           # 32 Anbieter
│   ├── plans.json               # ~120 Tarife
│   ├── ai-hosters.json          # 8 KI-spezifische Hoster
│   └── i18n/
│       ├── de.json              # 61 deutsche Strings
│       └── en.json              # 61 englische Strings
└── styles/
    └── global.css               # Tailwind + Custom Utility-Klassen
public/
└── logos/                       # Provider-Logos (SVG)
scripts/
└── validate-plans.mjs           # JSON-Schema-Validierung
tests/
└── e2e/                         # Playwright Tests
```

---

## Wichtige Konventionen & Coding Standards

### i18n-Routing
- Kein Middleware – rein dateibasiertes Routing unter `/de/*` und `/en/*`
- Jede Seite importiert ihr i18n-JSON direkt und übergibt `strings` + `lang` an `BaseLayout`
- Neue UI-Strings immer in **beide** i18n-Dateien eintragen

### Daten
- Alle Inhalte sind statische JSON-Dateien in `src/data/`
- Neue Felder in `providers.json` oder `plans.json` erfordern Typaktualisierung in `src/lib/types.ts`
- `npm run validate:plans` muss nach Änderungen an `plans.json` fehlerfrei durchlaufen

### Styling
- Tailwind CSS 4 – kein separates `tailwind.config.js` im Vite-Plugin, aber `@config "../../tailwind.config.js"` in `global.css`
- Semantische Farb-Tokens: `ink`, `sand`, `fog`, `ember`, `moss`
- Schriften: `font-display` (Bebas Neue), `font-body` (Space Grotesk)
- Utility-Klassen: `.card`, `.btn`, `.btn-outline`, `.badge` (in `global.css` definiert)
- Keine Komponenten-Libraries – alles Custom

### Affiliate-Links
- Pflicht: `rel="sponsored noopener"` auf allen Affiliate-Links
- Footer-Hinweis auf Affiliate-Links ist Pflicht (bereits in BaseLayout)
- Affilite-URLs werden in `providers.json` unter `affiliate_url` gespeichert

### TypeScript
- Typen zentral in `src/lib/types.ts` – nie inline definieren
- Inline-`<script>`-Tags in Astro-Komponenten sind untypisiert (bekannte Schwäche)

---

## Bekannte Schwachstellen & offene TODOs

### Kritisch (blockiert Monetarisierung)
- [ ] Alle `affiliate_url`-Felder in `providers.json` sind leer
- [ ] Kein Conversion-Tracking / Analytics
- [ ] Placeholder-Daten in `plans.json` – `validate:plans` schlägt fehl
- [ ] `last_verified_at` ist `null` für alle Top-10-Provider

### Technische Schulden
- [ ] `affiliate_url` fehlt im TypeScript-Interface `Provider`
- [ ] `Plan`-Interface unvollständig (fehlt: `plan_name`, `storage_gb`, `domains`, etc.)
- [ ] `ProviderDirectory.astro` ist 880 Zeilen monolithisch mit untypisiertem Inline-Script
- [ ] Kein Code-Splitting, kein Lazy-Loading für Logos

### Fehlende Features
- [ ] SEO: keine Meta-Descriptions, kein Open Graph, kein Sitemap, kein hreflang
- [ ] No affiliate links in compare.astro und ProviderDirectory cards
- [ ] Kein UTM-Parameter-System für Tracking
- [ ] Keine Nutzerbewertungen / Pros-Cons-Listen
- [ ] Nur Chromium in E2E-Tests, Test-Coverage < 10%

---

## Agenten-Rollen

Dieses Projekt wird von 5 spezialisierten Agenten bearbeitet. Jeder hat eine eigene MD-Datei:

| Agent | Datei | Verantwortung |
|---|---|---|
| Requirements Engineer | `agents/requirements-engineer.md` | Anforderungen, Backlog, Priorisierung |
| UX Engineer | `agents/ux-engineer.md` | UX/UI-Design, Flows, Designsystem |
| Frontend-Architekt | `agents/frontend-architekt.md` | Architektur, Patterns, Tech-Entscheidungen |
| Frontend-Developer | `agents/frontend-developer.md` | Implementierung, Bugfixes, Code |
| Affiliate Manager | `agents/affiliate-manager.md` | Monetarisierung, Links, Tracking, Reporting |
