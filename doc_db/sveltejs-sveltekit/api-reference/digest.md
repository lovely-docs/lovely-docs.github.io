## Server-side Hooks
`@sveltejs/kit/hooks` module provides `handle`, `handleError`, `handleFetch` hooks defined in `hooks.server.js` for intercepting and customizing request/response lifecycle.

## Runtime Modules
- `$app/environment` - Access environment variables and runtime information (build modes, config)
- `$app/navigation` - `goto()` for programmatic navigation, `invalidateAll()` and `invalidate(url)` to re-run load functions
- `$app/paths` - `base` and `assets` paths configured in `svelte.config.js`
- `$app/forms` - Utilities for handling form submissions and form data
- `$app/state` - Read-only state objects: `page`, `navigating`, `updated` (SvelteKit 2.12+)
- `$app/stores` - Legacy store-based state (use `$app/state` instead)
- `$app/server` - Server-only utilities for hooks, routes, and server load functions
- `$service-worker` - Service worker functionality access

## Environment Variables
- `$env/static/public` - Public variables (prefixed `PUBLIC_`) injected at build time, safe for client
- `$env/static/private` - Private variables statically replaced at build time, server-only
- `$env/dynamic/public` - Runtime access to public variables in server and client code
- `$env/dynamic/private` - Runtime access to private variables on server side

## Type Safety
`$app/types` exports auto-generated TypeScript utilities: `Asset`, `RouteId`, `Pathname`, `ResolvedPathname`, `RouteParams<'/blog/[slug]'>` → `{ slug: string }`, `LayoutParams`. Generated `.d.ts` files export typed `RequestHandler`, `Load`, `PageData`, `LayoutData`, `ActionData`. Helper types `PageProps` and `LayoutProps` (v2.16.0+) combine data with form/children.

## Configuration & Build
- `svelte.config.js` - Project configuration with `kit` property for adapter selection and options
- `svelte-kit sync` - Generates `tsconfig.json` and `./$types` definitions (runs as `prepare` script)
- Vite CLI - `vite dev`, `vite build`, `vite preview` for development and building
- `$lib` - Automatic import alias for `src/lib` directory (customizable in config)

## Adapters & Polyfills
- Node.js adapter - Runtime for server-side rendering and backend deployment
- Node.js polyfills - Browser APIs available in server-side contexts
- Vite integration - Build system plugin and configuration utilities