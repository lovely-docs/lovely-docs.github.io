

## Pages

### faq
Common SvelteKit patterns: package compatibility (publint, exports field, ESM), client-side library access (browser check/onMount), database setup (server routes + singleton), view transitions (onNavigate + startViewTransition), external APIs (event.fetch or proxy), middleware (Vite plugin or adapter-node), Yarn compatibility (nodeLinker workaround).

## What can I make with SvelteKit?
See documentation on project types.

## Including package.json details
Import JSON with type assertion:
```ts
import pkg from './package.json' with { type: 'json' };
```

## Fixing package inclusion errors
Check library packaging compatibility at publint.dev. Key points:
- `exports` field takes precedence over `main`/`module`
- ESM files should end with `.mjs` (or any extension if `"type": "module"` is set); CommonJS files should end with `.cjs`
- `main` should be defined if `exports` is not
- Svelte components should be distributed as uncompiled `.svelte` files with ESM-only JS, preprocessed custom languages
- Use `svelte-package` for packaging Svelte libraries
- ESM versions work best with Vite; CommonJS dependencies are pre-bundled to ESM by `vite-plugin-svelte` using esbuild
- For issues, check Vite and library issue trackers; `optimizeDeps` and `ssr` config can be short-term workarounds

## Using view transitions API
Call `document.startViewTransition` in `onNavigate`:
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

## Setting up a database
Put database queries in server routes, not `.svelte` files. Create a `db.js` singleton for connections. Execute one-time setup in `hooks.server.js`. Use Svelte CLI to automatically set up database integrations.

## Using client-side libraries accessing document/window
Wrap in `browser` check:
```js
import { browser } from '$app/environment';
if (browser) { /* client-only code */ }
```

Or use `onMount`:
```js
import { onMount } from 'svelte';
onMount(async () => {
	const { method } = await import('some-browser-only-library');
	method('hello world');
});
```

For side-effect-free libraries, static import works (tree-shaken in server build):
```js
import { onMount } from 'svelte';
import { method } from 'some-browser-only-library';
onMount(() => { method('hello world'); });
```

Or use `{#await}` block:
```svelte
<script>
	import { browser } from '$app/environment';
	const ComponentConstructor = browser ?
		import('some-browser-only-library').then((m) => m.Component) :
		new Promise(() => {});
</script>
{#await ComponentConstructor}
	<p>Loading...</p>
{:then component}
	<svelte:component this={component} />
{:catch error}
	<p>Error: {error.message}</p>
{/await}
```

## Using a different backend API server
Use `event.fetch` to request from external API, but handle CORS complications. Alternatively, set up a proxy: in production rewrite paths like `/api` to the API server; in dev use Vite's `server.proxy` option. If rewrites unavailable, add an API route:
```js
// src/routes/api/[...path]/+server.js
export function GET({ params, url }) {
	return fetch(`https://example.com/${params.path + url.search}`);
}
```
May also need to proxy POST/PATCH and forward request.headers.

## Using middleware
For production with `adapter-node`, it builds a middleware for your own server. For dev, add middleware via Vite plugin:
```js
import { sveltekit } from '@sveltejs/kit/vite';

const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			console.log(`Got request ${req.url}`);
			next();
		});
	}
};

export default { plugins: [myPlugin, sveltekit()] };
```

## Using Yarn
Yarn 2 Plug'n'Play is broken with ESM; use `nodeLinker: 'node-modules'` in `.yarnrc.yml` or prefer npm/pnpm.

Yarn 3 ESM support is experimental. To use: create app with `yarn create svelte myapp`, enable Berry with `yarn set version berry && yarn install`, then add to `.yarnrc.yml`:
```yaml
nodeLinker: node-modules
```

### integrations
vitePreprocess enables CSS preprocessors; svelte-preprocess alternative with more features; npx sv add for common integrations; Vite plugins supported.

## vitePreprocess

`vitePreprocess` enables support for CSS preprocessors that Vite supports: PostCSS, SCSS, Less, Stylus, and SugarSS. Included by default in TypeScript projects.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess()]
};
export default config;
```

Required for TypeScript with Svelte 4. Svelte 5 supports TypeScript natively for type syntax only; use `vitePreprocess({ script: true })` for complex TypeScript.

