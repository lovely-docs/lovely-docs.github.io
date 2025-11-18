## Build Process

SvelteKit builds in two stages when you run `vite build`:

1. **Vite optimization**: Creates optimized production builds of server code, browser code, and service worker. Prerendering happens here if configured.
2. **Adapter tuning**: An adapter takes the production build and optimizes it for your target environment.

## Preventing Code Execution During Build

Your `+page/layout(.server).js` files are loaded during build for analysis. Code that shouldn't run at build time must check the `building` flag:

```js
import { building } from '$app/environment';
import { setupMyDatabase } from '$lib/server/database';

if (!building) {
	setupMyDatabase();
}

export function load() {
	// ...
}
```

## Preview Your Build

After building, preview locally with `vite preview` (via `npm run preview`). This runs in Node and doesn't perfectly reproduce your deployed app — adapter-specific features like the `platform` object don't apply to previews.