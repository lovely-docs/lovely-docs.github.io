
## Directories

### getting_started
Initial setup, project structure, deployment options, and standard Web APIs available in SvelteKit.

## Creating a Project

Initialize with `npx sv create my-app`, then `npm run dev` starts dev server on localhost:5173. CLI scaffolds project and optionally sets up TypeScript. Each page is a Svelte component in `src/routes`. Pages are server-rendered on first visit for speed, then client-side app takes over. Recommended: VS Code with Svelte extension.

## Project Types & Deployment

SvelteKit supports multiple configurations:

- **Default (SSR+CSR)**: Server-side rendering for initial load (SEO, perceived performance), then client-side rendering for subsequent pages (faster navigation). Called transitional apps.
- **Static (SSG)**: Use `adapter-static` to prerender site. Prerender only some pages with prerender option. For large sites, use ISR with `adapter-vercel` to avoid long builds.
- **SPA**: Client-side only. Write backend in SvelteKit or separate language.
- **MPA**: Remove JavaScript with `csr = false` or use `data-sveltekit-reload` for specific links.
- **Separate backend**: Deploy frontend separately using `adapter-node` or serverless adapters.
- **Serverless**: Use `adapter-auto` (zero config), `adapter-vercel`, `adapter-netlify`, or `adapter-cloudflare`. Some offer edge option.
- **Own server/VPS**: Use `adapter-node`.
- **Container**: Use `adapter-node` with Docker/LXC.
- **Library**: Use `@sveltejs/package` with `sv create` library option.
- **PWA/Offline**: Full service worker support.
- **Mobile**: Convert SPA with Tauri or Capacitor. Use `bundleStrategy: 'single'` to limit concurrent requests.
- **Desktop**: Convert SPA with Tauri, Wails, or Electron.
- **Browser extension**: Use `adapter-static` or community adapters.
- **Embedded device**: Use `bundleStrategy: 'single'` for low-power devices with limited connections.

## Directory Structure

Standard layout:
```
my-project/
├ src/
│ ├ lib/                    [utilities, components; import via $lib]
│ │ └ server/              [server-only code; import via $lib/server]
│ ├ params/                [param matchers]
│ ├ routes/                [application routes]
│ ├ app.html               [page template with %sveltekit.* placeholders]
│ ├ error.html             [fallback error page]
│ ├ hooks.client.js        [client hooks]
│ ├ hooks.server.js        [server hooks]
│ ├ service-worker.js      [service worker]
│ └ instrumentation.server.js [observability setup]
├ static/                  [static assets served as-is]
├ tests/                   [Playwright tests]
├ package.json             [must include @sveltejs/kit, svelte, vite as devDependencies]
├ svelte.config.js         [Svelte/SvelteKit config]
├ tsconfig.json            [TypeScript config; extends .svelte-kit/tsconfig.json]
└ vite.config.js           [Vite config using @sveltejs/kit/vite plugin]
```

`app.html` placeholders: `%sveltekit.head%` (links/scripts), `%sveltekit.body%` (rendered markup), `%sveltekit.assets%` (asset path), `%sveltekit.nonce%` (CSP nonce), `%sveltekit.env.[NAME]%` (environment variables starting with publicPrefix), `%sveltekit.version%` (app version).

`error.html` placeholders: `%sveltekit.status%` (HTTP status), `%sveltekit.error.message%` (error message).

Unit tests with Vitest use `.test.js` extension in `src`. `.svelte-kit/` is auto-generated and can be deleted anytime.

## Web Standards APIs

Standard Web APIs available in hooks, server routes, and browser:

**fetch**: Special version in `load` functions, server hooks, and API routes allows invoking endpoints directly during SSR without HTTP calls while preserving credentials. Server-side `fetch` outside these contexts requires explicit `cookie`/`authorization` headers. Relative requests supported in special contexts.

**Request/Response/Headers**: `event.request` in hooks/server routes provides methods like `request.json()` and `request.formData()`. Set response headers via `response.headers`.

