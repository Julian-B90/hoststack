# Affiliate Manager – HostStack

## Rolle & Verantwortung

Der Affiliate Manager verantwortet die gesamte Monetarisierungsstrategie des Portals. Er pflegt Affiliate-Partnerschaften, verwaltet Links und Tracking, analysiert Conversion-Performance und stellt sicher, dass alle Compliance-Anforderungen erfüllt sind.

**Kernaufgaben:**
- Affiliate-Programme recherchieren und einrichten
- `affiliate_url`-Felder in `providers.json` befüllen und aktuell halten
- Tracking/Analytics für Conversions einrichten
- Compliance sicherstellen (DSGVO, FTC, Werbekennzeichnungspflichten)
- Conversion-Performance analysieren und CTAs optimieren
- Neue Provider-Partnerschaften akquirieren

---

## Aktueller Monetarisierungsstand

### Infrastruktur (vorhanden)
- `affiliate_url`-Feld in `providers.json` (alle 32 Provider)
- Affiliate-Link-Rendering auf Provider-Detailseiten (`rel="sponsored noopener"`)
- Footer-Disclosure auf allen Seiten (DE/EN)
- Korrekte `rel="sponsored"` Attribute im Code

### Was fehlt (alles)
- **Alle `affiliate_url`-Felder sind leer** – keine aktiven Affiliate-Links
- **Kein Tracking** – kein Analytics, kein Conversion-Pixel
- **Kein UTM-System** – keine Unterscheidung nach Traffic-Quelle
- **Keine Affiliate-Netzwerk-Integration** – kein Awin, Impact, PartnerStack etc.
- **Kein Reporting-Dashboard**
- **Keine CTA-Optimierung**

---

## Affiliate-Programme nach Provider

### Bekannte Programme (zu recherchieren/einrichten)

| Provider | Affiliate-Netzwerk | Status | Notizen |
|---|---|---|---|
| Vercel | Direkt (vercel.com/affiliates) | Offen | Beliebt, gute Conversion |
| Netlify | Direkt / Impact | Offen | |
| Render | Direkt / PartnerStack | Offen | |
| Railway | Direkt | Offen | |
| Fly.io | Direkt | Offen | Prüfen ob Programm aktiv |
| Heroku | Salesforce-Ökosystem | Offen | Möglicherweise kein direktes Programm |
| AWS | AWS Partner Network | Offen | Komplex, hohe Hürde |
| Cloudflare | Direkt / Impact | Offen | Workers/Pages-Segment |
| Hostinger | Direkt (sehr aktiv) | Offen | Gute Provisionen, easy onboarding |
| IONOS | Direkt / Awin | Offen | DE-Markt stark |
| STRATO | Direkt / Awin | Offen | DE-Markt |
| Hetzner | Kein Affiliate-Programm | N/A | Website-Link ohne Provision |
| DigitalOcean | Direkt | Offen | $25 Credit-System |

---

## Compliance-Anforderungen

### Deutschland / DSGVO
- **Werbekennzeichnung**: Affiliate-Links müssen als Werbung gekennzeichnet sein
- Footer-Hinweis: "Affiliate-Links können Provisionen generieren." ✓ (bereits vorhanden)
- `rel="sponsored"` auf allen Affiliate-Links ✓ (bereits vorhanden)
- **Noch fehlend**: Explizite Kennzeichnung mit "Werbung" oder "Anzeige" direkt beim Link?
- **Cookie-Consent**: Wenn Tracking-Pixel verwendet werden, ist eine Cookie-Consent-Lösung erforderlich

### International (EN)
- FTC (USA): Disclosure muss "clear and conspicuous" sein
- ASA (UK): Ähnliche Anforderungen wie FTC
- **Empfehlung**: Über "Sponsored" oder "Ad" Badge direkt bei gesponserten Einträgen nachdenken

### Technische Compliance
- Alle Affiliate-Links: `rel="sponsored noopener"` – bereits korrekt
- HTTPS-only für alle Affiliate-Links
- Keine Affiliate-Links in kritischen Pfaden (404-Seiten, Error-States)

---

## Tracking-Strategie

### Empfohlene Implementierung

**Option A: Google Analytics 4 (GA4)**
```javascript
// Event-Tracking für Affiliate-Klicks
gtag('event', 'affiliate_click', {
  provider_name: 'Vercel',
  source_page: 'provider-detail',
  currency: 'EUR',
});
```

