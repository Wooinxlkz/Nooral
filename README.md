# NoorAl — Your Quran Companion

NoorAl is a full-stack Quran companion for reading, memorization, reflection, prayer times, ahadith, dhikr, notes, bookmarks, collections, and personal progress tracking.

## Included

- React + Vite frontend in `artifacts/noor-al`
- Express API server in `artifacts/api-server`
- PostgreSQL + Drizzle database package in `lib/db`
- OpenAPI contract in `lib/api-spec`
- Generated Zod schemas and React Query client in `lib/api-zod` and `lib/api-client-react`
- Replit artifact deployment configuration in each app's `.replit-artifact/artifact.toml`

## Requirements

- Node.js 24+
- pnpm 9+
- PostgreSQL

## Setup

1. Copy `.env.example` to `.env` and fill in the required values.
2. Install packages:

   ```bash
   pnpm install
   ```

3. Push the database schema:

   ```bash
   pnpm --filter @workspace/db run push
   ```

4. Run the API and frontend in separate terminals:

   ```bash
   pnpm --filter @workspace/api-server run dev
   pnpm --filter @workspace/noor-al run dev
   ```

For a local frontend production build, provide the build-time values used by the artifact workflow:

```bash
PORT=22274 BASE_PATH=/ pnpm --filter @workspace/noor-al run build
```

## Checks

```bash
pnpm --filter @workspace/noor-al run typecheck
pnpm --filter @workspace/noor-al run build
pnpm --filter @workspace/api-server run build
```

## Environment variables

- `DATABASE_URL` — PostgreSQL connection string; required by the API and database package.
- `SESSION_SECRET` — signing secret for the httpOnly session cookie; required in production.
- `DEV_NAME` and `DEV_PIN` — optional development-only login panel values.
- `VITE_OPENAI_API_KEY` — optional browser-side key for open-ended Ask Noor responses; Quran and app knowledge features work without it.
- `LOG_LEVEL` — optional server logging level.

Never commit `.env` or secret values. Use your hosting provider's secret/environment-variable settings for production.

## External data sources

The frontend uses public services for Quran text, translations, tafsir, audio, prayer times, ahadith, geolocation, and optional AI responses. Review each provider's terms and availability before production use.
