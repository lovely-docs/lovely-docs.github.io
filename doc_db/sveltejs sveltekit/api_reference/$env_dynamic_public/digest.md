Provides access to public dynamic environment variables that begin with the configured public prefix (defaults to `PUBLIC_`). These variables are safe to expose to client-side code.

Public dynamic environment variables are sent from server to client, resulting in larger network requests. When possible, prefer `$env/static/public` for better performance.

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```