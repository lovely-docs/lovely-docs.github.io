## Server-only modules

SvelteKit prevents accidental exposure of sensitive data (API keys, private environment variables) to the browser by enforcing server-only module restrictions.

### Private environment variables

The `$env/static/private` and `$env/dynamic/private` modules can only be imported in server-only contexts like `hooks.server.js` or `+page.server.js`.

### Server-only utilities

The `$app/server` module (containing the `read` function for filesystem access) can only be imported by server-side code.

### Creating server-only modules

Two approaches:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

### How it works

If public-facing code (like a Svelte component) imports server-only code—even indirectly through a utility module—SvelteKit throws an error:

```js
// $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];

// src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
import { add } from './utils.js'; // ERROR: Cannot import server-only code
```

The error occurs even if only `add` is used, because the secret code could leak into browser JavaScript. This applies to dynamic imports including interpolated ones.

### Testing caveat

Unit testing frameworks like Vitest don't distinguish between server and public code, so illegal import detection is disabled when `process.env.TEST === 'true'`.