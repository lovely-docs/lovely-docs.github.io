## Getting Started
Create projects with `npx sv create my-app`. Project structure includes `src/routes/` for pages, `src/lib/` for shared code, `src/app.html` template, `src/hooks.server.js`/`src/hooks.client.js` for lifecycle hooks, and `static/` for assets.

SvelteKit supports SSR+CSR (default), static generation, SPAs, and multi-page apps. Deploy via adapters: `adapter-node` for servers, `adapter-static` for static sites, `adapter-vercel`/`adapter-netlify`/`adapter-cloudflare` for serverless.

Uses standard Web APIs: Fetch, Request/Response, Headers, FormData, Streams, URL, Web Crypto. Special fetch in load functions and server hooks allows direct endpoint invocation during SSR without HTTP calls.

## Core Concepts
Routes defined by `src/routes` directory structure with `+` prefixed files: `+page.svelte` for pages, `+page.js`/`+page.server.js` for load functions, `+layout.svelte` for layouts, `+server.js` for API endpoints, `+error.svelte` for errors.

Load functions run on server and/or browser, access `params`, `url`, `route`, `cookies`, set headers, access parent data, stream promises. Server-only load functions must return serializable data.

Form actions exported from `+page.server.js` handle POST requests. Read form data, return results/errors with `fail()`, redirect with `redirect()`. Use `use:enhance` directive for client-side handling without full-page reloads.

Page options: `prerender = true/'auto'` generates static HTML at build time, `ssr = false` skips server rendering, `csr = false` disables client-side rendering, `trailingSlash` controls URL behavior, `config` for adapter-specific settings.

Avoid shared state on server; use cookies and databases. Don't write to stores in load functions—return data instead. Store persistent state in URL search parameters. Preserve ephemeral UI state with snapshots.

Remote functions provide type-safe client-server communication: `query` (read), `form` (write with progressive enhancement), `command` (write from anywhere), `prerender` (build-time data). Enable with `kit: { experimental: { remoteFunctions: true } }`.

## Build & Deploy
SvelteKit builds in two stages: Vite optimizes code, then adapter tunes for target environment. Prevent code execution during build by checking `building` from `$app/environment`.

**adapter-auto** automatically detects correct adapter (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS SST, Google Cloud Run).

**Node servers** (`adapter-node`): Build with `npm run build`, deploy `build/`, `package.json`, `node_modules/`. Start with `node build`. Configure via environment: `PORT` (3000), `HOST` (0.0.0.0), `ORIGIN`, reverse proxy headers (`PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`), client IP (`ADDRESS_HEADER`, `XFF_DEPTH`), `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s). Supports graceful shutdown via `sveltekit:shutdown` event.

**Static sites** (`adapter-static`): Set `prerender = true` in root layout. Configure `pages`, `assets`, `fallback` (for SPA), `precompress`, `strict`. For GitHub Pages, set `paths.base` to repo name and generate `404.html` fallback.

**Single-page apps** (`adapter-static`): Disable SSR globally with `export const ssr = false` in root layout, use fallback page. Prerender specific pages by enabling SSR and `export const prerender = true` for those routes.

**Cloudflare** (`adapter-cloudflare`): Configure fallback (`'plaintext'` or `'spa'`), customize `_routes.json` with `include`/`exclude` (max 100 rules). Access runtime APIs via `platform?.env`. Test locally with `wrangler dev .svelte-kit/cloudflare`.

**Netlify** (`adapter-netlify`): Use `edge: true` for Deno-based edge functions, `split: true` for function splitting. Access context via `event.platform?.context`. Use `_redirects` file for redirects. Use `read()` from `$app/server` instead of `fs`.

**Vercel** (`adapter-vercel`): Set options via `export const config` in route files: `runtime` (`'edge'` or `'nodejs20.x'`/`'nodejs22.x'`), `regions`, `split`, `memory` (128-3008 MB), `maxDuration`. ISR: `expiration`, `bypassToken`, `allowQuery`. Bypass cache with `__prerender_bypass=<token>` cookie or `x-prerender-revalidate` header. Configure image optimization with `sizes`, `formats`, `minimumCacheTTL`, `domains`.

Custom adapters implement Adapter API by exporting function returning object with `name` and `adapt(builder)` methods. The `adapt` method must clear build directory, write output via `builder.writeClient/Server/Prerendered()`, generate code importing `Server`, instantiate with `builder.generateManifest()`, listen for requests, convert to `Request`, call `server.respond(request, { getClientAddress })`, expose platform via `platform` option, shim `fetch` if needed, bundle output, and place files correctly.

## Advanced Techniques
**Routing**: Rest parameters `[...file]` capture variable segments. Optional parameters `[[lang]]/home` match both `home` and `en/home`. Matchers created in `src/params/fruit.js` with `match(param)` function, used as `[page=fruit]`. Route sorting: specificity > matchers > optional/rest > alphabetical. Encoding: `[x+3a]` for `:`, `[x+2f]` for `/`. Layout groups `(app)` and `(marketing)` organize routes without URL changes. Use `+page@(app).svelte` to inherit from specific layout.

**Hooks**: Server hooks `handle` intercepts every request, `handleFetch` intercepts `event.fetch` calls, `handleValidationError` customizes validation errors. Shared hook `handleError` logs errors and returns safe representation for `$page.error`. Universal hook `reroute` translates URLs to routes, `transport` encodes/decodes custom types. Files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js`.

