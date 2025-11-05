## Setup

Install `@sveltejs/adapter-vercel` and add to `svelte.config.js`.

## Configuration

Set options via `export const config` in route files:
- `runtime`: `'edge'` or `'nodejs20.x'`/`'nodejs22.x'`
- `regions`: array of edge regions
- `split`: deploy as individual function
- `memory`: 128-3008 MB
- `maxDuration`: execution time limit
- `external`: exclude dependencies from edge bundling

## ISR (Incremental Static Regeneration)

```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

Bypass cache with `__prerender_bypass=<token>` cookie or `x-prerender-revalidate` header.

## Images

Configure in adapter options with `sizes`, `formats`, `minimumCacheTTL`, `domains`.

## Environment Variables

Access via `$env/static/private` (preferred for static replacement).

## Troubleshooting

- Edge functions: can't use `fs`, use `read()` from `$app/server`
- Serverless: `fs` won't work as expected, use `read()` instead
- Deployment Protection: enable "Protection Bypass for Automation" for edge functions using `read()`