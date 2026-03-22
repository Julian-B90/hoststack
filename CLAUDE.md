# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run validate:plans  # Validate plans.json schema consistency
npm run test:e2e     # Run Playwright E2E tests
```

## Architecture

**HostStack** is a bilingual (German/English) static hosting comparison site built with Astro 5 + Tailwind CSS 4.

### i18n Routing

All pages live under `src/pages/de/` and `src/pages/en/`. Pages import their strings from `src/data/i18n/de.json` or `en.json` and pass them to `BaseLayout`. There is no Astro i18n middleware — routing is purely file-based.

### Data Layer

All content is static JSON in `src/data/`:
- `providers.json` — hosting providers list
- `plans.json` — pricing plans per provider (validated by `scripts/validate-plans.mjs`)
- `ai-hosters.json` — AI-specific hosting options, typed by `src/lib/types.ts`
- `i18n/de.json` + `i18n/en.json` — UI strings

Pages import JSON directly at build time; there is no API or database.

### TypeScript Types

Core domain types are defined in `src/lib/types.ts`:
- `AiHosterItem` — shape of entries in `ai-hosters.json`
- Union types: `AiTargetSystem` (`openclaw | n8n | other`), `AiHostingType` (`vps | managed | platform`), `AiSetupLevel` (`self | assisted | managed`)

### Styling

Tailwind CSS 4 via the `@tailwindcss/vite` plugin (configured in `astro.config.mjs` — no separate `tailwind.config.js` integration). Custom theme uses semantic color tokens (`ink`, `sand`, `fog`, `ember`, `moss`) and two custom fonts: **Bebas Neue** (display/headings) and **Space Grotesk** (body). Reusable utility classes like `.card`, `.btn`, `.btn-outline`, `.badge` are defined in global styles.

### Testing

E2E tests use Playwright (`tests/` directory, config in `playwright.config.ts`). There are no unit tests.