## Add-ons

`npx sv add` command sets up integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## Packages

High-quality Svelte packages available at the packages page and sveltesociety.dev.

## svelte-preprocess

Alternative preprocessor with additional features: Pug, Babel, global styles support. May be slower and require more configuration than vitePreprocess. Install with `npm i -D svelte-preprocess` and add to svelte.config.js. Often requires installing corresponding libraries like `npm i -D sass` or `npm i -D less`. CoffeeScript is not supported.

## Vite plugins

SvelteKit uses Vite, so Vite plugins can enhance projects. Available plugins listed at vitejs/awesome-vite repository.

### breakpoint_debugging
Debug SvelteKit with breakpoints via VSCode debug terminal/launch.json, browser DevTools with NODE_OPTIONS="--inspect", or other editor-specific tools.

## Visual Studio Code

Use the built-in debug terminal to set breakpoints in source files:

1. Open command palette: `CMD/Ctrl` + `Shift` + `P`
2. Launch "Debug: JavaScript Debug Terminal"
3. Start your project: `npm run dev`
4. Set breakpoints in client or server-side source code
5. Trigger the breakpoint

Alternatively, set up `.vscode/launch.json`:

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"command": "npm run dev",
			"name": "Run development server",
			"request": "launch",
			"type": "node-terminal"
		}
	]
}
```

Then use the "Run and Debug" pane to select the run script and press the play button or hit `F5`.

## Other Editors

- WebStorm: Use built-in Svelte debugging support
- Neovim: Community guides available for JavaScript framework debugging

## Browser DevTools (Chrome/Edge)

Debug Node.js applications using browser-based debugger (client-side source maps only):

1. Run: `NODE_OPTIONS="--inspect" npm run dev`
2. Open site at `localhost:5173`
3. Open browser dev tools and click "Open dedicated DevTools for Node.js" icon (Node.js logo)
4. Set breakpoints and debug

Alternatively, navigate to `chrome://inspect` (Chrome) or `edge://inspect` (Edge).

### migrating-to-sveltekit-2
SvelteKit 2 breaking changes: error()/redirect() no longer thrown, cookies require path, top-level promises not auto-awaited, goto() rejects external URLs, paths relative by default, resolvePath→resolveRoute, improved error handling with status/message, dynamic env vars blocked during prerendering, use:enhance removes form/data, file forms need multipart/form-data, stricter tsconfig, Node 18.13+ required, $app/stores deprecated for $app/state

## Breaking Changes in SvelteKit 2

### error() and redirect() no longer need to be thrown
```js
// Before
throw error(500, 'something went wrong');
// After
error(500, 'something went wrong');
```
Use `isHttpError` and `isRedirect` from `@sveltejs/kit` to distinguish them from unexpected errors in try blocks.

### Cookies require explicit path
```js
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
cookies.serialize(name, value, { path: '/' });
```
Path can be `'/'` (domain-wide), `''` (current path), or `'.'` (current directory).

### Top-level promises no longer auto-awaited
```js
// Single promise
export async function load({ fetch }) {
	const response = await fetch(url).then(r => r.json());
	return { response };
}

// Multiple promises - use Promise.all to avoid waterfalls
export async function load({ fetch }) {
	const [a, b] = await Promise.all([
		fetch(url1).then(r => r.json()),
		fetch(url2).then(r => r.json()),
	]);
	return { a, b };
}
```

### goto() changes
- No longer accepts external URLs; use `window.location.href = url` instead
- `state` object now determines `$page.state` and must adhere to `App.PageState` interface

### Paths are relative by default
`paths.relative` now defaults to `true` (was inconsistent in v1). Affects `%sveltekit.assets%`, `base`, and `assets` from `$app/paths`.

### Server fetches no longer trackable
`dangerZone.trackServerFetches` setting removed due to security concerns.

### preloadCode() changes
- Arguments must be prefixed with `base` (consistent with `preloadData`)
- Now takes single argument instead of multiple arguments

