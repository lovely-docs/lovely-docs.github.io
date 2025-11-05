## package.json Changes
- Add `"type": "module"`
- Remove `polka`, `express`, `sirv`, `compression`
- Replace `sapper` with `@sveltejs/kit` and an adapter
- Update scripts: `sapper build` → `vite build`, `sapper export` → `vite build` (with static adapter), `sapper dev` → `vite dev`, `node __sapper__/build` → `node build`

## Configuration
- Replace `webpack.config.js` or `rollup.config.js` with `svelte.config.js`
- Move Svelte preprocessor options to `config.preprocess`
- Add an adapter (adapter-node for `sapper build`, adapter-static for `sapper export`)
- Add Vite plugins for unhandled filetypes to `vite.config.js`

## File Migrations
- `src/client.js` → move logic to `+layout.svelte` in `onMount` callback
- `src/server.js` → custom server with adapter-node or no equivalent for serverless
- `src/service-worker.js`: `files` unchanged, `routes` removed, `shell` → `build`, `timestamp` → `version`
- `src/template.html` → `src/app.html`: replace `%sapper.base%`, `%sapper.scripts%`, `%sapper.styles%` (remove), `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`, remove `<div id="sapper">`
- `src/node_modules` internal libraries → `src/lib`

## Routing & Pages
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `routes/about.svelte` → `routes/about/+page.svelte`
- `_error.svelte` → `+error.svelte`
- `_layout.svelte` → `+layout.svelte`
- Regex routes no longer supported; use advanced route matching

## API Changes
- `@sapper/app` imports: `goto`, `prefetch`, `prefetchRoutes` → `goto`, `preloadData`, `preloadCode` from `$app/navigation`
- `stores` from `@sapper/app` → import `navigating`, `page` from `$app/stores` (or use `$app/state` in Svelte 5 + SvelteKit 2.12+)
- `preload` function → `load` in `+page.js`/`+layout.js`, single `event` argument instead of `page` and `session`
- No `this` object; use `fetch` from input, throw `error` and `redirect`
- `preloading` store → `navigating` store with `from` and `to` properties
- `page` store: has `url` and `params`, no `path` or `query`
- `segment` prop removed; use `$page.url.pathname`
- Relative URLs now resolve against current page, not base URL
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`

## Endpoints
- No direct `req`/`res` access; SvelteKit is environment-agnostic
- `fetch` available globally; no need to import node-fetch or cross-fetch

## HTML Minification
Add html-minifier as dependency and use in server hook via `transformPageChunk`