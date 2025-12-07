## Getting Started
Initialize with `npx sv create my-app`, then `npm run dev` starts dev server on localhost:5173. Each page is a Svelte component in `src/routes`. Pages are server-rendered on first visit, then client-side app takes over.

Project types: SSR+CSR (default, transitional), SSG (static), SPA (client-only), MPA (no JS), serverless, Node.js, Docker, PWA, mobile (Tauri/Capacitor), desktop (Tauri/Wails/Electron), browser extension, embedded device.

Standard directory structure:
```
src/
├ lib/                    [utilities, components; import via $lib]
│ └ server/              [server-only code]
├ params/                [param matchers]
├ routes/                [application routes]
├ app.html               [page template with %sveltekit.* placeholders]
├ error.html             [fallback error page]
├ hooks.client.js        [client hooks]
├ hooks.server.js        [server hooks]
├ service-worker.js      [service worker]
└ instrumentation.server.js [observability setup]
```

Web APIs available: `fetch` (special version in load/hooks/routes), `Request/Response/Headers`, `Streams`, `URL/URLSearchParams`, `Web Crypto`.

## Core Concepts
Routes defined by `+` prefix files: `+page.svelte` (component), `+page.js`/`+page.server.js` (load), `+layout.svelte` (persistent wrapper), `+server.js` (API endpoints), `+error.svelte` (error boundary).

**Load functions** run before rendering. Universal load (`+page.js`, `+layout.js`) runs server+browser, can return any type. Server load (`+page.server.js`, `+layout.server.js`) runs server-only, must return serializable data. Receive: `url`, `route`, `params`, `fetch` (credentialed, relative-capable, bypasses HTTP), `cookies`, `setHeaders()`, `parent()`, `depends(url)`, `untrack()`. Throw `error(status, message)` or `redirect(status, location)`. Return unresolved promises to stream data.

**Form actions** handle POST via `actions` object in `+page.server.js`. Default action: `export const actions = { default: async (event) => {...} }`. Named actions: `export const actions = { login: async (event) => {...} }` invoked with `?/actionName`. Read form data with `request.formData()`, return data available as `form` prop. Use `fail(statusCode, data)` for validation errors, `redirect(statusCode, location)` after success. `use:enhance` directive for progressive enhancement without args emulates browser behavior; with `SubmitFunction` callback customize handling.

**Page options** exported from `+page.js`, `+page.server.js`, `+layout.js`, `+layout.server.js`:
- `prerender`: `true` (static HTML), `false` (dynamic), `'auto'` (prerender but include in SSR manifest)
- `ssr`: `false` disables server-side rendering
- `csr`: `false` disables client-side rendering
- `trailingSlash`: `'never'` (default), `'always'`, `'ignore'`
- `config`: adapter-specific configuration
- `entries()`: function exporting parameter combinations for dynamic routes

**State management**: Never store shared state in server variables (stateless, shared by users). Load functions must be pure. Use Svelte's context API with `setContext`/`getContext`. For state affecting SSR or surviving reload, store in URL search parameters. For ephemeral UI state, use snapshots.

**Remote functions** (experimental): Type-safe client-server RPC. Functions exported from `.remote.js`/`.remote.ts` execute on server, transformed to `fetch` wrappers on client. Requires `kit.experimental.remoteFunctions: true`.
- **query**: Reads dynamic data, cached per page, call `.refresh()` to re-fetch, use `query.batch()` for n+1 solving
- **form**: Writes data with progressive enhancement, takes callback receiving validated FormData, returns `{method, action}` for form spreading
- **command**: Writes without form element, called from anywhere
- **prerender**: Invoked at build time, data saved via Cache API

Validation via Standard Schema (Zod, Valibot). Validation errors return 400 Bad Request. Use `getRequestEvent()` inside query/form/command for cookie/auth abstractions.

## Adapters & Deployment
Build in two stages: Vite optimizes code, then adapter tunes for target environment. Check `building` flag from `$app/environment` to prevent unwanted execution during build.

**adapter-auto**: Default, auto-detects and installs correct adapter (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS/SST, Google Cloud Run).

**adapter-node**: Install `@sveltejs/adapter-node`, build with `npm run build`, run with `node build`. Environment variables: `PORT` (default 3000), `HOST` (default 0.0.0.0), `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT` (default 512kb), `SHUTDOWN_TIMEOUT` (default 30s), `IDLE_TIMEOUT`. Export `handler.js` for custom servers (Express, Polka, etc.).

