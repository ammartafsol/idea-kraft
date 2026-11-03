# Next.js frontend starter

Production-oriented **frontend-only** starter for apps whose API lives in a separate **NestJS** repository. Auth cookies and business logic stay on Nest; this app handles UI, client state, route guards, and calling the API.

## Quickstart

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_API_URL / NEXT_PUBLIC_AWS_URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | Nest API origin (no trailing slash) |
| `NEXT_PUBLIC_AWS_URL` | yes | Media / CDN base for `next/image` and `mediaUrl` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | no | Maps / Places |
| `NEXT_PUBLIC_SOCKET_URL` | no | Socket.IO origin (defaults to API URL) |

Read via [`src/config/config.ts`](src/config/config.ts) (`process.env.NEXT_PUBLIC_*`).

## Architecture (short)

| Area | Location |
| --- | --- |
| UI (atomic) | `src/components/{atoms,molecules,organisms,templates,ui}` |
| Nest HTTP client | `src/api/apiClient.ts` (CSRF, refresh, credentials) |
| Redux auth | `src/redux/auth` — session source of truth on the client |
| React Query | `src/providers/QueryProvider.tsx` — server state (see `useCurrentUser`) |
| Edge route guards | `src/proxy.ts` + META cookie |
| RBAC | `src/config/roles.ts`, `src/lib/rbac.ts` — single role: `user` |
| App cookies | `src/app/api/v1/set` + `COOKIE_NAMES` in `src/config/constant.ts` |

### Auth flow (frontend contract)

1. Nest sets httpOnly auth cookies on its domain (`withCredentials: true` on axios).
2. Client bootstraps CSRF via Nest `csrf` endpoint.
3. After login (or when `/users/me` succeeds), call `setUserSessionMeta("user")` so Next can set the **META** httpOnly cookie (`{ role: "user" }`).
4. `src/proxy.ts` protects `/cms`, `/admin`, `/dashboard` when META is missing/invalid; auth pages redirect away when META is valid.
5. Redux `isAuthenticated` + React Query `useCurrentUser` keep user profile in sync.

Nest owns real authorization. META is a **routing hint** for this Next app only.

### Protecting routes

Edit `PROTECTED_PREFIXES` / `AUTH_ROUTES` in [`src/config/routes.ts`](src/config/routes.ts).

UI gating:

```tsx
import { useHasRole } from "@/hooks";

const canSee = useHasRole("user");
```

### React Query + Nest

Prefer `request()` from `apiClient` inside `queryFn` / mutations. Reference: [`src/hooks/useCurrentUser.ts`](src/hooks/useCurrentUser.ts) and [`src/lib/queryKeys.ts`](src/lib/queryKeys.ts).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run ci` | lint + typecheck + test + build |

## Docker

Multi-stage image uses Next `output: "standalone"`.

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_AWS_URL=https://cdn.example.com \
  -t next-starter .

docker run --rm -p 3000:3000 next-starter
```

## Testing

Vitest covers env parsing, route helpers, and RBAC (`src/**/*.test.ts`). Playwright is intentionally out of scope until a Nest test environment is available.

## Non-goals

- NestJS implementation (separate repo)
- Sentry / full observability stack
- Playwright E2E
- Storybook, i18n, multi-role RBAC (`admin`, etc.)
