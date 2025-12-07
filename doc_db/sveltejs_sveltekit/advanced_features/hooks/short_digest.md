## Hooks

Three optional hook files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js` (universal).

**Server hooks:**
- `handle` — runs on every request, receives `event` and `resolve`, can modify response or bypass SvelteKit. `resolve` accepts options for `transformPageChunk`, `filterSerializedResponseHeaders`, `preload`.
- `handleFetch` — modifies `event.fetch` results, manages credentials for same-origin and cross-origin requests.
- `handleValidationError` — called when remote function receives invalid argument, returns custom error.

**Shared hooks (server & client):**
- `handleError` — logs errors and generates safe user-facing error representation. Customize via `App.Error` interface. Never throws.
- `init` — runs once at startup for async initialization.

**Universal hooks:**
- `reroute` — changes URL-to-route translation before `handle`. Can be async. Must be pure/idempotent.
- `transport` — defines custom type encoders/decoders for server/client boundary.