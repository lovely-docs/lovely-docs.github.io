## Server-only modules

SvelteKit prevents accidental exposure of sensitive data (API keys, private environment variables) to the browser by enforcing server-only module restrictions.

### Private environment variables

The `$env/static/private` and `$env/dynamic/private` modules can only be imported in server-only contexts like `hooks.server.js` or `+page.server.js`.

### Server-only utilities

The `$app/server` module (containing a `read` function for filesystem access) can only be imported by server-side code.

### Creating server-only modules

Two ways to mark modules as server-only:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

### How it works

SvelteKit analyzes import chains and errors if public-facing code (browser code) imports server-only modules, even indirectly or if only unused exports are imported.

Example that fails:
```js
// $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];

// src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
<script>
  import { add } from './utils.js';  // ERROR: utils.js imports server-only code
</script>
```

Error message: "Cannot import $lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information."

The error occurs even though only `add` is used, because the secret code could end up in browser JavaScript.

Works with dynamic imports including interpolated ones like `await import(`./${foo}.js`)`.

### Testing note

Unit testing frameworks like Vitest don't distinguish between server-only and public code, so illegal import detection is disabled when `process.env.TEST === 'true'`.