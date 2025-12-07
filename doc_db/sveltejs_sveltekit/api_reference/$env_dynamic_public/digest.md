Dynamic environment variables that are safe to expose to client-side code. Only includes variables beginning with the configured public prefix (defaults to `PUBLIC_`).

Unlike static public environment variables, dynamic ones are sent from server to client on each request, resulting in larger network payloads. Prefer `$env/static/public` when possible.

**Usage:**
```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

The public prefix is configurable via `config.kit.env.publicPrefix`.