## Core
- Create with `npx sv create my-app`, pages in `src/routes` as Svelte components
- Filesystem routing: `+page.svelte`, `+layout.svelte`, `+server.js` with rest/optional parameters, matchers, layout groups
- Load functions in `+page.server.js` (server-only) or `+page.js` (universal) receive `url`, `params`, `fetch`, support `error()`, `redirect()`
- Form actions via `export const actions` in `+page.server.js`, invoke with `<form method="POST" action="?/actionName">`
- Remote functions: `query()` (read), `form()` (write), `command()` (handlers) in `.remote.js` files

## Build & Deploy
- Adapters transform apps for platforms: `adapter-node`, `adapter-static`, `adapter-cloudflare`, `adapter-netlify`, `adapter-vercel`
- Static: `export const prerender = true` in root layout with `adapter-static`
- SPA: `export const ssr = false` with `adapter-static` and `fallback: '200.html'`
- Node: `adapter-node` outputs to `build/`, deploy with `node build`

## Advanced
- Hooks: `handle()` (every request), `handleFetch()`, `handleError()`, `reroute()` (URL mapping)
- Errors: `error(status, body)` renders `+error.svelte`, unexpected errors via `handleError()` hook
- Service workers: Auto-bundles `src/service-worker.js`, access `$service-worker` module
- Server-only modules: `.server` suffix or `$lib/server/` directory
- Snapshots: `export const snapshot = {capture(), restore(value)}` preserves DOM state
- Shallow routing: `pushState(url, state)`, `replaceState(url, state)` for modals

## Best Practices
- Auth: Lucia for session-based, validated in server hooks, user info in `locals`
- Images: `@sveltejs/enhanced-img` for auto format/sizing, or Vite auto-processing
- SEO: SSR default, unique `<title>` and `<meta name="description">` per page
- Accessibility: Unique titles announce route changes, set `lang` on `<html>`

## API
- `RequestEvent`: `cookies`, `fetch`, `params`, `url`, `locals`, `platform`, `request`, `setHeaders()`, `getClientAddress()`
- Navigation: `goto()`, `invalidate()`, `invalidateAll()`, `beforeNavigate()`, `afterNavigate()`, `pushState()`, `replaceState()`
- Forms: `enhance()` for progressive enhancement, `applyAction()`, `deserialize()`
- App state: `$app/state` with `navigating`, `page`, `updated`
- Config: `svelte.config.js` with `adapter`, `paths`, `prerender`, `csp`, `csrf`