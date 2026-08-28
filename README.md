# NoorAl — Your Quran Companion

<p align="center">
  <img src="https://img.shields.io/badge/Stack-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/API-Express%205-black?style=flat-square&logo=express" />
  <img src="https://img.shields.io/badge/DB-PostgreSQL%20%2B%20Drizzle-336791?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript" />
</p>

NoorAl is a full-stack, feature-rich Quran web platform built for Muslims who want a modern, distraction-free space to read, memorize, reflect on, and engage with the Quran — supported by prayer times, ahadith, dhikr tools, and an AI assistant.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Pages & Routes](#pages--routes)
- [Internationalization](#internationalization)
- [Architecture Notes](#architecture-notes)
- [Deployment](#deployment)

---

## Features

### Quran Reader
- Full Uthmanic script with multiple Arabic fonts and adjustable size
- Per-ayah translation (English and more via quran.com API)
- Inline **bookmarks** — save any ayah with one click
- **Hard ayah flagging** — mark ayahs you struggle to memorize
- Inline **notes** (rich text via Tiptap editor) — write reflections directly on any verse
- **Tafsir panel** — read scholarly commentary without leaving the page
- **Audio playback** — verse-by-verse audio with multiple reciters
- **Mood journal** — tag the emotional feeling of any verse (hope, peace, fear, gratitude, etc.)
- **Pinned verses** — keep your most important ayahs always at the top
- Surah filter and quick jump navigation

### Memorization Tracker
- Per-surah memorization progress tracking
- **Hard ayah review queue** with spaced repetition scheduling
  - Correct recall → interval × 2 (capped at 14 days)
  - Needs review → resets to 1 day
- Full **Khatm** (Quran completion) history with timestamps

### Dashboard
- **Reading streak** — current streak and longest ever recorded
- **Daily reading goal** with visual progress ring
- Last read position — resume exactly where you left off
- Memorization overview at a glance
- Recent notes and activity summary
- Verse of the day

### Prayer Times
- Geolocation-based prayer times powered by aladhan.com
- All five daily prayers displayed with countdown
- Prayer times widget accessible throughout the app

### Ahadith Browser
- Browse major hadith collections via the ahadith.co API
- Collections include: Sahih al-Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i, and more
- Chapter-level navigation within each collection

### Search
- Full-text Quran search powered by quran.com
- Results displayed with verse context, surah name, and ayah number

### Tasbih (Dhikr Counter)
- Digital counter with preset dhikr phrases:
  - SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, La ilaha ill-Allah, and more
- Custom dhikr phrase support
- Session history and count persistence

### Collections
- Create named collections and organize bookmarked ayahs into them
- Thematic verse grouping (e.g. "Verses on Patience", "Morning Adhkar", etc.)
- Full CRUD — create, rename, add/remove ayahs, delete

### Library
- Categorized Islamic learning articles built into the platform
- Topics covering Fiqh, Aqeedah, Seerah, Tazkiyah, Quran Sciences, and more

### Quran Radio
- Live Quran radio stations streamed directly in the browser

### Analytics
- Personal reading analytics: pages read, ayahs covered, time spent
- Reading calendar heatmap (GitHub-style contribution graph)
- Session-by-session log with dates and duration

### Reading Goal
- Set a custom daily reading target (in ayahs or pages)
- Real-time progress ring updated as you read
- Streak integration — hitting your goal maintains the streak

### Reciters
- Browse and switch between multiple Quran reciters
- Selected reciter persists across sessions via Zustand store

### Media
- Curated Islamic media resource library

### Ask Noor (AI Assistant)
- Built-in AI chat assistant powered by OpenRouter/OpenAI
- Slash command picker with commands including:
  - `/tafsir` — ask about verse commentary
  - `/hadith` — find relevant ahadith
  - `/dua` — get recommended duas
  - `/memorize` — memorization tips and techniques
  - `/translate` — translate verses or phrases
  - `/support`, `/feedback`, `/bug` — open support ticket directly from chat
- Context-aware Quran knowledge base
- Morphing panel UI with smooth expand/collapse animation

### Profile
- Upload or remove profile photo (stored in Clerk)
- Achievement badge system:
  - First Bookmark, Bookmark Collector (25+)
  - First Reflection, Journal Keeper (10 notes), 100 Reflections
  - 3-Day Streak, 7-Day Streak, 30-Day Streak
  - Hifz Begins, 100 Ayahs Memorized
  - First Khatm, 3 Khatms
  - Mood Tagger, Collector
- Full stats overview: bookmarks, notes, moods, collections, pinned verses, hard ayahs, khatms
- **Member since** date pulled from your own PostgreSQL database
- **Saved to database** confirmation badge (your own user data, not just Clerk)

### Plans & Giving
- Subscription/plan selection page
- Sadaqah pledge / donation page

### Settings
- **Theme**: Light, Dark, Sepia
- Arabic font size (small → extra-large)
- Translation language selector
- Reciter selector
- Interface language

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript 5.9 |
| Routing | Wouter |
| State | Zustand 5 (persisted to localStorage) |
| Server State | TanStack Query v5 |
| UI Components | shadcn/ui, Radix UI, Tailwind CSS v4 |
| Animations | Framer Motion |
| Rich Text Editor | Tiptap 3 |
| Icons | Lucide React |
| Internationalisation | i18next + react-i18next |
| Backend | Express 5, Node.js 24, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Clerk (Replit-managed) |
| API Contract | OpenAPI 3.1 → Orval codegen |
| Validation | Zod v4 + drizzle-zod |
| Logging | Pino + pino-http |
| Webhooks | Svix (Clerk webhook signature verification) |
| Build | esbuild (API bundle), Vite (frontend) |
| Package Manager | pnpm workspaces monorepo |

### External APIs

| Service | Purpose |
|---|---|
| quran.com | Quran text, translations, tafsir, audio, search |
| aladhan.com | Prayer times (geolocation-based) |
| ahadith.co | Hadith collections |
| OpenRouter / OpenAI | Ask Noor AI assistant |

---

## Project Structure

```
nooral/
├── artifacts/
│   ├── noor-al/                    # React + Vite frontend
│   │   └── src/
│   │       ├── components/         # Shared UI components
│   │       │   ├── ask-noor/       # AI assistant panel
│   │       │   ├── layout/         # App shell, sidebar, navbar
│   │       │   ├── library/        # Library viewer components
│   │       │   └── ui/             # shadcn/ui primitives
│   │       ├── pages/              # One file per route
│   │       ├── lib/
│   │       │   ├── quran-api.ts    # quran.com API client
│   │       │   ├── store.ts        # Zustand persist store
│   │       │   └── seo.ts          # Per-page SEO helper
│   │       └── index.css           # Tailwind + theme tokens + scrollbar
│   │
│   └── api-server/                 # Express 5 API server
│       └── src/
│           ├── routes/             # One router per resource
│           ├── middlewares/
│           │   ├── clerkProxyMiddleware.ts
│           │   └── syncUser.ts     # Auto-upsert user to DB on auth
│           └── lib/
│               └── logger.ts       # Pino singleton logger
│
├── lib/
│   ├── db/                         # Drizzle ORM
│   │   └── src/schema/             # One file per DB table
│   ├── api-spec/
│   │   └── openapi.yaml            # OpenAPI 3.1 spec (source of truth)
│   └── api-client-react/           # Orval-generated TanStack Query hooks
│       └── src/generated/
│           ├── api.ts              # All hooks + fetchers
│           └── api.schemas.ts      # Zod schemas
│
├── pnpm-workspace.yaml             # Workspace config + dependency catalog
├── tsconfig.base.json              # Shared strict TypeScript config
├── tsconfig.json                   # Solution file (composite libs only)
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 24+
- **pnpm** 9+
- A **PostgreSQL** database (local or hosted)
- A **Clerk** application (for auth)

### 1. Clone and install

```bash
git clone <repo-url>
cd nooral
pnpm install
```

### 2. Configure environment variables

Copy the required variables (see [Environment Variables](#environment-variables)) into your environment or `.env` file.

### 3. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 4. Run the development servers

In separate terminals (or let Replit workflows handle it):

```bash
# API server
pnpm --filter @workspace/api-server run dev

# Frontend
pnpm --filter @workspace/noor-al run dev
```

### 5. Open the app

Visit `http://localhost:<PORT>` — the port is assigned by the workflow config.

---

## Common Commands

| Command | Description |
|---|---|
| `pnpm run typecheck` | Full typecheck across all packages |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks + Zod schemas from OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev only) |
| `pnpm run typecheck:libs` | Build composite libs for cross-package type resolution |

> **Important**: Always run `codegen` after editing `openapi.yaml` before touching frontend code.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | ✅ | Clerk backend secret key (server-side) |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key (used in Express middleware) |
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key (used in the Vite frontend) |
| `CLERK_WEBHOOK_SECRET` | ⚠️ Optional | Clerk webhook signing secret — enables instant user DB sync on signup. Looks like `whsec_xxx`. |
| `PORT` | auto | Injected automatically by the Replit workflow system. |

### Clerk Webhook Setup (optional but recommended)

1. In your [Clerk Dashboard](https://dashboard.clerk.com) → **Webhooks** → Add endpoint
2. URL: `https://your-domain/api/webhooks/clerk`
3. Events to subscribe: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** and set it as `CLERK_WEBHOOK_SECRET`

Without the webhook, `syncUserMiddleware` acts as a fallback — it upserts the user on their first authenticated API request.

---

## Database Schema

All tables use the Clerk user ID (a `text` string like `user_2abc...`) as the foreign key. Your database owns the user data independently of Clerk.

| Table | Description |
|---|---|
| `users` | Synced from Clerk: email, display name, avatar URL, join date, last seen |
| `bookmarks` | Ayahs bookmarked by the user |
| `notes` | Rich-text reflections attached to individual ayahs |
| `hard_ayahs` | Ayahs flagged as difficult + spaced repetition interval state |
| `memorization` | Per-surah memorization progress and mastered status |
| `khatm_history` | Full Quran completion (khatm) records with completion date |
| `streaks` | Reading streak data (current streak, longest streak, last read date) |
| `goals` | Daily reading goal target and cumulative progress |
| `last_read` | The user's most recent surah and ayah position |
| `reading_logs` | Per-session reading activity log with start/end time |
| `ayah_moods` | Emotional mood tag per ayah per user |
| `tasbih` | Dhikr counter session records |
| `pinned_verses` | Ayahs pinned for quick access |
| `collections` | Named groups of bookmarked ayahs |
| `library` | Saved / bookmarked library articles |
| `donations` | Sadaqah pledge records |

---

## API Reference

All endpoints are under `/api`. Authentication requires a valid Clerk session (cookie or `Authorization: Bearer <token>`).

### Profile

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/profile/me` | Current user's DB record (email, name, join date) |
| `GET` | `/api/profile/stats` | Aggregated stats + all achievement badges |

### Quran Data (proxied from quran.com)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/search` | Full-text Quran search |
| `GET` | `/api/verse-of-day` | Daily featured verse |

### User Content

| Method | Path | Description |
|---|---|---|
| `GET/POST/DELETE` | `/api/bookmarks` | Ayah bookmarks |
| `GET/POST/PUT/DELETE` | `/api/notes` | Verse notes |
| `GET/POST/DELETE` | `/api/hard-ayahs` | Hard ayah queue |
| `GET/PATCH` | `/api/last-read` | Last read position |
| `GET/POST/PUT/DELETE` | `/api/collections` | Collections + members |
| `GET/POST/DELETE` | `/api/pinned-verses` | Pinned verses |
| `GET/POST/DELETE` | `/api/moods` | Ayah mood journal |

### Tracking

| Method | Path | Description |
|---|---|---|
| `GET/POST/PUT` | `/api/memorization` | Memorization progress |
| `GET/POST` | `/api/khatm` | Khatm history |
| `GET/POST/PUT` | `/api/goals` | Daily reading goal |
| `GET/POST` | `/api/streaks` | Reading streaks |
| `GET/POST` | `/api/reading-logs` | Session logs |
| `GET/POST` | `/api/tasbih` | Dhikr sessions |

### Other

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Aggregated dashboard summary |
| `GET` | `/api/library` | Library articles |
| `GET` | `/api/analytics` | Reading analytics |
| `POST` | `/api/support` | Submit support / feedback request |
| `POST` | `/api/donations` | Record sadaqah pledge |
| `POST` | `/api/webhooks/clerk` | Clerk user sync webhook (public, signed) |
| `GET` | `/api/healthz` | Health check |

> The API is **contract-first**: `lib/api-spec/openapi.yaml` is the single source of truth. Frontend code uses only Orval-generated TanStack Query hooks — never raw `fetch` calls.

---

## Authentication

NoorAl uses **Clerk** for all authentication flows (sign up, sign in, OAuth, session management).

### How it works

1. The Clerk SDK is loaded in the frontend via `@clerk/react`
2. The Clerk proxy is mounted at `/api/__clerk` in Express — all Clerk frontend requests go through this same-origin proxy (no CORS issues)
3. Every API request carries the Clerk session JWT (in a cookie)
4. `clerkMiddleware` on the Express server verifies the JWT and attaches `userId` to `req.auth`
5. `syncUserMiddleware` runs on every authenticated request and upserts the user into your own `users` table — giving you full ownership of your user base
6. Clerk webhooks (`user.created`, `user.updated`, `user.deleted`) sync users instantly on signup before any API request is made

### User data ownership

- **Clerk** stores credentials, OAuth tokens, and session state
- **Your PostgreSQL `users` table** stores: `id` (Clerk user ID), `email`, `display_name`, `image_url`, `created_at`, `last_seen_at`
- You own your user data — even if you migrate away from Clerk, the user records remain in your database

---

## Pages & Routes

| Route | Page | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/sign-in` | Sign in | Public |
| `/sign-up` | Sign up | Public |
| `/reader` | Quran reader | Public (features require auth) |
| `/dashboard` | Personal dashboard | Required |
| `/memorization` | Memorization tracker | Required |
| `/notes` | All notes | Required |
| `/search` | Quran search | Public |
| `/settings` | App settings | Public |
| `/ahadith` | Hadith browser | Public |
| `/bookmarks` | Saved bookmarks | Required |
| `/library` | Islamic library | Public |
| `/library/:categoryId` | Library category | Public |
| `/library/:categoryId/:articleId` | Article | Public |
| `/give` | Donate / sadaqah | Public |
| `/plans` | Subscription plans | Public |
| `/analytics` | Reading analytics | Required |
| `/reciters` | Reciter browser | Public |
| `/radio` | Quran radio | Public |
| `/collections` | Collections | Required |
| `/collections/:id` | Collection detail | Required |
| `/profile` | User profile + badges | Required |
| `/calendar` | Reading calendar | Required |
| `/media` | Islamic media | Public |
| `/reading-goal` | Daily reading goal | Required |
| `/about` | About NoorAl | Public |
| `/documentation` | User guide | Public |
| `/contribute` | Open source guide | Public |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms of service | Public |

---

## Internationalization

NoorAl supports multiple interface languages via **i18next** with automatic RTL layout switching.

| Language | Code | Direction |
|---|---|---|
| English | `en` | LTR |
| Arabic | `ar` | RTL |
| French | `fr` | LTR |
| Turkish | `tr` | LTR |
| Urdu | `ur` | RTL |
| Indonesian | `id` | LTR |

Language preference is stored in the Zustand persist store (localStorage) and applied on every render, including sidebar layout, text alignment, and font choices.

---

## Architecture Notes

### Contract-first API
The OpenAPI spec at `lib/api-spec/openapi.yaml` is the single source of truth. Running `codegen` generates:
- TanStack Query hooks in `lib/api-client-react/src/generated/api.ts`
- Zod schemas in `lib/api-client-react/src/generated/api.schemas.ts`

Never hand-write fetch calls in the frontend. Always use the generated hooks.

### Quran data sources
- Text, translations, tafsir, audio, and search → **quran.com public API** (fetched directly from the browser, no proxy)
- Prayer times → **aladhan.com** (geolocation-based, fetched client-side)
- Hadith collections → **ahadith.co** (fetched client-side)

### Zustand store
The `nooral-storage` Zustand store persists to `localStorage`:
- Theme (light / dark / sepia)
- Arabic font size
- Selected reciter
- Interface language
- Last read position

Clearing localStorage resets all preferences to defaults.

### Spaced repetition
Hard ayahs use a simple spaced repetition algorithm:
- **Correct recall**: `next_review = today + (current_interval × 2)`, capped at 14 days
- **Needs review**: `next_review = tomorrow` (1-day interval)

### Clerk proxy
The frontend auth stays same-origin by proxying Clerk's API through Express at `/api/__clerk`. This avoids CORS and allows the app to work on any domain without additional Clerk configuration.

### Logging
Server code never uses `console.log`. All logging goes through the Pino singleton (`logger`) or `req.log` in route handlers for structured JSON output.

---

## Deployment

NoorAl is built for Replit deployment with a shared reverse proxy routing by path:

| Path | Service |
|---|---|
| `/` | React + Vite frontend |
| `/api` | Express API server |

### Production checklist

- [ ] All 4 required env vars are set (`DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`)
- [ ] Using **production** Clerk instance keys (not development)
- [ ] `CLERK_WEBHOOK_SECRET` is set and webhook endpoint registered in Clerk Dashboard
- [ ] PostgreSQL database provisioned and schema pushed
- [ ] `pnpm --filter @workspace/db run push` run against the production DB

> Development Clerk keys have strict rate limits and must not be used in production.

---

## License

NoorAl is a private project. All rights reserved.

---

<p align="center">بسم الله الرحمن الرحيم</p>
<p align="center">Built with love for the Ummah</p>
