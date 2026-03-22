# UX Engineer – HostStack

## Rolle & Verantwortung

Der UX Engineer verantwortet alle Design- und Usability-Entscheidungen. Er gestaltet User Flows, erstellt Wireframes/Mockups, pflegt das Designsystem und stellt sicher, dass die Nutzererfahrung die Conversion-Rate maximiert – insbesondere den Klick auf Affiliate-CTAs.

**Kernaufgaben:**
- User Flows und Interaction Patterns definieren
- Designsystem weiterentwickeln (Tokens, Komponenten, Patterns)
- UX-Schwachstellen identifizieren und Lösungen vorschlagen
- Mobile-First-Erfahrung sicherstellen
- Conversion-orientiertes UI-Design (Affiliate-CTAs)

---

## Skillset & Tools
- use skill ui-ux-pro-max

## Analyse des vorhandenen UX/UI-Stands

### Designsystem-Grundlagen

**Farb-Tokens:**
| Token | Hex | Verwendung |
|---|---|---|
| `ink` | `#0b0d12` | Primärtext, dunkle UI-Elemente, Buttons |
| `sand` | `#f5f2ea` | Seitenhintergrund, Button-Text |
| `fog` | `#e4e2dc` | Borders, Divider, subtile Flächen |
| `ember` | `#ff7a45` | Primärer Akzent (Orange) – für CTAs geeignet |
| `moss` | `#0f7b6c` | Sekundärer Akzent (Teal) – **aktuell ungenutzt** |

**Schriften:**
- `font-display`: Bebas Neue (Headings, Caps-only, dekorativ)
- `font-body`: Space Grotesk (300–700, Fließtext und UI)

**Hintergrund:** Radial-Gradient mit ember/moss-Hauch + lineares Cream-Gradient (`gradient-bg`)

**Utility-Komponenten:**
- `.card` – Weiße, glassmorphism-ähnliche Box mit Shadow
- `.btn` – Dunkler Primär-Button, Lift-Hover-Effekt
- `.btn-outline` – Heller Sekundär-Button
- `.badge` – Pill-Label mit dünnem Border

**Bewertung:** Konsistentes, modernes Design. Cream-Farbpalette ist ungewöhnlich und differenzierend. Gut.

---

### Aktuelle Seiten & Flows

#### Homepage (`/de`, `/en`)
**Vorhanden:**
- Hero mit Titel, Untertitel, 2 CTAs
- Provider-Vorschauliste (Top 10)
- Feature-Badges (Preis, Storage, Traffic, etc.)
- AI-Hoster-Vergleich (AiHosterComparison-Komponente)

**Schwachstellen:**
- CTAs ("Jetzt vergleichen", "Anbieter entdecken") führen zu internen Seiten, nicht zu Affiliate-Links
- Keine visuelle Hierarchie zwischen primärem und sekundärem CTA
- Feature-Badges sind dekorativ, nicht klickbar/filterbar
- Kein Social Proof (Bewertungen, Nutzerzahlen, "500+ verglichene Pläne")
- Keine Preisvorschau auf der Homepage
- AI-Hoster-Sektion ohne Einleitung/Kontext

#### Provider-Verzeichnis (`/de/providers`)
**Vorhanden:**
- Suche mit Debounce
- Filter: Region, Integration-Tags, SSL, Preis-Range (Dual-Slider)
- Sort: Preis, Name, Pläne
- Pagination (12 Items/Seite)
- URL-State-Sync
- Mobile Bottomsheet für Filter

**Schwachstellen:**
- Provider-Karten zeigen **keinen Affiliate-Link** – nur interne Detailseite
- Kein visueller Hinweis was der "Jetzt besuchen"-CTA kostet oder bringt
- Dual-Range-Slider auf Mobile schwierig zu bedienen
- Keine "Featured/Empfohlen"-Markierung für gesponserte Anbieter
- Logo-Placeholder (leere Karten) für Provider ohne Logo wirken unprofessionell
- Keine Skeleton-Loading-States

#### Provider-Detailseite (`/de/providers/[slug]`)
**Vorhanden:**
- Logo, Name, Beschreibung, Region
- Preisrange EUR/USD
- Pläne in 2-spaltiger Grid
- Affiliate-CTA-Button (wenn `affiliate_url` vorhanden)

**Schwachstellen:**
- Affiliate-Button ist einziger CTA – keine alternativen Links
- Keine strukturierte Feature-Übersicht (Pros/Cons fehlen komplett)
- Keine Bewertung oder Editorial-Score
- Plan-Karten zeigen nur Preis + Integration-Tags, kein Storage/Traffic/Domains
- Kein Breadcrumb für Navigation
- Kein "Ähnliche Anbieter"-Bereich

#### Pläne-Vergleich (`/de/compare`)
**Vorhanden:**
- Vollständige Pläne-Tabelle mit Client-seitigem Filter/Sort
- Integration-Tag-Filter, SSL-Checkbox
- Währungsumschaltung

**Schwachstellen:**
- **Kein Affiliate-Link** in der Vergleichstabelle (größte Monetarisierungslücke!)
- Keine "Zu Anbieter"-Aktion pro Plan-Zeile
- Tabelle wird bei vielen Spalten auf Mobile unlesbar
- Keine Möglichkeit, spezifische Pläne zu "pinnen" oder zu vergleichen
- Kein Filter nach Preis-Range direkt in der Tabelle

---

## Offene UX-Aufgaben (nach Impact priorisiert)

### Sofort – Conversion-Impact
1. **Affiliate-CTAs in Provider-Karten** – "Zum Anbieter" Button direkt in ProviderDirectory-Karten
2. **Affiliate-CTAs in Vergleichstabelle** – Spalte mit "Zum Anbieter"-Links in compare.astro
3. **CTA-Hierarchie auf Homepage** – Primär-CTA visuell mit `ember`-Farbe hervorheben
4. **Social Proof auf Homepage** – "X Anbieter, Y Tarife verglichen" Counter

### Kurzfristig – UX-Qualität
5. **Plan-Karten verbessern** – Storage, Traffic, Domains sichtbar machen
6. **Provider ohne Logo** – Fallback-Avatar/Initialen statt leerer Box
7. **Breadcrumb-Navigation** – auf Provider-Detailseiten
8. **Featured-Badge** – für gesponserte/empfohlene Anbieter

### Mittelfristig – Feature-UX
9. **Direktvergleich-Feature** – 2-3 Anbieter Side-by-Side auswählen
10. **Mobile Tabellenansicht** – compare.astro auf Mobile optimieren (horizontal scroll oder Card-View)
11. **Pros/Cons-Sektion** – strukturierte Feature-Bewertung auf Detailseiten
12. **Empty State verbessern** – Suchvorschläge oder "Beliebte Anbieter" bei leeren Ergebnissen

---

## Abstimmungspunkte mit Affiliate Manager

- **CTA-Text und Placement**: Welche Formulierungen konvertieren am besten? ("Jetzt bestellen" vs. "Zum Anbieter" vs. "Deal sichern")
- **Featured/Sponsored-Label**: Wie transparent müssen gesponserte Platzierungen gekennzeichnet werden?
- **CTA-Farbe**: `ember` (Orange) für Affiliate-CTAs reservieren als visuelles Signal?
- **Link-Typen**: Direkte Affiliate-Links vs. Tracking-Redirects (beeinflusst URL-Anzeige)
- **Commission-Display**: Sollen Nutzern Provisionshinweise angezeigt werden? (Transparenz vs. Conversion)
