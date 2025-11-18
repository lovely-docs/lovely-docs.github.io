## package.json Changes
- Add `"type": "module"`
- Remove `polka`/`express` and middleware like `sirv`, `compression`
- Replace `sapper` with `@sveltejs/kit` and an adapter
- Update scripts: `sapper build` → `vite build`, `sapper export` → `vite build` (with static adapter), `sapper dev` → `vite dev`, `node __sapper__/build` → `node build`

## Configuration
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- Move preprocessor options to `config.preprocess`
- Add an adapter (adapter-node for `sapper build`, adapter-static for `sapper export`)
- Add Vite equivalents for any custom file type plugins

## File Migrations
- `src/client.js` → move logic to `+layout.svelte` in `onMount` callback
- `src/server.js` → custom server with adapter-node, or no equivalent for serverless
- `src/service-worker.js`: `files` unchanged, `routes` removed, `shell` → `build`, `timestamp` → `version`
- `src/template.html` → `src/app.html`; replace `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%` (remove), `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`; remove `<div id="sapper">`
- `src/node_modules` internal libraries → `src/lib`

## Routes and Pages
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `routes/about.svelte` → `routes/about/+page.svelte`
- `_error.svelte` → `+error.svelte`
- `_layout.svelte` → `+layout.svelte`

## Imports
- `@sapper/app` exports: `goto`, `prefetch`, `prefetchRoutes` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`
- `stores` from `@sapper/app` → import `navigating`, `page` from `$app/stores` (or use `$app/state` in Svelte 5+)
- `src/node_modules` imports → `$lib` imports

## Load Functions
- `preload` → `load` function in `+page.js`/`+layout.js`
- Single `event` argument instead of `page` and `session`
- No `this` object; use `fetch` from input, throw `error()` and `redirect()` instead of `this.error`/`this.redirect`

## Stores
- `page` store still exists with `url` and `params` properties (no `path` or `query`)
- `preloading` → `navigating` store with `from` and `to` properties
- Access via `getStores()` or direct imports from `$app/stores`

## Other Changes
- Regex routes removed; use advanced route matching
- `segment` prop removed; use `$page.url.pathname`
- Relative URLs now resolve against current page, not base URL
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`
- Endpoints no longer receive `req`/`res`; use environment-agnostic approach
- `fetch` available globally
- HTML minifier: add `html-minifier` dependency and use in `handle` hook with `transformPageChunk`