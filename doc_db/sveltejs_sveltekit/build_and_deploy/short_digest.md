## Build Process

Two-stage build: Vite optimization, then adapter-specific tuning. Prevent build-time code execution with `building` flag from `$app/environment`.

## Adapters

Transform built apps for deployment. Official: `adapter-cloudflare`, `adapter-netlify`, `adapter-node`, `adapter-static`, `adapter-vercel`. Configure in `svelte.config.js`. `adapter-auto` auto-detects environment.

## Node Servers

`@sveltejs/adapter-node` deploys to Node servers. Environment variables: `PORT`, `HOST`, `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH`, `BODY_SIZE_LIMIT`, `SHUTDOWN_TIMEOUT`. Graceful shutdown via `sveltekit:shutdown` event. Custom server with Express via `handler` from build.

## Static Site Generation

`@sveltejs/adapter-static` prerendering. Add `export const prerender = true;` to root layout. Options: `pages`, `assets`, `fallback`, `precompress`, `strict`. GitHub Pages: set `paths.base` to repo name, add `.nojekyll`.

## Single-Page Apps

Disable SSR with `export const ssr = false;` in root layout. Use `adapter-static` with `fallback: '200.html'`. Significant performance drawbacks; prerender as many pages as possible.

## Cloudflare

`@sveltejs/adapter-cloudflare` with `wrangler.jsonc`. Access bindings via `platform.env`. Install `@cloudflare/workers-types` and declare in `src/app.d.ts`. Test with `wrangler dev` or `wrangler pages dev`.

## Netlify

`@sveltejs/adapter-netlify` with `netlify.toml`. Options: `edge` (Deno-based), `split`. Access context via `event.platform?.context`. Use `_headers` and `_redirects` files.

## Vercel

`@sveltejs/adapter-vercel`. Control routes via `export const config` with `runtime`, `regions`, `memory`, `maxDuration`. Image optimization and ISR (Incremental Static Regeneration) configuration available.

## Custom Adapters

Export function returning `Adapter` with `name`, `adapt(builder)`, optional `emulate()` and `supports`. `adapt()` writes output, generates code importing `Server`, handles requests, calls `server.respond()`, places files appropriately.