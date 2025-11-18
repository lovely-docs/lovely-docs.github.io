Static private environment variables loaded from `.env` files and `process.env` by Vite. Unlike `$env/dynamic/private`, values are statically injected at build time, enabling optimizations like dead code elimination. Only includes variables that don't begin with `config.kit.env.publicPrefix` and do start with `config.kit.env.privatePrefix` (if configured). Cannot be imported into client-side code.

Import example:
```ts
import { API_KEY } from '$env/static/private';
```

All environment variables referenced in code should be declared in `.env` files, even if empty:
```
MY_FEATURE_FLAG=""
```

Override values from command line:
```sh
MY_FEATURE_FLAG="enabled" npm run dev
```