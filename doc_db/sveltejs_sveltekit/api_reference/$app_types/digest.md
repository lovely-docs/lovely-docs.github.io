## Generated Type Utilities for Routes

The `$app/types` module provides auto-generated TypeScript types for your app's routes and assets (available since v2.26).

### Asset
Union of all static directory filenames plus a string wildcard for dynamically imported assets:
```ts
type Asset = '/favicon.png' | '/robots.txt' | (string & {});
```

### RouteId
Union of all route IDs in your app, used with `page.route.id` and `event.route.id`:
```ts
type RouteId = '/' | '/my-route' | '/my-other-route/[param]';
```

### Pathname
Union of all valid pathnames in your app:
```ts
type Pathname = '/' | '/my-route' | `/my-other-route/${string}` & {};
```

### ResolvedPathname
Like `Pathname` but includes optional base path prefix, used with `page.url.pathname`:
```ts
type ResolvedPathname = `${'' | `/${string}`}/` | `${'' | `/${string}`}/my-route` | `${'' | `/${string}`}/my-other-route/${string}` | {};
```

### RouteParams
Utility to extract parameters from a route ID:
```ts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;
type BlogParams = RouteParams<'/blog/[slug]'>; // { slug: string }
```

### LayoutParams
Like `RouteParams` but for layouts, includes optional parameters from child routes:
```ts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;
```