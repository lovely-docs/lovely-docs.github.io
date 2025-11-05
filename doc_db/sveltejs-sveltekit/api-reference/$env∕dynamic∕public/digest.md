The `$env/dynamic/public` module provides access to public environment variables at runtime in SvelteKit applications.

Public environment variables are those prefixed with `PUBLIC_` and are safe to expose to the browser. Unlike static environment variables, dynamic public variables can change at runtime and are evaluated when the application runs.

Access public environment variables using:
```javascript
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_API_URL);
```

These variables are available in both server and client code, making them useful for configuration that needs to be accessible from the browser.