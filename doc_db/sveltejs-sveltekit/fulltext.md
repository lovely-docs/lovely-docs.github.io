
## Directories

### getting-started
Setup, project structure, deployment adapters, and standard Web APIs for building SvelteKit applications.

## Creating a Project

Run `npx sv create my-app` to scaffold a project, then `npm run dev` to start the dev server on localhost:5173.

## Project Structure

```
src/
├ lib/              # Library code ($lib alias)
│ └ server/         # Server-only code ($lib/server alias)
├ params/           # Param matchers
├ routes/           # Routes (Svelte components, server-rendered then client-side)
├ app.html          # Page template with placeholders: %sveltekit.head%, %sveltekit.body%, %sveltekit.assets%, %sveltekit.nonce%, %sveltekit.env.[NAME]%, %sveltekit.version%
├ error.html        # Error page with placeholders: %sveltekit.status%, %sveltekit.error.message%
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
tests/              # Playwright tests
```

**package.json** requires `@sveltejs/kit`, `svelte`, `vite` as devDependencies with `"type": "module"`.

## Rendering Modes & Deployment

SvelteKit supports: SSR + CSR (default), static site generation, SPAs, and multi-page apps. Adapters configure deployment targets:
- `adapter-node` for own servers/containers
- `adapter-static` for static generation
- `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare` for serverless
- For HTTP/1 limits (mobile/embedded), use `bundleStrategy: 'single'`

## Web Standards

SvelteKit uses standard Web APIs: Fetch, Request/Response, Headers, FormData, Streams, URL, Web Crypto.

**Fetch**: Available in hooks, server routes, and browser. Special version in `load` functions and server hooks allows direct endpoint invocation during SSR without HTTP calls.

**Request/Response/Headers**:
```js
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```

**FormData**:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses.

**URL/URLSearchParams**: Access query parameters via `url.searchParams.get('foo')`.

**Web Crypto**: `crypto.randomUUID()` and other operations.

### core-concepts
Foundational patterns for routing, data loading, form handling, rendering configuration, state management, and type-safe client-server communication in SvelteKit applications.

## Routing
Routes defined by `src/routes` directory structure with `+` prefixed files: `+page.svelte` for pages, `+page.js`/`+page.server.js` for load functions, `+layout.svelte` for shared markup, `+server.js` for API endpoints, `+error.svelte` for error pages.

## Load Functions
Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Universal load functions run on server and browser; server-only load functions run only on server and must return serializable data. Access `params`, `url`, `route`, `cookies`, set headers, access parent data, stream promises, and trigger reruns on param/url changes or `invalidate()`.

```js
export async function load({ params, fetch, cookies }) {
	const data = await fetch('/api/data');
	cookies.set('key', 'value');
	return { data };
}
```

## Form Actions
Export `actions` from `+page.server.js` to handle POST requests. Read form data, return results or errors with `fail()`, redirect with `redirect()`. Add `use:enhance` directive for client-side handling without full-page reloads.

```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		if (!data.get('email')) return fail(400, { missing: true });
		return { success: true };
	}
};
```

## Page Options
Export configuration from layout and page files:
- `prerender = true/'auto'` — generates static HTML at build time
- `ssr = false` — skips server rendering, sends empty shell
- `csr = false` — disables client-side rendering, HTML/CSS only
- `trailingSlash = 'never' | 'always' | 'ignore'` — controls URL trailing slash behavior
- `config = {...}` — adapter-specific configuration

## State Management
Avoid shared state on server; use cookies and databases instead. Don't write to stores in load functions—return data instead. Use context API for safe state sharing. Store persistent state in URL search parameters. Preserve ephemeral UI state with snapshots.

## Remote Functions
Type-safe client-server communication with `query` (read), `form` (write with progressive enhancement), `command` (write from anywhere), and `prerender` (build-time data).

```js
export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
	return post;
});

export const createPost = form(v.object({title: v.string()}), async (data) => {
	await db.insert(data);
	redirect(303, '/blog');
});
```

Enable with `kit: { experimental: { remoteFunctions: true } }`

### build-and-deploy
Build and deploy SvelteKit apps using adapters for various platforms (Node, static, Cloudflare, Netlify, Vercel) with platform-specific configuration and runtime APIs.

