

## Pages

### building-your-app
Two-stage build: Vite optimizes, adapter tunes for environment; skip build-time execution with `building` flag check; preview with `vite preview` (Node-based, not production-identical).

## Build Process

SvelteKit builds happen in two stages via `vite build` (usually `npm run build`):

1. **Vite optimization**: Creates optimized production builds of server code, browser code, and service worker. Prerendering executes at this stage if configured.
2. **Adapter tuning**: An adapter takes the production build and optimizes it for the target deployment environment.

## Code Execution During Build

SvelteKit loads `+page/layout(.server).js` files and their imports during the build for analysis. Code that should not execute at build time must check the `building` flag from `$app/environment`:

```js
import { building } from '$app/environment';
import { setupMyDatabase } from '$lib/server/database';

if (!building) {
	setupMyDatabase();
}

export function load() {
	// ...
}
```

## Preview

After building, preview the production build locally with `vite preview` (via `npm run preview`). This runs in Node and is not a perfect reproduction of the deployed app — adapter-specific features like the `platform` object don't apply to previews.

### adapters
Adapters are deployment plugins configured in svelte.config.js; official ones target Cloudflare, Netlify, Node, static, Vercel; platform context passed via RequestEvent.platform.

## Purpose
Adapters are plugins that transform a built SvelteKit app into deployment-ready output for specific platforms.

## Official Adapters
- `@sveltejs/adapter-cloudflare` — Cloudflare Workers and Cloudflare Pages
- `@sveltejs/adapter-netlify` — Netlify
- `@sveltejs/adapter-node` — Node servers
- `@sveltejs/adapter-static` — Static site generation (SSG)
- `@sveltejs/adapter-vercel` — Vercel

Community adapters available for other platforms.

## Configuration
Adapters are configured in `svelte.config.js`:

```js
import adapter from 'svelte-adapter-foo';

const config = {
	kit: {
		adapter: adapter({
			// adapter options go here
		})
	}
};

export default config;
```

