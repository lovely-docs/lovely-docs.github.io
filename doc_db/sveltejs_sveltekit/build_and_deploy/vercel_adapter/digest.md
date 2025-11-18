## Installation
Install `@sveltejs/adapter-vercel` and add to `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-vercel';
const config = {
	kit: { adapter: adapter({ /* options */ }) }
};
export default config;
```

## Deployment Configuration
Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:
```js
export const config = {
	split: true,
	runtime: 'edge',
	regions: ['iad1'],
	memory: 1024,
	maxDuration: 15
};
```

**Common options:**
- `runtime`: `'edge'`, `'nodejs20.x'`, or `'nodejs22.x'` (deprecated, will use project config)
- `regions`: array of edge regions or `'all'` for edge functions (default `['iad1']` for serverless)
- `split`: deploy route as individual function if `true`
- `memory`: 128-3008 MB for serverless (default 1024)
- `maxDuration`: max execution time in seconds (default 10/15/900 depending on plan)
- `external`: dependencies to exclude from edge function bundling

## Image Optimization
Configure in adapter options:
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

## Incremental Static Regeneration (ISR)
Add `isr` config to cache and revalidate routes:
```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```
- `expiration`: seconds before cache invalidation (required; `false` = never expire)
- `bypassToken`: 32+ char token to bypass cache via `__prerender_bypass` cookie or `x-prerender-revalidate` header
- `allowQuery`: query params that affect cache key (others ignored)

## Environment Variables
Vercel provides deployment-specific variables accessible via `$env/static/private` and `$env/dynamic/private`. Use `$env/static/private` for static replacement and dead code elimination.

## Skew Protection
Enable in Vercel project settings to route requests to original deployment via cookie. Users get newest version on page reload. `updated.current` always reports new deployments.

## Troubleshooting
- **File system access**: Use `read()` from `$app/server` instead of `fs` (works in both edge and serverless). For edge functions with `read()`, enable Protection Bypass for Automation if using Deployment Protection.
- **Vercel functions**: `/api/*` requests bypass SvelteKit if `api` directory exists; implement as SvelteKit API routes instead.
- **Node version**: Update in project settings if using outdated version.