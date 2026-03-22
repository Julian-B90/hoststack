# Sprint 01 – Monetarisierung & Launch-Readiness

**Datum:** 2026-03-22
**Sprint-Ziel:** Monetarisierung aktivieren und Launch-Readiness sicherstellen durch Affiliate-Link-Integration, TypeScript-Schema-Komplettierung und SEO-Grundlagen.

---

## Architektur-Entscheidungen (Frontend-Architekt)

- **Komponenten-Splittung:** NEIN – `ProviderDirectory.astro` bleibt monolithisch. Nur additive Änderungen in `renderCards()`. Kein Umbau.
- **Affiliate-Link Utility:** `src/lib/affiliate.ts` (neu) mit `buildAffiliateUrl(url, utm?)` und `hasAffiliateUrl(url)`
- **Filter-Presets:** Inline-Config im Page-Frontmatter (kein separates JSON), da P2 und einmalig
- **State-Management:** Status quo beibehalten – URL-State in ProviderDirectory funktioniert korrekt
- **Card-Wrapper-Umbau:** `<a class="card">` → `<div class="card">` da Affiliate-`<a>` nicht in `<a>` verschachtelt sein darf

## Skill-Nutzung

### `ui-ux-pro-max`
Der Skill `ui-ux-pro-max` wird für alle UI/UX-Aufgaben im Sprint eingesetzt. Aufruf via `/ui-ux-pro-max` in Claude Code.

**Einsatzbereiche in diesem Sprint:**
- **TASK-04 / TASK-05:** Design der `.btn-cta`-Klasse (Ember-Farbe, Hover-Effekte, Spacing)
- **TASK-07:** 404-Seiten-Layout (Display-Headline, CTA-Anordnung, Typografie mit Bebas Neue)
- **TASK-03:** OG-Image-Konzept und visuelle Konsistenz der Meta-Tag-Vorschau

**Wichtige Kontextangaben beim Skill-Aufruf:**
- Stack: Astro 5 + Tailwind CSS 4
- Design-System: Tokens `ink`, `sand`, `fog`, `ember`, `moss`; Fonts `font-display` (Bebas Neue) / `font-body` (Space Grotesk)
- Keine externen UI-Libraries — alles Custom

---

## Design-System-Entscheidungen (UX-Engineer)

- **Neue CSS-Klasse `.btn-cta`:** Ember-Farbe (Orange), unterscheidet sich visuell von `.btn` (schwarz)
- **Affiliate-CTA-Platzierung:** Footer der Provider-Card + letzte Spalte in Vergleichstabelle
- **Mobile Tabelle:** Horizontal Scroll (bereits `overflow-x-auto` vorhanden), + visueller Scroll-Hinweis
- **404-Layout:** BaseLayout (Nav+Footer), Display-Headline "404" in Bebas Neue, 2 CTAs
- **OG-Image Default:** `/public/og-default.png` (statisch, 1200×630px)

---

## Tasks für den Frontend-Developer

### Reihenfolge (sequenziell wo nötig)

```
TASK-01 (Typen) ─────────────────────────────────────────────────────┐
  └─> TASK-02 (affiliate.ts)                                          │
        └─> TASK-04 (compare.astro CTAs)                              │
              └─> TASK-05 (ProviderDirectory CTAs)                    │
  └─> TASK-08 (providers.json Daten)                                  │
                                                                      │
TASK-03 (SEO Meta)  ─ parallel, keine Deps                           │
TASK-06 (Sitemap)   ─ parallel, keine Deps                           │
TASK-07 (404)       ─ nach TASK-03 sinnvoll, aber unabhängig         │
```

---

### TASK-01: TypeScript-Interfaces vervollständigen
**Priorität:** P0 — **Blocker für alle anderen Tasks**

**Dateien:**
- `src/lib/types.ts`
- `src/lib/providerIndex.ts`

**Änderungen:**

In `types.ts` nach dem `AiHosterItem`-Interface ergänzen:
```typescript
export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  region: string;
  affiliate_url: string;
  website_url: string;
  short_desc: string;
  logo_note_de?: string;
  logo_note_en?: string;
}

export interface Plan {
  id: string;
  provider_id: string;
  plan_name: string;
  price_eur: number | null;
  price_usd: number | null;
  storage_gb: number | null;
  traffic_gb: number | null;
  domains: number | null;
  ssl: boolean;
  integration_tags: string[];
  notes?: string;
  last_verified_at: string | null;
}
```