## Platform-Specific Context
Some adapters provide access to platform-specific information (e.g., Cloudflare's `env` object with KV namespaces). This is passed to `RequestEvent` in hooks and server routes via the `platform` property. Consult adapter documentation for details.

### zero-config-deployments
adapter-auto automatically selects and installs the correct deployment adapter based on platform detection; supports Cloudflare, Netlify, Vercel, Azure, AWS/SST, Google Cloud; install specific adapter for config options and CI optimization.

## Zero-config deployments with adapter-auto

`adapter-auto` is the default adapter installed when creating a new SvelteKit project with `npx sv create`. It automatically detects and installs the correct adapter for your deployment environment at build time.

### Supported environments

- Cloudflare Pages via `@sveltejs/adapter-cloudflare`
- Netlify via `@sveltejs/adapter-netlify`
- Vercel via `@sveltejs/adapter-vercel`
- Azure Static Web Apps via `svelte-adapter-azure-swa`
- AWS via SST using `svelte-kit-sst`
- Google Cloud Run via `@sveltejs/adapter-node`

### Installation recommendation

Once you've chosen a target environment, install the specific adapter to your `devDependencies`. This adds the adapter to your lockfile and improves install times on CI.

### Environment-specific configuration

To use configuration options like `{ edge: true }` in adapter-vercel or adapter-netlify, you must install the underlying adapter directly. `adapter-auto` does not accept any configuration options itself.

### Adding community adapters

Community adapters can be added to zero-config support by editing the `adapters.js` file in the adapter-auto package and opening a pull request to the SvelteKit repository.

### adapter-node
Node.js adapter for SvelteKit: install, configure in svelte.config.js, build and run with `node build`. Configure via env vars (PORT, HOST, ORIGIN, PROTOCOL_HEADER, HOST_HEADER, ADDRESS_HEADER, XFF_DEPTH, BODY_SIZE_LIMIT, SHUTDOWN_TIMEOUT, IDLE_TIMEOUT). Adapter options: out, precompress, envPrefix. Graceful shutdown with sveltekit:shutdown event. Supports systemd socket activation. Export handler.js for custom servers.

## Usage

Install with `npm i -D @sveltejs/adapter-node`, then add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Deploying

Build with `npm run build` (outputs to `build` by default). To run: `node build`

You need the output directory, `package.json`, and production dependencies. Generate production dependencies with `npm ci --omit dev`. Development dependencies are bundled via Rollup; control bundling by placing packages in `devDependencies` (bundled) or `dependencies` (external).

## Compression

For custom servers, use `@polka/compression` instead of the popular `compression` package, as SvelteKit streams responses and `compression` doesn't support streaming.

## Environment Variables

In dev/preview, `.env` files are auto-loaded. In production, manually load with:
```sh
node -r dotenv/config build
# or Node.js v20.6+:
node --env-file=.env build
```

### Connection Configuration

**`PORT`, `HOST`, `SOCKET_PATH`**: Default is `0.0.0.0:3000`
```sh
HOST=127.0.0.1 PORT=4000 node build
SOCKET_PATH=/tmp/socket node build
```

**`ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`**: Tell SvelteKit the request URL
```sh
ORIGIN=https://my.site node build
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build
```

**`ADDRESS_HEADER`, `XFF_DEPTH`**: Get client IP from headers when behind proxies
```sh
ADDRESS_HEADER=True-Client-IP node build
```
For `X-Forwarded-For` with multiple proxies, use `XFF_DEPTH=3` to read from the right (prevents spoofing).

**`BODY_SIZE_LIMIT`**: Max request body in bytes (supports K/M/G suffixes, defaults to 512kb)
```sh
BODY_SIZE_LIMIT=1M node build
```

**`SHUTDOWN_TIMEOUT`**: Seconds to wait before forcefully closing connections on SIGTERM/SIGINT (defaults to 30)

**`IDLE_TIMEOUT`**: Seconds before auto-sleep with systemd socket activation

## Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli compression for assets
	envPrefix: ''           // prefix for env vars (e.g., 'MY_CUSTOM_')
})
```

With `envPrefix: 'MY_CUSTOM_'`, use `MY_CUSTOM_HOST`, `MY_CUSTOM_PORT`, `MY_CUSTOM_ORIGIN`, etc.

## Graceful Shutdown

On SIGTERM/SIGINT, the server:
1. Rejects new requests
2. Waits for in-flight requests to finish
3. Closes remaining connections after `SHUTDOWN_TIMEOUT`

Listen to `sveltekit:shutdown` event for cleanup:
```js
process.on('sveltekit:shutdown', async (reason) => {
  await jobs.stop();
  await db.close();
});
```

`reason` is `SIGINT`, `SIGTERM`, or `IDLE`.

## Socket Activation

For systemd socket activation, the OS passes `LISTEN_PID` and `LISTEN_FDS` env vars. The adapter listens on file descriptor 3.

Example systemd service:
```ini
[Service]
Environment=NODE_ENV=production IDLE_TIMEOUT=60
ExecStart=/usr/bin/node /usr/bin/myapp/build
```

Example socket unit:
```ini
[Socket]
ListenStream=3000

[Install]
WantedBy=sockets.target
```

Enable with `sudo systemctl enable --now myapp.socket`.

## Custom Server

The build outputs `index.js` (standalone server) and `handler.js` (middleware). Use `handler.js` with Express, Connect, Polka, or Node's `http.createServer`:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();
app.get('/healthcheck', (req, res) => res.end('ok'));
app.use(handler);
app.listen(3000);
```

### adapter-static
Static site generator adapter with options for output directories, SPA fallback, compression, and strict mode; GitHub Pages support with base path configuration and 404 fallback.

## Static Site Generation with adapter-static

Use `@sveltejs/adapter-static` to prerender your entire SvelteKit site as static files. For partial prerendering, use a different adapter with the `prerender` option.

### Installation and Setup

