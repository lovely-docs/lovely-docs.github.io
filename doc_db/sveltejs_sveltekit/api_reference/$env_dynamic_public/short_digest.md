Dynamic environment variables prefixed with `PUBLIC_` (configurable) that are sent to the client. Use `$env/static/public` instead when possible to avoid larger network requests.

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```