In `providerIndex.ts`:
- Lokale `Provider`/`Plan`-Types durch `import type { Provider, Plan } from './types';` ersetzen
- `ProviderIndexItem` um `affiliate_url: string` ergänzen (nach `has_logo`)
- In `buildProviderIndex()` Return-Objekt: `affiliate_url: provider.affiliate_url || ''` ergänzen

**Akzeptanzkriterien:**
- `npx tsc --noEmit` fehlerfrei
- `npm run build` fehlerfrei
- `ProviderIndexItem.affiliate_url` ist typisiert und befüllt

---

### TASK-02: Affiliate-Link Utility erstellen
**Priorität:** P0

**Datei:** `src/lib/affiliate.ts` (neu anlegen)

```typescript
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

export function buildAffiliateUrl(
  affiliateUrl: string,
  utm?: UtmParams
): string {
  if (!affiliateUrl) return '';
  const url = new URL(affiliateUrl);
  if (utm?.source) url.searchParams.set('utm_source', utm.source);
  if (utm?.medium) url.searchParams.set('utm_medium', utm.medium);
  if (utm?.campaign) url.searchParams.set('utm_campaign', utm.campaign);
  if (utm?.content) url.searchParams.set('utm_content', utm.content);
  return url.toString();
}

export function hasAffiliateUrl(url: string | undefined | null): url is string {
  return typeof url === 'string' && url.trim().length > 0;
}
```

**Akzeptanzkriterien:**
- `buildAffiliateUrl('', {source: 'hoststack'})` → `''` (kein Fehler)
- `buildAffiliateUrl('https://vercel.com', {source: 'hoststack', campaign: 'compare'})` → URL mit UTM
- `npx tsc --noEmit` fehlerfrei

**Abhängigkeiten:** TASK-01

---

### TASK-03: SEO Meta-Tags in BaseLayout
**Priorität:** P0

**Dateien:**
- `src/layouts/BaseLayout.astro`
- `src/data/i18n/de.json` + `en.json`

**Änderungen in `BaseLayout.astro`:**

Frontmatter-Destructuring erweitern:
```typescript
const { lang, title, strings, description, ogImage, canonical } = Astro.props;
const canonicalUrl = canonical ?? Astro.url.href;
const metaDescription = description ?? strings.meta_description ?? '';
const ogImageUrl = ogImage ?? '/og-default.png';
```

Im `<head>` nach `<title>` einfügen:
```html
<meta name="description" content={metaDescription} />
<link rel="canonical" href={canonicalUrl} />
<meta property="og:title" content={title} />
<meta property="og:description" content={metaDescription} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:type" content="website" />
<meta property="og:url" content={canonicalUrl} />
<link rel="alternate" hreflang={lang} href={canonicalUrl} />
<link rel="alternate" hreflang={lang === 'de' ? 'en' : 'de'} href={Astro.url.origin + switchedPath} />
<link rel="alternate" hreflang="x-default" href={Astro.url.origin + switchedPath} />
```

Neues `og-default.png` (1200×630px) unter `public/og-default.png` ablegen.

**Neue i18n-Strings:**
- `de.json`: `"meta_description": "Hosting-Anbieter vergleichen: Preise, Speicher, SSL und Integrationen. Finde das beste Hosting für dein Projekt."`
- `en.json`: `"meta_description": "Compare hosting providers: prices, storage, SSL and integrations. Find the best hosting for your project."`

**Akzeptanzkriterien:**
- Jede generierte Seite enthält `<meta name="description">`, `og:*`-Tags, beide `hreflang`-Links
- Seiten ohne explizites `description`-Prop nutzen `strings.meta_description`

**Abhängigkeiten:** Keine — parallel startbar

---

### TASK-04: Affiliate-CTAs in compare.astro
**Priorität:** P0

**Dateien:**
- `src/pages/de/compare.astro` + `src/pages/en/compare.astro`
- `src/styles/global.css`
- `src/data/i18n/de.json` + `en.json`

