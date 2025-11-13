## Including package.json data
Import JSON with type assertion:
```ts
import pkg from './package.json' with { type: 'json' };
```

## Library packaging issues
Check library compatibility with publint.dev. Key requirements:
- `exports` field takes precedence over `main`/`module`
- ESM files should end with `.mjs` (or any extension if `"type": "module"`)
- CommonJS files should end with `.cjs`
- Svelte components must be distributed as uncompiled `.svelte` files with ESM-only JS
- Use `svelte-package` for packaging Svelte libraries

## View transitions API
Trigger view transitions on client-side navigation:
```js
import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
```

## Database setup
Query databases in server routes, not `.svelte` files. Create a `db.js` singleton and import it into endpoints. Use `hooks.server.js` for one-time setup.

## Client-side library access
Wrap code accessing `document`/`window` in a `browser` check:
```js
import { browser } from '$app/environment';
if (browser) { /* client code */ }
```

Or use `onMount`, `{#await}` blocks, or dynamic imports with tree-shaking.

## External API server
Use `event.fetch` but handle CORS. Better approach: set up a proxy (Vite's `server.proxy` for dev, rewrite rules in production) or create an API route:
```js
export function GET({ params, url }) {
	return fetch(`https://example.com/${params.path + url.search}`);
}
```

## Middleware
For production: use `adapter-node` middleware. For dev: add a Vite plugin with `configureServer`.

## Yarn compatibility
Yarn 2: Plug'n'Play is broken with ESM. Use `nodeLinker: 'node-modules'` or switch to npm/pnpm.
Yarn 3: ESM support is experimental. Add `nodeLinker: node-modules` to `.yarnrc.yml`.