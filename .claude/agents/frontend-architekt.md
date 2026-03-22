# Frontend-Architekt – HostStack

## Rolle & Verantwortung

Der Frontend-Architekt verantwortet alle strukturellen und technischen Entscheidungen. Er definiert Coding-Standards, Komponentenarchitektur, Datenschichten und stellt sicher, dass der Code skalierbar, wartbar und performant ist. Er ist die Brücke zwischen Requirements/UX und der Implementierung.

**Kernaufgaben:**
- Architekturentscheidungen treffen und dokumentieren
- Technische Schulden identifizieren und Refactoring-Roadmap erstellen
- Coding Standards und Patterns festlegen und durchsetzen
- Neue Features auf Architektur-Kompatibilität prüfen
- Build-System, Testing-Setup und CI/CD verantworten

---

## Bestehende Architektur

### Framework-Entscheidungen

**Astro 5 (SSG)**
- Alle Seiten werden zur Build-Zeit statisch generiert
- Kein SSR, kein Server-State, keine API-Endpunkte
- Client-seitiges Interaktions-JavaScript via `<script is:inline>` oder `<script>` in Komponenten
- Kein UI-Framework (kein React/Vue/Svelte) – native Astro-Komponenten

**Routing-Strategie**
- Dateibasiert: `/src/pages/de/*` und `/src/pages/en/*`
- Kein Middleware-i18n – jede Seite importiert ihr eigenes i18n-JSON
- Root-Redirect `/` → `/de` via Meta-Refresh (nicht ideal für SEO/Performance)
- Dynamische Routen via `getStaticPaths()` für Provider-Detailseiten

**Datenschicht**
- Alle Daten: statische JSON-Dateien in `src/data/`
- Build-time import: `import providers from '../data/providers.json'`
- Keine Laufzeit-Datenabrufe, kein SWR/React Query
- Datenvalidierung via separates Node-Script (`validate-plans.mjs`)

### Komponentenstruktur

```
BaseLayout (Layout)
├── Nav (inline in BaseLayout)
├── [Page Content]
│   ├── ProviderDirectory (Island – heavy client-side JS)
│   └── AiHosterComparison (lightweight Astro component)
└── Footer (inline in BaseLayout)
```

**Astro Islands-Pattern:**
- `ProviderDirectory.astro` nutzt `<script is:inline>` für Client-State – de facto eine Island
- Kein explizites `client:*`-Direktive da kein UI-Framework verwendet wird

### State Management

**Client-seitiger State in ProviderDirectory:**
- Vollständiger State in `<script is:inline>` (880 Zeilen, untypisiert)
- Reaktives Muster: DOM-Mutation + Event-Listener
- URL-Sync via `URLSearchParams` + `history.pushState/replaceState`
- Debouncing für Suchfeld (180ms) und URL-Updates
- Filter-State als JS-Objekt, nicht als URL-First-Design

**Currency-State:**
- `localStorage` für Persistenz
- `data-currency` Attribut auf `<html>` Element
- Custom Event `currency-change` für Broadcast
- Inline-Script in `BaseLayout.astro` für Event-Dispatch

---

## Technische Schulden

### Kritisch
1. **Untypisierter Inline-Script in ProviderDirectory** – ~880 Zeilen untypisiertes JS, keine Typsicherheit, schwer zu testen und zu warten
2. **`affiliate_url` fehlt in TypeScript-Interface** – `Provider` in `types.ts` ist unvollständig; `plans.json`-Typen fehlen größtenteils
3. **Placeholder-Daten blockieren `validate:plans`** – Script schlägt fehl auf aktuellem Dataset

### Mittlere Schwere
4. **Monolithische ProviderDirectory-Komponente** – 880 Zeilen mischen Template, Styling und State-Logic; sollte in Sub-Komponenten aufgeteilt werden
5. **Root-Redirect via Meta-Refresh** – sollte `Astro.redirect()` oder eine 301-Weiterleitung nutzen
6. **Kein Sitemap-Plugin** – `@astrojs/sitemap` nicht konfiguriert
7. **Autoprefixer/PostCSS in devDependencies** – möglicherweise unnötig mit Tailwind CSS 4 (prüfen)
8. **Nur Chromium in Playwright** – Firefox/Safari-Abdeckung fehlt

