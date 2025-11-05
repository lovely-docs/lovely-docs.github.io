## Package.json
`import pkg from './package.json' with { type: 'json' };`

## Library Packaging
Check publint.dev. Ensure `exports` field, correct file extensions (`.mjs`/`.cjs`), and Svelte components as uncompiled `.svelte` files. Use `svelte-package` for Svelte libraries.

## View Transitions
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

## Database
Put queries in server routes. Create `db.js` singleton. Use `hooks.server.js` for setup.

## Client-side Libraries
Use `import { browser } from '$app/environment'` check, `onMount`, or `{#await}` blocks.

## Backend API Proxy
Use `event.fetch` or set up proxy with `server.proxy` in dev. In production, rewrite paths or create API route.

## Middleware
Use Vite plugin with `configureServer` in dev; adapter-node in production.

## Yarn
Yarn 2: Use `nodeLinker: 'node-modules'` in `.yarnrc.yml`. Yarn 3: Same setting recommended for ESM support.