```js
// svelte.config.js
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

```js
// src/routes/+layout.js
export const prerender = true;
```

### Configuration Options

- **pages**: Directory for prerendered pages (default: `build`)
- **assets**: Directory for static assets and generated JS/CSS (default: same as `pages`)
- **fallback**: Fallback page for SPA mode (e.g., `200.html` or `404.html`). Has negative performance/SEO impacts; only use for specific cases like mobile app wrapping
- **precompress**: If `true`, generates `.br` and `.gz` compressed files
- **strict**: By default checks that all pages/endpoints are prerendered or fallback is set. Set to `false` to disable this check

### Important Notes

Set `trailingSlash` appropriately: if your host doesn't render `/a.html` for `/a` requests, use `trailingSlash: 'always'` to create `/a/index.html` instead.

### Zero-config Platforms

Vercel has zero-config support. Omit adapter options to let `adapter-static` provide optimal configuration:

```js
const config = {
	kit: {
		adapter: adapter()
	}
};
```

### GitHub Pages Deployment

Update `config.kit.paths.base` to match your repo name (site serves from `https://your-username.github.io/your-repo-name`):

```js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};
export default config;
```

Generate a custom `404.html` fallback to replace GitHub Pages' default 404.

### GitHub Actions Deployment Example

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: 'main'

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm i
      - run: npm run build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'build/'

  deploy:
    needs: build_site
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

If not using GitHub Actions, add an empty `.nojekyll` file in `static/` to prevent Jekyll interference.

### single-page-apps
SPA mode via fallback page: disable SSR in root layout, use adapter-static with fallback option, selectively prerender pages; includes Apache .htaccess config and performance warnings.

## Single-Page Apps (SPA) Mode

Turn a SvelteKit app into a fully client-rendered SPA by specifying a fallback page that serves any URLs not handled by other means (prerendered pages, etc).

### Performance Warnings

SPA mode has significant drawbacks:
- Multiple network round trips required (HTML, JavaScript, data) before content displays
- Delays startup, especially on mobile with high latency
- Harms SEO: sites often downranked for performance, fails Core Web Vitals, excluded from search engines that don't render JS
- Makes app inaccessible if JavaScript fails or is disabled

Mitigation: prerender as many pages as possible (especially homepage). If all pages can be prerendered, use static site generation instead. Otherwise, use an adapter supporting server-side rendering.

### Usage

Disable SSR for pages to serve via fallback:
```js
// src/routes/+layout.js
export const ssr = false;
```

With no server-side logic, use `adapter-static`:
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '200.html' // host-dependent
		})
	}
};

export default config;
```

The fallback page is HTML generated from your template (e.g. `app.html`) that loads the app and navigates to the correct route. Different hosts use different fallback names (e.g., Surge uses `200.html`). Avoid `index.html` to prevent conflicts with prerendering. Fallback pages always use absolute asset paths (starting with `/`) regardless of `paths.relative` config.

### Prerendering Individual Pages

Re-enable `ssr` and `prerender` for specific pages:
```js
// src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

No Node server needed to deploy; page is server-rendered during build to output static `.html`.

### Apache Configuration

Add `static/.htaccess` to route requests to fallback:
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

### adapter-cloudflare
Cloudflare adapter: install @sveltejs/adapter-cloudflare, configure with platformProxy/fallback/routes options, set up wrangler.jsonc with assets binding, access platform.env bindings (KV/Durable Objects) in endpoints, use server endpoints not /functions, static _headers/_redirects only, troubleshoot with nodejs_compat flag and client-side imports.

## Cloudflare adapter for SvelteKit

Deploy to Cloudflare Workers or Cloudflare Pages using `@sveltejs/adapter-cloudflare`. Installed by default with `adapter-auto`; switch to it directly for local `event.platform` emulation, automatic type declarations, and Cloudflare-specific options.

### Comparisons
- `adapter-cloudflare` – all SvelteKit features; builds for Workers Static Assets and Pages
- `adapter-cloudflare-workers` – deprecated; all features; builds for Workers Sites
- `adapter-static` – client-side only; compatible with Workers Static Assets and Pages

### Installation and setup
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

