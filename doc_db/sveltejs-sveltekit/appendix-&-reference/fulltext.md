

## Pages

### frequently-asked-questions
Common questions about SvelteKit development covering package management, library integration, APIs, databases, client-side code, proxying, middleware, and package managers.

## Package.json
`import pkg from './package.json' with { type: 'json' };`

## Library Packaging
Check publint.dev. Ensure `exports` field, correct file extensions (`.mjs`/`.cjs`), and Svelte components as uncompiled `.svelte` files. Use `svelte-package` for Svelte libraries.

## View Transitions
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

## Database
Put queries in server routes. Create `db.js` singleton. Use `hooks.server.js` for setup.

## Client-side Libraries
Use `import { browser } from '$app/environment'` check, `onMount`, or `{#await}` blocks.

## Backend API Proxy
Use `event.fetch` or set up proxy with `server.proxy` in dev. In production, rewrite paths or create API route.

## Middleware
Use Vite plugin with `configureServer` in dev; adapter-node in production.

## Yarn
Yarn 2: Use `nodeLinker: 'node-modules'` in `.yarnrc.yml`. Yarn 3: Same setting recommended for ESM support.

### integrations
Overview of available integrations and preprocessors for SvelteKit projects including vitePreprocess, add-ons, alternative preprocessors, and Vite plugins.

## vitePreprocess

Enable CSS preprocessors (PostCSS, SCSS, Less, Stylus, SugarSS) with `vitePreprocess` from `@sveltejs/vite-plugin-svelte`. Included by default with TypeScript. Use `vitePreprocess({ script: true })` for complex TypeScript in Svelte 5.

## Add-ons

`npx sv add` sets up: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## svelte-preprocess

Alternative with Pug, Babel, global styles support. Install `npm i -D svelte-preprocess` and configure in svelte.config.js.

## Vite plugins

Use Vite plugins to enhance SvelteKit projects (see vitejs/awesome-vite).

### breakpoint-debugging
Set breakpoints to debug SvelteKit projects using VSCode debug terminal, launch.json configuration, or browser DevTools with Node.js inspection.

## Visual Studio Code

Debug terminal: `CMD/Ctrl` + `Shift` + `P` → "Debug: JavaScript Debug Terminal" → `npm run dev` → set breakpoints

Or use `.vscode/launch.json` with `"type": "node-terminal"` and start with `F5`.

## Browser DevTools

Run `NODE_OPTIONS="--inspect" npm run dev`, open `localhost:5173`, click "Open dedicated DevTools for Node.js" in dev tools, or navigate to `chrome://inspect`.

### migrating-to-sveltekit-v2
Breaking changes and migration guide for upgrading from SvelteKit v1 to v2, including API changes for error handling, cookies, promises, routing, and environment variables.

## Key Changes

- `error()` and `redirect()` no longer need `throw`
- `cookies.set/delete` require `path` parameter
- Top-level promises must be explicitly `await`ed
- `goto()` rejects external URLs
- `preloadCode` requires `base` prefix
- `resolvePath` → `resolveRoute`
- Dynamic env vars blocked during prerendering
- `$app/stores` deprecated → use `$app/state`
- Forms with file inputs need `enctype="multipart/form-data"`
- Node 18.13+, Svelte 4, Vite 5, TypeScript 5 required

Run `npx sv migrate sveltekit-2` for automatic migration.

### migrating-from-sapper
Comprehensive guide to migrating a Sapper application to SvelteKit, covering package.json updates, file structure changes, routing conventions, API migrations, and configuration updates.

## Key Changes
- Add `"type": "module"` to package.json, replace `sapper` with `@sveltejs/kit` + adapter
- Update scripts: `sapper build/dev/export` → `vite build/dev` (with appropriate adapter)
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- File renames: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`
- Route renames: `routes/about.svelte` → `routes/about/+page.svelte`
- `preload` → `load` function in `+page.js`/`+layout.js` with single `event` argument
- `@sapper/app` imports: `goto`, `prefetch`, `prefetchRoutes` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`
- `stores()` → import `navigating`, `page` from `$app/stores`
- No `req`/`res` access; `fetch` available globally
- Relative URLs resolve against current page, not base URL

### additional-resources
Links to FAQs, example projects, and community support channels for SvelteKit developers.

**FAQs**: SvelteKit FAQ, Svelte FAQ, vite-plugin-svelte FAQ

**Examples**: Official - sveltejs/realworld (blog), HackerNews clone, svelte.dev. Community examples on GitHub (#sveltekit, #sveltekit-template) and Svelte Society (unvetted, may be outdated).

**Support**: Discord, StackOverflow. Search existing resources first.

### glossary
Reference guide defining rendering modes (CSR, SSR, SPA, SSG, ISR, hybrid) and related concepts (hydration, prerendering, routing, PWA) used in SvelteKit.

## Rendering Modes

- **CSR**: Browser-based rendering, default but can disable with `csr = false`
- **SSR**: Server-side rendering, default, disable with `ssr = false`
- **Hybrid**: Default SvelteKit mode (SSR initial + CSR navigation)
- **SPA**: Single HTML shell, all client-side routing, use `adapter-static`
- **SSG**: All pages prerendered, use `adapter-static` or `prerender` option
- **ISR**: On-demand static generation with `adapter-vercel`

## Key Concepts

- **Hydration**: Server data transmitted with HTML, components initialize without re-fetching, event listeners attached
- **Prerendering**: Build-time HTML generation, must return same content for all users, no form actions
- **Edge Rendering**: CDN-based rendering near users
- **Routing**: Client-side navigation by default, skip with `data-sveltekit-reload`
- **PWA**: Installable web app with offline capabilities via service workers
- **MPA**: Traditional server-rendered multi-page applications

