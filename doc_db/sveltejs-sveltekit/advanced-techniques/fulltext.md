

## Pages

### advanced-routing
Advanced routing techniques including rest parameters, optional parameters, matchers, route sorting, character encoding, and layout grouping.

## Rest Parameters
`[...file]` matches variable segments: `/[org]/[repo]/tree/[branch]/[...file]` with `/sveltejs/kit/tree/main/docs/file.md` gives `file: 'docs/file.md'`.

## Optional Parameters
`[[lang]]/home` matches both `home` and `en/home`.

## Matching
Create `src/params/fruit.js` with `match(param)` function, use `[page=fruit]` in routes.

## Sorting
Specificity > matchers > optional/rest > alphabetical. `/foo-abc` matches `foo-abc/+page.svelte` before `foo-[c]/+page.svelte`.

## Encoding
`[x+3a]` for `:`, `[x+2f]` for `/`. `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`.

## Layout Groups
`(app)` and `(marketing)` organize routes without URL changes. Use `+page@(app).svelte` to inherit from `(app)` layout only.

### hooks
App-wide functions that hook into SvelteKit lifecycle events for request handling, error management, routing, and type serialization.

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

### errors
How to handle expected and unexpected errors in SvelteKit, customize error objects, and control error page rendering.

## Expected vs Unexpected Errors

**Expected errors** use the `error()` helper to throw exceptions that SvelteKit catches and renders with `+error.svelte`:

```js
import { error } from '@sveltejs/kit';
error(404, 'Not found');
// or with custom properties:
error(404, { message: 'Not found', code: 'NOT_FOUND' });
```

**Unexpected errors** are other exceptions. They show a generic message to users and pass through the `handleError` hook for custom handling.

## Type Safety

Declare custom error properties in `src/app.d.ts`:

```ts
declare global {
	namespace App {
		interface Error {
			code: string;
			id: string;
		}
	}
}
```

## Error Responses

Customize the fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` functions render the nearest `+error.svelte`, except in root layouts which use the fallback page.

### link-options
Customize SvelteKit link navigation behavior using data-sveltekit-* attributes for preloading, history management, focus, and scroll control.

## Link Navigation Attributes

Control SvelteKit link behavior with `data-sveltekit-*` attributes:

- **data-sveltekit-preload-data**: `"hover"` (default) or `"tap"` — when to preload page data
- **data-sveltekit-preload-code**: `"eager"`, `"viewport"`, `"hover"`, or `"tap"` — when to preload code
- **data-sveltekit-reload**: force full-page browser navigation
- **data-sveltekit-replacestate**: replace history entry instead of pushing new one
- **data-sveltekit-keepfocus**: retain focus after navigation
- **data-sveltekit-noscroll**: prevent scroll to top after navigation

Disable with `"false"` value. Respects `navigator.connection.saveData`.

### service-workers
How to implement and configure service workers in SvelteKit for offline support and performance optimization.

SvelteKit automatically registers `src/service-worker.js` for offline support and performance. Access `$service-worker` module for build files, static assets, version, and base path. Implement install/activate/fetch handlers to cache assets and handle offline requests. Use version string for unique cache names. Disable auto-registration via config if needed. In dev, use `{ type: 'module' }` for manual registration.

### server-only-modules
Prevent accidental exposure of sensitive data to the browser by marking modules as server-only using .server suffix or $lib/server/ directory.

Mark modules as server-only using `.server` filename suffix or `$lib/server/` directory to prevent sensitive data leaking to the browser. SvelteKit errors if any import chain from client code reaches server-only modules, even indirectly or through unused exports.

### snapshots
Preserve ephemeral DOM state across navigation using snapshot capture and restore methods.

Export a `snapshot` object with `capture()` and `restore()` methods from `+page.svelte` or `+layout.svelte` to preserve DOM state across navigation. Data must be JSON-serializable and is stored in `sessionStorage`.

```svelte
export const snapshot = {
	capture: () => state,
	restore: (value) => state = value
};
```

### shallow-routing
Create history entries without navigating using pushState/replaceState to enable patterns like history-driven modals.

## Shallow Routing

Use `pushState()` and `replaceState()` from `$app/navigation` to create history entries without navigating. Access state via `page.state`.

```svelte
pushState('', { showModal: true });
```

For rendering nested pages, preload data with `preloadData()` before calling `pushState()`:

```svelte
const result = await preloadData(href);
if (result.type === 'loaded' && result.status === 200) {
	pushState(href, { selected: result.data });
}
```

**Caveats:** `page.state` is empty during SSR and on initial page load. Requires JavaScript.

### observability
SvelteKit can emit OpenTelemetry spans for server-side operations; enable via config, set up instrumentation in src/instrumentation.server.ts, and augment spans with custom attributes.

## Observability with OpenTelemetry

Enable in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```

SvelteKit emits spans for `handle` hooks, `load` functions, form actions, and remote functions. Create `src/instrumentation.server.ts` for tracing setup.

Access spans via `event.tracing.root` and `event.tracing.current` to add custom attributes.

For local development with Jaeger, install `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-proto`, and `import-in-the-middle`, then configure the NodeSDK in `src/instrumentation.server.js` to export traces to localhost:16686.

### packaging
How to build and publish component libraries with SvelteKit using @sveltejs/package, configuring package.json exports, handling TypeScript definitions, and best practices.

## Building Component Libraries

Use `@sveltejs/package` to build libraries with `src/lib` as public-facing code. Generates `dist` with preprocessed components and auto-generated type definitions.

## package.json Configuration

**exports** — Define entry points with `types` and `svelte` conditions:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./Foo.svelte": { "types": "./dist/Foo.svelte.d.ts", "svelte": "./dist/Foo.svelte" }
  }
}
```

**files** — Include `dist` folder
**license** — Recommended: `MIT`
**sideEffects** — Mark CSS as having side effects: `["**/*.css"]`

## TypeScript

Type definitions auto-generate. For non-root exports, use `typesVersions` to map types:
```json
{
  "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } }
}
```

## Best Practices

- Avoid SvelteKit-specific modules; use `esm-env` or pass values as props
- Define aliases in `svelte.config.js`
- Removing export paths/conditions is a breaking change
- Enable declaration maps for source navigation

## Caveats

- All relative imports need full paths with extensions: `import { x } from './something/index.js'`
- TypeScript imports use `.js` extension, not `.ts`

