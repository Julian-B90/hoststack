# Requirements Engineer – HostStack

## Rolle & Verantwortung

Der Requirements Engineer verantwortet die vollständige Erfassung, Strukturierung und Priorisierung aller Projektanforderungen. Er ist der erste Ansprechpartner für neue Features und stellt sicher, dass Anforderungen klar und umsetzbar sind, bevor sie an UX Engineer oder Frontend-Architekt weitergegeben werden.

**Kernaufgaben:**
- User Stories und Akzeptanzkriterien formulieren
- Backlog pflegen und priorisieren
- Anforderungen auf technische Machbarkeit prüfen (mit Frontend-Architekt)
- Kommerzielle Anforderungen mit dem Affiliate Manager abstimmen
- Lücken und Widersprüche im aktuellen Produkt identifizieren

---

## Bereits dokumentierte Anforderungen (aus Code abgeleitet)

### Umgesetzt
- [x] Zweisprachige Website (DE/EN) mit separaten Routen
- [x] Anbieterverzeichnis mit Suche, Filter (Region, Integration, SSL, Preis) und Sortierung
- [x] Provider-Detailseiten mit Plänen und Affiliate-Link-Infrastruktur
- [x] Pläne-Vergleichsseite mit Tag-Filter, SSL-Filter, Sortierung
- [x] KI-Hoster-Vergleich (spezifisch für OpenClaw/n8n)
- [x] Währungsumschaltung EUR/USD (persistent via localStorage)
- [x] Affiliate-Disclosure im Footer
- [x] Datenvalidierung via `validate:plans` Script

### Teilweise umgesetzt
- [~] Affiliate-Link-Button auf Provider-Detailseiten (Infrastruktur vorhanden, URLs fehlen)
- [~] Mobile-optimierte Filter-UI (Bottomsheet vorhanden, UX verbesserungswürdig)
- [~] Bilinguales Designsystem (Strings vorhanden, aber unvollständig in Komponenten)

---

## Fehlende oder unklare Anforderungen

### Monetarisierung (höchste Priorität)
- Welche Affiliate-Netzwerke sollen integriert werden? (Awin, Impact, PartnerStack, direkte Programme?)
- Wie soll Conversion-Tracking implementiert werden? (GA4 Events? eigenes Backend?)
- Sollen UTM-Parameter automatisch generiert werden?
- Gibt es eine Offenlegungspflicht für spezifische Märkte (DSGVO/FTC-konform)?

### Inhalt & Daten
- Wie werden Provider-Daten langfristig gepflegt? (manuell vs. CMS vs. API-Sync)
- Welche Datenpunkte sind für Nutzer am wichtigsten? (Preise, Features, SLA, Support?)
- Welche Provider sollen zuerst mit echten Daten befüllt werden? (Top-10 laut Validierungsscript)
- Sollen Nutzerbewertungen/Reviews aufgenommen werden?

### SEO & Discovery
- Welche Keywords sollen primär abgedeckt werden? (z.B. "bester Webhosting Anbieter")
- Ist ein Blog/Content-Bereich geplant?
- Benötigen wir strukturierte Daten (JSON-LD) für Rich Results?

### Nutzerfeatures
- Gibt es Anforderungen an Nutzeraccounts oder gespeicherte Vergleiche?
- Soll es eine E-Mail-Benachrichtigung bei Preisänderungen geben?
- Ist ein Direktvergleich (2-3 Anbieter nebeneinander) gewünscht?

---

## Priorisiertes Backlog (nach Ist-Zustand)

### P0 – Sofortiger Business-Impact
1. **Affiliate-URLs befüllen** – Top-10 Provider mit echten Affiliate-Links versehen
2. **Echte Plan-Daten** – Placeholder durch verifizierte Preise ersetzen (Top-10 zuerst)
3. **Analytics einrichten** – GA4 oder Plausible für Conversion-Tracking
4. **Affiliate-Links in alle CTAs** – compare.astro und ProviderDirectory-Karten

### P1 – Wichtig für Launch-Qualität
5. **SEO-Grundlagen** – Meta-Descriptions, Open Graph, hreflang, Sitemap
6. **TypeScript-Lücken schließen** – `affiliate_url` in Provider-Interface, vollständiges Plan-Interface
7. **Provider-Detailseiten verbessern** – Pros/Cons, Feature-Übersicht, echte Beschreibungen
8. **UTM-Parameter-System** – automatische Anhängung an alle Affiliate-Links

### P2 – Mittelfristig
9. **Direktvergleich (2-3 Provider)** – expliziter Side-by-Side-Vergleich
10. **Nutzerbewertungen/Ratings** – zumindest als statische Redaktionsbewertungen
11. **Preisverifizierungs-Workflow** – wann und wie werden Preise aktualisiert?
12. **Erweiterte KI-Hoster-Sektion** – mehr Provider, Affiliate-Links

### P3 – Langfristig
13. **CMS-Integration** für Datenmanagement
14. **E-Mail-Capture** (Newsletter/Preisalarme)
15. **Community-Features** (Kommentare, User-Reviews)
16. **Weitere Sprachen** (FR, ES, NL)

---

## Schnittstellen zu anderen Rollen

| Empfänger | Was er vom Requirements Engineer bekommt |
|---|---|
| **UX Engineer** | Priorisierte User Stories mit Akzeptanzkriterien, Flow-Beschreibungen, Nutzerszenarien |
| **Frontend-Architekt** | Technische Anforderungen, Datenmodell-Änderungen, Performance-Anforderungen |
| **Frontend-Developer** | Konkrete, implementierungsfertige Tickets mit klaren Akzeptanzkriterien |
| **Affiliate Manager** | Anforderungen an Tracking, Link-Management, Reporting-Dashboards |

**Abstimmung nötig mit Affiliate Manager vor:**
- Jeder neuen CTA-Implementierung (welcher Affiliate-Link wohin?)
- Änderungen an der Provider-Datenbankstruktur
- SEO-Content-Planung (welche Keywords generieren Affiliate-Traffic?)
