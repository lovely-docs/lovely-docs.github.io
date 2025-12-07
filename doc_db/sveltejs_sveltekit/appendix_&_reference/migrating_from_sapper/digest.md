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