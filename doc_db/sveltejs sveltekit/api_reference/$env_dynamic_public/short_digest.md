Access public dynamic environment variables (prefixed with `PUBLIC_` by default) that are sent to the client:

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

Use `$env/static/public` instead when possible for better performance.