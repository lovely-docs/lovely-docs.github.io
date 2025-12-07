Module for accessing private environment variables that are statically injected at build time. Variables are loaded from `.env` files and `process.env` by Vite.

**Key differences from `$env/dynamic/private`:**
- Values are statically injected into the bundle at build time (enables dead code elimination)
- Cannot be imported into client-side code
- Only includes variables that don't begin with `config.kit.env.publicPrefix` and do start with `config.kit.env.privatePrefix` (if configured)

**Usage:**
```ts
import { API_KEY } from '$env/static/private';
```

**Environment variable declaration:**
All referenced variables should be declared in `.env` files, even without values:
```
MY_FEATURE_FLAG=""
```

**Override from command line:**
```sh
MY_FEATURE_FLAG="enabled" npm run dev
```