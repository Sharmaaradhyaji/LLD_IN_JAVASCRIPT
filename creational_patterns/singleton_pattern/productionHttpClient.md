# Singleton in Production — HttpClient (Module Style)

> Preview with **Cmd / Ctrl + Shift + V**
>
> **Code:** [`productionHttpClient.ts`](./productionHttpClient.ts) — run with `npm run demo:singleton-http`

If you did not understood the code for this one, be fine and just get the idea of how vast a production authentication can go in typical production apps and enjoy learning.

---

## Why this matters in real apps

Most React / React Native / Node apps centralize networking in one HTTP client:

```typescript
export class HttpClient {
  private isRefreshing = false;
  private failedQueue: Array<...> = [];
  // axios (or fetch) instance + interceptors (attach token, refresh on 401)
}

export const httpClient = new HttpClient(); // ← THE singleton
```

That last line is the production Singleton pattern in JavaScript/TypeScript:

> **Create the client once at module load. Import `httpClient` everywhere.**

You don’t call `HttpClient.getInstance()`. The **module cache** guarantees one instance per app bundle.

---

## Why HttpClient _must_ be a singleton

| Shared state on the client | What breaks if you `new HttpClient()` per screen |
| -------------------------- | ------------------------------------------------ |
| `isRefreshing`             | Two refreshes race; both hit `/auth/refresh`     |
| `failedQueue`              | Parallel 401s don’t wait for the same new token  |
| Interceptors / baseURL     | Duplicate setup; inconsistent headers            |
| Logout flags               | One client clears session; another still retries |

**Token refresh** is the killer reason: the queue and `isRefreshing` flag only work if **every** API call shares one client object.

```
Request A → 401 ─┐
Request B → 401 ─┼─→ same httpClient → refresh ONCE → replay both with new token
Request C → 401 ─┘
```

---

## Module singleton vs classic getInstance

| Classic (Logger lesson) | Production (HttpClient)                       |
| ----------------------- | --------------------------------------------- |
| `Logger.getInstance()`  | `export const httpClient = new HttpClient()`  |
| Explicit lazy create    | Module loads once; instance created at import |
| Great for interviews    | Idiomatic in React / RN / Node                |

Same guarantee: **one instance, global access.**

---

## How services use it

```typescript
// anywhere in the app
import { httpClient } from "@/api/httpClient";

await httpClient.get("/flights");
await httpClient.post("/bookings", body);
```

Every feature module imports the **same** object — auth headers and refresh behaviour stay consistent.

---

## Simplified teaching demo

[`productionHttpClient.ts`](./productionHttpClient.ts) shows the idea without pulling in axios:

1. One `HttpClient` with shared `isRefreshing` + queue
2. `export const httpClient = new HttpClient()`
3. Parallel “401” calls → **one** refresh, then both succeed

Compare that to creating two clients — refresh runs twice (bad).

---

## Other production singletons you’ll see

| Resource                      | Why one instance                   |
| ----------------------------- | ---------------------------------- |
| DB / Prisma / Mongo client    | Connection pool                    |
| Redis / cloud SDK clients     | Expensive setup + connection reuse |
| Feature flag / Config service | One source of truth                |
| Analytics / Logger            | One pipeline                       |
| Redux / Zustand store         | One app state (same idea)          |

---

## Caveats (say this in interviews)

1. **Testing** — module singletons need care (reset mocks, inject interfaces when possible).
2. **Don’t overuse** — domain entities (`Booking`, `User`) should _not_ be singletons.
3. **SSR / multi-tenant** — sometimes you need per-request clients; then factory + DI beats a global.

For a typical SPA or mobile app with login: **one shared HttpClient is the right call.**

---

## Run it

```bash
npm run demo:singleton-http
```
