## Installation and Setup

Install `@sveltejs/adapter-vercel` and configure it in `svelte.config.js`:

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
	split: true,
	runtime: 'nodejs20.x',
	regions: ['iad1'],
	memory: 1024,
	maxDuration: 15
};
```

**Options:**
- `runtime`: `'edge'`, `'nodejs20.x'`, or `'nodejs22.x'` (deprecated, will use project config)
- `regions`: array of edge regions or `'all'` for edge functions (default `["iad1"]` for serverless)
- `split`: deploy route as individual function if `true`
- `memory`: 128-3008 MB (default 1024)
- `maxDuration`: max execution time in seconds (default 10/15/900 depending on plan)
- `external`: array of dependencies to exclude from edge function bundling

## Image Optimization

Configure image handling in adapter options:

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

Enable ISR for routes with cached content that regenerates on expiration:

```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

- `expiration`: seconds before cache regenerates (required; `false` = never expire)
- `bypassToken`: token to bypass cache via `__prerender_bypass=<token>` cookie or `x-prerender-revalidate` header (must be 32+ chars)
- `allowQuery`: query parameters that contribute to cache key; others ignored

Generate token: `crypto.randomUUID()`. Set as environment variable `BYPASS_TOKEN` in Vercel project settings. Pull locally with `vercel env pull .env.development.local`.

## Environment Variables

Access Vercel deployment variables via `$env/static/private` or `$env/dynamic/private`:

```js
// +layout.server.js
import { VERCEL_COMMIT_REF } from '$env/static/private';

export function load() {
	return { deploymentGitBranch: VERCEL_COMMIT_REF };
}
```

Use `$env/static/private` for static replacement and dead code elimination.

## Skew Protection

Enable in Vercel project Advanced settings. Routes client requests to their original deployment via cookie with deployment ID. When user reloads, they get newest deployment. `updated.current` always reports new deployments.

Caveat: multiple tabs with different versions will route older tabs to newer deployment, triggering SvelteKit's built-in skew protection.

## Troubleshooting

**File system access:** Can't use `fs` in edge functions. In serverless functions, use `read()` from `$app/server` instead (works in edge functions too by fetching from public assets). Alternatively, prerender routes.

**Deployment Protection:** If using `read()` in edge functions with Deployment Protection enabled, enable "Protection Bypass for Automation" to avoid 401 errors.

**Vercel `/api` directory:** Requests to `/api/*` won't be handled by SvelteKit if you have Vercel functions in the `api` directory. Implement as SvelteKit API routes instead, unless using non-JavaScript languages.

**Node version:** Older projects may use outdated Node versions. Update in project settings.