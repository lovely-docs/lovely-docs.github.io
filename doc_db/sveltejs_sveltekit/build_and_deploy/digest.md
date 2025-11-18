## Build Process

SvelteKit builds in two stages: Vite optimization (server, browser, service worker code and prerendering), then adapter-specific tuning for the target environment.

Code in `+page/layout(.server).js` files runs during build for analysis. Prevent unwanted execution by checking the `building` flag:

```js
import { building } from '$app/environment';
if (!building) {
	setupMyDatabase();
}
```

Preview builds locally with `vite preview` (doesn't reproduce adapter-specific features like `platform` object).

## Adapters

Adapters transform built SvelteKit apps for deployment to specific platforms. Official adapters: `adapter-cloudflare`, `adapter-netlify`, `adapter-node`, `adapter-static`, `adapter-vercel`.

Configure in `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-node';
const config = { kit: { adapter: adapter({ /* options */ }) } };
export default config;
```

Adapters provide platform-specific context via `platform` property in `RequestEvent`.

## adapter-auto

Default adapter that automatically detects deployment environment (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS SST, Google Cloud Run) and uses the correct adapter. Install the specific adapter to `devDependencies` for environment-specific configuration.

## Node Servers

Install `@sveltejs/adapter-node`. Build outputs to `build/` directory. Deploy `build/`, `package.json`, and production dependencies. Start with `node build`.

Environment variables:
- `PORT` (default 3000), `HOST` (default 0.0.0.0)
- `ORIGIN`: deployment URL
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`: for reverse proxies
- `ADDRESS_HEADER`: read client IP from header
- `XFF_DEPTH`: number of trusted proxies for `X-Forwarded-For`
- `BODY_SIZE_LIMIT`: max request body (default 512kb)
- `SHUTDOWN_TIMEOUT`: seconds before force-closing connections (default 30)

Adapter options: `out` (output directory), `precompress` (gzip/brotli), `envPrefix` (variable prefix).

Graceful shutdown via `sveltekit:shutdown` event:
```js
process.on('sveltekit:shutdown', async (reason) => {
	await db.close();
});
```

Custom server with Express:
```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

## Static Site Generation

Install `@sveltejs/adapter-static`. Add `export const prerender = true;` to root layout.

Configuration options: `pages` (output directory), `assets` (static assets directory), `fallback` (SPA fallback page), `precompress` (generate `.br` and `.gz` files), `strict` (validate all pages prerendered).

Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a` requests.

GitHub Pages deployment: set `config.kit.paths.base` to repo name and add `.nojekyll` file to `static/` directory.

## Single-Page Apps

Disable SSR in root layout:
```js
export const ssr = false;
```

Use `adapter-static` with fallback:
```js
adapter({ fallback: '200.html' })
```

Optionally prerender specific pages by re-enabling SSR and adding `export const prerender = true;` to those routes.

SPAs have significant performance drawbacks (multiple network round trips, poor Core Web Vitals, SEO harm). Prerender as many pages as possible; if all pages can be prerendered, use static site generation instead.

## Cloudflare

Install `@sveltejs/adapter-cloudflare`. Create `wrangler.jsonc`:
```jsonc
{
	"name": "<any-name>",
	"main": ".svelte-kit/cloudflare/_worker.js",
	"compatibility_date": "2025-01-01",
	"assets": {
		"binding": "ASSETS",
		"directory": ".svelte-kit/cloudflare"
	}
}
```

Adapter options: `config` (Wrangler config path), `platformProxy` (emulated `platform.env` preferences), `fallback` (`'plaintext'` or `'spa'`), `routes` (customize `_routes.json` patterns).

Access Cloudflare bindings via `platform.env`:
```ts
declare global {
	namespace App {
		interface Platform {
			env: {
				YOUR_KV_NAMESPACE: KVNamespace;
				YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
			};
		}
	}
}
```

Install `@cloudflare/workers-types` and reference in `src/app.d.ts`. Test with `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

Troubleshooting: add `"compatibility_flags": ["nodejs_compat"]` for Node.js compatibility; import large libraries client-side only; use `read()` from `$app/server` instead of `fs`; use `_headers` and `_redirects` files for static assets.

## Netlify

Install `@sveltejs/adapter-netlify`. Create `netlify.toml`:
```toml
[build]
	command = "npm run build"
	publish = "build"
```

Adapter options: `edge` (use Deno-based edge functions), `split` (split app into multiple functions).

Access Netlify context via `event.platform?.context` in server endpoints. Use `_headers` and `_redirects` files for static assets. Create HTML forms with `form-name` input and prerender with `export const prerender = true;`.

Troubleshooting: use `read()` from `$app/server` instead of `fs` in edge deployments; serverless deployments don't copy files.

## Vercel

Install `@sveltejs/adapter-vercel`. Control route deployment via `export const config` in `+server.js`, `+page(.server).js`, or `+layout(.server).js`:

```js
export const config = {
	runtime: 'edge',
	regions: ['iad1'],
	memory: 1024,
	maxDuration: 15
};
```

Image optimization:
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

Incremental Static Regeneration (ISR):
```js
export const config = {
	isr: {
		expiration: 60,
		bypassToken: BYPASS_TOKEN,
		allowQuery: ['search']
	}
};
```

Environment variables via `$env/static/private` and `$env/dynamic/private`. Use `$env/static/private` for static replacement and dead code elimination.

Troubleshooting: use `read()` from `$app/server` instead of `fs`; implement `/api/*` requests as SvelteKit API routes.

## Writing Custom Adapters

Adapter packages export a default function returning an `Adapter` object with:
- `name`: string identifier
- `adapt(builder)`: async function implementing the adapter
- `emulate()` (optional): returns platform-specific context
- `supports` (optional): object with feature support methods

The `adapt` method should:
1. Clear build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Generate output code that imports `Server`, creates app instance with manifest, listens for requests, converts to `Request` objects, calls `server.respond(request, { getClientAddress })`, passes platform info via `platform` option
4. Bundle output if necessary
5. Place static files and generated code in platform-appropriate locations

Reference existing adapters as templates.