## Server-only modules

Prevent sensitive data leaks by marking modules as server-only:
- Use `.server` suffix: `secrets.server.js`
- Or place in `$lib/server/`: `$lib/server/secrets.js`

SvelteKit errors if browser code imports server-only modules, even indirectly. Works with dynamic imports.

```js
// $lib/server/secrets.js - server-only
export const apiKey = 'secret';

// src/routes/utils.js
export { apiKey } from '$lib/server/secrets.js';

// src/routes/+page.svelte - ERROR
import { apiKey } from './utils.js'; // Cannot import server-only code
```

Note: Import detection is disabled during tests.