Example:
```js
import { json } from '@sveltejs/kit';

export function GET({ request }) {
	console.log(...request.headers);
	return json(
		{ userAgent: request.headers.get('user-agent') },
		{ headers: { 'x-custom-header': 'potato' } }
	);
}

export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses.

**URL/URLSearchParams**: `event.url` in hooks/server routes, `page.url` in pages, `from`/`to` in navigation callbacks. Access query params via `url.searchParams.get('foo')`.

**Web Crypto**: Available via `crypto` global. Example: `const uuid = crypto.randomUUID();`

### core_concepts
Filesystem routing with `+` prefix files, load functions for data fetching, form actions for POST handling, page options for rendering control, state management patterns, and type-safe remote functions for client-server communication.

## Routing

Routes defined by directory structure in `src/routes`. Files with `+` prefix are special: `+page.svelte` (component), `+page.js`/`+page.server.js` (load functions), `+layout.svelte`/`+layout.js`/`+layout.server.js` (persistent wrappers), `+server.js` (API endpoints), `+error.svelte` (error boundaries).

Pages render SSR initially, CSR on navigation. Layouts persist across navigation. Dynamic routes use `[param]` syntax, rest parameters with `[...rest]`.

`+server.js` exports HTTP verb handlers (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD). Content negotiation: GET/POST/HEAD treated as pages if `accept: text/html`, else API. PUT/PATCH/DELETE/OPTIONS always API. Handlers receive `RequestEvent`, return `Response`. Can use `error()`, `redirect()`, `json()` helpers.

`+error.svelte` walks tree for closest error boundary. Falls back to root, then static `src/error.html`.

`$types.d.ts` auto-generated for type safety with `PageProps`, `LayoutProps`, `PageLoad`, `PageServerLoad`, `LayoutLoad`, `LayoutServerLoad`.

## Load Functions

Run before rendering to fetch data. Universal load (`+page.js`, `+layout.js`) runs server+browser, can return any type. Server load (`+page.server.js`, `+layout.server.js`) runs server-only, must return serializable data (JSON, BigInt, Date, Map, Set, RegExp, promises).

Receive: `url` (with `origin`, `hostname`, `pathname`, `searchParams`), `route`, `params`, `fetch` (inherits cookies/auth on server, makes relative requests, bypasses HTTP overhead, inlines response into HTML), `cookies`, `setHeaders()`, `parent()` (access parent layout data), `depends(url)`, `untrack()`.

Throw `error(status, message)` to render nearest `+error.svelte`. Use `redirect(status, location)` to redirect. Return unresolved promises to stream data as it resolves.

Dependency tracking: load reruns when referenced `params`/`url` changes, `await parent()` called and parent reran, `fetch(url)` or `depends(url)` invalidated with `invalidate(url)` or `invalidateAll()`. Use `untrack()` to exclude dependencies.

Data available via `data` prop on page/layout, or `page.data` app-wide.

## Form Actions

Server-side form handling via `actions` object in `+page.server.js`. Forms use POST (never GET for side-effects), work without JavaScript with optional progressive enhancement.

Default action: `export const actions = { default: async (event) => {...} }`. Named actions: `export const actions = { login: async (event) => {...}, register: async (event) => {...} }` invoked with `?/actionName` query parameter.

Actions receive `RequestEvent`, read form data with `request.formData()`, return data available as `form` prop and `page.form` app-wide. Use `fail(statusCode, data)` for validation errors with form values. Use `redirect(statusCode, location)` after success.

`use:enhance` directive for progressive enhancement: `<form method="POST" use:enhance>`. Without args, emulates browser behavior (updates `form`/`page.form`, resets form, invalidates data on success, redirects on redirect, renders error boundary on error). Customize with `SubmitFunction` callback receiving `{ formElement, formData, action, cancel, submitter }` returning async callback with `{ result, update }`. Use `applyAction(result)` to manually handle results.

`deserialize()` from `$app/forms` handles Date/BigInt objects (not `JSON.parse`).

## Page Options

Export from `+page.js`, `+page.server.js`, `+layout.js`, `+layout.server.js` to control rendering:

- `prerender`: `true` (static HTML at build), `false` (dynamic), `'auto'` (prerender but include in SSR manifest). Prerenderer crawls from root following `<a>` links. Specify additional routes via `config.kit.prerender.entries` or export `entries()` function from dynamic routes returning array of param objects.
- `ssr`: `false` disables server-side rendering (renders empty shell on server, browser-only).
- `csr`: `false` disables client-side rendering (HTML/CSS only, no JavaScript).
- `trailingSlash`: `'never'` (default, redirects `/about/` to `/about`), `'always'`, `'ignore'`.
- `config`: Adapter-specific configuration object. Top-level keys merged (not nested).
- `entries()`: Function exporting parameter combinations to prerender for dynamic routes. Can be async.

If all options are boolean/string literals, evaluated statically. Otherwise imports file at build/runtime, so browser-only code must not run at module load.

## State Management

Never store shared state in server variables (servers are stateless, shared by multiple users). Authenticate with cookies, persist to database.

Load functions must be pure—don't write to stores or global state. Return data instead, pass to components or use `page.data`.

Use Svelte's context API with `setContext`/`getContext` instead of globals. Pass functions into context to maintain reactivity. On server, context updates in child components don't affect already-rendered parents; on client they do. Pass state down rather than up to avoid hydration flashing.

Component/page state preserved on navigation—`data` prop updates but lifecycle doesn't rerun. Use `$derived` for reactive calculations. Use `afterNavigate`/`beforeNavigate` if lifecycle code must rerun. Use `{#key}` block to destroy/remount on navigation.

For state affecting SSR or surviving reload (filters, sorting), store in URL search parameters. Set via `<a href="...">`, `<form action="...">`, or `goto('?key=value')`. Access in load via `url`, in components via `page.url.searchParams`.

For ephemeral UI state (accordion open/closed) persisting across navigation but not reload, use snapshots.

## Remote Functions

Type-safe client-server RPC. Functions exported from `.remote.js`/`.remote.ts` files execute on server, transformed to `fetch` wrappers on client. Requires `kit.experimental.remoteFunctions: true` in `svelte.config.js`.

**query**: Reads dynamic data. Returns Promise. Accepts single validated argument (Standard Schema: Zod, Valibot). Cached per page. Call `.refresh()` to re-fetch. Use `query.batch()` to batch requests solving n+1 problem—server callback receives array of arguments, returns function `(input, index) => output`.

**form**: Writes data with progressive enhancement. Takes callback receiving validated data from FormData. Returns object with `method`/`action` for form spreading. Fields accessed via `createPost.fields.title.as('text')` etc. Supports nested objects/arrays, strings, numbers, booleans, Files. Use `invalid(invalid.field(...))` for runtime validation errors. Call `validate()` programmatically. Prefix field name with `_` to prevent sending back on invalid submission. Single-flight mutations: `await submit().updates(getQuery())` or `await getQuery().refresh()` inside handler. Form handler can `redirect(...)` or `return data`. Customize with `enhance(async ({ form, data, submit }) => {...})`. Use `modifyTodo.for(id)` for repeated forms. Different buttons submit to different URLs via `formaction` and `register.buttonProps`.

**command**: Writes without form element, called from anywhere (not during render). Like form, accepts optional validated argument. Refresh queries: `await addLike(id).updates(getQuery())` or with optimistic update: `.withOverride(n => n + 1)`.

**prerender**: Invoked at build time. Data saved via Cache API in browser, survives reloads, cleared on new deployment. Accepts validated argument. Specify values via `inputs` option. By default excluded from server bundle; set `dynamic: true` to allow runtime calls.

Validation errors return 400 Bad Request. Control message via `handleValidationError` server hook. Opt out with `'unchecked'` string instead of schema.

Use `getRequestEvent()` inside query/form/command to access current RequestEvent for cookie/auth abstractions. Cannot set headers (except cookies in form/command).

`redirect(...)` works in query/form/prerender but not command.

### adapters_and_deployment
Deployment adapters, build process, and platform-specific configuration for SvelteKit applications.

## Build Process

SvelteKit builds in two stages: Vite optimizes server/browser/service-worker code, then an adapter tunes output for the target environment. Code in `+page/layout(.server).js` files executes during build—check the `building` flag from `$app/environment` to prevent unwanted execution:

```js
import { building } from '$app/environment';
if (!building) setupDatabase();
```

Preview with `vite preview` (runs in Node, not production-identical).

## Adapters Overview

Adapters are deployment plugins configured in `svelte.config.js`. Official adapters: `adapter-cloudflare` (Workers/Pages), `adapter-netlify`, `adapter-node`, `adapter-static` (SSG), `adapter-vercel`. Platform-specific context (e.g., Cloudflare's `env` object) is passed via `RequestEvent.platform`.

## adapter-auto

Default adapter that auto-detects and installs the correct adapter at build time. Supports Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS/SST, Google Cloud Run. Install the specific adapter directly for configuration options and CI optimization.

## adapter-node

Install `@sveltejs/adapter-node`, configure in `svelte.config.js`, build with `npm run build`, run with `node build`. Requires output directory, `package.json`, and production dependencies. Environment variables: `PORT` (default 3000), `HOST` (default 0.0.0.0), `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH` (for proxies), `BODY_SIZE_LIMIT` (default 512kb), `SHUTDOWN_TIMEOUT` (default 30s), `IDLE_TIMEOUT`. Adapter options: `out`, `precompress`, `envPrefix`. Graceful shutdown via `sveltekit:shutdown` event. Supports systemd socket activation. Export `handler.js` for custom servers (Express, Polka, etc.):

```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

## adapter-static

Prerender entire site as static files. Install, set `export const prerender = true` in root layout, configure:

```js
adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false,
  strict: true
})
```

Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a`. For GitHub Pages, set `paths.base` to repo name and use `fallback: '404.html'`. Add `.nojekyll` to `static/` to prevent Jekyll interference.

