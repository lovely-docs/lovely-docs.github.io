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