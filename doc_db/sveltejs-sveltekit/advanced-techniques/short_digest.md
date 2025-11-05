## Routing

**Rest/Optional Parameters** — `[...file]` captures segments; `[[lang]]` makes optional.

**Matchers** — Create `src/params/fruit.js` with `match()`, use `[page=fruit]` in routes.

**Layout Groups** — `(app)` organizes routes without URL changes; use `+page@(app).svelte` for specific layout.

**Encoding** — `[x+3a]` for `:`, `[x+2f]` for `/`.

## Hooks

`handle` intercepts requests; `handleFetch` intercepts `event.fetch`; `handleError` logs errors; `reroute` translates URLs; `transport` encodes/decodes custom types.

## Error Handling

`error(404, 'Not found')` throws expected errors rendered by `+error.svelte`. Declare custom error properties in `src/app.d.ts`. Customize fallback with `src/error.html`.

## Link Navigation

`data-sveltekit-preload-data`, `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll` control behavior.

## Service Workers

Auto-registers `src/service-worker.js`. Access `$service-worker` module for build files and version.

## Server-Only Modules

Use `.server` suffix or `$lib/server/` directory to prevent sensitive data leaking to browser.

## Snapshots

Export `snapshot` with `capture()` and `restore()` to preserve DOM state across navigation.

## Shallow Routing

`pushState('', { showModal: true })` creates history entries without navigating. Preload data with `preloadData()` first.

## Observability

Enable OpenTelemetry in config. Create `src/instrumentation.server.ts`. Access spans via `event.tracing.root`.

## Component Libraries

Use `@sveltejs/package`. Configure `package.json` exports with `types` and `svelte` conditions. Type definitions auto-generate.