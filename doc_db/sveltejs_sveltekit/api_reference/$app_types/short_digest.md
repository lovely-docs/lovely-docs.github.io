## Generated Route & Asset Types

Auto-generated TypeScript utilities for type-safe route handling:

- **Asset**: Union of static files + dynamic imports
- **RouteId**: All route IDs in your app
- **Pathname**: All valid pathnames
- **ResolvedPathname**: Pathnames with base path prefix
- **RouteParams**: Get parameters for a route: `RouteParams<'/blog/[slug]'>` → `{ slug: string }`
- **LayoutParams**: Like RouteParams but includes child route parameters