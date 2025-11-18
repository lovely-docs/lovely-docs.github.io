## Advanced Routing
- **Rest parameters**: `[...file]` matches variable segments; `[...rest]` matches zero or more
- **Optional parameters**: `[[lang]]/home` matches both `home` and `en/home`; cannot follow rest parameters
- **Matchers**: Create `src/params/fruit.js` with `match(param)` function to validate route parameters
- **Route sorting**: Specificity > matchers > optional/rest > alphabetical
- **Character encoding**: Use `[x+3a]` for `:`, `[x+2f]` for `/`, or Unicode `[u+nnnn]`
- **Layout groups**: `(group)` directories organize routes without affecting URLs
- **Breaking layouts**: `+page@segment` resets hierarchy; `+page@.svelte` inherits only root layout

## Hooks
Server hooks in `src/hooks.server.js`:
- `handle(event, resolve)` - Runs on every request; can modify response or bypass SvelteKit
- `handleFetch(request, fetch)` - Modifies `event.fetch` calls (e.g., redirect API to localhost during SSR)
- `handleValidationError` - Called when remote functions receive invalid arguments
- `handleError` - Processes unexpected errors; allows logging and custom error objects

Universal hooks in `src/hooks.js`:
- `reroute({ url })` - Changes URL-to-route mapping before `handle`
- `transport` - Defines custom type encoders/decoders for server/client boundary

## Errors
- **Expected errors**: Use `error(404, { message: 'Not found' })` to set status and render `+error.svelte`
- **Customize error shape**: Declare `App.Error` interface in TypeScript
- **Unexpected errors**: Logged but not exposed to users; process via `handleError` hook
- **Fallback error page**: Create `src/error.html` with `%sveltekit.status%` and `%sveltekit.error.message%` placeholders

## Link Options
Control navigation with `data-sveltekit-*` attributes:
- `data-sveltekit-preload-data="hover|tap"` - When to preload page data
- `data-sveltekit-preload-code="eager|viewport|hover|tap"` - When to preload page code
- `data-sveltekit-reload` - Force full-page navigation
- `data-sveltekit-replacestate` - Replace history entry instead of push
- `data-sveltekit-keepfocus` - Retain focus after navigation
- `data-sveltekit-noscroll` - Prevent scroll to top
- Disable with `"false"` value in nested elements

## Service Workers
SvelteKit auto-bundles `src/service-worker.js` if present. Access `$service-worker` module for `build`, `files`, `version`, and `prerendered` paths. Example: cache assets on install, clean old caches on activate, serve from cache with network fallback on fetch.

## Server-only Modules
Prevent accidental exposure of sensitive data:
- Mark modules with `.server` suffix: `secrets.server.js`
- Or place in `$lib/server/`: `$lib/server/secrets.js`
- `$env/static/private` and `$env/dynamic/private` only importable in server contexts
- SvelteKit throws error if public code imports server-only modules, even indirectly

## Snapshots
Preserve ephemeral DOM state across navigation. Export `snapshot` object from `+page.svelte` or `+layout.svelte`:
```js
export const snapshot = {
  capture: () => comment,
  restore: (value) => comment = value
};
```
Data must be JSON-serializable to persist to `sessionStorage`.

## Shallow Routing
Create history entries without navigation for modals/overlays:
- `pushState(url, state)` - New history entry with state
- `replaceState(url, state)` - Set state without new entry
- `preloadData(href)` - Load route data before navigating
- Access state via `page.state` from `$app/state`
- Declare `App.PageState` interface for type safety
- State is empty during SSR and on page reload

## Observability
Enable OpenTelemetry tracing in `svelte.config.js`:
```js
kit: {
  experimental: {
    tracing: { server: true },
    instrumentation: { server: true }
  }
}
```
Access spans via `event.tracing.root` and `event.tracing.current` to add custom attributes. Instrumentation code goes in `src/instrumentation.server.ts`.

## Packaging
Build component libraries with `@sveltejs/package`:
- `src/lib` is public-facing; `svelte-package` generates `dist` with preprocessed components and auto-generated type definitions
- Configure `package.json` exports with `types` and `svelte` conditions
- Set `sideEffects` for tree-shaking (mark CSS files as side effects)
- Use `typesVersions` to map types for non-root exports if consumers can't use `"moduleResolution": "bundler"`
- Avoid SvelteKit-specific modules; use fully specified relative imports with `.js` extensions