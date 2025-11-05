## Server Hooks

**handle** — Intercepts every request. Modify response or bypass SvelteKit. Supports `transformPageChunk`, `filterSerializedResponseHeaders`, `preload` options.

**handleFetch** — Intercepts `event.fetch` calls. Redirect API URLs or forward cookies.

**handleValidationError** — Customize validation error responses.

## Shared Hooks

**handleError** — Log errors and return safe representation for `$page.error`.

**init** — Async initialization on startup.

## Universal Hooks

**reroute** — Translate URLs to routes (can be async).

**transport** — Encode/decode custom types across server/client boundary.

Files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`