# Frontend-Developer – HostStack

## Rolle & Verantwortung

Der Frontend-Developer implementiert Features und Bugfixes gemäß den Vorgaben von Requirements Engineer, UX Engineer und Frontend-Architekt. Er schreibt sauberen, wartbaren Code, hält Coding-Standards ein und meldet technische Schulden oder Architekturprobleme zurück.

**Kernaufgaben:**
- Features implementieren nach Spezifikation
- Bugs beheben
- Komponenten bauen und warten
- E2E-Tests schreiben und pflegen
- Daten in `src/data/` aktuell halten
- Code-Reviews durchführen

---

## Übersicht aller Komponenten & ihr Status

### Layouts
| Datei | Status | Anmerkungen |
|---|---|---|
| `src/layouts/BaseLayout.astro` | Fertig | Nav, Footer, Currency-Toggle – funktional |

### Seiten
| Datei | Status | Anmerkungen |
|---|---|---|
| `src/pages/index.astro` | Fertig (verbesserungswürdig) | Meta-Refresh-Redirect – sollte 301 werden |
| `src/pages/de/index.astro` | Fertig | Hero, Provider-Vorschau, AI-Sektion |
| `src/pages/en/index.astro` | Fertig | Wie DE, englische Strings |
| `src/pages/de/compare.astro` | Fertig | Fehlende Affiliate-CTAs in Tabelle |
| `src/pages/en/compare.astro` | Fertig | Wie DE |
| `src/pages/de/providers/index.astro` | Fertig | Nutzt ProviderDirectory-Komponente |
| `src/pages/en/providers/index.astro` | Fertig | Wie DE |
| `src/pages/de/providers/[slug].astro` | Fertig | Affiliate-Button-Infra vorhanden, URL leer |
| `src/pages/en/providers/[slug].astro` | Fertig | Wie DE |

### Komponenten
| Datei | Status | Anmerkungen |
|---|---|---|
| `src/components/ProviderDirectory.astro` | Fertig (Schulden) | 880 Zeilen, untypisierter Inline-Script |
| `src/components/AiHosterComparison.astro` | Fertig | Kein Affiliate-Tracking |

### Lib / Utilities
| Datei | Status | Anmerkungen |
|---|---|---|
| `src/lib/types.ts` | Unvollständig | Provider/Plan-Interfaces unvollständig |
| `src/lib/providerIndex.ts` | Fertig | Filter, Sort, Pagination – funktional |

### Daten
| Datei | Status | Anmerkungen |
|---|---|---|
| `src/data/providers.json` | Unvollständig | `affiliate_url` überall leer |
| `src/data/plans.json` | Unvollständig | Placeholder-Daten, `validate:plans` schlägt fehl |
| `src/data/ai-hosters.json` | Fertig | 8 Einträge, kein Affiliate-Tracking |
| `src/data/i18n/de.json` | Fertig | 61 Keys |
| `src/data/i18n/en.json` | Fertig | 61 Keys |

### Tests
| Datei | Status | Anmerkungen |
|---|---|---|
| `tests/e2e/provider-directory.spec.ts` | Fertig | 11 Tests, nur Chromium |

---

## Konkrete offene Implementierungsaufgaben

### Kritisch – Monetarisierung
```
TASK-001: affiliate_url in providers.json befüllen
  - Dateien: src/data/providers.json
  - Für alle 32 Provider: echte Affiliate-URLs eintragen oder leer lassen
  - Priorität: Top-10 zuerst (aws, azure, gcp, cloudflare, vercel, netlify, render, railway, heroku, fly.io)

TASK-002: Affiliate-CTAs in ProviderDirectory-Karten
  - Datei: src/components/ProviderDirectory.astro
  - In Provider-Karte: wenn affiliate_url vorhanden → "Zum Anbieter" Button mit rel="sponsored noopener"
  - Neuer i18n-Key: providers_cta_visit (DE: "Zum Anbieter", EN: "Visit Provider")

TASK-003: Affiliate-CTAs in compare.astro
  - Dateien: src/pages/de/compare.astro, src/pages/en/compare.astro
  - Pro Plan-Zeile: Link-Button zum Provider (affiliate_url > website_url Fallback)
  - rel="sponsored noopener" wenn affiliate_url

TASK-004: affiliate_url im TypeScript-Interface ergänzen
  - Datei: src/lib/types.ts
  - Provider-Interface: affiliate_url?: string; website_url?: string; ergänzen
```