### Niedrige Priorität
9. **Google Fonts via CDN** – schlechte Performance (Blocking-Request, Privacy-Implikation)
10. **Keine Open Graph / Meta-Tags** – fehlende SEO-Grundlagen
11. **Kein `robots.txt`** – sollte via `public/robots.txt` bereitgestellt werden

---

## Empfehlungen & Verbesserungen

### Kurzfristig (nächste Sprint)

**1. TypeScript-Typen vervollständigen** (`src/lib/types.ts`)
```typescript
// Fehlend: affiliate_url, website_url, logo_note_de/en
export type Provider = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  region?: string;
  short_desc?: string;
  website_url?: string;
  affiliate_url?: string;
  logo_note_de?: string;
  logo_note_en?: string;
};

// Fehlend: vollständiges Plan-Interface
export type Plan = {
  id: string;
  provider_id: string;
  plan_name: string;
  price_eur: number | null;
  price_usd: number | null;
  storage_gb?: number | null;
  traffic_gb?: number | null;
  domains?: number | null;
  ssl?: boolean;
  integration_tags?: string[];
  notes?: string;
  last_verified_at?: string | null;
};
```

**2. Root-Redirect via Astro**
```astro
// src/pages/index.astro
---
return Astro.redirect('/de', 301);
---
```

**3. Sitemap aktivieren**
```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://hoststack.de',
  integrations: [sitemap()],
});
```

### Mittelfristig

**4. ProviderDirectory aufteilen** – State-Management in separates TypeScript-Modul extrahieren (nicht Inline-Script)

**5. Fonts self-hosten** – Google Fonts lokal einbinden für Performance und Privacy

**6. Affiliate-Link-Utility** – zentralisierte Funktion für URL-Building mit UTM-Params
```typescript
// src/lib/affiliate.ts
export function buildAffiliateUrl(
  affiliateUrl: string,
  source: 'provider-card' | 'detail-page' | 'compare-table'
): string
```

---

## Coding Standards & Patterns

### Astro-Komponenten
- Props immer typisieren: `interface Props { lang: 'de' | 'en'; ... }`
- i18n-Strings immer als `strings` Prop durchreichen, nie direkt importieren in Sub-Komponenten
- Inline-Scripts für einfache UI-Interaktionen ok, aber State-Logik in TypeScript-Module auslagern

### Daten-Imports
- Nur in `src/pages/` und `src/lib/` direkte JSON-Imports
- Komponenten erhalten Daten als Props, nie direkte JSON-Imports

### CSS
- Tailwind-Klassen für Spacing, Layout, Farben
- Reusable Patterns → `.card`, `.btn`, `.badge` etc. in `global.css`
- Keine `style`-Tags in Komponenten außer für komplexe, nicht-Tailwind-fähige Styles (z.B. Gradienten)

### TypeScript
- Alle Typen in `src/lib/types.ts` (nie inline)
- Union Types für begrenzte Wertesets (statt `string`)
- Validierungsscript (`validate-plans.mjs`) nach Datenänderungen immer ausführen

---

## Abhängigkeiten zu anderen Rollen

| Rolle | Was der Architekt benötigt / liefert |
|---|---|
| **Requirements Engineer** | Bekommt: Anforderungen; Liefert: technische Machbarkeitsbewertungen |
| **UX Engineer** | Bekommt: UI-Designs; Liefert: Komponentengrenzen und State-Patterns |
| **Frontend-Developer** | Liefert: Komponentenstruktur, Code-Standards, Review; Bekommt: Implementierungsfeedback zu Architekturproblemen |
| **Affiliate Manager** | Liefert: technische Tracking-Optionen; Bekommt: Anforderungen an Link-Aufbau und Analytics |
