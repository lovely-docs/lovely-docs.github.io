## Getting Started
- Create projects with `npx sv create my-app`, dev server on localhost:5173
- Pages are Svelte components in `src/routes`, server-renders initially then client-side navigation
- Project structure: `src/lib` (utilities), `src/routes` (pages), `src/app.html` (template), `svelte.config.js` (config)

## Core Concepts
**Routing**: Filesystem-based with `+page.svelte`, `+layout.svelte`, `+server.js` files. Rest parameters `[...file]`, optional `[[lang]]`, matchers for validation, layout groups `(group)`.

**Load Functions**: `+page.server.js` (server-only, access cookies/locals) or `+page.js` (universal, runs on server then browser). Receive `url`, `params`, `fetch`, support `setHeaders()`, `await parent()`, `error()`, `redirect()`.

**Form Actions**: Export `actions` from `+page.server.js`, invoke with `<form method="POST" action="?/actionName">`. Return validation errors with `fail(status, data)`, use `use:enhance` for progressive enhancement.

**Page Options**: Export `prerender`, `ssr`, `csr`, `trailingSlash`, `config` from route files.

**State Management**: Server state via cookies/database (no shared variables), client state via Svelte context API, URL state via search parameters.

**Remote Functions**: Type-safe client-server via `.remote.js` files with `query()` (read, cached), `form()` (write via forms), `command()` (event handlers), `prerender()` (build-time).

## Build & Deploy
**Adapters**: Transform built apps for platforms. Official: `adapter-cloudflare`, `adapter-netlify`, `adapter-node`, `adapter-static`, `adapter-vercel`. Configure in `svelte.config.js`.

**Node**: `adapter-node` outputs to `build/`, deploy with `node build`. Environment: `PORT`, `HOST`, `ORIGIN`, proxy headers, graceful shutdown via `sveltekit:shutdown` event.

**Static**: `adapter-static` with `export const prerender = true` in root layout. Options: `pages`, `assets`, `fallback` (SPA), `precompress`.

**SPA**: Disable SSR with `export const ssr = false`, use `adapter-static` with `fallback: '200.html'`. Performance drawback; prerender as many pages as possible.

**Cloudflare**: `adapter-cloudflare`, create `wrangler.jsonc`, access bindings via `platform.env`. Test with `wrangler dev .svelte-kit/cloudflare`.

**Netlify**: `adapter-netlify`, create `netlify.toml`. Options: `edge` (Deno functions), `split` (multiple functions). Access context via `event.platform?.context`.

**Vercel**: `adapter-vercel`, control routes via `export const config` with `runtime`, `regions`, `memory`, `maxDuration`. Image optimization and ISR support.

**Custom Adapters**: Export function returning `{name, adapt(builder), emulate?, supports?}`. `adapt()` calls `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`, generates output code importing `Server`.

## Advanced Features
**Advanced Routing**: Rest `[...file]`, optional `[[lang]]`, matchers `src/params/fruit.js`, layout groups `(group)`, breaking layouts `+page@segment`.

**Hooks**: Server `handle()` (every request), `handleFetch()` (modify fetch), `handleValidationError()`, `handleError()`. Universal `reroute()` (change URL mapping), `transport` (custom encoders).

**Errors**: Use `error(status, body)` for expected errors, renders `+error.svelte`. Unexpected errors logged via `handleError()` hook. Fallback `src/error.html` with `%sveltekit.status%`, `%sveltekit.error.message%`.

**Link Options**: `data-sveltekit-preload-data="hover|tap"`, `data-sveltekit-preload-code="eager|viewport|hover|tap"`, `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll`.

**Service Workers**: Auto-bundles `src/service-worker.js`. Access `$service-worker` module for `build`, `files`, `version`, `prerendered` paths.

**Server-only Modules**: Mark with `.server` suffix or place in `$lib/server/`. `$env/static/private` and `$env/dynamic/private` only importable server-side.

**Snapshots**: Preserve DOM state across navigation via `export const snapshot = {capture(), restore(value)}` in `+page.svelte`.

**Shallow Routing**: `pushState(url, state)`, `replaceState(url, state)` for modals/overlays without full navigation. Access via `page.state`.

**Observability**: Enable OpenTelemetry in `svelte.config.js` with `experimental.tracing.server`, access spans via `event.tracing.root`.

