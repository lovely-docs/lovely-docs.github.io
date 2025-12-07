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