## Single-Page Apps (SPA)

Disable SSR with `export const ssr = false`, use `adapter-static` with `fallback: '200.html'` (host-dependent). Significant drawbacks: multiple network round trips, poor SEO, inaccessible without JavaScript. Prerender as many pages as possible. Selectively re-enable SSR/prerender for specific pages. Apache config:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^200\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /200.html [L]
</IfModule>
```

## adapter-cloudflare

Deploy to Cloudflare Workers/Pages. Install `@sveltejs/adapter-cloudflare`, configure:

```js
adapter({
  config: undefined,
  platformProxy: { configPath, environment, persist },
  fallback: 'plaintext',
  routes: { include: ['/*'], exclude: ['<all>'] }
})
```

Wrangler config (`wrangler.jsonc`):

```jsonc
{
  "name": "<name>",
  "main": ".svelte-kit/cloudflare/_worker.js",
  "compatibility_date": "2025-01-01",
  "assets": { "binding": "ASSETS", "directory": ".svelte-kit/cloudflare" }
}
```

Access Cloudflare bindings (KV, Durable Objects) via `platform.env` in endpoints. Declare in `src/app.d.ts`:

```js
declare global {
  namespace App {
    interface Platform {
      env: {
        YOUR_KV_NAMESPACE: KVNamespace;
        YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
      };
    }
  }
}
```

`_headers` and `_redirects` affect static assets only; use server endpoints for dynamic responses. Add `"compatibility_flags": ["nodejs_compat"]` for Node.js compatibility. Test with `wrangler dev .svelte-kit/cloudflare`.

## adapter-cloudflare-workers (Deprecated)

Deprecated in favor of `adapter-cloudflare`. Deploys to Cloudflare Workers using Workers Sites. Configure Wrangler, access bindings via `platform.env`, deploy with `wrangler deploy`.

## adapter-netlify

Install `@sveltejs/adapter-netlify`, configure with `edge: true` (Deno-based edge functions) or `split: true` (multiple functions). Requires `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "build"
```

Place `_headers` and `_redirects` in project root for static assets. Forms must be prerendered (`export const prerender = true`). Access Netlify context via `event.platform.context` in hooks/endpoints. Can't use `fs` in edge deployments; use `read()` from `$app/server` or prerender.

## adapter-vercel

Install `@sveltejs/adapter-vercel`. Control deployment via `export const config` in routes:

```js
export const config = {
  runtime: 'edge' | 'nodejs20.x' | 'nodejs22.x',
  regions: ['iad1'],
  split: true,
  memory: 1024,
  maxDuration: 10,
  isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```

Image optimization:

```js
adapter({
  images: {
    sizes: [640, 828, 1200, 1920, 3840],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 300,
    domains: ['example.vercel.app']
  }
})
```

Incremental Static Regeneration (ISR): set `expiration` (seconds before re-generate), `bypassToken` (≥32 chars for on-demand revalidation), `allowQuery` (query params in cache key). Access Vercel env vars via `$env/static/private` and `$env/dynamic/private`. Skew protection routes requests to original deployment via cookie; `updated.current` from `$app/state` reports new deployments. Can't use `fs` in edge functions; use `read()` from `$app/server` or prerender.

## Writing Custom Adapters

Export default function returning `Adapter` object:

```js
export default function (options) {
  return {
    name: 'adapter-name',
    async adapt(builder) {
      // Clear build dir, write via builder.write*()
      // Instantiate Server with builder.generateManifest({ relativePath })
      // Listen for requests, convert to Request, call server.respond(request, { getClientAddress })
      // Expose platform via platform option
      // Shim fetch globally if needed (@sveltejs/kit/node/polyfills)
      // Bundle output, place files correctly
    },
    async emulate() {
      return {
        async platform({ config, prerender }) {
          // becomes event.platform during dev/build/preview
        }
      }
    },
    supports: {
      read: ({ config, route }) => true,
      tracing: () => true
    }
  };
}
```

Required: `name`, `adapt`. Optional: `emulate`, `supports`.

### advanced_features
Advanced SvelteKit features: routing with parameters/matchers/layout groups, server/client/universal hooks for request handling and error management, link navigation customization, service workers, server-only module enforcement, state snapshots, shallow routing for modals, OpenTelemetry observability, and component library packaging.

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

### best_practices
Production-ready patterns for authentication, performance optimization, accessibility, SEO, and asset handling in SvelteKit applications.

## Authentication
Session IDs vs JWT tradeoffs: sessions stored in database (immediately revokable, requires DB query per request) vs JWT (not revoked, better latency). Check auth cookies in server hooks, store user data in `locals`. Use Lucia for session-based auth via `npx sv add lucia`.

## Performance
Built-in features: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading.

Diagnostics: Google PageSpeed Insights, WebPageTest, browser devtools (Chrome/Edge Lighthouse + Network + Performance tabs; Firefox Network + Performance; Safari Web Inspector).

Assets:
- Images: `@sveltejs/enhanced-img` for auto format/size/EXIF stripping. Usage: `<enhanced:img src="./image.jpg" alt="text" />` or with dynamic imports via `?enhanced` query. Responsive sizing: `<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />`. Custom widths: `src="./image.png?w=1280;640;400"` with matching `sizes` attribute. Per-image transforms: `src="./image.jpg?blur=15"`. Width/height auto-inferred to prevent layout shift.
- Videos: compress with Handbrake to `.webm`/`.mp4`, lazy-load below-fold with `preload="none"`, strip audio from muted videos with FFmpeg.
- Fonts: manually preload in `handle` hook via `resolve` with `preload` filter; subset fonts to reduce size.

Code reduction:
- Use latest Svelte (5 < 4 < 3 in size/speed).
- Identify large packages with `rollup-plugin-visualizer`.
- Minimize third-party scripts; use server-side analytics (Cloudflare, Netlify, Vercel) instead of JS-based. Run third-party scripts in web worker with Partytown's SvelteKit integration.
- Static `import` bundles automatically; use dynamic `import(...)` for conditional lazy-loading.

Navigation:
- Preload links (configured by default on `<body>`).
- Return promises from `load` functions for slow data; server load functions stream after navigation.
- Prevent waterfalls: browser waterfalls need manual web font handling (SvelteKit adds `modulepreload` tags/headers); backend waterfalls avoided by using server load functions for backend requests (avoids high-latency round trips) and preferring single DB query with joins over sequential queries.

Hosting: co-locate frontend with backend, deploy to edge for sites without central backend, serve images from CDN, use HTTP/2+.

## Icons
CSS-based via Iconify (supports many sets at icon-sets.iconify.design, integrates with Tailwind/UnoCSS plugins). Avoid Svelte icon libraries with one `.svelte` file per icon due to Vite optimization slowdown, especially with mixed umbrella and subpath imports.

## Images
Three approaches:

1. Vite built-in: `import logo from '$lib/assets/logo.png'; <img src={logo} />`

2. `@sveltejs/enhanced-img`: auto format/size/EXIF. Setup: `npm i -D @sveltejs/enhanced-img`, add `enhancedImages()` plugin to Vite config. Usage: `<enhanced:img src="./image.jpg" alt="text" />`. Dynamic: `import MyImage from './image.jpg?enhanced'; <enhanced:img src={MyImage} />`. Glob: `import.meta.glob('/path/*.{jpg,png,...}', { eager: true, query: { enhanced: true } })`. Responsive: `<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />`. Custom widths: `src="./image.png?w=1280;640;400"` with `sizes` attribute. Transforms: `src="./image.jpg?blur=15"`. Width/height auto-inferred.

3. CDN dynamic loading: for runtime images (CMS, database). Libraries like `@unpic/svelte` or platform-specific (Cloudinary, Contentful, Storyblok, Contentstack).

Best practices: mix all three as appropriate; serve via CDN; provide 2x originals for HiDPI; specify `sizes` for large images (>400px); set `fetchpriority="high"` and avoid `loading="lazy"` for LCP images; constrain with CSS and use `width`/`height` to prevent layout shift; provide good `alt` text; don't use `em`/`rem` in `sizes`.

## Accessibility
Route announcements: SvelteKit announces page title to screen readers after navigation via injected live region. Every page needs unique, descriptive `<title>` in `<svelte:head>`.

Focus management: SvelteKit auto-focuses `<body>` after navigation/form submission (or `autofocus` element if present). Customize with `afterNavigate` hook: `import { afterNavigate } from '$app/navigation'; afterNavigate(() => { document.querySelector('.focus-me')?.focus(); })`. `goto()` accepts `keepFocus` option to preserve current focus.

Language: set `lang` attribute on `<html>` in `src/app.html`. For multi-language, set dynamically in server hook: `<html lang="%lang%">` in app.html, then in `src/hooks.server.js`: `export function handle({ event, resolve }) { return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event)) }); }`.

## SEO
Out-of-box: SSR enabled by default (more reliably indexed than CSR), performance impacts ranking, SvelteKit has minimal overhead, auto-redirects trailing slash variants (configurable via `trailingSlash`).

Manual setup:
- Title/meta: every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Pattern: return SEO data from page `load` functions, use in root layout via `page.data`.
- Sitemaps: create dynamically at `src/routes/sitemap.xml/+server.js`: `export async function GET() { return new Response('<?xml version="1.0"?><urlset xmlns="..."><!-- urls --></urlset>', { headers: { 'Content-Type': 'application/xml' } }); }`
- AMP: set `inlineStyleThreshold: Infinity` in `svelte.config.js`, disable CSR in root layout (`export const csr = false;`), add `amp` attribute to `<html>` in app.html, transform HTML in `src/hooks.server.js` using `@sveltejs/amp`. Optionally use `dropcss` to remove unused CSS after transformation. Validate with `amphtml-validator` in `handle` hook (prerendered pages only).

### appendix_&_reference
Common patterns, integrations, debugging, breaking changes from v1→v2, Sapper migration guide, and rendering/architecture glossary.

## FAQ - Common Patterns

**Package compatibility**: Check publint.dev for library issues. ESM files need `.mjs` extension (or any if `"type": "module"`), CommonJS needs `.cjs`. `exports` field takes precedence over `main`/`module`. Svelte components distributed as uncompiled `.svelte` files with ESM-only JS. Use `svelte-package` for packaging Svelte libraries.

**Client-side libraries**: Wrap in `browser` check or `onMount` to avoid SSR issues. For side-effect-free libraries, static import works (tree-shaken in server build). Use `{#await}` blocks for dynamic imports.

**Database setup**: Put queries in server routes, not `.svelte` files. Create `db.js` singleton for connections. Execute one-time setup in `hooks.server.js`.

**View transitions**: Call `document.startViewTransition` in `onNavigate`:
```js
import { onNavigate } from '$app/navigation';
onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
```

**External APIs**: Use `event.fetch` to request from external API. Handle CORS by setting up proxy: in production rewrite paths like `/api` to API server; in dev use Vite's `server.proxy`. Fallback: add API route at `src/routes/api/[...path]/+server.js` that forwards requests.

**Middleware**: For production with `adapter-node`, builds middleware for custom server. For dev, add via Vite plugin with `server.middlewares.use()`.

**Yarn**: Yarn 2 Plug'n'Play broken with ESM; use `nodeLinker: 'node-modules'` in `.yarnrc.yml`. Yarn 3 ESM experimental; enable Berry and set `nodeLinker: node-modules`.

## Integrations

**vitePreprocess**: Enables CSS preprocessors (PostCSS, SCSS, Less, Stylus, SugarSS) via Vite. Included by default in TypeScript projects. Required for TypeScript with Svelte 4; Svelte 5 supports TypeScript natively (use `vitePreprocess({ script: true })` for complex TypeScript).

**svelte-preprocess**: Alternative with additional features (Pug, Babel, global styles). May be slower; requires installing corresponding libraries like `sass` or `less`.

**npx sv add**: Sets up integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**Vite plugins**: SvelteKit uses Vite, so Vite plugins enhance projects. Available at vitejs/awesome-vite.

## Debugging

**VSCode**: Use built-in debug terminal (Cmd/Ctrl+Shift+P → "Debug: JavaScript Debug Terminal") or set up `.vscode/launch.json` with node-terminal type. Set breakpoints in source files.

**Browser DevTools**: Run `NODE_OPTIONS="--inspect" npm run dev`, open site at localhost:5173, click Node.js logo in DevTools or navigate to chrome://inspect / edge://inspect.

**Other editors**: WebStorm has built-in Svelte debugging; Neovim has community guides.

## SvelteKit 2 Breaking Changes

**error() and redirect()**: No longer thrown; call directly. Use `isHttpError` and `isRedirect` to distinguish from unexpected errors.

**Cookies**: Require explicit path: `cookies.set(name, value, { path: '/' })`. Path can be `'/'` (domain-wide), `''` (current path), or `'.'` (current directory).

**Top-level promises**: No longer auto-awaited. Use `await` explicitly or `Promise.all()` for multiple promises to avoid waterfalls.

**goto()**: No longer accepts external URLs; use `window.location.href` instead. `state` object determines `$page.state` and must adhere to `App.PageState`.

**Paths**: `paths.relative` defaults to `true` (was inconsistent). Affects `%sveltekit.assets%`, `base`, `assets` from `$app/paths`.

**preloadCode()**: Arguments must be prefixed with `base`; takes single argument instead of multiple.

**resolvePath() → resolveRoute()**: 
```js
// Before: import { resolvePath } from '@sveltejs/kit'; const path = base + resolvePath('/blog/[slug]', { slug });
// After: import { resolveRoute } from '$app/paths'; const path = resolveRoute('/blog/[slug]', { slug });
```

**Error handling**: `handleError` hooks receive `status` and `message` properties. For thrown errors, status is `500`, message is `Internal Error`. `message` safe to expose to users.

**Dynamic env vars**: Cannot be used during prerendering. Use `$env/static/public` and `$env/static/private` instead. SvelteKit requests updated values from `/_app/env.js` on prerendered pages.

**use:enhance**: `form` and `data` properties removed; use `formElement` and `formData`.

**File forms**: Require `enctype="multipart/form-data"`. SvelteKit 2 throws error during `use:enhance` if missing.

**tsconfig.json**: Stricter with `"moduleResolution": "bundler"` and `verbatimModuleSyntax`. Use `alias` in `svelte.config.js` instead of `paths`/`baseUrl`. Remove `importsNotUsedAsValues` and `preserveValueImports`.

**Dependencies**: Node 18.13+, svelte@4, vite@5, typescript@5, @sveltejs/vite-plugin-svelte@3 (peerDependency). Adapter versions: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4.

**$app/stores deprecated** (v2.12+): Use `$app/state` instead (Svelte 5 runes). Run `npx sv migrate app-state` for auto-migration.

## Sapper Migration

**package.json**: Add `"type": "module"`. Remove `polka`, `express`, `sirv`, `compression`. Replace `sapper` with `@sveltejs/kit` and adapter. Update scripts: `sapper build` → `vite build`, `sapper export` → `vite build` (static adapter), `sapper dev` → `vite dev`, `node __sapper__/build` → `node build`.

**Config**: Replace webpack/rollup config with `svelte.config.js`. Move preprocessor options to `config.preprocess`. Add adapter (adapter-node ≈ `sapper build`, adapter-static ≈ `sapper export`).

**Files**:
- `src/client.js` → move to `+layout.svelte` `onMount`
- `src/server.js` → custom server with adapter-node or no equivalent for serverless
- `src/service-worker.js` → update imports: `@sapper/service-worker` → `$service-worker`; `shell` → `build`, `timestamp` → `version`
- `src/template.html` → `src/app.html`: replace `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%`, `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`
- `src/node_modules` → `src/lib`

**Routes**: `routes/about.svelte` or `routes/about/index.svelte` → `routes/about/+page.svelte`. `_error.svelte` → `+error.svelte`. `_layout.svelte` → `+layout.svelte`.

**Imports**: `goto`, `prefetch`, `prefetchRoutes` from `@sapper/app` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`. `stores` from `@sapper/app` → import `navigating`, `page` from `$app/stores` (or `$app/state` for Svelte 5 + SvelteKit 2.12+).

**Data loading**: Rename `preload` to `load`. Move to `+page.js` or `+layout.js`. Change from two arguments (`page`, `session`) to single `event`. Remove `this` object; use `fetch` from input, throw `error()` and `redirect()`.

**Stores**: `page` still exists with `url` and `params` (no `path`/`query`). `preloading` → `navigating` with `from`/`to`. Import directly instead of via `stores()`.

**Routing**: Regex routes removed; use advanced matching. `segment` prop removed; use `$page.url.pathname`. Relative URLs resolve against current page (use root-relative `/`).

**Links**: `sapper:prefetch` → `data-sveltekit-preload-data`. `sapper:noscroll` → `data-sveltekit-noscroll`.

**Endpoints**: No longer receive Node's `req`/`res` directly. SvelteKit environment-agnostic. `fetch` available globally.

**HTML minification**: Sapper included by default; SvelteKit doesn't. Add via `handle` hook with `html-minifier`.

## Glossary

**CSR (Client-Side Rendering)**: Page contents generated in browser. Default in SvelteKit but can disable with `csr = false`.

**SSR (Server-Side Rendering)**: Page contents generated on server. Default in SvelteKit; can disable with `ssr` option. Preferred for performance, SEO, accessibility.

**Hybrid App**: SvelteKit's default combining SSR for initial load with CSR for subsequent navigations.

**SPA (Single-Page App)**: Single empty HTML shell on initial request, all navigation client-side. Large performance/SEO impact; use only in limited cases like mobile app wrapping. Built with `adapter-static`.

**MPA (Multi-Page App)**: Traditional apps rendering each page on server.

**SSG (Static Site Generation)**: Every page prerendered at build time. No server maintenance; serve from CDNs. Use `adapter-static` or configure all pages with `prerender` option.

**ISR (Incremental Static Regeneration)**: Generate static pages on-demand as visitors request without redeploying. Reduces build times vs SSG for large sites. Available with `adapter-vercel`.

**Prerendering**: Computing page contents at build time and saving HTML. Scales nearly free as visitors increase but expensive build process and requires redeployment for updates. Not all pages can be prerendered—content must be identical for all users, pages must not contain actions. Can prerender personalized pages if user-specific data fetched client-side. Controlled with `prerender` page option and config in `svelte.config.js`.

**Hydration**: Server-rendered HTML enhanced on client. SvelteKit stores data fetched during SSR and transmits with HTML. Components initialize with this data without re-fetching. Svelte verifies DOM state and attaches listeners. Enabled by default; disable with `csr = false`.

**Routing**: Client-side routing intercepts navigation (links, back/forward) and updates page contents without server requests. Default behavior; skip with `data-sveltekit-reload`.

**Edge**: Rendering in CDN near user, reducing latency.

**PWA (Progressive Web App)**: Web app using web APIs/technologies functioning like mobile/desktop apps. Can be installed with shortcuts. Often uses service workers for offline capabilities.

### api_reference
Complete API reference for SvelteKit exports: server class, error/response helpers, form actions, adapters, navigation types, load functions, request handling, cookies, hooks, remote functions, validation, configuration options, environment modules, and type definitions.

## Complete API Reference

### Core Exports
- **Server class**: Constructor takes `SSRManifest`, methods: `init(ServerInitOptions)`, `respond(Request, RequestOptions)`
- **VERSION**: String constant for kit version

### Error Handling & Responses
- **error(status, body)**: Throws HTTP error without invoking `handleError`
- **fail(status, data?)**: Creates `ActionFailure` for form submission failures
- **redirect(status, location)**: Throws redirect (status 300-308)
- **json(data, init?)**, **text(body, init?)**: Create JSON/text Response
- **normalizeUrl(url)**: Strips SvelteKit-internal suffixes, returns `{url, wasNormalized, denormalize}`
- Type guards: **isActionFailure(e)**, **isHttpError(e, status?)**, **isRedirect(e)**

### Form Actions
- **Action**: Type for form action methods in `+page.server.js`, receives `RequestEvent`, returns `MaybePromise<OutputData>`
- **ActionFailure**: Interface with `status: number`, `data: T`, unique symbol
- **ActionResult**: Union type for form responses: `{type: 'success'|'failure'|'redirect'|'error', ...}`

### Adapters
- **Adapter**: Interface with `name`, `adapt(builder)`, optional `supports` and `emulate()`
- **Builder**: Object passed to `adapt()` with methods:
  - File ops: `rimraf(dir)`, `mkdirp(dir)`, `copy(from, to, opts?)`
  - Config access: `log`, `config`, `prerendered`, `routes`
  - Path resolution: `getBuildDirectory(name)`, `getClientDirectory()`, `getServerDirectory()`, `getAppPath()`
  - Build generation: `generateManifest(opts)`, `generateFallback(dest)`, `generateEnvModule()`
  - Write artifacts: `writeClient(dest)`, `writePrerendered(dest)`, `writeServer(dest)`
  - Instrumentation (v2.31.0+): `hasServerInstrumentationFile()`, `instrument(args)`
  - Compression: `compress(directory)` for gzip/brotli

### Navigation & Routing
- **Navigation**: Union of `NavigationExternal | NavigationFormSubmit | NavigationPopState | NavigationLink`
- **NavigationBase**: Base with `from/to: NavigationTarget | null`, `willUnload: boolean`, `complete: Promise<void>`
- **NavigationTarget**: Info about target with `params`, `route.id`, `url`
- **AfterNavigate**: Callback with `type` (enter/form/link/goto/popstate), `willUnload: false`, plus Navigation properties
- **BeforeNavigate**: Callback with `cancel()` method plus Navigation properties
- **Page**: Reactive object with `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`

### Load Functions
- **Load**: Generic type for page/layout load functions, receives `LoadEvent`, returns `MaybePromise<OutputData>`
- **LoadEvent**: Extends `NavigationEvent` with:
  - `fetch: typeof fetch` - credentialed, relative-capable, internal-request-optimized
  - `data: Data` - server load data
  - `setHeaders(headers)` - set response headers (no set-cookie)
  - `parent(): Promise<ParentData>` - get parent layout data
  - `depends(...deps)` - declare dependencies for invalidation
  - `untrack(fn)` - opt out of dependency tracking
  - `tracing: {enabled, root, current}` - tracing spans (v2.31.0+)
- **ServerLoad**: Server-only load function type
- **ServerLoadEvent**: Extends `RequestEvent` with `parent()`, `depends()`, `untrack()`, `tracing`

### Request Handling
- **RequestEvent**: Server request context with:
  - `cookies: Cookies`, `fetch`, `getClientAddress()`, `locals: App.Locals`, `params`, `platform`, `request`, `route.id`, `setHeaders()`, `url`, `isDataRequest`, `isSubRequest`, `isRemoteRequest`, `tracing`
- **RequestHandler**: Type for HTTP verb handlers in `+server.js`, receives `RequestEvent`, returns `MaybePromise<Response>`
- **RequestOptions**: Options for `Server.respond()` with `getClientAddress()`, `platform?`

### Cookies
- **Cookies**: Interface with methods:
  - `get(name, opts?)` - get cookie value
  - `getAll(opts?)` - get all cookies as `{name, value}[]`
  - `set(name, value, opts)` - set cookie (httpOnly/secure true by default, sameSite defaults to lax, requires path)
  - `delete(name, opts)` - delete cookie (requires matching path)
  - `serialize(name, value, opts)` - serialize to Set-Cookie header string

### Hooks
- **Handle**: `(input: {event, resolve}) => MaybePromise<Response>`. Runs on every request
- **HandleClientError**: `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`. Client-side unexpected errors
- **HandleServerError**: `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`. Server-side unexpected errors
- **HandleFetch**: `(input: {event, request, fetch}) => MaybePromise<Response>`. Modifies `event.fetch` results
- **HandleValidationError**: `(input: {issues, event}) => MaybePromise<App.Error>`. Remote function validation failures
- **ClientInit**: `() => MaybePromise<void>`. Runs once when app starts in browser (v2.10.0+)
- **ServerInit**: `() => MaybePromise<void>`. Runs before server responds to first request (v2.10.0+)
- **Reroute**: `(event: {url, fetch}) => MaybePromise<void | string>`. Modifies URL before route matching (v2.3.0+)
- **Transport**: `Record<string, Transporter>`. Transports custom types across server/client boundary
- **Transporter**: `{encode(value): false | U, decode(data): T}`. Encodes on server, decodes in browser

### Remote Functions
- **RemoteCommand**: `(arg: Input) => Promise<Output> & {updates(...queries): Promise<Output>}` with `pending` getter
- **RemoteQuery**: `Promise<Output> & {set(value), refresh(), withOverride(fn), error, loading, current, ready}`
- **RemoteQueryFunction**: `(arg: Input) => RemoteQuery<Output>`
- **RemoteForm**: Form submission with:
  - `method: 'POST'`, `action: string`
  - `enhance(callback)` - intercept submission
  - `for(id)` - create instance for deduplication
  - `preflight(schema)` - add preflight validation
  - `validate(opts?)` - programmatic validation
  - `result` getter - submission result
  - `pending` getter - pending count
  - `fields` - field accessors with `as(type)` for input props
  - `buttonProps` - spread onto submit button
- **RemoteFormField**: Field accessor with `name()`, `value()`, `issues()`, `as(type)`
- **RemoteFormIssue**: `{message, path: (string | number)[]}`

### Validation
- **Invalid**: Function and proxy for imperative validation errors. Call `invalid(issue1, ...)` to throw. Access properties for field-specific issues: `invalid.fieldName('message')`

### Misc Types
- **Snapshot**: `{capture(): T, restore(snapshot): void}`. Export from page/layout for state preservation
- **ParamMatcher**: `(param: string) => boolean`. Custom route parameter validation
- **Emulator**: `{platform?(details): MaybePromise<App.Platform>}`. Adapter environment emulation
- **ResolveOptions**: Options for `resolve()` in handle hook with `transformPageChunk`, `filterSerializedResponseHeaders`, `preload`
- **Prerendered**: `{pages, assets, redirects, paths}` maps/arrays of prerendered content
- **RouteDefinition**: Route metadata with `id`, `api.methods`, `page.methods`, `pattern`, `prerender`, `segments`, `config`
- **SSRManifest**: Server manifest with `appDir`, `appPath`, `assets`, `mimeTypes`, private `_` object
- **ServerInitOptions**: `{env, read?(file): MaybePromise<ReadableStream | null>}`
- **CspDirectives**: Content Security Policy directives object
- **HttpError**: `{status: number, body: App.Error}`. Thrown by `error()`
- **Redirect**: `{status: 300-308, location: string}`. Thrown by `redirect()`
- **Logger**: `(msg) | success(msg) | error(msg) | warn(msg) | minor(msg) | info(msg)`
- **MaybePromise**: `T | Promise<T>`
- **TrailingSlash**: 'never' | 'always' | 'ignore'

### Hooks Helper
- **sequence(...handlers: Handle[]): Handle** - Chains multiple handle middleware. `transformPageChunk` applied in reverse order, `preload`/`filterSerializedResponseHeaders` applied forward with first winning

### Node.js Utilities
- **createReadableStream(file)** - Converts file on disk to readable stream (since 2.4.0)
- **getRequest({request, base, bodySizeLimit})** - Converts Node.js IncomingMessage to Request
- **setResponse(res, response)** - Writes Response to Node.js ServerResponse
- **installPolyfills()** - Adds crypto and File web APIs as globals in Node.js

### Vite Integration
- **sveltekit()** - Returns `Promise<import('vite').Plugin[]>` - async function resolving to array of Vite plugins

### Environment & Paths
- **$app/environment**: `browser`, `building`, `dev`, `version` boolean flags and version string
- **$app/paths**: `asset(file)`, `resolve(pathname | routeId, params?)` for URL resolution with base path handling
- **$app/forms**: `applyAction(result)`, `deserialize(text)`, `enhance(form, callback)` for form handling
- **$app/navigation**: `afterNavigate()`, `beforeNavigate()`, `disableScrollHandling()`, `goto()`, `invalidate()`, `invalidateAll()`, `onNavigate()`, `preloadCode()`, `preloadData()`, `pushState()`, `refreshAll()`, `replaceState()`
- **$app/server**: `command()`, `form()`, `getRequestEvent()`, `prerender()`, `query()`, `query.batch()`, `read()` for server-side operations
- **$app/state**: `navigating`, `page`, `updated` read-only state objects (v2.12+)
- **$app/stores**: Deprecated store-based API; use `$app/state` instead
- **$app/types**: Auto-generated types `Asset`, `RouteId`, `Pathname`, `ResolvedPathname`, `RouteParams<T>`, `LayoutParams<T>`
- **$env/dynamic/private**: Runtime private environment variables (server-only)
- **$env/dynamic/public**: Runtime public environment variables (PUBLIC_ prefix)
- **$env/static/private**: Build-time private environment variables (server-only)
- **$env/static/public**: Build-time public environment variables (PUBLIC_ prefix)
- **$lib**: Alias to `src/lib` directory
- **$service-worker**: `base`, `build`, `files`, `prerendered`, `version` for service worker caching

### Configuration (svelte.config.js)
- **adapter** - Deployment adapter
- **alias** - Import path mappings
- **appDir** (default: `"_app"`) - SvelteKit static assets directory
- **csp** - Content Security Policy with `directives`, `reportOnly`, `mode` ('hash'|'nonce'|'auto')
- **csrf** - CSRF protection with `checkOrigin` (deprecated), `trustedOrigins`
- **embedded** (default: `false`) - App embedded in larger app
- **env** - Environment variables with `dir`, `publicPrefix` (default: `"PUBLIC_"`), `privatePrefix` (default: `""`)
- **experimental** - Unstable features:
  - `tracing` (v2.31.0+) - OpenTelemetry tracing with `server`, `serverFile` flags
  - `instrumentation` (v2.31.0+) - `instrumentation.server.js` support
  - `remoteFunctions` (default: `false`) - Enable experimental remote functions
- **files** - File locations: `src`, `assets`, `hooks.client`, `hooks.server`, `hooks.universal`, `lib`, `params`, `routes`, `serviceWorker`, `appTemplate`, `errorTemplate`
- **inlineStyleThreshold** (default: `0`) - Max CSS file size to inline
- **moduleExtensions** (default: `[".js", ".ts"]`) - Module file extensions
- **outDir** (default: `".svelte-kit"`) - Build output directory
- **output** - Build output options:
  - `preloadStrategy` ('modulepreload'|'preload-js'|'preload-mjs', default: 'modulepreload')
  - `bundleStrategy` ('split'|'single'|'inline', default: 'split')
- **paths** - URL paths with `assets`, `base`, `relative` (default: `true`)
- **prerender** - Prerendering with `concurrency`, `crawl`, `entries`, `handleHttpError`, `handleMissingId`, `handleEntryGeneratorMismatch`, `handleUnseenRoutes`, `origin`
- **router** - Client-side routing:
  - `type` ('pathname'|'hash', default: 'pathname')
  - `resolution` ('client'|'server', default: 'client')
- **typescript** - TypeScript with `config(config)` function
- **version** - Version management with `name` (deterministic string), `pollInterval` (default: `0`)

### Type Definitions
- **Generated types**: `.svelte-kit/types/src/routes/[param]/$types.d.ts` with `RequestHandler`, `PageLoad`, `PageData`, `LayoutData`, `ActionData`, `PageProps`, `LayoutProps`
- **app.d.ts**: Ambient types with `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform`
- **$lib/server**: Subdirectory preventing client-side imports of server-only modules

### CLI
- **vite dev** - Start development server
- **vite build** - Build production version
- **vite preview** - Run production build locally
- **svelte-kit sync** - Generate `tsconfig.json` and type definitions (runs automatically as prepare script)