const config = {
	kit: {
		adapter: adapter({
			config: undefined,
			platformProxy: {
				configPath: undefined,
				environment: undefined,
				persist: undefined
			},
			fallback: 'plaintext',
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	}
};
export default config;
```

### Options
- **config**: Path to Wrangler configuration file (wrangler.jsonc, wrangler.json, or wrangler.toml)
- **platformProxy**: Preferences for emulated `platform.env` local bindings (see Wrangler getPlatformProxy API docs)
- **fallback**: `'plaintext'` (default) or `'spa'` for 404 handling. For Workers, returns null-body 404 unless `assets.not_found_handling` is `"404-page"` or `"single-page-application"`. For Pages, served when request matches `routes.exclude` but fails asset match.
- **routes** (Pages only): Customize `_routes.json` generation
  - `include`: routes invoking functions (default `['/*']`)
  - `exclude`: routes NOT invoking functions (faster/cheaper static serving). Special values: `<build>`, `<files>`, `<prerendered>`, `<all>` (default)
  - Max 100 combined include/exclude rules

### Cloudflare Workers configuration
```jsonc
// wrangler.jsonc
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

### Cloudflare Pages deployment
Build settings:
- Framework preset: SvelteKit
- Build command: `npm run build` or `vite build`
- Build output directory: `.svelte-kit/cloudflare`

Functions in `/functions` directory are NOT deployed; use SvelteKit server endpoints instead (compiled to single `_worker.js`).

### Runtime APIs
Access Cloudflare bindings (KV/Durable Objects) via `platform.env`:
```js
// src/app.d.ts
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';

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

```js
// +server.js
export async function POST({ request, platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Cloudflare values emulated in dev/preview modes using Wrangler config bindings. Use `platformProxy` option to customize. For testing builds: `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages) with Wrangler v4+.

### Headers and redirects
`_headers` and `_redirects` files in project root affect static assets only. For dynamic responses, use server endpoints or `handle` hook.

### Troubleshooting
- **Node.js compatibility**: Add `"compatibility_flags": ["nodejs_compat"]` to wrangler.jsonc
- **Worker size limits**: If bundled worker exceeds size limits, import large libraries client-side only
- **File system access**: Can't use `fs`; use `read()` from `$app/server` to fetch from deployed assets, or prerender routes

### Migration from Workers Sites
Replace `@sveltejs/adapter-cloudflare-workers` with `@sveltejs/adapter-cloudflare`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';
const config = { kit: { adapter: adapter() } };
export default config;
```

Remove `site` config, add `assets` config:
```jsonc
// wrangler.jsonc
{
	"assets": {
		"directory": ".svelte-kit/cloudflare",
		"binding": "ASSETS"
	}
}
```

### adapter-cloudflare-workers
Deprecated adapter for deploying SvelteKit to Cloudflare Workers with Workers Sites; configure Wrangler, access bindings via platform.env, deploy with wrangler deploy.

**DEPRECATED**: This adapter is deprecated in favor of `adapter-cloudflare` with Static Assets.

Deploys SvelteKit apps to Cloudflare Workers using Workers Sites.

**Installation & Setup**:
```js
npm i -D @sveltejs/adapter-cloudflare-workers
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare-workers';
export default {
  kit: { adapter: adapter({ /* options */ }) }
};
```

**Wrangler Configuration** (`wrangler.jsonc`):
```jsonc
{
  "name": "<service-name>",
  "account_id": "<account-id>",
  "main": "./.cloudflare/worker.js",
  "site": { "bucket": "./.cloudflare/public" },
  "build": { "command": "npm run build" },
  "compatibility_date": "2021-11-12"
}
```
Get account_id from `wrangler whoami` or Cloudflare dashboard URL. Add `.cloudflare` and `.wrangler` to `.gitignore`.

**Options**:
- `config`: Path to Wrangler config file (defaults to `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`)
- `platformProxy`: Preferences for emulated `platform.env` local bindings (see Wrangler getPlatformProxy API docs)

**Runtime APIs**:
Access Cloudflare bindings via `platform` property in hooks/endpoints:
```js
// src/app.d.ts
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';
declare global {
  namespace App {
    interface Platform {
      env?: {
        YOUR_KV_NAMESPACE: KVNamespace;
        YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
      };
      ctx?: any;
      caches?: any;
      cf?: any;
    }
  }
}

// +server.js
export async function POST({ request, platform }) {
  const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

**Local Testing**: Bindings are emulated in dev/preview modes based on Wrangler config. Use `platformProxy` option to customize. For build testing, use Wrangler v4 and run `wrangler dev`.

**Deployment**: `wrangler deploy`

**Troubleshooting**:
- **Node.js compatibility**: Add `"compatibility_flags": ["nodejs_compat"]` to wrangler.jsonc
- **Worker size limits**: If exceeding size limits, import large libraries client-side only
- **File system access**: Can't use `fs` in Workers; prerender affected routes instead

### adapter-netlify
Netlify adapter: install, configure with edge/split options, set up netlify.toml, use _redirects for routing, prerender forms, access platform context in endpoints, use $app/server read() for files.

## Installation and Setup

Install with `npm i -D @sveltejs/adapter-netlify` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter({
			edge: false,      // use Netlify Edge Functions (Deno-based) instead of Node
			split: false      // split app into multiple functions instead of one
		})
	}
};
export default config;
```

Requires a `netlify.toml` file in project root:
```toml
[build]
	command = "npm run build"
	publish = "build"
```

If missing, defaults to `publish = "build"`. Node LTS is used by default for new projects.

## Netlify Edge Functions

Set `edge: true` to deploy server-side rendering to Deno-based edge functions deployed close to visitors, instead of Node-based Netlify Functions.

## Netlify-Specific Features

**`_headers` and `_redirects` files**: Place in project root for static asset responses. Redirect rules are automatically appended to `_redirects` during compilation. Note: `_redirects` has higher priority than `[[redirects]]` in `netlify.toml`, so always use the `_redirects` file. Avoid custom catch-all rules like `/* /foobar/:splat` as they prevent automatic rules from being applied.

**Netlify Forms**: Create HTML forms as described in Netlify docs. Forms must be prerendered as HTML—add `export const prerender = true` to the page or set `kit.prerender.force: true`. If using custom success messages like `<form netlify ... action="/success">`, ensure the corresponding success page exists and is prerendered.

**Netlify Functions**: SvelteKit endpoints are hosted as Netlify Functions. Access Netlify context (including Identity info) via `event.platform.context` in hooks and server endpoints:

```js
export const load = async (event) => {
	const context = event.platform?.context;
	console.log(context);
};
```

Add custom functions by creating a directory and configuring in `netlify.toml`:
```toml
[functions]
	directory = "functions"
```

## Troubleshooting

**File system access**: Can't use `fs` in edge deployments. In serverless deployments, files aren't copied to deployment, so use the `read` function from `$app/server` instead (works in both edge and serverless). Alternatively, prerender routes.

### adapter-vercel
Vercel adapter for SvelteKit with deployment config (runtime, regions, split, memory, maxDuration), ISR (expiration, bypassToken, allowQuery), image optimization, environment variables, skew protection, and file system access via $app/server.

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

### writing-adapters
Adapter API: export function returning {name, adapt(builder), emulate?(), supports?{read(), tracing()}}; adapt() must clear build, write via builder.write*, instantiate with builder.generateManifest(), listen/convert requests to Request, call server.respond(request, {getClientAddress}), expose platform via platform option, shim fetch globally if needed, bundle, place files correctly.

## Adapter API

An adapter package must export a default function that returns an `Adapter` object:

```js
export default function (options) {
	const adapter = {
		name: 'adapter-package-name',
		async adapt(builder) {
			// adapter implementation
		},
		async emulate() {
			return {
				async platform({ config, prerender }) {
					// becomes event.platform during dev, build, preview
				}
			}
		},
		supports: {
			read: ({ config, route }) => {
				// Return true if route can use read() from $app/server in production
			},
			tracing: () => {
				// Return true if adapter supports loading tracing.server.js
			}
		}
	};
	return adapter;
}
```

Required properties: `name` and `adapt`. Optional: `emulate` and `supports`.

## Adapt Method Requirements

The `adapt` method must:

1. Clear the build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Output code that:
   - Imports `Server` from `${builder.getServerDirectory()}/index.js`
   - Instantiates app with manifest from `builder.generateManifest({ relativePath })`
   - Listens for platform requests, converts to standard `Request` if needed
   - Calls `server.respond(request, { getClientAddress })` to generate `Response`
   - Exposes platform-specific info via `platform` option to `server.respond()`
   - Globally shims `fetch` if necessary (SvelteKit provides `@sveltejs/kit/node/polyfills` for undici-compatible platforms)
4. Bundle output to avoid requiring dependencies on target platform (if necessary)
5. Place static files and generated JS/CSS in correct location for target platform

Recommended: place adapter output under `build/` with intermediate output under `.svelte-kit/[adapter-name]`.

