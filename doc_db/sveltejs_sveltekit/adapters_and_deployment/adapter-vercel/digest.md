## Installation and Setup

Install with `npm i -D @sveltejs/adapter-vercel` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter: adapter({
			// options here
		})
	}
};

export default config;
```

## Deployment Configuration

Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:

```js
export const config = {
	split: true
};
```

**All functions:**
- `runtime`: `'edge'`, `'nodejs20.x'`, or `'nodejs22.x'` (deprecated, will use project config)
- `regions`: array of edge network regions (default `["iad1"]` for serverless, `'all'` for edge)
- `split`: if `true`, deploy route as individual function

**Edge functions:**
- `external`: array of dependencies esbuild should treat as external

**Serverless functions:**
- `memory`: 128-3008 Mb (default 1024)
- `maxDuration`: max execution time in seconds (default 10s hobby, 15s pro, 900s enterprise)
- `isr`: Incremental Static Regeneration config

Configuration in layouts applies to nested routes unless overridden.

## Image Optimization

Set `images` config in adapter options:

```js
adapter({
	images: {
		sizes: [640, 828, 1200, 1920, 3840],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 300,
		domains: ['example-app.vercel.app'],
	}
})
```

## Incremental Static Regeneration (ISR)

Add `isr` property to config:

```js
import { BYPASS_TOKEN } from '$env/static/private';

export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

- `expiration` (required): seconds before cache re-generates, or `false` for never
- `bypassToken`: token for on-demand re-validation via `__prerender_bypass=<token>` cookie or `x-prerender-revalidate: <token>` header (must be ≥32 chars, generate with `crypto.randomUUID()`)
- `allowQuery`: list of query params that contribute to cache key; others ignored

Set `BYPASS_TOKEN` as environment variable on Vercel. Pull locally with `vercel env pull .env.development.local`.

ISR on prerendered routes has no effect.

## Environment Variables

Vercel provides deployment-specific environment variables accessible from `$env/static/private` and `$env/dynamic/private`. Use `$env/static/private` for static replacement and dead code elimination:

```js
// +layout.server.js
import { VERCEL_COMMIT_REF } from '$env/static/private';

export function load() {
	return { deploymentGitBranch: VERCEL_COMMIT_REF };
}
```

```svelte
<!-- +layout.svelte -->
<script>
	let { data } = $props();
</script>

<p>Deployed from {data.deploymentGitBranch}.</p>
```

## Skew Protection

Vercel's skew protection routes requests to original deployment via deployment ID cookie. When user reloads, they get newest deployment. `updated.current` from `$app/state` is exempted and reports new deployments. Enable in Advanced project settings.

Caveat: multiple tabs with different versions will route older tabs to newer deployment, triggering SvelteKit's built-in skew protection.

## Notes

- Vercel functions in `api` directory at project root won't be handled by SvelteKit; use SvelteKit API routes instead unless non-JavaScript language needed
- Projects may default to older Node version; change in project settings

## Troubleshooting

**File system access:**
- Can't use `fs` in edge functions
- In serverless functions, use `read()` from `$app/server` instead (works in edge functions too by fetching from deployed assets)
- Alternatively, prerender routes

**Deployment protection:**
If using `read()` in edge functions with Deployment Protection enabled, enable Protection Bypass for Automation to avoid 401 errors.