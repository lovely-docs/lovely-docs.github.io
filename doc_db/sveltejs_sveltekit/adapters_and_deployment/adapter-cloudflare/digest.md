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