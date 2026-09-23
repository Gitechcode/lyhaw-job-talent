# LY Haw Job Talent

Khmer-first recruitment website and staff dashboard for LY Haw HR Solution.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/lyhaw-job-talent run dev` — run the public recruitment website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/lyhaw-job-talent/src/App.tsx` — public and staff dashboard routes
- `artifacts/lyhaw-job-talent/src/index.css` — design tokens, Kantumruy Pro typography, and global styles
- `artifacts/api-server/src/routes/` — typed public API routes
- `artifacts/api-server/src/lib/recruitment-data.ts` — development recruitment dataset
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks and types

## Architecture decisions

- The public app is a single React + Vite artifact at `/`, backed by the shared Express API at `/api`.
- The first usable build uses a typed in-process recruitment dataset so the preview is populated immediately; the API contract is ready for PostgreSQL persistence.
- All public API calls use generated OpenAPI hooks rather than raw fetch calls.
- Dates are modeled as `Date` values on the server and serialize as ISO dates in API responses.
- Khmer copy uses Kantumruy Pro first, with Manrope as the Latin fallback.

## Product

Visitors can browse, search, filter, and sort recruitment posts; open full job details; browse companies and HR articles; use application/contact/share actions; and read recruitment safety guidance. Staff have a summary dashboard at `/admin`.

## User preferences

- Use Khmer as the default language and Kantumruy/Kantumruy Pro for Khmer UI text.

## Gotchas

- The artifact workflow supplies `PORT` and `BASE_PATH`; do not hard-code either in the app.
- If the OpenAPI spec changes, run `pnpm --filter @workspace/api-spec run codegen` before typechecking leaf packages.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