## Building

SvelteKit builds in two stages: Vite optimizes code, then an adapter tunes it for the target environment. Prevent code execution during build by checking `building` from `$app/environment`. Preview builds with `vite preview`.

## Adapters

Adapters are deployment plugins configured in `svelte.config.js` that transform built apps for specific platforms. Official adapters exist for Cloudflare, Netlify, Node, static sites, and Vercel. Access platform-specific context via `RequestEvent.platform`.

## Deployment Options

**adapter-auto** automatically detects and uses the correct adapter (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS SST, Google Cloud Run). Install the specific adapter to devDependencies for environment-specific configuration.

**Node servers** (`adapter-node`): Build with `npm run build`, deploy `build/`, `package.json`, `node_modules/`. Start with `node build`. Configure via environment variables: `PORT` (3000), `HOST` (0.0.0.0), `ORIGIN`, reverse proxy headers (`PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`), client IP detection (`ADDRESS_HEADER`, `XFF_DEPTH`), `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s). Supports graceful shutdown via `sveltekit:shutdown` event and systemd socket activation.

**Static sites** (`adapter-static`): Set `prerender = true` in root layout. Configure `pages`, `assets`, `fallback` (for SPA), `precompress`, `strict`. For GitHub Pages, set `paths.base` to repo name and generate `404.html` fallback.

**Single-page apps** (`adapter-static`): Disable SSR globally with `export const ssr = false` in root layout, use fallback page. Prerender specific pages by enabling SSR and `export const prerender = true` for those routes. Add `.htaccess` for Apache routing. Warning: SPAs have poor performance, SEO, and accessibility.

**Cloudflare** (`adapter-cloudflare`): Configure fallback (`'plaintext'` or `'spa'`), customize `_routes.json` with `include`/`exclude` (max 100 rules). Access runtime APIs via `platform?.env`. Test locally with `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

**Netlify** (`adapter-netlify`): Use `edge: true` for Deno-based edge functions, `split: true` for function splitting. Access Netlify context via `event.platform?.context`. Use `_redirects` file for redirects. Use `read()` from `$app/server` instead of `fs` for file access.

**Vercel** (`adapter-vercel`): Set options via `export const config` in route files: `runtime` (`'edge'` or `'nodejs20.x'`/`'nodejs22.x'`), `regions`, `split`, `memory` (128-3008 MB), `maxDuration`. ISR configuration: `expiration`, `bypassToken`, `allowQuery`. Bypass cache with `__prerender_bypass=<token>` cookie or `x-prerender-revalidate` header. Configure image optimization with `sizes`, `formats`, `minimumCacheTTL`, `domains`. Use `read()` from `$app/server` instead of `fs`.

## Custom Adapters

Implement the Adapter API by exporting a function returning an object with `name` and `adapt(builder)` methods. The `adapt` method must clear the build directory, write output via `builder.writeClient/Server/Prerendered()`, generate code that imports `Server`, instantiate with `builder.generateManifest()`, listen for requests, convert to `Request`, call `server.respond(request, { getClientAddress })`, expose platform via `platform` option, shim `fetch` if needed, bundle output, and place files correctly.

### advanced-techniques
Advanced SvelteKit patterns for routing, hooks, error handling, navigation, service workers, security, state preservation, observability, and library packaging.

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

### best-practices
Production-ready patterns for authentication, performance optimization, accessibility, SEO, and asset handling in SvelteKit applications.

## Authentication and Authorization
Sessions are revocable but require DB queries; JWT offer better latency but can't be revoked. Check auth cookies in server hooks and store user info in `locals`. Use framework-specific libraries like Lucia.

## Performance
SvelteKit handles code-splitting, asset preloading, file hashing, request coalescing, parallel loading, data inlining, conservative invalidation, prerendering, and link preloading.

Diagnose with PageSpeed Insights, WebPageTest, or browser devtools (Lighthouse, Network, Performance tabs). Instrument slow APIs with OpenTelemetry or Server-Timing headers.

