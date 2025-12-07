**Routing**: `src/routes` directory structure with `+` prefix files (`+page.svelte`, `+page.js/.server.js`, `+layout.svelte/.js/.server.js`, `+server.js`, `+error.svelte`). Pages SSR/CSR, layouts persist, `+server.js` handles HTTP verbs with content negotiation, `+error.svelte` walks tree for boundaries, `$types.d.ts` for type safety.

**Load Functions**: Universal (`+page.js`, `+layout.js`) runs server+browser any type; server (`+page.server.js`, `+layout.server.js`) runs server-only serializable data. Receive `url`, `params`, `fetch` (inherits cookies, inlines responses), `cookies`, `setHeaders()`, `parent()`, `depends()`. Throw `error()` or `redirect()`. Dependency tracking with `invalidate()`/`invalidateAll()`.

**Form Actions**: `actions` object in `+page.server.js` with default/named actions. POST only, work without JS. Return data as `form` prop. Use `fail(status, data)` for validation, `redirect()` for success. `use:enhance` for progressive enhancement with `SubmitFunction` callback. `applyAction()` for manual handling.

**Page Options**: `prerender` (true/false/'auto'), `ssr` (disable server render), `csr` (disable client render), `trailingSlash` ('never'/'always'/'ignore'), `config` (adapter-specific), `entries()` (prerender params).

**State Management**: No shared server state. Load functions pure. Use context API instead of globals. `$derived` for reactivity. URL for persistent state, snapshots for ephemeral UI state.

**Remote Functions**: Type-safe RPC from `.remote.js`. `query` (read, cached, `.refresh()`, `.batch()`), `form` (write, progressive, `.updates()`, `.for(id)`), `command` (write, anywhere), `prerender` (build-time). Standard Schema validation. `getRequestEvent()` for auth/cookies.