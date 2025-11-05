## Package.json in Application
Import JSON with: `import pkg from './package.json' with { type: 'json' };`

## Library Packaging Issues
Check library compatibility at publint.dev. Key points:
- `exports` field takes precedence over `main` and `module`
- ESM files should end with `.mjs` (or any extension if `"type": "module"` is set); CommonJS files should end with `.cjs`
- `main` should be defined if `exports` is not
- Svelte components should be distributed as uncompiled `.svelte` files with ESM-only JS
- Use `svelte-package` for packaging Svelte libraries
- Libraries work best with ESM versions; CommonJS dependencies are pre-bundled by vite-plugin-svelte using esbuild
- Troubleshoot with `optimizeDeps` or `ssr` config values if needed

## View Transitions API
Call `document.startViewTransition` in `onNavigate` to trigger transitions on client-side navigation:
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

## Database Setup
Put database queries in server routes, not .svelte files. Create a `db.js` singleton for connection management. Use `hooks.server.js` for one-time setup code. Use Svelte CLI to automatically set up database integrations.

## Client-side Libraries Accessing document/window
Wrap in browser check: `import { browser } from '$app/environment'; if (browser) { /* code */ }`

Or use `onMount` for code that runs after first DOM render:
```js
import { onMount } from 'svelte';
onMount(async () => {
	const { method } = await import('some-browser-only-library');
	method('hello world');
});
```

For side-effect-free libraries, static import works (tree-shaken in server build):
```js
import { method } from 'some-browser-only-library';
onMount(() => { method('hello world'); });
```

Or use `{#await}` block for dynamic imports.

## Different Backend API Server
Use `event.fetch` to request from external API, but handle CORS complications. Better approach: set up a proxy. In production, rewrite paths like `/api` to the API server; in dev, use Vite's `server.proxy` option. Alternatively, create an API route:
```js
export function GET({ params, url }) {
	return fetch(`https://example.com/${params.path + url.search}`);
}
```

## Middleware
For production with adapter-node, build a middleware for your own server. For dev, add middleware via Vite plugin using `configureServer`:
```js
const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			console.log(`Got request ${req.url}`);
			next();
		});
	}
};
```

## Yarn Support
Yarn 2: Plug'n'Play (pnp) is broken with ESM. Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` or switch to npm/pnpm.

Yarn 3: ESM support is experimental. Add `nodeLinker: node-modules` to `.yarnrc.yml` to use local node_modules instead of global cache.