**Neue CSS-Klasse in `global.css`** (nach `.btn-outline`):
```css
.btn-cta {
  @apply inline-flex items-center justify-center rounded-full bg-ember px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:translate-y-[-1px] hover:opacity-90;
}
```

**In beiden compare.astro:**

Frontmatter-Import ergänzen:
```typescript
import { buildAffiliateUrl } from '../../lib/affiliate';
```

Tabellen-Kopfzeile: neue `<th>` nach Integration-Spalte:
```html
<th class="pb-3">{strings.compare_action_column}</th>
```

In der Plan-Map-Zeile: neue `<td>` nach Integration:
```astro
<td class="py-3 pr-4">
  {plan.provider?.affiliate_url && (
    <a
      class="btn-cta"
      href={buildAffiliateUrl(plan.provider.affiliate_url, { source: 'hoststack', medium: 'compare', campaign: plan.provider?.slug })}
      rel="sponsored noopener"
      target="_blank"
    >
      {strings.cta_visit_provider}
    </a>
  )}
</td>
```

Mobiler Scroll-Hinweis unter der Tabellen-Wrapper-`<div>`:
```html
<p class="mt-2 block md:hidden text-xs uppercase tracking-[0.2em] text-ink/50">{strings.compare_scroll_hint}</p>
```

**Neue i18n-Strings:**
- `de.json`: `"cta_visit_provider": "Zum Anbieter"`, `"compare_scroll_hint": "Tabelle horizontal scrollbar"`, `"compare_action_column": "Aktion"`
- `en.json`: `"cta_visit_provider": "Visit provider"`, `"compare_scroll_hint": "Scroll table horizontally"`, `"compare_action_column": "Action"`

**Akzeptanzkriterien:**
- Zeilen mit `affiliate_url` → `.btn-cta` Button mit `rel="sponsored noopener"` + `target="_blank"`
- Zeilen ohne `affiliate_url` → kein Button, kein leerer Platz
- Mobiler Scroll-Hinweis auf `<md` sichtbar

**Abhängigkeiten:** TASK-01, TASK-02

---

### TASK-05: Affiliate-CTAs in ProviderDirectory (Card-Umbau)
**Priorität:** P0

**Datei:** `src/components/ProviderDirectory.astro`

**Umbau der `renderCards()`-Funktion:**

Card-Wrapper von `<a class="card ...">` auf `<div class="card ...">` umbauen. Die Verlinkung zur Detailseite wird ein separates `<a>` im inneren Content-Bereich. Affiliate-CTA als eigenes `<a class="btn-cta">` am Ende der Card.

Template-Logik:
```javascript
const affiliateLabel = strings.cta_visit_provider || 'Zum Anbieter';
const detailLabel = strings.providers_detail_label || 'Details';

const affiliateCta = provider.affiliate_url
  ? `<a class="btn-cta" href="${escapeHtml(provider.affiliate_url)}" rel="sponsored noopener" target="_blank">${affiliateLabel}</a>`
  : '';

const cardBottom = affiliateCta
  ? `<div class="flex items-center justify-end gap-2">${affiliateCta}<a class="btn-outline" href="${detailUrl}">${detailLabel}</a></div>`
  : '';
```

Logo-Fallback (Provider ohne Logo → Initialen):
```javascript
const logoHtml = provider.logo
  ? `<img src="${escapeHtml(provider.logo)}" alt="${escapeHtml(provider.name)} logo" class="h-8 w-8 object-contain" />`
  : `<span>${escapeHtml(provider.name.slice(0, 2).toUpperCase())}</span>`;
```

**Neue i18n-Strings:**
- `de.json`: `"providers_detail_label": "Details"`
- `en.json`: `"providers_detail_label": "Details"`

**Akzeptanzkriterien:**
- Cards mit `affiliate_url` → `.btn-cta` am Card-Footer + `.btn-outline` "Details"-Link
- Cards ohne `affiliate_url` → kein Button-Footer
- Kein `<a>` verschachtelt in `<a>`
- Logo-Initialen für Provider ohne Logo

**Abhängigkeiten:** TASK-01, TASK-04 (`.btn-cta` in global.css, i18n-Strings)

---

