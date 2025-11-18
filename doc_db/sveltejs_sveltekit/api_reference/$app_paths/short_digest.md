## $app/paths exports

**asset(file)** - Resolve static asset URLs with proper path prefixing
```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

**resolve(pathname | routeId, params?)** - Resolve pathnames with base path or populate route parameters
```js
resolve(`/blog/hello-world`);
resolve('/blog/[slug]', { slug: 'hello-world' });
```

Deprecated: `assets`, `base`, `resolveRoute()`