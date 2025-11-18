The `$service-worker` module provides build-time constants available only within service workers.

**base** - The deployment base path, calculated from `location.pathname`. Unlike `config.kit.paths.base`, this works correctly for subdirectory deployments. Note: `assets` is not available since service workers cannot be used with `config.kit.paths.assets`.

**build** - Array of URL strings for Vite-generated files suitable for caching with `cache.addAll(build)`. Empty during development.

**files** - Array of URL strings for static directory files (or custom directory via `config.kit.files.assets`). Customizable via `config.kit.serviceWorker.files`.

**prerendered** - Array of pathnames for prerendered pages and endpoints. Empty during development.

**version** - Value from `config.kit.version`, useful for generating unique cache names to invalidate old caches on deployment.

Example usage in a service worker:
```js
import { base, build, files, prerendered, version } from '$service-worker';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(`cache-${version}`).then((cache) => {
      cache.addAll([...build, ...files, ...prerendered]);
    })
  );
});
```