**Error Handling**: Use `error(404, 'Not found')` or `error(404, { message: 'Not found', code: 'NOT_FOUND' })` for expected errors. Unexpected errors show generic message and pass through `handleError` hook. Declare custom error properties in `src/app.d.ts`. Customize fallback page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders.

**Link Navigation**: Control with `data-sveltekit-*` attributes: `data-sveltekit-preload-data` (`"hover"` or `"tap"`), `data-sveltekit-preload-code` (`"eager"`, `"viewport"`, `"hover"`, or `"tap"`), `data-sveltekit-reload` (force full-page), `data-sveltekit-replacestate` (replace history), `data-sveltekit-keepfocus` (retain focus), `data-sveltekit-noscroll` (prevent scroll). Disable with `"false"` value.

**Service Workers**: SvelteKit automatically registers `src/service-worker.js`. Access `$service-worker` module for build files, static assets, version, and base path. Implement install/activate/fetch handlers to cache assets and handle offline requests. Use version string for unique cache names.

**Server-Only Modules**: Mark modules as server-only using `.server` filename suffix or `$lib/server/` directory to prevent sensitive data leaking to browser. SvelteKit errors if any import chain from client code reaches server-only modules.

**Snapshots**: Export `snapshot` object with `capture()` and `restore()` methods from `+page.svelte` or `+layout.svelte` to preserve DOM state across navigation.

**Shallow Routing**: Use `pushState()` and `replaceState()` from `$app/navigation` to create history entries without navigating. Preload data before pushing state with `preloadData(href)`. Caveat: `page.state` is empty during SSR and initial page load. Requires JavaScript.

**Observability**: Enable OpenTelemetry in `svelte.config.js` with `kit: { experimental: { tracing: { server: true }, instrumentation: { server: true } } }`. Create `src/instrumentation.server.ts` for tracing setup. SvelteKit emits spans for `handle` hooks, `load` functions, form actions, and remote functions. Access spans via `event.tracing.root` and `event.tracing.current`.

**Component Libraries**: Use `@sveltejs/package` to build libraries with `src/lib` as public-facing code. Configure `package.json` exports with `types` and `svelte` conditions. Include `dist` folder in `files`. Mark CSS as having side effects: `["**/*.css"]`. Type definitions auto-generate. Avoid SvelteKit-specific modules; use `esm-env` or pass values as props. All relative imports need full paths with extensions.

## Best Practices
**Authentication**: Sessions are revocable but require DB queries; JWT offer better latency but can't be revoked. Check auth cookies in server hooks and store user info in `locals`. Use framework-specific libraries like Lucia.

**Performance**: SvelteKit handles code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading. Diagnose with PageSpeed Insights, WebPageTest, or browser devtools. Instrument slow APIs with OpenTelemetry or Server-Timing headers. Optimize images with `@sveltejs/enhanced-img`, compress videos to `.webm`/`.mp4` with lazy-loading, preload fonts via `resolve` with `preload` filter in `handle` hook. Find large packages with `rollup-plugin-visualizer`. Replace JS analytics with server-side solutions. Use Partytown for third-party scripts. Use dynamic `import(...)` for conditional code. Preload links (default enabled), return promises from `load` for streaming non-essential data, use server `load` instead of universal to avoid waterfalls. Deploy frontend near backend or use edge deployment, serve images from CDN, use HTTP/2+.

**Icons**: Use Iconify for CSS-based icons. Avoid icon libraries with one `.svelte` file per icon as they slow down Vite's dependency optimization.

**Images**: Vite auto-processes imported assets with hashing and inlining. `@sveltejs/enhanced-img` generates avif/webp formats, multiple sizes, and intrinsic dimensions. For dynamic/external images use `@unpic/svelte` or provider-specific libraries. Serve via CDN, provide 2x resolution images, set `fetchpriority="high"` for LCP images.

**Accessibility**: Every page needs unique `<title>` in `<svelte:head>` for screen reader announcements. SvelteKit focuses `<body>` after navigation (or `autofocus` element if present). Customize with `afterNavigate` hook. Set `lang` attribute on `<html>` in `src/app.html` or dynamically via `handle` hook.

**SEO**: SSR enabled by default with minimal performance overhead and automatic trailing slash normalization. Add unique `<title>` and `<meta name="description">` to each page in `<svelte:head>`. Create sitemaps via `src/routes/sitemap.xml/+server.js` endpoint. For AMP support, set `inlineStyleThreshold: Infinity`, disable `csr`, add `amp` to `<html>`, and transform with `@sveltejs/amp` in hooks.

