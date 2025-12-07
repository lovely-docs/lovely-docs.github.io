Server-side module for accessing private runtime environment variables. Cannot be used in client code. Automatically filters variables based on prefix configuration.

```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```