## Installation

Install `@sveltejs/adapter-cloudflare` and add to `svelte.config.js`:

```js
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

## Configuration Options

- **config**: Path to Wrangler configuration file (wrangler.jsonc, wrangler.json, or wrangler.toml)
- **platformProxy**: Preferences for emulated `platform.env` local bindings
- **fallback**: `'plaintext'` for null-body 404 or `'spa'` for rendered SPA fallback page
- **routes** (Cloudflare Pages only): Customize `_routes.json` with `include` and `exclude` arrays. Special values: `<build>`, `<files>`, `<prerendered>`, `<all>`. Max 100 combined rules.

## Cloudflare Workers Setup

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

## Cloudflare Pages Setup

Build settings:
- Framework preset: SvelteKit
- Build command: `npm run build` or `vite build`
- Build output directory: `.svelte-kit/cloudflare`

Functions in `/functions` directory are not deployed. Use SvelteKit server endpoints instead, which compile to `_worker.js`.

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

Use in endpoints/hooks:

```js
export async function POST({ request, platform }) {
	const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Install `@cloudflare/workers-types` for type definitions.

## Local Testing

Cloudflare values are emulated in dev/preview modes using Wrangler configuration. Test builds with Wrangler 4:
- Workers: `wrangler dev .svelte-kit/cloudflare`
- Pages: `wrangler pages dev .svelte-kit/cloudflare`

## Headers and Redirects

Use `_headers` and `_redirects` files in project root for static assets only. For dynamic responses, use server endpoints or the `handle` hook.

## Troubleshooting

- **Node.js compatibility**: Add `"compatibility_flags": ["nodejs_compat"]` to wrangler.jsonc
- **Worker size limits**: Import large libraries client-side only
- **File system access**: Use `read()` from `$app/server` or prerender routes instead of `fs`

## Migration from Workers Sites

Replace `@sveltejs/adapter-cloudflare-workers` with `@sveltejs/adapter-cloudflare`. Remove `site` config and add `assets.directory` and `assets.binding` to Wrangler configuration.