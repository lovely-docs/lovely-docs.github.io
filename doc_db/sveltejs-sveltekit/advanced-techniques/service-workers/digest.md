Service workers act as proxy servers for network requests, enabling offline support and performance optimization through precaching. SvelteKit automatically bundles and registers a service worker if `src/service-worker.js` (or `src/service-worker/index.js`) exists.

Inside the service worker, access the `$service-worker` module to get paths to static assets, build files, prerendered pages, app version, and base path. Use the version string to create unique cache names.

Example service worker implementation:
```js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

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
			return await cache.match(url.pathname);
		}
		try {
			const response = await fetch(event.request);
			if (response instanceof Response && response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch {
			return await cache.match(event.request);
		}
	})());
});
```

Disable automatic registration via configuration if you need custom logic. During development, only browsers supporting ES modules in service workers work; manually register with `{ type: dev ? 'module' : 'classic' }`. Vite PWA plugin and Workbox are alternative solutions.