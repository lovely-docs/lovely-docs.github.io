## Building & Adapters

SvelteKit builds in two stages: Vite optimizes code, then an adapter tunes it for the target environment. Prevent build-time execution with `building` from `$app/environment`.

Adapters are deployment plugins configured in `svelte.config.js`. **adapter-auto** automatically detects the correct adapter. Official adapters: Node, static sites, Cloudflare, Netlify, Vercel.

## Key Deployment Patterns

**Node**: `npm run build`, deploy `build/`, `package.json`, `node_modules/`. Start with `node build`. Configure via `PORT`, `HOST`, `ORIGIN`, reverse proxy headers, `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s).

**Static**: Set `prerender = true` in root layout. Configure `pages`, `assets`, `fallback`, `precompress`.

**SPA**: Disable SSR globally with `export const ssr = false`, use fallback page. Prerender specific pages with `export const prerender = true`.

**Cloudflare**: Configure fallback, `_routes.json` rules (max 100). Access runtime APIs via `platform?.env`. Test with `wrangler dev .svelte-kit/cloudflare`.

**Netlify**: Use `edge: true` for edge functions, `split: true` for function splitting. Access context via `event.platform?.context`. Use `read()` from `$app/server` instead of `fs`.

**Vercel**: Set `runtime` (`'edge'` or `'nodejs20.x'`), `regions`, `split`, `memory`, `maxDuration` via `export const config`. ISR: `expiration`, `bypassToken`, `allowQuery`. Bypass cache with `__prerender_bypass=<token>` cookie.