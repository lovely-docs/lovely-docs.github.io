The `$env/dynamic/public` module provides runtime access to public environment variables (prefixed with `PUBLIC_`) in both server and client code.

```javascript
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_API_URL);
```