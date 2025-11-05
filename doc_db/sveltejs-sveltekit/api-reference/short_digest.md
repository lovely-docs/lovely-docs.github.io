## Core Modules
- `$app/navigation` - `goto()`, `invalidateAll()`, `invalidate(url)`
- `$app/environment`, `$app/paths`, `$app/forms`, `$app/state` - Runtime utilities
- `$app/server` - Server-only operations
- `$env/static/public|private`, `$env/dynamic/public|private` - Environment variables

## Types & Config
- `$app/types` - Auto-generated route types: `RouteParams<'/blog/[slug]'>` → `{ slug: string }`
- `svelte.config.js` - Kit configuration with adapter selection
- `svelte-kit sync` - Generate types and config
- `$lib` - Alias for `src/lib`

## Server
- `@sveltejs/kit/hooks` - `handle`, `handleError`, `handleFetch` in `hooks.server.js`
- Node.js adapter for SSR and deployment