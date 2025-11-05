## Routing

**Rest Parameters** — `[...file]` captures variable segments: `/[org]/[repo]/tree/[branch]/[...file]` matches `/sveltejs/kit/tree/main/docs/file.md` with `file: 'docs/file.md'`.

**Optional Parameters** — `[[lang]]/home` matches both `home` and `en/home`.

**Matchers** — Create `src/params/fruit.js` with `match(param)` function, use `[page=fruit]` in routes.

**Route Sorting** — Specificity > matchers > optional/rest > alphabetical.

**Encoding** — Use `[x+3a]` for `:`, `[x+2f]` for `/`. `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`.

**Layout Groups** — `(app)` and `(marketing)` organize routes without URL changes. Use `+page@(app).svelte` to inherit from specific layout.

## Hooks

**Server Hooks** — `handle` intercepts every request; `handleFetch` intercepts `event.fetch` calls; `handleValidationError` customizes validation errors.

**Shared Hooks** — `handleError` logs errors and returns safe representation for `$page.error`.

**Universal Hooks** — `reroute` translates URLs to routes; `transport` encodes/decodes custom types across server/client.

Files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`

## Error Handling

**Expected Errors** — Use `error(404, 'Not found')` or `error(404, { message: 'Not found', code: 'NOT_FOUND' })` to throw exceptions SvelteKit catches and renders with `+error.svelte`.

**Unexpected Errors** — Other exceptions show generic message to users and pass through `handleError` hook.

**Type Safety** — Declare custom error properties in `src/app.d.ts`:
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

**Fallback Page** — Customize with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders.

## Link Navigation

Control behavior with `data-sveltekit-*` attributes:
- `data-sveltekit-preload-data`: `"hover"` or `"tap"`
- `data-sveltekit-preload-code`: `"eager"`, `"viewport"`, `"hover"`, or `"tap"`
- `data-sveltekit-reload`: force full-page navigation
- `data-sveltekit-replacestate`: replace history entry
- `data-sveltekit-keepfocus`: retain focus after navigation
- `data-sveltekit-noscroll`: prevent scroll to top

Disable with `"false"` value.

## Service Workers

SvelteKit automatically registers `src/service-worker.js`. Access `$service-worker` module for build files, static assets, version, and base path. Implement install/activate/fetch handlers to cache assets and handle offline requests. Use version string for unique cache names. Disable auto-registration via config if needed.

## Server-Only Modules

Mark modules as server-only using `.server` filename suffix or `$lib/server/` directory to prevent sensitive data leaking to browser. SvelteKit errors if any import chain from client code reaches server-only modules.

## Snapshots

Export `snapshot` object with `capture()` and `restore()` methods from `+page.svelte` or `+layout.svelte` to preserve DOM state across navigation:
```svelte
export const snapshot = {
	capture: () => state,
	restore: (value) => state = value
};
```

## Shallow Routing

Use `pushState()` and `replaceState()` from `$app/navigation` to create history entries without navigating:
```svelte
pushState('', { showModal: true });
```

Preload data before pushing state:
```svelte
const result = await preloadData(href);
if (result.type === 'loaded' && result.status === 200) {
	pushState(href, { selected: result.data });
}
```

**Caveats** — `page.state` is empty during SSR and initial page load. Requires JavaScript.

## Observability

Enable OpenTelemetry in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```

Create `src/instrumentation.server.ts` for tracing setup. SvelteKit emits spans for `handle` hooks, `load` functions, form actions, and remote functions. Access spans via `event.tracing.root` and `event.tracing.current`.

## Component Libraries

Use `@sveltejs/package` to build libraries with `src/lib` as public-facing code. Configure `package.json` exports with `types` and `svelte` conditions:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./Foo.svelte": { "types": "./dist/Foo.svelte.d.ts", "svelte": "./dist/Foo.svelte" }
  }
}
```

Include `dist` folder in `files`. Mark CSS as having side effects: `["**/*.css"]`. Type definitions auto-generate. Avoid SvelteKit-specific modules; use `esm-env` or pass values as props. All relative imports need full paths with extensions.