### TASK-06: Sitemap + robots.txt
**Priorität:** P1

**Dateien:** `astro.config.mjs`, `public/robots.txt` (neu)

**Installation:** `npm install @astrojs/sitemap`

**`astro.config.mjs` ändern:**
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hoststack.io', // echte Domain eintragen
  integrations: [sitemap(), /* bestehende Integrations */],
  // ... Rest beibehalten
});
```

**`public/robots.txt` anlegen:**
```
User-agent: *
Allow: /

Sitemap: https://hoststack.io/sitemap-index.xml
```

**Akzeptanzkriterien:**
- `npm run build` generiert `dist/sitemap-index.xml` und `dist/sitemap-0.xml`
- Alle `/de/*` und `/en/*` Routen in der Sitemap
- `dist/robots.txt` vorhanden

**Abhängigkeiten:** Keine

---

### TASK-07: 404-Seiten (bilingual)
**Priorität:** P1

**Dateien:**
- `src/pages/de/404.astro` (neu)
- `src/pages/en/404.astro` (neu)
- `src/data/i18n/de.json` + `en.json`

**Neue i18n-Strings:**
- `de.json`: `"404_title": "Seite nicht gefunden"`, `"404_subtitle": "Die gesuchte Seite existiert nicht."`, `"404_cta_home": "Zur Startseite"`, `"404_cta_providers": "Anbieter entdecken"`
- `en.json`: `"404_title": "Page not found"`, `"404_subtitle": "The page you're looking for doesn't exist."`, `"404_cta_home": "Go home"`, `"404_cta_providers": "Explore providers"`

**Template `de/404.astro`:**
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import strings from '../../data/i18n/de.json';
---
<BaseLayout lang="de" title="404 – HostStack" strings={strings}>
  <section class="card text-center py-16">
    <p class="text-xs uppercase tracking-[0.2em] text-ink/50">Error</p>
    <h1 class="mt-4 font-display text-8xl uppercase tracking-[0.1em]">404</h1>
    <p class="mt-6 text-ink/70">{strings["404_subtitle"]}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/de" class="btn">{strings["404_cta_home"]}</a>
      <a href="/de/providers" class="btn-outline">{strings["404_cta_providers"]}</a>
    </div>
  </section>
</BaseLayout>
```

Analog für `en/404.astro` mit `lang="en"`, `en.json` und `/en`-Links.

**Akzeptanzkriterien:**
- `dist/de/404.html` und `dist/en/404.html` nach Build vorhanden
- BaseLayout (Nav + Footer) sichtbar
- Beide Sprachen korrekt

**Abhängigkeiten:** TASK-03 (optional)

---

### TASK-08: providers.json Affiliate-URLs befüllen
**Priorität:** P0 (Business-Impact)

**Datei:** `src/data/providers.json`

Für alle Provider mit vorhandenem Affiliate-Programm die `affiliate_url`-Felder mit echten HTTPS-URLs befüllen. Priorität: die 10 Provider mit Logos in `public/logos/`.

Providers ohne Affiliate-Programm: `affiliate_url` leer lassen (`""`), `website_url` dient als Fallback.

Nach Änderungen: `npm run validate:plans` ausführen als Smoke-Test.

**Akzeptanzkriterien:**
- Mindestens 5 Provider haben nicht-leere `affiliate_url`
- Alle URLs sind gültige HTTPS-URLs
- `npm run build` fehlerfrei

**Abhängigkeiten:** TASK-01

---

## Kritische Dateien (Risiko-Übersicht)

| Datei | Risiko | Warum |
|---|---|---|
| `src/components/ProviderDirectory.astro` | Hoch | Card-Wrapper-Umbau von `<a>` zu `<div>` — alle 880 Zeilen betroffen, Inline-Script |
| `src/layouts/BaseLayout.astro` | Mittel | Alle 9 Seiten erben Meta-Tag-Änderungen automatisch |
| `src/lib/providerIndex.ts` | Mittel | `ProviderIndexItem`-Typ-Änderung betrifft Client-seitigen State |
| `src/lib/types.ts` | Niedrig | Reine Ergänzungen, keine Breaking Changes |
| `astro.config.mjs` | Niedrig | Sitemap-Plugin ist additiv |