Optimize images with `@sveltejs/enhanced-img`, compress videos to `.webm`/`.mp4` with lazy-loading, preload fonts via `resolve` with `preload` filter in `handle` hook. Find large packages with `rollup-plugin-visualizer`. Replace JS analytics with server-side solutions. Use Partytown for third-party scripts. Use dynamic `import(...)` for conditional code.

Preload links (default enabled), return promises from `load` for streaming non-essential data, use server `load` instead of universal to avoid waterfalls. Deploy frontend near backend or use edge deployment, serve images from CDN, use HTTP/2+.

## Icons
Use Iconify for CSS-based icons. Avoid icon libraries with one `.svelte` file per icon as they slow down Vite's dependency optimization.

## Images
Vite auto-processes imported assets with hashing and inlining. `@sveltejs/enhanced-img` generates avif/webp formats, multiple sizes, and intrinsic dimensions:
```svelte
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" fetchpriority="high" alt="text" />
```
For dynamic/external images use `@unpic/svelte` or provider-specific libraries. Serve via CDN, provide 2x resolution images, set `fetchpriority="high"` for LCP images.

## Accessibility
Every page needs a unique `<title>` in `<svelte:head>` for screen reader announcements. SvelteKit focuses `<body>` after navigation (or an `autofocus` element if present). Customize with `afterNavigate` hook. Set `lang` attribute on `<html>` in `src/app.html` or dynamically via `handle` hook.

## SEO
SSR enabled by default with minimal performance overhead and automatic trailing slash normalization. Add unique `<title>` and `<meta name="description">` to each page in `<svelte:head>`. Create sitemaps via `src/routes/sitemap.xml/+server.js` endpoint. For AMP support, set `inlineStyleThreshold: Infinity`, disable `csr`, add `amp` to `<html>`, and transform with `@sveltejs/amp` in hooks.

### appendix-&-reference
Reference documentation covering FAQs, integrations, debugging, migration guides from v1/Sapper, and glossary of rendering modes and concepts.

## Frequently Asked Questions

**Package Management**: Import JSON with `import pkg from './package.json' with { type: 'json' };`. Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` for Yarn 2/3 ESM support.

**Library Packaging**: Validate with publint.dev. Ensure `exports` field, correct file extensions (`.mjs`/`.cjs`), and ship Svelte components as uncompiled `.svelte` files. Use `svelte-package` for Svelte libraries.

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

## Integrations

**vitePreprocess**: Enables CSS preprocessors (PostCSS, SCSS, Less, Stylus, SugarSS). Included by default with TypeScript. Use `vitePreprocess({ script: true })` for complex TypeScript in Svelte 5.

**Add-ons**: `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**Alternative Preprocessors**: `svelte-preprocess` supports Pug, Babel, global styles. Install and configure in `svelte.config.js`.

**Vite Plugins**: Enhance projects with Vite plugins (see vitejs/awesome-vite).

## Breakpoint Debugging

**VSCode**: Debug terminal via `CMD/Ctrl + Shift + P` → "Debug: JavaScript Debug Terminal" → `npm run dev`, or use `.vscode/launch.json` with `"type": "node-terminal"` and press `F5`.

**Browser DevTools**: Run `NODE_OPTIONS="--inspect" npm run dev`, open `localhost:5173`, click "Open dedicated DevTools for Node.js", or navigate to `chrome://inspect`.

## Migration: v1 to v2

**Breaking Changes**: `error()` and `redirect()` no longer need `throw`. `cookies.set/delete` require `path` parameter. Top-level promises must be explicitly `await`ed. `goto()` rejects external URLs. `preloadCode` requires `base` prefix. `resolvePath` → `resolveRoute`. Dynamic env vars blocked during prerendering. `$app/stores` deprecated → use `$app/state`. Forms with file inputs need `enctype="multipart/form-data"`. Requires Node 18.13+, Svelte 4, Vite 5, TypeScript 5.

**Automatic Migration**: Run `npx sv migrate sveltekit-2`.

## Migration: Sapper to SvelteKit

**Package Setup**: Add `"type": "module"` to package.json. Replace `sapper` with `@sveltejs/kit` + adapter.

**Scripts**: `sapper build/dev/export` → `vite build/dev` (with appropriate adapter).