**Option B: Plausible Analytics (DSGVO-freundlich)**
```javascript
plausible('Affiliate Click', {
  props: { provider: 'Vercel', page: 'detail' }
});
```

**Option C: Eigenes Event-System**
- POST zu eigenem Endpoint bei jedem Affiliate-Klick
- Serverless Function (z.B. Vercel Edge Function)
- Speichert: Timestamp, Provider, Source-Page, Currency, User-Agent

### UTM-Parameter-System
```
Basis-URL: https://vercel.com?ref=hoststack
UTM-Format: ?utm_source=hoststack&utm_medium=affiliate&utm_campaign={provider}&utm_content={source}

Beispiel Provider-Detail: ?utm_source=hoststack&utm_medium=affiliate&utm_campaign=vercel&utm_content=detail-page
Beispiel Compare-Table: ?utm_source=hoststack&utm_medium=affiliate&utm_campaign=vercel&utm_content=compare-table
Beispiel Provider-Card: ?utm_source=hoststack&utm_medium=affiliate&utm_campaign=vercel&utm_content=provider-card
```

**Implementierung** – zentrales Utility in `src/lib/affiliate.ts`:
```typescript
export function buildAffiliateUrl(
  baseUrl: string,
  provider: string,
  source: 'detail' | 'compare' | 'card' | 'homepage'
): string {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', 'hoststack');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', provider);
  url.searchParams.set('utm_content', source);
  return url.toString();
}
```

---

## Priorisiertes Aufgaben-Backlog

### P0 – Sofort (blockiert alle Einnahmen)
1. **Top-5 Affiliate-Programme einrichten**: Vercel, Netlify, Render, Hostinger, IONOS
2. **`affiliate_url` in providers.json befüllen** für diese 5 Provider
3. **Analytics einrichten**: Plausible (DSGVO-friendly) oder GA4
4. **Affiliate-Klick-Events tracken**: zumindest Provider-Name + Source-Page

### P1 – Kurzfristig
5. **Alle Top-10 Provider mit Affiliate-Links** versehen
6. **UTM-Utility implementieren** (coordinate mit Frontend-Developer)
7. **Conversion-Dashboard** einrichten (welches Netzwerk / welcher Provider konvertiert am besten)
8. **CTA-Performance messen** – compare.astro vs. detail page vs. provider card

### P2 – Mittelfristig
9. **Restliche Provider** mit Affiliate-Links versehen (wo möglich)
10. **A/B-Test CTAs** – verschiedene Texte und Platzierungen testen
11. **Featured/Premium-Platzierung** für Partner mit höheren Provisionen
12. **KI-Hoster-Affiliate-Links** (ai-hosters.json erweitern)

### P3 – Langfristig
13. **Tiered Commission-Display** – Hinweis auf beste Deals (Transparenz + Conversion)
14. **Saisonale Kampagnen** (Black Friday, Jahreswechsel)
15. **Neue Niche-Provider** aufnehmen (spezifische Märkte: Gaming, E-Commerce etc.)

---

## Schnittstellen zu anderen Rollen

| Rolle | Abstimmungspunkte |
|---|---|
| **Requirements Engineer** | Kommerzielle Prioritäten mitteilen; welche Provider sollen bevorzugt werden? |
| **UX Engineer** | CTA-Texte, Platzierung, Farben, Disclosure-Badges; Conversion-Optimierung |
| **Frontend-Architekt** | Tracking-Architektur, UTM-Utility-Design, Cookie-Consent-Integration |
| **Frontend-Developer** | Konkrete `affiliate_url`-Werte liefern; neue i18n-Keys für CTAs spezifizieren |

---

## Daten-Format für providers.json

```json
{
  "id": "vercel",
  "affiliate_url": "https://vercel.com?ref=hoststack",
  "website_url": "https://vercel.com"
}
```

**Regeln:**
- `affiliate_url`: Vollständige URL mit Tracking-Parameter des Affiliate-Netzwerks
- `website_url`: Immer die direkte (nicht-affiliate) URL als Fallback
- Wenn kein Affiliate-Programm: `affiliate_url` leer lassen (`""`)
- UTM-Parameter werden **zusätzlich** zur `affiliate_url` via Utility-Funktion angehängt
