## Server-only modules

Prevent accidental exposure of sensitive data (API keys, private environment variables) to the browser by marking code as server-only.

### Private environment variables

Import `$env/static/private` and `$env/dynamic/private` only in server-side files like `hooks.server.js` or `+page.server.js`.

### Server utilities

The `$app/server` module (containing `read()` for filesystem access) can only be imported by server-side code.

### Creating server-only modules

Two ways to mark your own modules as server-only:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

### How it works

SvelteKit prevents any import chain from public-facing code (like `+page.svelte`) to server-only code, even if only unused exports are imported:

```js
// $lib/server/secrets.js
export const apiKey = 'secret';

// src/routes/utils.js
export { apiKey } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
import { add } from './utils.js'; // ERROR: import chain includes server-only code
```

This also works with dynamic imports like `` await import(`./${foo}.js`) ``.

**Note:** Unit testing frameworks disable this check when `process.env.TEST === 'true'`.