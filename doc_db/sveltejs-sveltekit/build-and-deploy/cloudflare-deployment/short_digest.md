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