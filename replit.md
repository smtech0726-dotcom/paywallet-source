# SMTech

A simulated digital wallet / payments app (Paytm-style): phone + OTP login, wallet balance, send money to other users, mobile recharge & bill payments, saved contacts, transaction history, and a QR code for receiving money.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/smtech run dev` — run the web frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session cookie signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + `express-session` (cookie-based sessions, `SESSION_SECRET`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec) → `@workspace/api-client-react` (React Query hooks) + `@workspace/api-zod` (Zod schemas)
- Frontend: React + Vite + wouter + shadcn/ui, artifact `paytm-clone` (title "SMTech"), mounted at `/`

## Where things live

- API spec (source of truth for all endpoints/schemas): `lib/api-spec/openapi.yaml`
- DB schema: `lib/db/src/schema/` (`users`, `wallets`, `transactions`, `contacts`, `otps`)
- API routes: `artifacts/api-server/src/routes/` (`auth`, `wallet`, `transactions`, `transfers`, `contacts`, `billers`, `dashboard`)
- Session/auth middleware: `artifacts/api-server/src/lib/session.ts`, `src/middlewares/requireAuth.ts`
- Static biller directory (mobile/DTH/electricity/etc, no DB table): `artifacts/api-server/src/lib/billers.ts`
- Frontend pages: `artifacts/paytm-clone/src/pages/`

## Architecture decisions

- **Auth is phone + OTP, but OTP is simulated**: `POST /auth/request-otp` returns the code directly in the response instead of sending a real SMS (no SMS gateway integration). The frontend surfaces this as a demo/simulated code. Do not "fix" this by hiding the code without adding real SMS delivery (e.g. Twilio) first.
- Sessions are cookie-based (`express-session`, MemoryStore, `SESSION_SECRET`) — no JWTs, no bearer tokens on the frontend.
- All money is simulated — wallet balances are plain integer-cent columns in Postgre, transfers are just paired debit/credit rows in the same DB, no real banking/UPI/card processor integration.
- Billers (mobile recharge, DTH, electricity, etc.) are a static hardcoded list, not a DB table — there's no catalog management need for this demo.
- No dedicated QR backend endpoint — the frontend renders a QR code client-side encoding the logged-in user's own phone number (from `/auth/me`); "scanning" is simulated via manual phone entry.

## Product

- Phone + OTP login (simulated OTP, shown in-app)
- Home dashboard: wallet balance, quick actions, recent transactions, spend-by-category
- Add money (simulated payment methods)
- Send money to another user by phone, with saved contacts
- Mobile recharge & bill payments across 8 categories
- Full transaction history + detail view
- "My QR code" screen (phone-number based) with manual-entry fallback

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- OTP and all money movement are simulated/demo — no real SMS gateway or banking integration is wired up.
- Run `pnpm --filter @workspace/api-spec run codegen` after any `lib/api-spec/openapi.yaml` change before writing routes/frontend code against it.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