### Wichtig – SEO & Technik
```
TASK-005: Root-Redirect zu 301 umschreiben
  - Datei: src/pages/index.astro
  - Astro.redirect('/de', 301) statt Meta-Refresh

TASK-006: Meta-Tags auf allen Seiten
  - Datei: src/layouts/BaseLayout.astro
  - Props: description?: string, ogImage?: string hinzufügen
  - <meta name="description">, og:title, og:description, og:image ergänzen
  - hreflang-Tags für DE/EN Alternates

TASK-007: Plan-Interface vervollständigen
  - Datei: src/lib/types.ts
  - id, plan_name, storage_gb, traffic_gb, domains, notes, last_verified_at ergänzen

TASK-008: Echte Plan-Daten für Top-10 Provider
  - Datei: src/data/plans.json
  - Placeholder-Kommentare entfernen, last_verified_at setzen
  - validate:plans muss danach fehlerfrei durchlaufen
```

### Verbesserungen – UX
```
TASK-009: Plan-Karten in Detailseite verbessern
  - Datei: src/pages/de/providers/[slug].astro, en/
  - Storage, Traffic, Domains in Planbox anzeigen
  - Neuer i18n-Keys: plan_storage, plan_traffic, plan_domains

TASK-010: Logo-Placeholder für Provider ohne Bild
  - Datei: src/components/ProviderDirectory.astro
  - Fallback: Initialen des Providers in farbigem Kreis (Tailwind-generiert)

TASK-011: Breadcrumb-Navigation auf Provider-Detailseiten
  - Dateien: src/pages/de/providers/[slug].astro, en/
  - "Startseite > Anbieter > {Name}" mit korrekten Links

TASK-012: Sitemap-Plugin aktivieren
  - Datei: astro.config.mjs
  - @astrojs/sitemap installieren und konfigurieren
```

---

## Wichtige Code-Konventionen

### Neue Seite erstellen
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import strings from '../../data/i18n/de.json';

const lang = 'de';
---
<BaseLayout lang={lang} title="Seitentitel" {strings}>
  <!-- content -->
</BaseLayout>
```

### Affiliate-Link-Pattern
```astro
{provider.affiliate_url ? (
  <a href={provider.affiliate_url} rel="sponsored noopener" target="_blank" class="btn">
    {strings.providers_cta_visit}
  </a>
) : (
  <a href={provider.website_url} rel="noopener" target="_blank" class="btn-outline">
    {strings.providers_cta_website}
  </a>
)}
```

### Neuer i18n-String
1. Key in `src/data/i18n/de.json` eintragen
2. **Gleichen Key** in `src/data/i18n/en.json` eintragen
3. In Komponente über `strings.key_name` referenzieren

### Neuer Provider/Plan
1. Eintrag in `src/data/providers.json` oder `plans.json` hinzufügen
2. `npm run validate:plans` ausführen – muss fehlerfrei durchlaufen
3. Logo (SVG) nach `public/logos/` kopieren wenn vorhanden

### E2E-Test schreiben
```typescript
// tests/e2e/mein-feature.spec.ts
import { test, expect } from '@playwright/test';

test('beschreibung was getestet wird', async ({ page }) => {
  await page.goto('/de/providers');
  // ...
});
```

---

## Bekannte Bugs

| ID | Beschreibung | Datei | Schwere |
|---|---|---|---|
| BUG-001 | `validate:plans` schlägt fehl wegen Placeholder-Daten | src/data/plans.json | Hoch |
| BUG-002 | Root-Redirect via Meta-Refresh (nicht SEO-optimal) | src/pages/index.astro | Mittel |
| BUG-003 | `affiliate_url` nicht im TypeScript-Interface → kein Type-Check | src/lib/types.ts | Mittel |
| BUG-004 | Dual-Range-Slider auf Mobile schwierig bedienbar | ProviderDirectory.astro | Niedrig |

---

## Verantwortungsbereich (Dateien & Ordner)

**Primärer Verantwortungsbereich:**
- `src/pages/**/*.astro` – alle Seiten
- `src/components/**/*.astro` – alle Komponenten
- `src/layouts/**/*.astro` – alle Layouts
- `src/lib/providerIndex.ts` – Filter-/Sort-Logik
- `tests/e2e/**/*.spec.ts` – E2E-Tests

**Geteilt mit Architekt:**
- `src/lib/types.ts` – Typdefinitionen
- `astro.config.mjs` – Build-Konfiguration
- `tailwind.config.js` – Design-Tokens

**Shared mit Affiliate Manager:**
- `src/data/providers.json` – `affiliate_url`-Felder
- `src/data/i18n/*.json` – CTA-Texte
