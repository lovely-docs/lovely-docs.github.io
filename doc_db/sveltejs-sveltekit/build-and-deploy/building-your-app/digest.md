## Build Process

SvelteKit builds happen in two stages via `vite build` (or `npm run build`):

1. **Vite optimization**: Creates optimized production builds of server code, browser code, and service worker. Prerendering executes at this stage if configured.
2. **Adapter tuning**: An adapter takes the production build and optimizes it for your target environment.

## Avoiding Code Execution During Build

SvelteKit loads `+page/layout(.server).js` files and their imports during the build for analysis. Code that shouldn't execute at build time must check the `building` flag from `$app/environment`:

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

After building, preview the production build locally with `vite preview` (or `npm run preview`). This runs in Node and doesn't perfectly reproduce your deployed app — adapter-specific features like the `platform` object don't apply to previews.