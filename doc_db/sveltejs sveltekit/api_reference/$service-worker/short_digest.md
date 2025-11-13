The `$service-worker` module exports build-time constants for service workers: `base` (deployment path), `build` (Vite files), `files` (static assets), `prerendered` (prerendered routes), and `version` (for cache invalidation).

```js
import { base, build, files, prerendered, version } from '$service-worker';
caches.open(`cache-${version}`).then(cache => cache.addAll([...build, ...files]));
```