### resolvePath() replaced with resolveRoute()
```js
// Before
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });

// After
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

### Improved error handling
`handleError` hooks now receive `status` and `message` properties. For thrown errors, status is `500` and message is `Internal Error`. `message` is safe to expose to users, unlike `error.message`.

### Dynamic environment variables cannot be used during prerendering
Use `$env/static/public` and `$env/static/private` during prerendering instead of `$env/dynamic/*`. SvelteKit requests updated dynamic values from `/_app/env.js` when landing on prerendered pages.

### use:enhance callback changes
`form` and `data` properties removed; use `formElement` and `formData` instead.

### Forms with file inputs require multipart/form-data
```html
<form enctype="multipart/form-data">
	<input type="file">
</form>
```
SvelteKit 2 throws error during `use:enhance` submission if missing.

### Generated tsconfig.json stricter
- Warns against `paths` or `baseUrl` in tsconfig.json
- Use `alias` config in `svelte.config.js` instead
- Now uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax`
- Remove `importsNotUsedAsValues` and `preserveValueImports` if present

### getRequest() no longer throws immediately
Errors from `@sveltejs/kit/node` `getRequest()` are deferred until request body is read.

### vitePreprocess no longer exported from @sveltejs/kit/vite
Import directly from `@sveltejs/vite-plugin-svelte` instead.

### Dependency requirements
- Node 18.13+
- svelte@4, vite@5, typescript@5
- @sveltejs/vite-plugin-svelte@3 (now peerDependency)
- Adapter versions: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

### SvelteKit 2.12: $app/stores deprecated
Use `$app/state` instead (Svelte 5 runes API):
```svelte
<!-- Before -->
<script>
	import { page } from '$app/stores';
</script>
{$page.data}

<!-- After -->
<script>
	import { page } from '$app/state';
</script>
{page.data}
```
Use `npx sv migrate app-state` for auto-migration.

### migrating_from_sapper
Comprehensive migration guide from Sapper to SvelteKit covering package.json, config files, routing (index.svelte→+page.svelte, _layout→+layout), data loading (preload→load with event arg), stores (direct imports from $app/stores), imports (@sapper/* → $app/*), link attributes, and environment-agnostic endpoints.

## Overview
SvelteKit is the successor to Sapper. This guide covers all necessary changes to migrate an existing Sapper app.

## package.json Changes
- Add `"type": "module"`
- Remove `polka`, `express`, `sirv`, `compression` dependencies
- Replace `sapper` devDependency with `@sveltejs/kit` and an adapter
- Update scripts:
  - `sapper build` → `vite build` (with Node adapter)
  - `sapper export` → `vite build` (with static adapter)
  - `sapper dev` → `vite dev`
  - `node __sapper__/build` → `node build`

## Configuration
- Replace `webpack.config.js` or `rollup.config.js` with `svelte.config.js`
- Move Svelte preprocessor options to `config.preprocess`
- Add an adapter (adapter-node is equivalent to `sapper build`, adapter-static to `sapper export`)
- Add Vite equivalents for any custom file type plugins

## File Migrations
- `src/client.js` → move logic to `+layout.svelte` in `onMount` callback
- `src/server.js` → custom server with adapter-node, or no equivalent for serverless
- `src/service-worker.js` → update imports from `@sapper/service-worker` to `$service-worker`:
  - `files` unchanged
  - `routes` removed
  - `shell` → `build`
  - `timestamp` → `version`
- `src/template.html` → `src/app.html`
  - Remove `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%`
  - Replace `%sapper.head%` with `%sveltekit.head%`
  - Replace `%sapper.html%` with `%sveltekit.body%`
  - Remove `<div id="sapper">`
- `src/node_modules` → use `src/lib` instead

## Routes and Pages
- Rename `routes/about.svelte` or `routes/about/index.svelte` → `routes/about/+page.svelte`
- Rename `_error.svelte` → `+error.svelte`
- Rename `_layout.svelte` → `+layout.svelte`
- Other files are ignored

## Imports
- `goto`, `prefetch`, `prefetchRoutes` from `@sapper/app` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`
- `stores` from `@sapper/app` → use `getStores` or import `navigating`, `page` directly from `$app/stores` (or `$app/state` for Svelte 5 + SvelteKit 2.12+)
- `src/node_modules` imports → `$lib` imports

## Data Loading
- Rename `preload` function to `load`
- Move to `+page.js` or `+layout.js` next to component
- Change from two arguments (`page`, `session`) to single `event` argument
- Remove `this` object; no `this.fetch`, `this.error`, `this.redirect`
- Use `fetch` from input, throw `error()` and `redirect()` instead

## Stores
Old Sapper pattern:
```js
import { stores } from '@sapper/app';
const { preloading, page, session } = stores();
```

New SvelteKit:
- `page` store still exists with `url` and `params` properties (no `path` or `query`)
- `preloading` → `navigating` store with `from` and `to` properties
- Import directly: `import { page, navigating } from '$app/stores'`
- `stores()` → `getStores()` (usually unnecessary)

## Routing Changes
- Regex routes no longer supported; use advanced route matching instead
- `segment` prop removed from layouts; use `$page.url.pathname` instead
- Relative URLs now resolve against current page, not base URL (use root-relative URLs starting with `/`)

## Link Attributes
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`

## Endpoints
- No longer receive Node's `req` and `res` objects directly
- SvelteKit is environment-agnostic (Node, serverless, Cloudflare Workers)
- `fetch` available globally; no need to import node-fetch or cross-fetch

## HTML Minification
Sapper included html-minifier by default; SvelteKit doesn't. To add it:
```js
import { minify } from 'html-minifier';
import { building } from '$app/environment';

const minification_options = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	html5: true,
	ignoreCustomComments: [/^#/],
	minifyCSS: true,
	minifyJS: false,
	removeAttributeQuotes: true,
	removeComments: false,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true
};

export async function handle({ event, resolve }) {
	let page = '';
	return resolve(event, {
		transformPageChunk: ({ html, done }) => {
			page += html;
			if (done) return building ? minify(page, minification_options) : page;
		}
	});
}
```

### glossary
Glossary of rendering modes (CSR, SSR, Hybrid, SPA, MPA, SSG, ISR), prerendering rules, hydration, client-side routing, edge rendering, and PWA concepts for SvelteKit applications.

## Rendering Modes and Strategies

**CSR (Client-Side Rendering)**: Page contents generated in the browser using JavaScript. Default in SvelteKit but can be disabled with `csr = false` page option.

**SSR (Server-Side Rendering)**: Page contents generated on the server. Default in SvelteKit, can be disabled with `ssr` page option. Preferred for performance and SEO, improves accessibility when JavaScript fails.

**Hybrid App**: SvelteKit's default mode combining SSR for initial HTML load with CSR for subsequent navigations.

**SPA (Single-Page App)**: Application serving a single empty HTML shell on initial request, with all navigation handled client-side. Has large performance and SEO impacts; recommended only in limited circumstances like mobile app wrapping. Built with `adapter-static`.

**MPA (Multi-Page App)**: Traditional applications rendering each page view on the server (common in non-JavaScript languages).

**SSG (Static Site Generation)**: Every page is prerendered at build time. No server maintenance needed; can be served from CDNs. Achieved with `adapter-static` or by configuring all pages with `prerender` option.

**ISR (Incremental Static Regeneration)**: Generate static pages on-demand as visitors request them without redeploying. Reduces build times vs SSG for large sites. Available with `adapter-vercel`.

**Prerendering**: Computing page contents at build time and saving HTML. Scales nearly free as visitors increase but has expensive build process and requires redeployment for updates. Not all pages can be prerendered—content must be identical for all users and pages must not contain actions. Can still prerender personalized pages if user-specific data is fetched client-side. Controlled with `prerender` page option and config in `svelte.config.js`.

## Core Concepts

**Hydration**: Process where server-rendered HTML is enhanced on the client. SvelteKit stores data fetched during SSR and transmits it with HTML. Components initialize with this data without re-fetching APIs. Svelte verifies DOM state and attaches event listeners. Enabled by default, disabled with `csr = false`.

**Routing**: Client-side routing intercepts navigation (links, back/forward buttons) and updates page contents without server requests. Default behavior; can be skipped with `data-sveltekit-reload`.

**Edge**: Rendering in a CDN near the user, reducing request/response distance and improving latency.

## App Types

**PWA (Progressive Web App)**: Web app built with web APIs/technologies functioning like mobile/desktop apps. Can be installed with shortcuts on launcher/home screen/start menu. Often uses service workers for offline capabilities.

