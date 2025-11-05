**Deprecation Notice**: `adapter-cloudflare-workers` is deprecated in favor of `adapter-cloudflare` with Static Assets.

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

**Adapter Options**:
- `config`: Path to Wrangler configuration file (if not using default names)
- `platformProxy`: Preferences for emulated `platform.env` local bindings

**Runtime APIs**: Access Cloudflare bindings (KV, Durable Objects) via `platform.env` in hooks and endpoints:
```js
export async function POST({ platform }) {
  const x = platform?.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');
}
```

Type bindings in `src/app.d.ts` using `@cloudflare/workers-types`.

**Local Testing**: Bindings are emulated in dev/preview modes based on Wrangler config. Use Wrangler 4+ to test builds with `wrangler dev`.

**Troubleshooting**:
- Enable Node.js compatibility with `"compatibility_flags": ["nodejs_compat"]`
- Worker size limits: reduce by importing large libraries client-side only
- File system access: use prerendering instead of `fs`