## $app/paths

Module for resolving URLs and paths in SvelteKit applications.

### asset(file)
Resolves the URL of a static asset by prefixing with `config.kit.paths.assets` or the base path. During SSR, the base path is relative to the current page.

```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

### assets (deprecated)
Absolute path matching `config.kit.paths.assets`. During `vite dev` or `vite preview`, replaced with `'/_svelte_kit_assets'`. Type: `'' | 'https://...' | 'http://...' | '/_svelte_kit_assets'`. Use `asset()` instead.

### base (deprecated)
String matching `config.kit.paths.base`. Example: `<a href="{base}/your-page">Link</a>`. Type: `'' | '/${string}'`. Use `resolve()` instead.

### resolve(pathname | routeId, params?)
Resolves a pathname by prefixing with base path, or resolves a route ID by populating dynamic segments with parameters. During SSR, base path is relative to current page.

```js
import { resolve } from '$app/paths';
const resolved = resolve(`/blog/hello-world`);
const resolved = resolve('/blog/[slug]', { slug: 'hello-world' });
```

### resolveRoute (deprecated)
Alias for `resolve()`. Use `resolve()` instead.