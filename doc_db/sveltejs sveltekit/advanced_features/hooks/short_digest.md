Hooks are app-wide functions in `src/hooks.server.js`, `src/hooks.client.js`, or `src/hooks.js` that SvelteKit calls for specific events.

**Key server hooks:**
- `handle` — runs on every request, can modify response or bypass SvelteKit
- `handleFetch` — intercepts `event.fetch` calls to redirect URLs
- `handleValidationError` — handles validation failures for remote functions
- `locals` — attach custom data to requests

**Shared hooks (server + client):**
- `handleError` — log errors and generate safe user-facing error objects
- `init` — async initialization on startup

**Universal hooks:**
- `reroute` — change URL-to-route mapping (can be async)
- `transport` — encode/decode custom types across server/client boundary