**adapter-static**: Prerender entire site as static files. Set `export const prerender = true` in root layout. For GitHub Pages, set `paths.base` to repo name and use `fallback: '404.html'`.

**adapter-cloudflare**: Deploy to Cloudflare Workers/Pages. Access bindings (KV, Durable Objects) via `platform.env` in endpoints. Declare in `src/app.d.ts`.

**adapter-netlify**: Install `@sveltejs/adapter-netlify`, configure with `edge: true` (Deno-based) or `split: true` (multiple functions). Requires `netlify.toml`. Access Netlify context via `event.platform.context`.

**adapter-vercel**: Install `@sveltejs/adapter-vercel`. Control deployment via `export const config` in routes with `runtime`, `regions`, `split`, `memory`, `maxDuration`, `isr`. Image optimization via adapter options. ISR: set `expiration` (seconds before re-generate), `bypassToken` (≥32 chars), `allowQuery` (query params in cache key).

**Custom adapters**: Export default function returning `Adapter` object with `name`, `adapt(builder)`, optional `emulate()`, `supports`.

## Advanced Features
**Advanced routing**: Rest parameters `[...file]` match variable segments. Optional parameters `[[lang]]` match with or without. Matchers validate via `src/params/fruit.js` exporting `match(param)`. Layout groups `(app)` don't affect URLs. Break out with `+page@segment` or `+layout@segment`.