**Packaging**: `@sveltejs/package` builds component libraries. `src/lib` is public, generates `dist` with preprocessed components. Configure `package.json` exports with `types` and `svelte` conditions.

## Best Practices
**Authentication**: Use Lucia for session-based auth. Sessions stored in database, validated in server hooks, user info in `locals`.

**Performance**: SvelteKit auto-optimizes: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, prerendering, link preloading. Use `@sveltejs/enhanced-img` for images (auto format, responsive sizing). Compress videos to `.webm`/`.mp4`. Subset fonts, preload via `handle` hook. Diagnose with PageSpeed Insights, WebPageTest, browser devtools (test in preview mode).

**Icons**: Use Iconify for CSS-based icons, avoid Svelte icon libraries.

**Images**: Vite auto-processes imported assets with hashing. `@sveltejs/enhanced-img` generates optimal formats (avif, webp), multiple sizes. Dynamic selection: `<enhanced:img src="./image.jpg?w=1280;640;400" sizes="..." />`. CDN-based via `@unpic/svelte`.

**Accessibility**: SvelteKit injects live region for route announcements. Set unique titles with `<svelte:head><title>Page Title</title></svelte:head>`. Focus management: SvelteKit focuses `<body>` after navigation. Set `lang` attribute on `<html>`.

**SEO**: SSR enabled by default. Every page needs unique `<title>` and `<meta name="description">`. Return SEO data from load functions. Dynamic sitemaps via `src/routes/sitemap.xml/+server.js`.

## API Reference
**Core Exports**: `Server` class, response helpers `json()`, `text()`, `error()`, `redirect()`, `fail()`, type guards `isHttpError()`, `isRedirect()`, `isActionFailure()`.

**RequestEvent**: `cookies`, `fetch`, `params`, `url`, `locals`, `platform`, `request`, `setHeaders()`, `getClientAddress()`, `isDataRequest`, `isSubRequest`, `isRemoteRequest`, `tracing`.

**LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`.

**Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`.

**Navigation**: `afterNavigate(callback)`, `beforeNavigate(callback)`, `goto(url, opts)`, `invalidate(resource)`, `invalidateAll()`, `onNavigate(callback)`, `preloadCode(pathname)`, `preloadData(href)`, `pushState(url, state)`, `replaceState(url, state)`.

**Forms**: `enhance(form)` for progressive enhancement, `applyAction(result)`, `deserialize(text)`.

**App State** (`$app/state`): `navigating`, `page`, `updated` reactive objects.

**Environment**: `$env/static/public`, `$env/static/private`, `$env/dynamic/public`, `$env/dynamic/private`.

**Configuration** (`svelte.config.js`): `adapter`, `alias`, `appDir`, `csp`, `csrf`, `env`, `experimental`, `inlineStyleThreshold`, `outDir`, `output`, `paths`, `prerender`, `router`, `typescript`, `version`.

**Types** (auto-generated): `Asset`, `RouteId`, `Pathname`, `RouteParams`, `PageData`, `LayoutData`, `ActionData`, `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform`.

**CLI**: `vite dev`, `vite build`, `vite preview`, `svelte-kit sync`.

**Utilities**: `$app/environment` (`browser`, `building`, `dev`, `version`), `$lib` alias, `Cookies`, `Invalid`, `Snapshot`, `ParamMatcher`, `SubmitFunction`.

## Migration
**From Sapper**: Add `"type": "module"` to `package.json`. Replace `sapper` with `@sveltejs/kit` and adapter. Routes: `routes/about/index.svelte` → `routes/about/+page.svelte`. Imports: `@sapper/app` → `$app/navigation`, `preload` → `load` function. Stores: `page` still exists, `preloading` → `navigating`.

**To v2**: `error()` and `redirect()` no longer need throwing. `cookies.set()` requires `path` parameter. No auto-await of top-level promises in load functions. `goto()` rejects external URLs. `state` object determines `$page.state`. Dynamic env vars can't be used during prerendering. Forms: `form` and `data` removed from `use:enhance` callbacks. Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+.

## Glossary
**Rendering**: CSR (browser), SSR (server), Hybrid (SSR initial + CSR navigation, SvelteKit default), SPA (client-only), MPA (traditional server-rendered).

**Static Generation**: SSG (all pages prerendered), Prerendering (computed at build time), ISR (on-demand without redeploying).

**Other**: Hydration (server HTML + client interactivity), Edge Rendering (CDN near user), Routing (client-side interception by default), PWA (web APIs like native app).