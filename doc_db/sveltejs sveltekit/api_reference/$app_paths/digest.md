## Functions for resolving paths and assets

**asset(file)** - Resolve URLs for static directory assets by prefixing with configured assets path or base path. During SSR, the base path is relative to the current page.

```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

**resolve(pathname | routeId, params?)** - Resolve a pathname by prefixing with base path, or resolve a route ID by populating dynamic segments.

```js
import { resolve } from '$app/paths';
const resolved = resolve(`/blog/hello-world`);
const resolved = resolve('/blog/[slug]', { slug: 'hello-world' });
```

**Deprecated exports:**
- `assets` - Absolute path matching config.kit.paths.assets (use `asset()` instead)
- `base` - String matching config.kit.paths.base (use `resolve()` instead)
- `resolveRoute()` - Use `resolve()` instead