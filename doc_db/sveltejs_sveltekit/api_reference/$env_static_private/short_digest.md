Static private environment variables injected at build time from `.env` files. Cannot be used in client-side code. Values are statically injected enabling dead code elimination.

```ts
import { API_KEY } from '$env/static/private';
```

Declare all referenced variables in `.env` and override via command line: `MY_FEATURE_FLAG="enabled" npm run dev`