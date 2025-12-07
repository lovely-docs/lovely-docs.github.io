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