**Hooks**: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`.
- **handle**: runs on every request, receives `event` and `resolve`, can modify response
- **resolve**: accepts `transformPageChunk`, `filterSerializedResponseHeaders`, `preload`
- **handleFetch**: modifies `event.fetch` calls
- **handleValidationError**: handles Standard Schema validation failures
- **handleError**: catches unexpected errors, receives `error`, `event`, `status`, `message`
- **init**: runs once at startup
- **reroute**: translates URLs to routes before `handle`
- **transport**: defines custom type serialization with `encode`/`decode`

**Error handling**: Expected errors via `error(status, message)` render nearest `+error.svelte`. Unexpected errors show generic message, logged to console, passed to `handleError` hook. Customize fallback with `src/error.html`.

**Link navigation**: `data-sveltekit-*` attributes customize `<a>` and `<form method="GET">`:
- `preload-data`: `"hover"` (default), `"tap"`, `"eager"`, `"viewport"`
- `preload-code`: `"eager"`, `"viewport"`, `"hover"`, `"tap"`
- `reload`: Force full-page navigation
- `replacestate`: Replace history entry
- `keepfocus`: Retain focus
- `noscroll`: Prevent scroll to top

**Service workers**: Place `src/service-worker.js` for automatic bundling. Access `$service-worker` module exporting `build`, `files`, `version`, `base`. Implement `install`, `activate`, `fetch` events.

**Server-only modules**: Mark with `.server` suffix or `$lib/server/` directory. SvelteKit errors if browser code imports them.

**Snapshots**: Preserve ephemeral DOM state across navigation. Export `snapshot` object from `+page.svelte` or `+layout.svelte` with `capture()` and `restore(value)` methods.

**Shallow routing**: Create history entries without navigation via `pushState(url, state)` and `replaceState(url, state)`. Access state via `page.state`. Useful for modals dismissible via back button.

**Observability**: OpenTelemetry spans for server-side observability (experimental). Create `src/instrumentation.server.ts` for setup. Access `event.tracing.root` and `event.tracing.current`.

**Component library packaging**: Use `@sveltejs/package`. Structure: `src/lib` is public API, `src/routes` for docs. `svelte-package` generates `dist` with preprocessed components and type definitions. Configure `package.json` with `exports`, `svelte`, `sideEffects`.

## Best Practices
**Authentication**: Session IDs vs JWT tradeoffs. Check auth cookies in server hooks, store user data in `locals`. Use Lucia for session-based auth.

**Performance**: Built-in: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, link preloading.

Diagnostics: Google PageSpeed Insights, WebPageTest, browser devtools.

**Assets**:
- **Images**: `@sveltejs/enhanced-img` for auto format/size/EXIF stripping. Usage: `<enhanced:img src="./image.jpg" alt="text" />`. Responsive: `<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />`. Custom widths: `src="./image.png?w=1280;640;400"` with matching `sizes`. Transforms: `src="./image.jpg?blur=15"`.
- **Videos**: compress to `.webm`/`.mp4`, lazy-load with `preload="none"`, strip audio from muted with FFmpeg
- **Fonts**: manually preload in `handle` hook via `resolve` with `preload` filter

**Code reduction**: Use latest Svelte, identify large packages with `rollup-plugin-visualizer`, minimize third-party scripts, use server-side analytics instead of JS-based, run third-party scripts in web worker with Partytown.

**Navigation**: Preload links (default), return promises from `load` for slow data, prevent waterfalls with server load functions.

**Icons**: CSS-based via Iconify. Avoid Svelte icon libraries with one `.svelte` file per icon.

**Images**: Three approaches: Vite built-in, `@sveltejs/enhanced-img`, CDN dynamic loading. Mix as appropriate; serve via CDN; provide 2x originals for HiDPI; specify `sizes` for large images; set `fetchpriority="high"` for LCP images; constrain with CSS; provide good `alt` text.

**Accessibility**: Route announcements via injected live region (every page needs unique `<title>`). Focus management: SvelteKit auto-focuses `<body>` after navigation (or `autofocus` element). Customize with `afterNavigate` hook. Set `lang` attribute on `<html>` in `src/app.html`.

**SEO**: SSR enabled by default. Manual: unique `<title>` and `<meta name="description">` per page in `<svelte:head>`. Sitemaps: create at `src/routes/sitemap.xml/+server.js`. AMP: set `inlineStyleThreshold: Infinity`, disable CSR in root layout, add `amp` attribute to `<html>`, transform HTML in `src/hooks.server.js` using `@sveltejs/amp`.

## Common Patterns & Reference
**Package compatibility**: Check publint.dev. ESM files need `.mjs` extension (or any if `"type": "module"`), CommonJS needs `.cjs`. `exports` field takes precedence. Svelte components distributed as uncompiled `.svelte` files with ESM-only JS.

**Client-side libraries**: Wrap in `browser` check or `onMount` to avoid SSR issues.

**Database setup**: Put queries in server routes. Create `db.js` singleton for connections. Execute one-time setup in `hooks.server.js`.

**View transitions**: Call `document.startViewTransition` in `onNavigate`.

**External APIs**: Use `event.fetch` to request from external API. Handle CORS by setting up proxy or API route at `src/routes/api/[...path]/+server.js`.

**Middleware**: For production with `adapter-node`, build middleware for custom server. For dev, add via Vite plugin.

**Yarn**: Yarn 2 Plug'n'Play broken with ESM; use `nodeLinker: 'node-modules'` in `.yarnrc.yml`.

**Integrations**: `vitePreprocess` (CSS preprocessors), `svelte-preprocess` (additional features), `npx sv add` (sets up integrations), Vite plugins.

**Debugging**: VSCode built-in debug terminal or `.vscode/launch.json`. Browser DevTools: `NODE_OPTIONS="--inspect" npm run dev`. WebStorm has built-in Svelte debugging.

**SvelteKit 2 breaking changes**: `error()` and `redirect()` no longer thrown; call directly. Cookies require explicit path. Top-level promises no longer auto-awaited. `goto()` no longer accepts external URLs. `paths.relative` defaults to `true`. `preloadCode()` arguments must be prefixed with `base`. `resolvePath()` → `resolveRoute()`. `handleError` receives `status` and `message`. Dynamic env vars cannot be used during prerendering. `use:enhance` `form` and `data` properties removed. File forms require `enctype="multipart/form-data"`. `tsconfig.json` stricter. Node 18.13+, svelte@4, vite@5, typescript@5. `$app/stores` deprecated (v2.12+); use `$app/state` instead.

**Sapper migration**: Add `"type": "module"` to `package.json`. Replace `sapper` with `@sveltejs/kit` and adapter. Update scripts. Replace webpack/rollup config with `svelte.config.js`. Migrate files: `src/client.js` → `+layout.svelte` `onMount`, `src/server.js` → custom server or no equivalent, `src/service-worker.js` → update imports, `src/template.html` → `src/app.html`. Routes: `routes/about.svelte` → `routes/about/+page.svelte`. Imports: `goto`, `prefetch`, `prefetchRoutes` from `@sapper/app` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`. Data loading: rename `preload` to `load`, move to `+page.js` or `+layout.js`, change from two arguments to single `event`. Stores: `page` still exists, `preloading` → `navigating`. Routing: regex routes removed, `segment` prop removed, relative URLs resolve against current page. Links: `sapper:prefetch` → `data-sveltekit-preload-data`. Endpoints: no longer receive Node's `req`/`res` directly.

