
## Directories

### getting_started
Foundation for creating and configuring SvelteKit projects with rendering patterns, project structure, and Web API usage.

## Project Creation

Run `npx sv create my-app` to scaffold a new SvelteKit project. Start the dev server with `npm run dev` on localhost:5173.

## Core Architecture

- Pages are Svelte components in `src/routes`
- Server-renders on first visit for SEO/performance, then client-side app takes over
- Use Visual Studio Code with Svelte extension

## Project Structure

```
src/
├ lib/              # Utilities, components (via $lib)
│ └ server/         # Server-only code (via $lib/server)
├ params/           # Param matchers
├ routes/           # Application routes
├ app.html          # Page template with %sveltekit.head%, %sveltekit.body%, %sveltekit.assets%, %sveltekit.nonce%, %sveltekit.env.[NAME]%, %sveltekit.version%
├ error.html        # Error page with %sveltekit.status%, %sveltekit.error.message%
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
package.json        # Requires @sveltejs/kit, svelte, vite as devDependencies
svelte.config.js    # Configuration
tsconfig.json       # Extends .svelte-kit/tsconfig.json
vite.config.js      # Uses @sveltejs/kit/vite plugin
```

## Rendering & Deployment Patterns

**Default**: SSR initial load, then CSR for navigation

**Static**: `adapter-static` for prerendering, or `prerender` option for selective pages. `adapter-vercel` supports ISR.

**SPA**: Client-side only with `adapter-auto` or serverless adapters

**Multi-page**: Set `csr = false` to render subsequent links on server, or use `data-sveltekit-reload` for specific links

**Separate backend**: Use `adapter-node` or serverless adapters

**Serverless**: `adapter-auto` (zero-config), `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`

**Own server/VPS/Container**: `adapter-node`

**Library**: `@sveltejs/package` with `sv create` library option

**PWA/Offline**: Full service worker support

**Mobile/Desktop**: Convert SPA with Tauri, Capacitor, Wails, or Electron. Use `bundleStrategy: 'single'` for HTTP/1 limitations

**Browser extension**: `adapter-static` or community adapters

**Embedded device**: `bundleStrategy: 'single'` to reduce concurrent requests

## Web APIs

SvelteKit builds on standard Web APIs: Fetch, Request, Response, Headers, FormData, Streams, URL, Web Crypto.

**Fetch**: Available in hooks, server routes, and browser. Special version in `load` functions and server hooks allows direct endpoint invocation during SSR without HTTP calls. Server-side `fetch` outside `load` requires explicit `cookie`/`authorization` headers. Relative URLs supported in `load` functions only.

**Request/Response**: Accessible as `event.request` in hooks and server routes. Handlers in `+server.js` return Response objects.

**Headers**: Read from `request.headers`, set in response:
```js
import { json } from '@sveltejs/kit';
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```

**FormData**: Handle form submissions:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses

**URL**: Access query parameters via `url.searchParams` (URLSearchParams)

**Web Crypto**: `crypto.randomUUID()` for UUID generation

### core_concepts
Core routing, data loading, form handling, and state management patterns in SvelteKit with type-safe remote functions for client-server communication.

## Routing

Filesystem-based routing in `src/routes` with `+` prefixed files:
- `+page.svelte` - page component receiving `data` prop
- `+page.js` / `+page.server.js` - export `load()` function for data fetching
- `+layout.svelte` / `+layout.js` / `+layout.server.js` - wrap pages with `{@render children()}`
- `+error.svelte` - error boundary
- `+server.js` - API routes exporting HTTP handlers (`GET`, `POST`, etc.)

All files run on server; all run on client except `+server` files. Layouts and error boundaries apply to subdirectories.

## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js` to fetch data before rendering.

**Server load** (`+page.server.js`, `+layout.server.js`):
- Always runs on server
- Access to `cookies`, `locals`, `request`, `platform`, `clientAddress`
- Must return serializable data

**Universal load** (`+page.js`, `+layout.js`):
- Runs on server during SSR, then in browser on navigation
- Can return non-serializable data

Load functions receive `url`, `route`, `params`, and a `fetch` function that inherits cookies and caches responses. Use `setHeaders()` for caching, `await parent()` for parent data, `error()` to throw errors, `redirect()` to redirect. Server loads can return unresolved promises for streaming.

