## Installation and Setup

Install `@sveltejs/adapter-cloudflare` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-cloudflare';

const config = {
	kit: {
		adapter: adapter({
			config: undefined,
			platformProxy: { configPath: undefined, environment: undefined, persist: undefined },
			fallback: 'plaintext',
			routes: { include: ['/*'], exclude: ['<all>'] }
		})
	}
};
export default config;
```

## Adapter Options

- **config**: Path to Wrangler configuration file (wrangler.jsonc, wrangler.json, or wrangler.toml)
- **platformProxy**: Preferences for emulated `platform.env` local bindings
- **fallback**: `'plaintext'` for null-body 404 or `'spa'` for rendered SPA fallback page
- **routes** (Cloudflare Pages only): Customize `_routes.json` with `include` and `exclude` patterns. Supports `<build>`, `<files>`, `<prerendered>`, `<all>` special values. Max 100 combined rules.

## Cloudflare Workers Configuration

Create `wrangler.jsonc`:

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

## Cloudflare Pages Deployment

Build settings:
- Framework preset: SvelteKit
- Build command: `npm run build` or `vite build`
- Build output directory: `.svelte-kit/cloudflare`

Functions in `/functions` directory are not deployed; use SvelteKit server endpoints instead.

## Runtime APIs

Access Cloudflare bindings via `platform.env`:

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

Install `@cloudflare/workers-types` and reference in `src/app.d.ts`. Bindings are emulated during dev/preview based on Wrangler config. Test builds with `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

## Troubleshooting

- **Node.js compatibility**: Add `"compatibility_flags": ["nodejs_compat"]` to wrangler.jsonc
- **Worker size limits**: Import large libraries client-side only
- **File system access**: Use `read()` from `$app/server` instead of `fs`, or prerender routes
- **Headers/redirects**: Use `_headers` and `_redirects` files for static assets; use server endpoints or `handle` hook for dynamic responses

## Migration from Workers Sites

Replace `@sveltejs/adapter-cloudflare-workers` with `@sveltejs/adapter-cloudflare`. Remove `site` config and add `assets.directory` and `assets.binding` to Wrangler config.