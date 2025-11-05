

## Pages

### building-your-app
How to build a SvelteKit app and prevent code from running during the build process.

SvelteKit builds in two stages: Vite optimizes your code, then an adapter tunes it for your target environment. Prevent code execution during build by checking `building` from `$app/environment`. Preview your build with `vite preview`, though it won't perfectly match your deployed app.

### adapters
Adapters are deployment plugins configured in svelte.config.js that prepare SvelteKit apps for specific platforms.

Adapters transform built SvelteKit apps for deployment. Official adapters exist for Cloudflare, Netlify, Node, static sites, and Vercel. Configure in `svelte.config.js` with `kit.adapter`. Platform-specific context is available via `RequestEvent.platform`.

### zero-config-deployments
adapter-auto automatically detects and uses the correct deployment adapter for supported hosting platforms, with option to install specific adapters for configuration and performance.

**adapter-auto** automatically selects the correct deployment adapter based on your environment (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS SST, or Google Cloud Run).

Install the specific adapter to devDependencies for environment-specific configuration options and better CI performance. adapter-auto itself takes no options.

### node-servers
Deploy SvelteKit apps as standalone Node servers using adapter-node with environment variable configuration for proxies, ports, and graceful shutdown.

## Setup

Install `@sveltejs/adapter-node` and add to `svelte.config.js`. Build with `npm run build`, deploy `build/`, `package.json`, and `node_modules/`. Start with `node build`.

## Environment Variables

- `PORT` (3000), `HOST` (0.0.0.0), `SOCKET_PATH`
- `ORIGIN` - deployment URL
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER` - reverse proxy headers
- `ADDRESS_HEADER`, `XFF_DEPTH` - client IP detection
- `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s), `IDLE_TIMEOUT`

## Adapter Options

```js
adapter({ out: 'build', precompress: true, envPrefix: '' })
```

## Custom Server

Import `handler.js` for Express/Connect/Polka:

```js
import { handler } from './build/handler.js';
import express from 'express';
app.use(handler);
```

## Graceful Shutdown & systemd

Listen to `sveltekit:shutdown` event. Supports systemd socket activation with `LISTEN_PID`/`LISTEN_FDS`.

### static-site-generation
Configure SvelteKit to prerender your entire site as static files using adapter-static with options for output directories, SPA fallback, compression, and GitHub Pages deployment.

Install `@sveltejs/adapter-static` and set `prerender = true` in root layout. Configure adapter options: `pages`, `assets`, `fallback` (for SPA), `precompress`, `strict`. Set `trailingSlash: 'always'` if needed. For GitHub Pages, update `paths.base` to repo name and generate `404.html` fallback.

### single-page-apps
Configure SvelteKit as a client-rendered single-page app using adapter-static with a fallback page, with options to prerender individual pages.

## Single-Page App Setup

Disable SSR globally and use `adapter-static` with a fallback page:

```js
// src/routes/+layout.js
export const ssr = false;

// svelte.config.js
import adapter from '@sveltejs/adapter-static';
const config = {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

Prerender specific pages by enabling SSR and prerender for those routes:

```js
export const prerender = true;
export const ssr = true;
```

For Apache, add `.htaccess` to route unmatched requests to the fallback page.

**Warning:** SPAs have poor performance, SEO, and accessibility. Prerender as many pages as possible or use static site generation instead.

### cloudflare-deployment
Deploy SvelteKit apps to Cloudflare Workers or Pages using adapter-cloudflare with configuration options, runtime API access, and local testing setup.

## Installation

```js
import adapter from '@sveltejs/adapter-cloudflare';

const config = {
	kit: { adapter: adapter() }
};
```

## Key Options

- **fallback**: `'plaintext'` or `'spa'` for 404 handling
- **routes**: Customize `_routes.json` with `include`/`exclude` (max 100 rules)

## Cloudflare Workers

```jsonc
{
	"main": ".svelte-kit/cloudflare/_worker.js",
	"compatibility_date": "2025-01-01",
	"assets": {
		"binding": "ASSETS",
		"directory": ".svelte-kit/cloudflare"
	}
}
```

## Cloudflare Pages

Build settings: SvelteKit preset, `npm run build`, output `.svelte-kit/cloudflare`. Use server endpoints instead of `/functions` directory.

## Runtime APIs

```js
export async function POST({ platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Install `@cloudflare/workers-types` for types.

## Local Testing

`wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages)

### cloudflare-workers-deployment
Deploy SvelteKit to Cloudflare Workers using the deprecated adapter-cloudflare-workers (use adapter-cloudflare instead), configure Wrangler, and access runtime bindings through platform.env.

**Deprecated** in favor of `adapter-cloudflare`. Install `@sveltejs/adapter-cloudflare-workers` and configure Wrangler. Access Cloudflare bindings via `platform.env`. Type with `@cloudflare/workers-types`. Test locally with Wrangler 4+. Reduce worker size by client-side imports; use prerendering instead of `fs`.

### netlify
Deploy SvelteKit to Netlify using adapter-netlify with options for edge functions and function splitting, with access to Netlify-specific features like context, forms, and custom functions.

Install `@sveltejs/adapter-netlify` and configure `svelte.config.js` with `edge` and `split` options. Create `netlify.toml` with build command and publish directory. Use `edge: true` for Deno-based edge functions. Access Netlify context via `event.platform?.context`. Use `_redirects` file for redirects (higher priority than `netlify.toml`). For file system access, use `read()` from `$app/server` instead of `fs`.

### vercel-deployment
Configure and deploy SvelteKit apps to Vercel with adapter-vercel, supporting serverless/edge functions, ISR, image optimization, and environment variables.

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

### writing-adapters
Implement the Adapter API by exporting a function that returns an object with name and adapt method, where adapt handles build output, request handling, and platform integration.

## Adapter API

Export default function returning `Adapter` with required `name` and `adapt(builder)`, optional `emulate()` and `supports`.

## Adapt Method

Must clear build dir, write output via `builder.writeClient/Server/Prerendered()`, generate code that imports `Server`, instantiates with `builder.generateManifest()`, listens for requests, converts to `Request`, calls `server.respond(request, { getClientAddress })`, exposes platform via `platform` option, shims `fetch` if needed, bundles output, and places files correctly.

### build-and-deploy
Introduction to building and deploying SvelteKit applications.

Overview of building and deploying SvelteKit applications to production.

