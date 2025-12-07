## Purpose
Service workers act as proxy servers handling network requests, enabling offline support and precaching for faster navigation.

## Setup
Place `src/service-worker.js` (or `src/service-worker/index.js`) in your project—it's automatically bundled and registered. Disable automatic registration via configuration if you need custom logic.

Default registration:
```js
if ('serviceWorker' in navigator) {
	addEventListener('load', function () {
		navigator.serviceWorker.register('./path/to/service-worker.js');
	});
}
```

## Inside the Service Worker
Access the `$service-worker` module for paths to static assets, build files, prerendered pages, app version string, and base path. Vite's `define` config applies here too.

Example implementation with eager caching of app/static files and network-first fallback:
```js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';
const self = /** @type {ServiceWorkerGlobalScope} */ (globalThis.self);
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	})());
});

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	})());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith((async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);
		
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) return response;
		}
		
		try {
			const response = await fetch(event.request);
			if (!(response instanceof Response)) throw new Error('invalid response');
			if (response.status === 200) cache.put(event.request, response.clone());
			return response;
		} catch (err) {
			const response = await cache.match(event.request);
			if (response) return response;
			throw err;
		}
	})());
});
```

## Development
Service workers aren't bundled during development. Only browsers supporting ES modules in service workers work at dev time. For manual registration, use:
```js
import { dev } from '$app/environment';
navigator.serviceWorker.register('/service-worker.js', {
	type: dev ? 'module' : 'classic'
});
```
Note: `build` and `prerendered` are empty arrays during development.

## Caching Considerations
Be careful with caching—stale data can be worse than unavailable data. Avoid caching large assets like videos since browsers clear caches when full.

## Alternatives
For PWA applications, consider Workbox library or Vite PWA plugin if you prefer those approaches.