**Glossary**:
- **CSR**: Page contents generated in browser
- **SSR**: Page contents generated on server (default, preferred)
- **Hybrid App**: SSR for initial load with CSR for subsequent navigations (SvelteKit default)
- **SPA**: Single empty HTML shell, all navigation client-side
- **MPA**: Traditional apps rendering each page on server
- **SSG**: Every page prerendered at build time
- **ISR**: Generate static pages on-demand without redeploying
- **Prerendering**: Computing page contents at build time and saving HTML
- **Hydration**: Server-rendered HTML enhanced on client
- **Routing**: Client-side routing intercepts navigation without server requests
- **Edge**: Rendering in CDN near user
- **PWA**: Web app using web APIs functioning like mobile/desktop apps

## API Reference
**Core exports**: `Server` class, `VERSION` string.

**Error handling & responses**: `error(status, body)`, `fail(status, data?)`, `redirect(status, location)`, `json(data, init?)`, `text(body, init?)`, `normalizeUrl(url)`, type guards: `isActionFailure(e)`, `isHttpError(e, status?)`, `isRedirect(e)`.

**Form actions**: `Action` type, `ActionFailure` interface, `ActionResult` union type.

**Adapters**: `Adapter` interface, `Builder` object with file ops, config access, path resolution, build generation, write artifacts, compression.

**Navigation & routing**: `Navigation` union, `NavigationBase`, `NavigationTarget`, `AfterNavigate`, `BeforeNavigate`, `Page` reactive object.

**Load functions**: `Load` generic type, `LoadEvent`, `ServerLoad`, `ServerLoadEvent`.

**Request handling**: `RequestEvent`, `RequestHandler`, `RequestOptions`.

**Cookies**: `Cookies` interface with `get()`, `getAll()`, `set()`, `delete()`, `serialize()`.

**Hooks**: `Handle`, `HandleClientError`, `HandleServerError`, `HandleFetch`, `HandleValidationError`, `ClientInit`, `ServerInit`, `Reroute`, `Transport`, `Transporter`.

**Remote functions**: `RemoteCommand`, `RemoteQuery`, `RemoteQueryFunction`, `RemoteForm`, `RemoteFormField`, `RemoteFormIssue`.

**Validation**: `Invalid` function and proxy.

**Misc types**: `Snapshot`, `ParamMatcher`, `Emulator`, `ResolveOptions`, `Prerendered`, `RouteDefinition`, `SSRManifest`, `ServerInitOptions`, `CspDirectives`, `HttpError`, `Redirect`, `Logger`, `MaybePromise`, `TrailingSlash`.

**Hooks helper**: `sequence(...handlers: Handle[]): Handle` chains multiple handle middleware.

**Node.js utilities**: `createReadableStream(file)`, `getRequest({request, base, bodySizeLimit})`, `setResponse(res, response)`, `installPolyfills()`.

**Vite integration**: `sveltekit()` returns `Promise<import('vite').Plugin[]>`.

**Environment & paths**: `$app/environment` (`browser`, `building`, `dev`, `version`), `$app/paths` (`asset()`, `resolve()`), `$app/forms` (`applyAction()`, `deserialize()`, `enhance()`), `$app/navigation` (`afterNavigate()`, `beforeNavigate()`, `disableScrollHandling()`, `goto()`, `invalidate()`, `invalidateAll()`, `onNavigate()`, `preloadCode()`, `preloadData()`, `pushState()`, `refreshAll()`, `replaceState()`), `$app/server` (`command()`, `form()`, `getRequestEvent()`, `prerender()`, `query()`, `query.batch()`, `read()`), `$app/state` (`navigating`, `page`, `updated`), `$app/stores` (deprecated), `$app/types` (auto-generated), `$env/dynamic/private`, `$env/dynamic/public`, `$env/static/private`, `$env/static/public`, `$lib`, `$service-worker`.

**Configuration** (svelte.config.js): `adapter`, `alias`, `appDir`, `csp`, `csrf`, `embedded`, `env`, `experimental`, `files`, `inlineStyleThreshold`, `moduleExtensions`, `outDir`, `output`, `paths`, `prerender`, `router`, `typescript`, `version`.

**Type definitions**: Generated `.svelte-kit/types/src/routes/[param]/$types.d.ts`, `app.d.ts` with `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform`, `$lib/server` subdirectory.

**CLI**: `vite dev`, `vite build`, `vite preview`, `svelte-kit sync`.