# 📊 Market Visual Explainer

An interactive content-analytics dashboard: KPI cards, engagement/traffic charts,
a top-articles table, geographic and device breakdowns, cohort retention, and a
live-activity feed — built with React, TypeScript, Tailwind, and shadcn/ui.

> **Data honesty:** Out of the box this app runs on **generated sample data** and
> shows a **“Sample data”** badge in the header. It can also pull **real** data
> from Google Analytics 4 and NewsAPI via two Supabase Edge Functions — when
> those credentials are configured the badge switches to **“Live.”** Some
> per-item fields that the upstream APIs don’t expose (e.g. per-article
> engagement, per-day engagement) remain illustrative even in live mode; these
> are commented as such in the code.

---

## Tech stack

| Area | Choice |
|---|---|
| App | Vite + React 18 + TypeScript (SPA) |
| UI | Tailwind CSS + shadcn/ui (Radix primitives) |
| Charts | Recharts |
| Animation | Framer Motion |
| Data/state | React Query provider + a typed `useAnalyticsData` hook |
| Backend (optional) | Supabase Edge Functions (`fetch-news`, `fetch-analytics`) |

## Quick start

```bash
npm install
cp .env.example .env      # fill in your Supabase project values
npm run dev               # http://localhost:8080
```

Other scripts:

```bash
npm run build       # type-check (strict) + production build to dist/
npm run typecheck   # tsc --noEmit, no emit
npm run lint        # eslint
npm run preview     # preview the production build
```

## Configuration

### Client (`.env`)
Only the public Supabase values live here. The anon key is safe to expose in the
browser **only when Row-Level Security is enabled** on your tables.

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

`.env` is git-ignored — never commit it. See `.env.example` for the template.

### Edge function secrets (server-side)
Real data is optional. Set these as Supabase secrets (never as `VITE_` vars, which
ship to the browser):

```bash
supabase secrets set NEWS_API_KEY=... \
  GA4_PROPERTY_ID=... GOOGLE_CLIENT_EMAIL=... GOOGLE_PRIVATE_KEY=... \
  ALLOWED_ORIGINS=https://your-app.example.com
```

If any are missing, the corresponding function gracefully returns sample data.

## Security notes

- Both edge functions require a valid Supabase JWT (`verify_jwt = true`).
- CORS is restricted to `ALLOWED_ORIGINS` when set (falls back to `*` for local dev).
- A best-effort per-IP rate limiter throttles bursts (`_shared/security.ts`); for
  hard guarantees, back it with an external store (e.g. Upstash Redis).

## Project structure

```
src/
  components/          Dashboard shell + dashboard/ (charts, tables, header, filters)
  components/ui/       shadcn/ui primitives
  hooks/useAnalyticsData.ts   fetch + map + demo/live detection
  data/mockData.ts     sample-data generators
  types/analytics.ts   shared types
supabase/functions/    fetch-news, fetch-analytics, _shared/security.ts
```

## Deployment

Static build — deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages,
etc.). The included GitHub Actions workflow (`.github/workflows/ci.yml`) runs
lint, type-check, and build on every push and PR.

---

*Independent demo/portfolio project. Sample metrics are illustrative and not real
audience data unless live sources are configured.*
