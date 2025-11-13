**Deprecated Notice**: `adapter-cloudflare-workers` is deprecated in favor of `adapter-cloudflare` with Static Assets.

**Installation & Setup**:
```js
import adapter from '@sveltejs/adapter-cloudflare-workers';
export default {
  kit: { adapter: adapter() }
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

**Options**:
- `config`: Path to Wrangler configuration file (defaults to `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`)
- `platformProxy`: Preferences for emulated `platform.env` local bindings

**Runtime APIs**: Access Cloudflare bindings (KV, Durable Objects) via `platform.env` in hooks and endpoints. Install `@cloudflare/workers-types` and declare types in `src/app.d.ts`:
```ts
import { KVNamespace, DurableObjectNamespace } from '@cloudflare/workers-types';
declare global {
  namespace App {
    interface Platform {
      env?: {
        YOUR_KV_NAMESPACE: KVNamespace;
        YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
      };
    }
  }
}
```

**Deployment**: `wrangler deploy`

**Troubleshooting**:
- Enable Node.js compatibility with `"compatibility_flags": ["nodejs_compat"]`
- Worker size limits: reduce by importing large libraries client-side only
- File system access: use prerendering instead of `fs`