## Reference & Appendix
**FAQs**: Import JSON with `import pkg from './package.json' with { type: 'json' };`. Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` for Yarn 2/3 ESM support. Validate libraries with publint.dev. Ensure `exports` field, correct file extensions (`.mjs`/`.cjs`), and ship Svelte components as uncompiled `.svelte` files.

**View Transitions**:
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

**Database**: Put queries in server routes, create `db.js` singleton, use `hooks.server.js` for setup.

**Client-side Libraries**: Use `import { browser } from '$app/environment'` check, `onMount`, or `{#await}` blocks.

**Backend API Proxy**: Use `event.fetch` in dev/prod, or set up proxy with `server.proxy` in dev and rewrite paths in production.

**Middleware**: Use Vite plugin with `configureServer` in dev; use adapter-node in production.

**Integrations**: `vitePreprocess` enables CSS preprocessors (PostCSS, SCSS, Less, Stylus, SugarSS). Included by default with TypeScript. Use `vitePreprocess({ script: true })` for complex TypeScript in Svelte 5. `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook. Alternative preprocessors: `svelte-preprocess` supports Pug, Babel, global styles.

**Debugging**: VSCode: Debug terminal via `CMD/Ctrl + Shift + P` → "Debug: JavaScript Debug Terminal" → `npm run dev`, or use `.vscode/launch.json` with `"type": "node-terminal"` and press `F5`. Browser DevTools: Run `NODE_OPTIONS="--inspect" npm run dev`, open `localhost:5173`, click "Open dedicated DevTools for Node.js", or navigate to `chrome://inspect`.

**Migration v1→v2**: `error()` and `redirect()` no longer need `throw`. `cookies.set/delete` require `path` parameter. Top-level promises must be explicitly `await`ed. `goto()` rejects external URLs. `preloadCode` requires `base` prefix. `resolvePath` → `resolveRoute`. Dynamic env vars blocked during prerendering. `$app/stores` deprecated → use `$app/state`. Forms with file inputs need `enctype="multipart/form-data"`. Requires Node 18.13+, Svelte 4, Vite 5, TypeScript 5. Run `npx sv migrate sveltekit-2`.

**Migration Sapper→SvelteKit**: Add `"type": "module"` to package.json. Replace `sapper` with `@sveltejs/kit` + adapter. `sapper build/dev/export` → `vite build/dev`. Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`. `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`, `routes/about.svelte` → `routes/about/+page.svelte`. `preload` → `load` function in `+page.js`/`+layout.js` with single `event` argument. `@sapper/app` imports → `goto`, `preloadData`, `preloadCode` from `$app/navigation`. `stores()` → import `navigating`, `page` from `$app/stores`. No `req`/`res` access; `fetch` available globally. Relative URLs resolve against current page, not base URL.

**Glossary**:
- **CSR**: Browser-based rendering (disable with `csr = false`)
- **SSR**: Server-side rendering (disable with `ssr = false`)
- **Hybrid**: Default SvelteKit mode (SSR initial + CSR navigation)
- **SPA**: Single HTML shell with client-side routing (`adapter-static`)
- **SSG**: All pages prerendered (`adapter-static` or `prerender` option)
- **ISR**: On-demand static generation (`adapter-vercel`)
- **Hydration**: Server data transmitted with HTML; components initialize without re-fetching; event listeners attached
- **Prerendering**: Build-time HTML generation; must return same content for all users; no form actions
- **Edge Rendering**: CDN-based rendering near users
- **Routing**: Client-side navigation by default; skip with `data-sveltekit-reload`
- **PWA**: Installable web app with offline capabilities via service workers
- **MPA**: Traditional server-rendered multi-page applications

**Runtime Modules**:
- `$app/environment` - Environment variables and runtime information
- `$app/navigation` - `goto()`, `invalidateAll()`, `invalidate(url)`
- `$app/paths` - `base` and `assets` paths
- `$app/forms` - Form submission utilities
- `$app/state` - Read-only state: `page`, `navigating`, `updated`
- `$app/stores` - Legacy store-based state
- `$app/server` - Server-only utilities
- `$service-worker` - Service worker functionality

**Environment Variables**:
- `$env/static/public` - Public variables (prefixed `PUBLIC_`) injected at build time
- `$env/static/private` - Private variables statically replaced at build time, server-only
- `$env/dynamic/public` - Runtime access to public variables
- `$env/dynamic/private` - Runtime access to private variables on server side

**Type Safety**: `$app/types` exports auto-generated utilities: `Asset`, `RouteId`, `Pathname`, `ResolvedPathname`, `RouteParams<'/blog/[slug]'>` → `{ slug: string }`, `LayoutParams`. Generated `.d.ts` files export typed `RequestHandler`, `Load`, `PageData`, `LayoutData`, `ActionData`. Helper types `PageProps` and `LayoutProps` (v2.16.0+) combine data with form/children.

**Configuration**: `svelte.config.js` for project configuration with `kit` property. `svelte-kit sync` generates `tsconfig.json` and `./$types` definitions. `$lib` automatic import alias for `src/lib` directory (customizable).