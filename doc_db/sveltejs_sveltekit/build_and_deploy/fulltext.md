

## Pages

### building_your_app
SvelteKit's two-stage build process: Vite optimization followed by adapter-specific tuning; prevent unwanted build-time execution with the `building` flag.

SvelteKit builds in two stages: Vite optimizes your code, then an adapter tunes it for your target environment. Prevent build-time code execution by checking `building` from `$app/environment`:

```js
import { building } from '$app/environment';
if (!building) {
	setupMyDatabase();
}
```

Preview with `vite preview`, but note it doesn't perfectly reproduce your deployed app.

### adapters
Adapters are plugins that prepare SvelteKit apps for deployment to specific platforms.

Adapters are deployment plugins configured in `svelte.config.js`. Official adapters exist for Cloudflare, Netlify, Node, static sites, and Vercel. Platform-specific context is accessible via `RequestEvent.platform`.

### zero-config_deployments
adapter-auto automatically selects the correct deployment adapter based on the environment, with support for major platforms and the ability to add community adapters.

## adapter-auto

Default adapter that auto-detects deployment environment and uses the correct adapter (Cloudflare, Netlify, Vercel, Azure, AWS SST, or Google Cloud Run).

Install the specific adapter to `devDependencies` for better CI performance and to use environment-specific configuration options. `adapter-auto` itself takes no options.

### node_servers
Configure and deploy SvelteKit apps as standalone Node servers with environment-based configuration for ports, origins, proxies, and graceful shutdown.

## Setup

```js
import adapter from '@sveltejs/adapter-node';
const config = { kit: { adapter: adapter() } };
```

Build with `npm run build`, deploy `build/`, `package.json`, and `node_modules/`. Start with `node build`.

## Environment Variables

- `PORT`, `HOST`: server binding (default 0.0.0.0:3000)
- `SOCKET_PATH`: Unix socket instead of PORT/HOST
- `ORIGIN`: deployment URL (e.g., `https://my.site`)
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`: for reverse proxies
- `ADDRESS_HEADER`, `XFF_DEPTH`: client IP detection behind proxies
- `BODY_SIZE_LIMIT`: max request body (default 512kb)
- `SHUTDOWN_TIMEOUT`: graceful shutdown wait time (default 30s)
- `IDLE_TIMEOUT`: auto-sleep with systemd socket activation

Production `.env` loading requires: `node -r dotenv/config build` or `node --env-file=.env build` (Node v20.6+)

## Options

```js
adapter({ out: 'build', precompress: true, envPrefix: '' })
```

## Custom Server

```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

Graceful shutdown via `process.on('sveltekit:shutdown', async (reason) => {...})`

### static_site_generation
Configure adapter-static for prerendering your entire SvelteKit site as static files, with options for SPA fallback, compression, and GitHub Pages deployment.

## Setup

Install `@sveltejs/adapter-static` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};

export default config;
```

Add `export const prerender = true;` to root layout.

## Key Options

- **pages/assets**: Output directories
- **fallback**: For SPA mode (e.g., `200.html` or `404.html`)
- **precompress**: Generate `.br` and `.gz` files
- **strict**: Validate all pages are prerendered (default: true)

## GitHub Pages

Set `config.kit.paths.base` to repo name and use `fallback: '404.html'`. Add `.nojekyll` to `static` directory.

### single-page_apps
Configure SvelteKit apps as client-rendered single-page apps using adapter-static with a fallback page, with options to prerender specific pages.

## Creating SPAs

Disable SSR in root layout and use `adapter-static` with `fallback` option:
```js
// src/routes/+layout.js
export const ssr = false;

// svelte.config.js
import adapter from '@sveltejs/adapter-static';
const config = {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

Prerender specific pages by setting both `prerender` and `ssr` to true. SPAs have major performance and SEO drawbacks—prerender as many pages as possible.

### cloudflare
Deploy SvelteKit to Cloudflare Workers or Pages using adapter-cloudflare with configuration options, runtime API access, and troubleshooting guidance.

## Setup

Install `@sveltejs/adapter-cloudflare` and configure in `svelte.config.js` with options for config path, platformProxy, fallback behavior, and routes.

## Cloudflare Workers

Create `wrangler.jsonc` with `main: ".svelte-kit/cloudflare/_worker.js"` and `assets` binding.

## Cloudflare Pages

Build command: `npm run build`, output: `.svelte-kit/cloudflare`. Use SvelteKit server endpoints instead of `/functions` directory.

## Runtime APIs

Access bindings via `platform.env` after installing `@cloudflare/workers-types` and declaring in `src/app.d.ts`.

## Troubleshooting

- Enable Node.js: `"compatibility_flags": ["nodejs_compat"]`
- File access: Use `read()` from `$app/server` instead of `fs`
- Large libraries: Import client-side only

### cloudflare_workers_adapter
Deprecated adapter for deploying SvelteKit to Cloudflare Workers with Workers Sites; use adapter-cloudflare instead.

**Deprecated** in favor of `adapter-cloudflare`. Install `@sveltejs/adapter-cloudflare-workers`, configure `wrangler.jsonc`, and deploy with `wrangler deploy`. Access Cloudflare bindings via `platform.env`. Enable Node.js compatibility if needed. Prerender routes instead of using `fs`.

### netlify_adapter
How to deploy SvelteKit apps to Netlify using the adapter with configuration options for edge functions, redirects, forms, and accessing Netlify-specific context.

Install `@sveltejs/adapter-netlify` and configure in `svelte.config.js` with `edge` and `split` options. Requires `netlify.toml` with build settings. Access Netlify context via `event.platform.context` in server endpoints. Use `_headers` and `_redirects` files for routing. For file access, use `read()` from `$app/server` instead of `fs`.

### vercel_adapter
Deploy SvelteKit apps to Vercel with per-route configuration for runtime, regions, memory, ISR caching, and image optimization.

## Setup
```js
import adapter from '@sveltejs/adapter-vercel';
const config = { kit: { adapter: adapter() } };
```

## Route Configuration
```js
export const config = {
	split: true,
	runtime: 'edge',
	regions: ['iad1'],
	memory: 1024,
	maxDuration: 15
};
```

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

## Key Points
- Configure per-route via `+server.js`, `+page(.server).js`, `+layout(.server).js`
- Use `$env/static/private` for Vercel environment variables
- Use `read()` from `$app/server` for file access (not `fs`)
- Enable Skew Protection in project settings to route to original deployment

### writing_adapters
Guide to implementing custom SvelteKit adapters by defining the required API structure and adapt method responsibilities.

## Adapter API

Export a function returning an `Adapter` object with required `name` and `adapt(builder)` properties, plus optional `emulate()` and `supports` methods.

## Adapt Implementation

The `adapt` method must:
- Clear build directory
- Write output via `builder.writeClient/Server/Prerendered()`
- Generate code that imports `Server`, creates app with `builder.generateManifest()`, converts platform requests to `Request`, calls `server.respond()`, and returns `Response`
- Expose platform info via `platform` option
- Shim `fetch` globally if needed
- Bundle output and place files in platform-appropriate locations

