## Advanced Routing
Rest parameters `[...file]` match variable segments: `/[org]/[repo]/tree/[branch]/[...file]` captures path segments. Optional parameters `[[lang]]` match with or without the segment. Matchers validate parameters via `src/params/fruit.js` exporting `match(param)` function. Route sorting prioritizes: specificity (no params > one param > more params), matchers, then alphabetical. Special characters in routes use hex escapes `[x+nn]` (e.g., `:` → `[x+3a]`) or Unicode `[u+nnnn]`. Layout groups `(app)` don't affect URLs but allow different layouts per group. Break out of layout hierarchy with `+page@segment` or `+layout@segment` to inherit from specific ancestor instead of parent.

## Hooks
Three hook files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`. **handle** runs on every request, receives `event` and `resolve`, can modify response or bypass SvelteKit. **resolve** accepts options: `transformPageChunk` for HTML transforms, `filterSerializedResponseHeaders` to control which headers serialize from load functions, `preload` to control asset preloading. **handleFetch** modifies `event.fetch` calls (useful for API proxying). **handleValidationError** handles Standard Schema validation failures. **handleError** catches unexpected errors during loading/rendering, receives `error`, `event`, `status`, `message`; customize error shape via `App.Error` interface. **init** runs once at startup for async initialization. **reroute** (universal) translates URLs to routes before `handle`, can be async, must be pure/idempotent. **transport** defines custom type serialization across server/client boundary with `encode`/`decode` functions.

## Error Handling
Expected errors via `error(status, message)` from `@sveltejs/kit` render nearest `+error.svelte` with `page.error` containing error object. Unexpected errors show generic message, logged to console, passed to `handleError` hook. Customize fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Define `App.Error` interface for type-safe custom properties (always includes `message: string`).

## Link Navigation Options
`data-sveltekit-*` attributes customize `<a>` and `<form method="GET">` behavior:
- **preload-data**: `"hover"` (default), `"tap"`, `"eager"`, `"viewport"` - when to preload page data
- **preload-code**: `"eager"`, `"viewport"`, `"hover"`, `"tap"` - when to preload page code
- **reload**: Force full-page navigation instead of client-side
- **replacestate**: Replace history entry instead of pushing new one
- **keepfocus**: Retain focus on current element after navigation
- **noscroll**: Prevent scroll to top after navigation
Disable inherited attributes with `"false"` value. Respects `navigator.connection.saveData`.

## Service Workers
Place `src/service-worker.js` for automatic bundling and registration. Access build/static paths via `$service-worker` module exporting `build`, `files`, `version`, `base`. Implement `install` event to cache assets, `activate` to clean old caches, `fetch` to intercept requests. Example: cache app files on install, network-first with cache fallback on fetch. During dev, service workers aren't bundled; use `type: dev ? 'module' : 'classic'` for manual registration. `build` and `prerendered` arrays empty during development.

## Server-Only Modules
Prevent accidental exposure of secrets to browser. Mark modules as server-only via `.server` suffix (`secrets.server.js`) or `$lib/server/` directory. SvelteKit analyzes import chains and errors if browser code imports server-only modules, even indirectly or unused exports. `$env/static/private`, `$env/dynamic/private`, `$app/server` are built-in server-only modules. Illegal import detection disabled during tests when `process.env.TEST === 'true'`.

## Snapshots
Preserve ephemeral DOM state (scroll, form values) across navigation. Export `snapshot` object from `+page.svelte` or `+layout.svelte` with `capture()` and `restore(value)` methods. `capture()` called before page updates, value stored in history stack. `restore()` called with stored value after page updates. Data must be JSON-serializable for `sessionStorage` persistence across page reloads.

## Shallow Routing
Create history entries without navigation via `pushState(url, state)` and `replaceState(url, state)`. Access state via `page.state`. Useful for modals/overlays dismissible via back button. Use `preloadData(href)` to fetch route data for rendering another `+page.svelte` inside current page. Type-safe state via `App.PageState` interface. Requires JavaScript; `page.state` empty during SSR and on first page load.

## Observability
Emit OpenTelemetry spans for server-side observability (experimental, opt-in via `kit.experimental.tracing.server` and `kit.experimental.instrumentation.server`). Traces `handle` hook, server/universal `load` functions, form actions, remote functions. Create `src/instrumentation.server.ts` for setup. Access `event.tracing.root` and `event.tracing.current` to add custom attributes. Example Jaeger setup with `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-proto`.

## Component Library Packaging
Use `@sveltejs/package` to build libraries. Structure: `src/lib` is public API, `src/routes` for docs/demo. `svelte-package` generates `dist` with preprocessed components and auto-generated type definitions. Configure `package.json`: **exports** with `types`, `svelte`, `default` conditions for entry points; **svelte** field for legacy compatibility; **sideEffects** to mark files with side effects (CSS always has). For non-root exports, use `typesVersions` to map types if consumers don't use `moduleResolution: bundler|node16|nodenext`. Avoid SvelteKit-specific modules; use `esm-env` instead. All relative imports must be fully specified with extensions (`.js` not `.ts`). Options: `-w/--watch`, `-i/--input`, `-o/--output`, `-p/--preserve-output`, `-t/--types`, `--tsconfig`.