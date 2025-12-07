## Build Process

SvelteKit builds in two stages: Vite optimizes server/browser/service-worker code, then an adapter tunes output for the target environment. Code in `+page/layout(.server).js` files executes during build—check the `building` flag from `$app/environment` to prevent unwanted execution:

```js
import { building } from '$app/environment';
if (!building) setupDatabase();
```

Preview with `vite preview` (runs in Node, not production-identical).

## Adapters Overview

Adapters are deployment plugins configured in `svelte.config.js`. Official adapters: `adapter-cloudflare` (Workers/Pages), `adapter-netlify`, `adapter-node`, `adapter-static` (SSG), `adapter-vercel`. Platform-specific context (e.g., Cloudflare's `env` object) is passed via `RequestEvent.platform`.

## adapter-auto

Default adapter that auto-detects and installs the correct adapter at build time. Supports Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS/SST, Google Cloud Run. Install the specific adapter directly for configuration options and CI optimization.

## adapter-node

Install `@sveltejs/adapter-node`, configure in `svelte.config.js`, build with `npm run build`, run with `node build`. Requires output directory, `package.json`, and production dependencies. Environment variables: `PORT` (default 3000), `HOST` (default 0.0.0.0), `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `ADDRESS_HEADER`, `XFF_DEPTH` (for proxies), `BODY_SIZE_LIMIT` (default 512kb), `SHUTDOWN_TIMEOUT` (default 30s), `IDLE_TIMEOUT`. Adapter options: `out`, `precompress`, `envPrefix`. Graceful shutdown via `sveltekit:shutdown` event. Supports systemd socket activation. Export `handler.js` for custom servers (Express, Polka, etc.):

```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

## adapter-static

Prerender entire site as static files. Install, set `export const prerender = true` in root layout, configure:

```js
adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false,
  strict: true
})
```

Set `trailingSlash: 'always'` if host doesn't render `/a.html` for `/a`. For GitHub Pages, set `paths.base` to repo name and use `fallback: '404.html'`. Add `.nojekyll` to `static/` to prevent Jekyll interference.

## Single-Page Apps (SPA)

Disable SSR with `export const ssr = false`, use `adapter-static` with `fallback: '200.html'` (host-dependent). Significant drawbacks: multiple network round trips, poor SEO, inaccessible without JavaScript. Prerender as many pages as possible. Selectively re-enable SSR/prerender for specific pages. Apache config:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^200\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /200.html [L]
</IfModule>
```

## adapter-cloudflare

Deploy to Cloudflare Workers/Pages. Install `@sveltejs/adapter-cloudflare`, configure:

```js
adapter({
  config: undefined,
  platformProxy: { configPath, environment, persist },
  fallback: 'plaintext',
  routes: { include: ['/*'], exclude: ['<all>'] }
})
```

Wrangler config (`wrangler.jsonc`):

```jsonc
{
  "name": "<name>",
  "main": ".svelte-kit/cloudflare/_worker.js",
  "compatibility_date": "2025-01-01",
  "assets": { "binding": "ASSETS", "directory": ".svelte-kit/cloudflare" }
}
```

Access Cloudflare bindings (KV, Durable Objects) via `platform.env` in endpoints. Declare in `src/app.d.ts`:

```js
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

`_headers` and `_redirects` affect static assets only; use server endpoints for dynamic responses. Add `"compatibility_flags": ["nodejs_compat"]` for Node.js compatibility. Test with `wrangler dev .svelte-kit/cloudflare`.

## adapter-cloudflare-workers (Deprecated)

Deprecated in favor of `adapter-cloudflare`. Deploys to Cloudflare Workers using Workers Sites. Configure Wrangler, access bindings via `platform.env`, deploy with `wrangler deploy`.

## adapter-netlify

Install `@sveltejs/adapter-netlify`, configure with `edge: true` (Deno-based edge functions) or `split: true` (multiple functions). Requires `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "build"
```

Place `_headers` and `_redirects` in project root for static assets. Forms must be prerendered (`export const prerender = true`). Access Netlify context via `event.platform.context` in hooks/endpoints. Can't use `fs` in edge deployments; use `read()` from `$app/server` or prerender.

## adapter-vercel

Install `@sveltejs/adapter-vercel`. Control deployment via `export const config` in routes:

```js
export const config = {
  runtime: 'edge' | 'nodejs20.x' | 'nodejs22.x',
  regions: ['iad1'],
  split: true,
  memory: 1024,
  maxDuration: 10,
  isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```

Image optimization:

```js
adapter({
  images: {
    sizes: [640, 828, 1200, 1920, 3840],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 300,
    domains: ['example.vercel.app']
  }
})
```

Incremental Static Regeneration (ISR): set `expiration` (seconds before re-generate), `bypassToken` (≥32 chars for on-demand revalidation), `allowQuery` (query params in cache key). Access Vercel env vars via `$env/static/private` and `$env/dynamic/private`. Skew protection routes requests to original deployment via cookie; `updated.current` from `$app/state` reports new deployments. Can't use `fs` in edge functions; use `read()` from `$app/server` or prerender.

## Writing Custom Adapters

Export default function returning `Adapter` object:

```js
export default function (options) {
  return {
    name: 'adapter-name',
    async adapt(builder) {
      // Clear build dir, write via builder.write*()
      // Instantiate Server with builder.generateManifest({ relativePath })
      // Listen for requests, convert to Request, call server.respond(request, { getClientAddress })
      // Expose platform via platform option
      // Shim fetch globally if needed (@sveltejs/kit/node/polyfills)
      // Bundle output, place files correctly
    },
    async emulate() {
      return {
        async platform({ config, prerender }) {
          // becomes event.platform during dev/build/preview
        }
      }
    },
    supports: {
      read: ({ config, route }) => true,
      tracing: () => true
    }
  };
}
```

Required: `name`, `adapt`. Optional: `emulate`, `supports`.