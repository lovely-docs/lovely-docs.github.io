

## Pages

### advanced_routing
Advanced routing techniques including rest parameters, optional parameters, matchers, route sorting, character encoding, layout groups, and layout hierarchy control.

## Rest Parameters
`[...file]` matches variable segments: `/[org]/[repo]/tree/[branch]/[...file]` → `file: 'documentation/docs/04-advanced-routing.md'`

## Optional Parameters
`[[lang]]/home` matches both `home` and `en/home`

## Matchers
Validate parameters with `src/params/fruit.js` containing `match(param)` function, use as `[page=fruit]`

## Route Sorting
Specificity > matchers > optional/rest > alphabetical. `/foo-abc` matches `foo-abc/+page.svelte` before `foo-[c]/+page.svelte`

## Encoding
`[x+3a]` for `:`, `[x+2f]` for `/`. Example: `/smileys/:-)` → `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

## Layout Groups
`(app)` and `(marketing)` groups organize routes without affecting URLs, each with separate layouts

## Breaking Out of Layouts
`+page@(app).svelte` resets hierarchy to `(app)` layout, `+page@.svelte` to root layout

### hooks
App-wide functions that hook into SvelteKit's request lifecycle and initialization for fine-grained framework control.

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

### errors
How to handle expected and unexpected errors in SvelteKit, customize error objects, and control error page rendering.

## Expected Errors

```js
import { error } from '@sveltejs/kit';
error(404, { message: 'Not found' });
```

Throws an exception caught by SvelteKit, sets status code, and renders nearest `+error.svelte` with `page.error`.

Customize error shape with `App.Error` interface in TypeScript.

## Unexpected Errors

Any other exception is logged but not exposed to users (sends generic `{ message: "Internal Error" }`). Process in `handleError` hook.

## Error Responses

Customize fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` render nearest `+error.svelte`; errors in root layout use fallback page.

### link_options
Configure SvelteKit link navigation behavior with data-sveltekit-* attributes for preloading, history management, focus, and scroll control.

Customize `<a>` link behavior with `data-sveltekit-*` attributes:
- **data-sveltekit-preload-data**: `"hover"` or `"tap"` - when to preload page data
- **data-sveltekit-preload-code**: `"eager"`, `"viewport"`, `"hover"`, or `"tap"` - when to preload code
- **data-sveltekit-reload**: force full-page navigation
- **data-sveltekit-replacestate**: replace history instead of push
- **data-sveltekit-keepfocus**: keep focus after navigation
- **data-sveltekit-noscroll**: prevent scroll to top

Disable with `"false"` value. Applies to `<form method="GET">` too.

### service_workers
How to implement service workers in SvelteKit for offline support and performance optimization.

SvelteKit automatically registers `src/service-worker.js` for offline support and precaching. Access `$service-worker` module for assets, build files, version, and base path. Example caches built app and static files on install, removes old caches on activate, and serves from cache with network fallback on fetch. During development, manually register with `{ type: dev ? 'module' : 'classic' }`. Alternatives: Workbox or Vite PWA plugin.

### server-only_modules
Prevent accidental exposure of sensitive data to the browser by marking modules as server-only using `.server` suffix or `$lib/server/` directory.

## Server-only modules

Prevent sensitive data leaks by marking modules as server-only:
- Use `.server` suffix: `secrets.server.js`
- Or place in `$lib/server/`: `$lib/server/secrets.js`

SvelteKit errors if browser code imports server-only modules, even indirectly. Works with dynamic imports.

```js
// $lib/server/secrets.js - server-only
export const apiKey = 'secret';

// src/routes/utils.js
export { apiKey } from '$lib/server/secrets.js';

// src/routes/+page.svelte - ERROR
import { apiKey } from './utils.js'; // Cannot import server-only code
```

Note: Import detection is disabled during tests.

### snapshots
Preserve ephemeral DOM state across page navigation using snapshot capture and restore methods.

Preserve DOM state across navigation using `snapshot` object with `capture` and `restore` methods exported from `+page.svelte` or `+layout.svelte`. Data is stored in history stack and `sessionStorage`, must be JSON-serializable.

### shallow_routing
Create history entries without navigation to implement modals and overlays that can be dismissed by navigating back.

Shallow routing creates history entries without navigation using `pushState()` and `replaceState()`. Use `preloadData()` to load route data before showing overlays. Access state via `page.state` from `$app/state`. State is empty during SSR and page reloads.

**Example:**
```svelte
<script>
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
</script>

{#if page.state.showModal}
  <Modal close={() => history.back()} />
{/if}

<button onclick={() => pushState('', { showModal: true })}>
  Show Modal
</button>
```

### observability
Configure OpenTelemetry tracing for server-side operations in SvelteKit applications.

Enable OpenTelemetry tracing by setting `kit.experimental.tracing.server` and `kit.experimental.instrumentation.server` to true in `svelte.config.js`. Write instrumentation code in `src/instrumentation.server.ts`. Access spans via `event.tracing.root` and `event.tracing.current` to add custom attributes. For local development, use Jaeger with the NodeSDK setup shown in the full digest.

### packaging
Configure and build reusable component libraries using @sveltejs/package with proper package.json exports, type definitions, and entry points.

## Building Component Libraries

Use `@sveltejs/package` to build libraries with `src/lib` as public-facing code. Running `svelte-package` generates `dist` with preprocessed components and auto-generated type definitions.

## package.json Fields

- **exports** - Define entry points with `types` and `svelte` conditions
- **files** - Specify what to publish, typically `["dist"]`
- **license**, **name** - Standard npm fields
- **svelte** - Legacy field pointing to root entry point
- **sideEffects** - Mark CSS as having side effects: `["**/*.css"]`

## TypeScript

Type definitions auto-generate. For non-root exports, use `typesVersions` to map types or require consumers to set `"moduleResolution": "bundler"` in tsconfig.

## Best Practices

- Avoid SvelteKit-specific modules; use `esm-env` instead
- Add aliases via `svelte.config.js`
- Removing exports is a breaking change
- Use fully specified imports with extensions: `import { x } from './something/index.js'`
- For TypeScript, import `.ts` files with `.js` extension