**Configuration**: Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`.

**File Structure**: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`, `routes/about.svelte` → `routes/about/+page.svelte`.

**Data Loading**: `preload` → `load` function in `+page.js`/`+layout.js` with single `event` argument.

**Navigation**: `@sapper/app` imports (`goto`, `prefetch`, `prefetchRoutes`) → `goto`, `preloadData`, `preloadCode` from `$app/navigation`.

**Stores**: `stores()` → import `navigating`, `page` from `$app/stores`.

**API Access**: No `req`/`res` access; `fetch` available globally. Relative URLs resolve against current page, not base URL.

## Glossary

**Rendering Modes**:
- **CSR**: Browser-based rendering (disable with `csr = false`)
- **SSR**: Server-side rendering (disable with `ssr = false`)
- **Hybrid**: Default SvelteKit mode (SSR initial + CSR navigation)
- **SPA**: Single HTML shell with client-side routing (`adapter-static`)
- **SSG**: All pages prerendered (`adapter-static` or `prerender` option)
- **ISR**: On-demand static generation (`adapter-vercel`)

**Key Concepts**:
- **Hydration**: Server data transmitted with HTML; components initialize without re-fetching; event listeners attached
- **Prerendering**: Build-time HTML generation; must return same content for all users; no form actions
- **Edge Rendering**: CDN-based rendering near users
- **Routing**: Client-side navigation by default; skip with `data-sveltekit-reload`
- **PWA**: Installable web app with offline capabilities via service workers
- **MPA**: Traditional server-rendered multi-page applications

## Resources

**FAQs**: SvelteKit FAQ, Svelte FAQ, vite-plugin-svelte FAQ

**Examples**: Official - sveltejs/realworld (blog), HackerNews clone, svelte.dev. Community examples on GitHub and Svelte Society.

**Support**: Discord, StackOverflow.

### api-reference
Complete reference for SvelteKit's runtime modules, environment variables, type system, configuration, and server-side APIs.

## Server-side Hooks
`@sveltejs/kit/hooks` module provides `handle`, `handleError`, `handleFetch` hooks defined in `hooks.server.js` for intercepting and customizing request/response lifecycle.

## Runtime Modules
- `$app/environment` - Access environment variables and runtime information (build modes, config)
- `$app/navigation` - `goto()` for programmatic navigation, `invalidateAll()` and `invalidate(url)` to re-run load functions
- `$app/paths` - `base` and `assets` paths configured in `svelte.config.js`
- `$app/forms` - Utilities for handling form submissions and form data
- `$app/state` - Read-only state objects: `page`, `navigating`, `updated` (SvelteKit 2.12+)
- `$app/stores` - Legacy store-based state (use `$app/state` instead)
- `$app/server` - Server-only utilities for hooks, routes, and server load functions
- `$service-worker` - Service worker functionality access

## Environment Variables
- `$env/static/public` - Public variables (prefixed `PUBLIC_`) injected at build time, safe for client
- `$env/static/private` - Private variables statically replaced at build time, server-only
- `$env/dynamic/public` - Runtime access to public variables in server and client code
- `$env/dynamic/private` - Runtime access to private variables on server side

## Type Safety
`$app/types` exports auto-generated TypeScript utilities: `Asset`, `RouteId`, `Pathname`, `ResolvedPathname`, `RouteParams<'/blog/[slug]'>` → `{ slug: string }`, `LayoutParams`. Generated `.d.ts` files export typed `RequestHandler`, `Load`, `PageData`, `LayoutData`, `ActionData`. Helper types `PageProps` and `LayoutProps` (v2.16.0+) combine data with form/children.

## Configuration & Build
- `svelte.config.js` - Project configuration with `kit` property for adapter selection and options
- `svelte-kit sync` - Generates `tsconfig.json` and `./$types` definitions (runs as `prepare` script)
- Vite CLI - `vite dev`, `vite build`, `vite preview` for development and building
- `$lib` - Automatic import alias for `src/lib` directory (customizable in config)

## Adapters & Polyfills
- Node.js adapter - Runtime for server-side rendering and backend deployment
- Node.js polyfills - Browser APIs available in server-side contexts
- Vite integration - Build system plugin and configuration utilities