Rerun when referenced `params` or `url` properties change, or when dependencies declared via `fetch(url)` or `depends(url)` are invalidated with `invalidate(url)` or `invalidateAll()`.

## Form Actions

Export `actions` from `+page.server.js` to handle form submissions server-side:

```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    if (!data.get('email')) return fail(400, { missing: true });
    cookies.set('sessionid', token, { path: '/' });
    return { success: true };
  }
};
```

Invoke with `<form method="POST" action="?/login">` or `<button formaction="?/register">`. Return validation errors with `fail(status, data)`. Use `redirect()` to redirect after action. Use `use:enhance` directive for progressive enhancement without full-page reload.

## Page Options

Export from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`:
- `prerender` - generate static HTML at build time; export `entries()` for dynamic routes
- `ssr` - disable server-side rendering
- `csr` - disable client-side rendering (HTML/CSS only)
- `trailingSlash` - `'never'` (default), `'always'`, or `'ignore'`
- `config` - adapter-specific configuration

## State Management

**Server**: Don't store shared state in variables; use cookies and databases. Load functions should be pure without side effects.

**Client**: Use Svelte's context API to pass state through component tree. Component state persists across navigation; use `$derived` for reactive values or `{#key}` to force remounting.

**URL**: Store state affecting SSR or surviving reloads in URL search parameters via `goto('?sort=price')`.

## Remote Functions

Type-safe client-server communication via `.remote.js`/`.remote.ts` files (enable in `svelte.config.js`):

```js
export const getPost = query(v.string(), async (slug) => {
  const post = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404);
  return post;
});

export const createPost = form(
  v.object({ title: v.string(), content: v.string() }),
  async ({ title, content }) => {
    await db.sql`INSERT INTO post VALUES (${title}, ${content})`;
    redirect(303, '/blog');
  }
);

export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});
```

- `query()` - reads data, caches per page, supports `.refresh()` and `.batch()` for n+1 solutions
- `form()` - writes via HTML forms with progressive enhancement, validates with schema
- `command()` - callable from event handlers, not tied to elements
- `prerender()` - invokes at build time for static data

All accept Standard Schema (Zod, Valibot) for validation.

### build_and_deploy
Comprehensive guide to building and deploying SvelteKit applications with official adapters for various platforms and instructions for writing custom adapters.

## Build Process

SvelteKit builds in two stages: Vite optimization (server, browser, service worker code and prerendering), then adapter-specific tuning for the target environment.

Code in `+page/layout(.server).js` files runs during build for analysis. Prevent unwanted execution by checking the `building` flag:

```js
import { building } from '$app/environment';
if (!building) {
	setupMyDatabase();
}
```

Preview builds locally with `vite preview` (doesn't reproduce adapter-specific features like `platform` object).

## Adapters

Adapters transform built SvelteKit apps for deployment to specific platforms. Official adapters: `adapter-cloudflare`, `adapter-netlify`, `adapter-node`, `adapter-static`, `adapter-vercel`.

Configure in `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-node';
const config = { kit: { adapter: adapter({ /* options */ }) } };
export default config;
```

Adapters provide platform-specific context via `platform` property in `RequestEvent`.

## adapter-auto

Default adapter that automatically detects deployment environment (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS SST, Google Cloud Run) and uses the correct adapter. Install the specific adapter to `devDependencies` for environment-specific configuration.

## Node Servers

Install `@sveltejs/adapter-node`. Build outputs to `build/` directory. Deploy `build/`, `package.json`, and production dependencies. Start with `node build`.

Environment variables:
- `PORT` (default 3000), `HOST` (default 0.0.0.0)
- `ORIGIN`: deployment URL
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`: for reverse proxies
- `ADDRESS_HEADER`: read client IP from header
- `XFF_DEPTH`: number of trusted proxies for `X-Forwarded-For`
- `BODY_SIZE_LIMIT`: max request body (default 512kb)
- `SHUTDOWN_TIMEOUT`: seconds before force-closing connections (default 30)

Adapter options: `out` (output directory), `precompress` (gzip/brotli), `envPrefix` (variable prefix).

Graceful shutdown via `sveltekit:shutdown` event:
```js
process.on('sveltekit:shutdown', async (reason) => {
	await db.close();
});
```

Custom server with Express:
```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

## Static Site Generation

Install `@sveltejs/adapter-static`. Add `export const prerender = true;` to root layout.

Configuration options: `pages` (output directory), `assets` (static assets directory), `fallback` (SPA fallback page), `precompress` (generate `.br` and `.gz` files), `strict` (validate all pages prerendered).

Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a` requests.

GitHub Pages deployment: set `config.kit.paths.base` to repo name and add `.nojekyll` file to `static/` directory.

## Single-Page Apps

Disable SSR in root layout:
```js
export const ssr = false;
```

Use `adapter-static` with fallback:
```js
adapter({ fallback: '200.html' })
```

Optionally prerender specific pages by re-enabling SSR and adding `export const prerender = true;` to those routes.

SPAs have significant performance drawbacks (multiple network round trips, poor Core Web Vitals, SEO harm). Prerender as many pages as possible; if all pages can be prerendered, use static site generation instead.

## Cloudflare

Install `@sveltejs/adapter-cloudflare`. Create `wrangler.jsonc`:
```jsonc
{
	"name": "<any-name>",
	"main": ".svelte-kit/cloudflare/_worker.js",
	"compatibility_date": "2025-01-01",
	"assets": {
		"binding": "ASSETS",
		"directory": ".svelte-kit/cloudflare"
	}
}
```

Adapter options: `config` (Wrangler config path), `platformProxy` (emulated `platform.env` preferences), `fallback` (`'plaintext'` or `'spa'`), `routes` (customize `_routes.json` patterns).

Access Cloudflare bindings via `platform.env`:
```ts
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

Install `@cloudflare/workers-types` and reference in `src/app.d.ts`. Test with `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

Troubleshooting: add `"compatibility_flags": ["nodejs_compat"]` for Node.js compatibility; import large libraries client-side only; use `read()` from `$app/server` instead of `fs`; use `_headers` and `_redirects` files for static assets.

## Netlify

Install `@sveltejs/adapter-netlify`. Create `netlify.toml`:
```toml
[build]
	command = "npm run build"
	publish = "build"
```

Adapter options: `edge` (use Deno-based edge functions), `split` (split app into multiple functions).

Access Netlify context via `event.platform?.context` in server endpoints. Use `_headers` and `_redirects` files for static assets. Create HTML forms with `form-name` input and prerender with `export const prerender = true;`.

Troubleshooting: use `read()` from `$app/server` instead of `fs` in edge deployments; serverless deployments don't copy files.

## Vercel

Install `@sveltejs/adapter-vercel`. Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:

```js
export const config = {
	runtime: 'edge',
	regions: ['iad1'],
	memory: 1024,
	maxDuration: 15
};
```

Image optimization:
```js
adapter({
	images: {
		sizes: [640, 828, 1200, 1920, 3840],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 300,
		domains: ['example-app.vercel.app']
	}
})
```

Incremental Static Regeneration (ISR):
```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

Environment variables via `$env/static/private` and `$env/dynamic/private`. Use `$env/static/private` for static replacement and dead code elimination.

Troubleshooting: use `read()` from `$app/server` instead of `fs`; implement `/api/*` requests as SvelteKit API routes.

## Writing Custom Adapters

Adapter packages export a default function returning an `Adapter` object with:
- `name`: string identifier
- `adapt(builder)`: async function implementing the adapter
- `emulate()` (optional): returns platform-specific context
- `supports` (optional): object with feature support methods

The `adapt` method should:
1. Clear build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Generate output code that imports `Server`, creates app instance with manifest, listens for requests, converts to `Request` objects, calls `server.respond(request, { getClientAddress })`, passes platform info via `platform` option
4. Bundle output if necessary
5. Place static files and generated code in platform-appropriate locations

Reference existing adapters as templates.

### advanced_features
Advanced SvelteKit features for routing, hooks, error handling, service workers, server-only modules, state management, observability, and component library packaging.

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

### best_practices
Practical guidance on authentication, performance optimization, accessibility, SEO, and asset handling in SvelteKit applications.

## Authentication
Use Lucia for session-based auth in SvelteKit. Sessions are stored in database and can be immediately revoked; JWTs cannot be revoked but have lower latency. Auth cookies are validated in server hooks and user info stored in `locals`.

## Performance
SvelteKit provides automatic optimizations: code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

Diagnose with PageSpeed Insights, WebPageTest, or browser devtools (test in preview mode, not dev). Use OpenTelemetry or Server-Timing headers for slow API calls.

**Assets**: Use `@sveltejs/enhanced-img` for images (auto format conversion, responsive sizing, layout shift prevention). Compress videos to `.webm`/`.mp4` with Handbrake; lazy-load with `preload="none"`. Subset fonts and preload via `handle` hook's `resolve` with `preload` filter.

**Code size**: Upgrade Svelte version, use `rollup-plugin-visualizer` to identify large packages, replace JS analytics with server-side implementations, use Partytown for third-party scripts, use dynamic `import()` for conditional code.

**Navigation**: Preload code/data for client-side navigation via link options. Return promises from `load` functions to stream results. Prevent waterfalls by using server `load` functions instead of universal ones, and database joins instead of multiple queries.

**Hosting**: Colocate frontend/backend, deploy to edge for distributed users, serve images from CDN, use HTTP/2+.

## Icons
Use Iconify for CSS-based icons. Avoid Svelte icon libraries with one `.svelte` file per icon as they slow Vite's dependency optimization.

## Images
**Vite built-in**: Automatically processes imported assets, adds hashes, inlines small assets.
```svelte
import logo from '$lib/assets/logo.png';
<img alt="Logo" src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin generating optimal formats (avif, webp), multiple sizes, intrinsic dimensions. Install, add `enhancedImages()` before `sveltekit()` in vite.config.js.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

With dynamic selection and transforms:
```svelte
import MyImage from './image.jpg?enhanced';
<enhanced:img src={MyImage} alt="text" sizes="min(1280px, 100vw)" />
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" />
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

**CDN-based**: For runtime images not available at build time. Use `@unpic/svelte` or provider-specific libraries.

Best practices: Mix approaches in one project, serve all images via CDN, provide 2x resolution for HiDPI, use `sizes` for large images, set `fetchpriority="high"` for LCP images, prevent layout shift with width/height, provide good alt text.

## Accessibility
SvelteKit injects a live region that reads page titles to announce route changes. Set unique titles with `<svelte:head><title>Page Title</title></svelte:head>`.

Focus management: SvelteKit focuses `<body>` after navigation; customize with `afterNavigate` hook or use `goto` with `keepFocus` option.

Set `lang` attribute on `<html>` element. For multi-language, use server-side `handle` hook to replace `%lang%` placeholder.

## SEO
SSR is enabled by default and should remain on. Core Web Vitals impact rankings; use hybrid rendering and optimize images.

Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Return SEO data from page `load` functions and use in root layout.

Create dynamic sitemaps via `src/routes/sitemap.xml/+server.js`:
```js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
			<!-- url elements -->
		</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

AMP support: Set `inlineStyleThreshold: Infinity`, disable `csr` in root layout, add `amp` attribute to `<html>`, transform HTML in `src/hooks.server.js` using `@sveltejs/amp`.

### appendix
Reference documentation covering FAQs, integrations, debugging, migration guides from Sapper and v1, and terminology for SvelteKit development.

## Common Questions

**Package Management**
- Import JSON: `import pkg from './package.json' with { type: 'json' };`
- Library packaging: check publint.dev; `exports` field takes precedence; Svelte components distributed as uncompiled `.svelte` files with ESM-only JS; use `svelte-package`
- Yarn 2: use `nodeLinker: 'node-modules'`; Yarn 3: add `nodeLinker: node-modules` to `.yarnrc.yml`

**Database & APIs**
- Query databases in server routes via `db.js` singleton; use `hooks.server.js` for setup
- External APIs: use `event.fetch` with proxy or API route; handle CORS via rewrite rules
- Client-side library access: wrap in `browser` check or use `onMount`/dynamic imports

**View Transitions**
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

**Middleware**
- Production: use `adapter-node`
- Development: add Vite plugin with `configureServer`

## Integrations

**vitePreprocess** (default for TypeScript projects)
- Enables CSS preprocessing: PostCSS, SCSS, Less, Stylus, SugarSS
- TypeScript: native in Svelte 5 for type syntax; use `vitePreprocess({ script: true })` for complex TypeScript

**Add-ons**
- Install via `npx sv add`: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook

**svelte-preprocess**
- Alternative with Pug, Babel, global styles support; may be slower

**Vite Plugins**
- Any Vite plugin works; browse vitejs/awesome-vite

## Debugging

**VSCode**
- Debug Terminal: CMD/Ctrl + Shift + P → "Debug: JavaScript Debug Terminal"
- Launch Configuration: create `.vscode/launch.json` with Node.js config

**Browser DevTools**
- Run `NODE_OPTIONS="--inspect" npm run dev`
- Open `localhost:5173`, then DevTools → "Open dedicated DevTools for Node.js"

**Other Editors**
- WebStorm: built-in Svelte debugging
- Neovim: community guides available

## Migration to SvelteKit 2

**Error & Redirect Handling**
- `error()` and `redirect()` no longer need to be thrown
- Use `isHttpError` and `isRedirect` to distinguish from unexpected errors

**Cookie Path**
- `cookies.set()`, `cookies.delete()`, `cookies.serialize()` require `path` parameter (typically `path: '/'`)

**Load Functions**
- No auto-await of top-level promises; use `async/await` and `Promise.all()`
```js
export async function load({ fetch }) {
  const [a, b] = await Promise.all([
    fetch(url1).then(r => r.json()),
    fetch(url2).then(r => r.json()),
  ]);
  return { a, b };
}
```

**Navigation**
- `goto()` no longer accepts external URLs; use `window.location.href`
- `state` object determines `$page.state`

**Paths**
- Relative by default (`paths.relative = true`)
- `preloadCode()` requires `base` prefix; takes single argument
- `resolvePath()` removed; use `resolveRoute()` from `$app/paths`

**Environment Variables**
- Dynamic variables (`$env/dynamic/*`) cannot be used during prerendering; use `$env/static/*`

**Forms**
- `form` and `data` removed from `use:enhance` callbacks; use `formElement` and `formData`
- File inputs require `enctype="multipart/form-data"` or `use:enhance` will error

**Stores**
- `$app/stores` deprecated in favor of `$app/state` (Svelte 5 runes)

**Dependencies**
- Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+
- `@sveltejs/vite-plugin-svelte@3` required as peer dependency
- Adapter minimums: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

## Migration from Sapper

**package.json**
- Add `"type": "module"`
- Replace `sapper` with `@sveltejs/kit` and adapter
- Scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`

**Configuration**
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- Move preprocessor options to `config.preprocess`

**File Migrations**
- `src/client.js` → `+layout.svelte` `onMount`
- `src/template.html` → `src/app.html`; replace `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`
- `src/node_modules` → `src/lib`

**Routes**
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `_error.svelte` → `+error.svelte`
- `_layout.svelte` → `+layout.svelte`

**Imports**
- `@sapper/app` → `$app/navigation` and `$app/stores`
- `preload` → `load` function in `+page.js`/`+layout.js`

**Stores**
- `page` store still exists; `preloading` → `navigating` store

**Other**
- Regex routes removed
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`

## Glossary

**Rendering Modes**
- **CSR**: Page generation in browser (can disable with `csr = false`)
- **SSR**: Page generation on server (default, can disable with `ssr = false`)
- **Hybrid**: SSR for initial load + CSR for navigation (SvelteKit default)
- **SPA**: Single empty HTML shell, all navigation client-side (use `adapter-static`)
- **MPA**: Traditional server-rendered per page

**Static Generation**
- **SSG**: Every page prerendered at build time; no server needed
- **Prerendering**: Computing page contents at build time; pages must return same content for all users
- **ISR**: Generate static pages on-demand without redeploying (Vercel adapter)

**Other Concepts**
- **Hydration**: Server-rendered HTML enhanced with client-side interactivity
- **Edge Rendering**: Rendering in CDN near user
- **Routing**: SvelteKit intercepts navigation client-side by default (skip with `data-sveltekit-reload`)
- **PWA**: Web app using web APIs that functions like native app

### api_reference
Complete TypeScript API reference for SvelteKit exports, hooks, navigation, forms, configuration, and type generation.

## Core Exports

**Server class**: Initializes with SSRManifest, provides `init()` and `respond()` methods.

**Response helpers**: `json(data, init?)`, `text(body, init?)`, `error(status, body)`, `redirect(status, location)`, `fail(status, data?)`

**Type guards**: `isHttpError(e, status?)`, `isRedirect(e)`, `isActionFailure(e)`

**Utilities**: `normalizeUrl(url)` returns `{url, wasNormalized, denormalize}`, `VERSION`

## Request/Response Types

**RequestEvent**: cookies, fetch, params, url, locals, platform, request, route info, setHeaders(), getClientAddress(), isDataRequest, isSubRequest, isRemoteRequest, tracing

**LoadEvent** (extends RequestEvent): Adds fetch, data, setHeaders(), parent(), depends(), untrack(), tracing

**Page**: url, params, route.id, status, error, data, state, form

## Form Actions & Hooks

**Action**: `(event: RequestEvent) => MaybePromise<OutputData>`

**ActionFailure**: `{status, data, [uniqueSymbol]}`

**Handle**: `(input: {event, resolve}) => Response` - runs on every request

**HandleError**: `(input: {error, event, status, message}) => App.Error`

**HandleFetch**: `(input: {event, request, fetch}) => Response`

**HandleValidationError**: `(input: {issues, event}) => App.Error`

**Reroute**: `(event: {url, fetch}) => void | string`

**sequence()**: Chains multiple handle middleware. `transformPageChunk` applied in reverse order, `preload` and `filterSerializedResponseHeaders` in forward order (first wins).

## Adapter API

**Adapter interface**: `{name, adapt(builder), supports?, emulate?}`

**Builder**: log, rimraf, mkdirp, config, prerendered, routes, createEntries, findServerAssets, generateFallback, generateEnvModule, generateManifest, getBuildDirectory, getClientDirectory, getServerDirectory, getAppPath, writeClient, writePrerendered, writeServer, copy, hasServerInstrumentationFile, instrument, compress

## Navigation

**Navigation types**: NavigationLink, NavigationFormSubmit, NavigationPopState, NavigationExternal, NavigationEnter

**afterNavigate(callback)**: Runs on mount and every navigation

**beforeNavigate(callback)**: Intercept navigation, call `cancel()` to prevent

**goto(url, opts)**: Programmatic navigation with `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate`, `state` options

**invalidate(resource)**: Re-run load functions depending on resource (string/URL or predicate function)

**invalidateAll()**: Re-run all load functions

**onNavigate(callback)**: Runs before navigation, can return Promise to delay

**preloadCode(pathname)**: Import code without calling load functions

**preloadData(href)**: Preload page by loading code and calling load functions

**pushState(url, state)** / **replaceState(url, state)**: Create/replace history entry with page state

## Remote Functions

**command(fn, opts?)**: Remote command executed on server when called from browser

**query(fn, opts?)**: Remote query executed on server when called from browser

**query.batch()**: Collect multiple query calls into single request (v2.35+)

**form(fn, opts?)**: Form object for spreading onto `<form>` elements

**prerender(fn, opts?)**: Remote prerender function with optional `inputs` generator and `dynamic` flag

**getRequestEvent()**: Returns current RequestEvent in server hooks, load functions, actions, endpoints

**read(asset)**: Read imported asset contents from filesystem

## Forms

**enhance(form)**: Enhance `<form>` to work without JavaScript. Callback receives FormData, action, cancel(), controller. Returns callback for server response. Default: updates `form` prop, resets form, invalidates data on success, redirects on redirect/error.

**applyAction(result)**: Update `form` property and `page.status`, redirect to error page on error

**deserialize(text)**: Deserialize form submission response into ActionResult

## App State

**$app/state** (v2.12+): Three read-only reactive objects:
- `navigating`: In-progress navigation with `from`, `to`, `type`, `delta` (popstate only), or `null`
- `page`: Current page with `data`, `form`, `state`, `url`, `route`, `params`
- `updated`: Boolean, set to `true` when new version detected (if `version.pollInterval` > 0). Call `updated.check()` to force check.

**$app/stores** (deprecated): Store equivalents via `getStores()` returning `{page, navigating, updated}`

## Paths & Assets

**asset(file)**: Resolve static directory asset URLs with base path prefix

**resolve(pathname | routeId, params?)**: Resolve pathname with base path or route ID with dynamic segments populated

**Deprecated**: `assets`, `base`, `resolveRoute()`

## Environment Variables

**$env/static/public**: Public variables (PUBLIC_ prefix) injected at build time

**$env/static/private**: Private variables injected at build time, server-only

**$env/dynamic/public**: Public variables sent from server to client at runtime

**$env/dynamic/private**: Private variables at runtime, server-only

## Node.js Integration

**@sveltejs/kit/node**:
- `createReadableStream(path)`: Convert file to readable stream (v2.4.0+)
- `getRequest({request, base, bodySizeLimit?})`: Convert IncomingMessage to Request
- `setResponse(serverResponse, response)`: Write Response to ServerResponse

**@sveltejs/kit/node/polyfills**:
- `installPolyfills()`: Enable web APIs (crypto, File) in Node.js

## Vite Integration

**@sveltejs/kit/vite**: `sveltekit()` returns array of Vite plugins

## Service Worker

**$service-worker**: Build-time constants available only in service workers:
- `base`: Deployment base path from `location.pathname`
- `build`: Array of Vite-generated file URLs for caching
- `files`: Array of static directory file URLs
- `prerendered`: Array of prerendered page pathnames
- `version`: From `config.kit.version`

## Configuration

**svelte.config.js** key options:
- `adapter`: Platform adapter
- `alias`: Import path mappings
- `appDir`: SvelteKit assets directory (default: "_app")
- `csp`: Content Security Policy with `mode` ('hash'|'nonce'|'auto'), `directives`, `reportOnly`
- `csrf`: CSRF protection via `checkOrigin` or `trustedOrigins`
- `embedded`: Add listeners to parent of body instead of window
- `env`: `dir`, `publicPrefix` (default: "PUBLIC_"), `privatePrefix`
- `experimental`: `tracing`, `instrumentation`, `remoteFunctions`
- `inlineStyleThreshold`: Max CSS size to inline
- `moduleExtensions`: File extensions as modules (default: [".js", ".ts"])
- `outDir`: Build output directory (default: ".svelte-kit")
- `output`: `preloadStrategy` ('modulepreload'|'preload-js'|'preload-mjs'), `bundleStrategy` ('split'|'single'|'inline')
- `paths`: `assets` (CDN path), `base` (root-relative path), `relative` (use relative paths in SSR)
- `prerender`: `concurrency`, `crawl`, `entries`, error handlers, `origin`
- `router`: `type` ('pathname'|'hash'), `resolution` ('client'|'server')
- `typescript`: `config` function to modify tsconfig.json
- `version`: `name` (deterministic version string), `pollInterval` (ms for version polling)

## Types

**$app/types** auto-generated:
- `Asset`: Union of static filenames + wildcard
- `RouteId`: Union of all route IDs
- `Pathname`: Union of all valid pathnames
- `ResolvedPathname`: Pathnames with base path prefix
- `RouteParams<RouteId>`: Parameters for given route
- `LayoutParams`: Parameters including optional from child routes

**Generated per route** (`./$types`):
- `PageData`: Return type of page load
- `LayoutData`: Return type of layout load
- `ActionData`: Union of all Actions return types
- `PageProps` (v2.16.0+): `{data: PageData, form: ActionData}`
- `LayoutProps` (v2.16.0+): `{data: LayoutData, children: Snippet}`

**app.d.ts** ambient types:
- `App.Error`: Error shape (has `message: string`)
- `App.Locals`: Type of `event.locals`
- `App.PageData`: Shared data across pages
- `App.PageState`: Shape of `page.state`
- `App.Platform`: Platform-specific context from adapters

## CLI

**Vite commands** (via npm scripts):
- `vite dev`: Development server
- `vite build`: Production build
- `vite preview`: Run production build locally

**SvelteKit command**:
- `svelte-kit sync`: Generate tsconfig.json and type definitions

## Utilities

**$app/environment**: Runtime detection constants:
- `browser: boolean`
- `building: boolean`
- `dev: boolean`
- `version: string`

**$lib**: Automatic alias to `src/lib` (configurable via `config.kit.files.lib`)

**Cookies**: `get(name, opts?)`, `getAll(opts?)`, `set(name, value, opts)`, `delete(name, opts)`, `serialize(name, value, opts)`

**Invalid**: Create validation errors via `invalid(issue1, issue2)` or `invalid.fieldName('message')`

**Snapshot**: `{capture(), restore(snapshot)}` - preserve component state during navigation

**ParamMatcher**: `(param: string) => boolean` - custom route parameter validation

**SubmitFunction**: Enhanced form submission handler with formData, action, result, update()


