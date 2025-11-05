## Building

SvelteKit builds in two stages: Vite optimizes code, then an adapter tunes it for the target environment. Prevent code execution during build by checking `building` from `$app/environment`. Preview builds with `vite preview`.

## Adapters

Adapters are deployment plugins configured in `svelte.config.js` that transform built apps for specific platforms. Official adapters exist for Cloudflare, Netlify, Node, static sites, and Vercel. Access platform-specific context via `RequestEvent.platform`.

## Deployment Options

**adapter-auto** automatically detects and uses the correct adapter (Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS SST, Google Cloud Run). Install the specific adapter to devDependencies for environment-specific configuration.

**Node servers** (`adapter-node`): Build with `npm run build`, deploy `build/`, `package.json`, `node_modules/`. Start with `node build`. Configure via environment variables: `PORT` (3000), `HOST` (0.0.0.0), `ORIGIN`, reverse proxy headers (`PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`), client IP detection (`ADDRESS_HEADER`, `XFF_DEPTH`), `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s). Supports graceful shutdown via `sveltekit:shutdown` event and systemd socket activation.

**Static sites** (`adapter-static`): Set `prerender = true` in root layout. Configure `pages`, `assets`, `fallback` (for SPA), `precompress`, `strict`. For GitHub Pages, set `paths.base` to repo name and generate `404.html` fallback.

**Single-page apps** (`adapter-static`): Disable SSR globally with `export const ssr = false` in root layout, use fallback page. Prerender specific pages by enabling SSR and `export const prerender = true` for those routes. Add `.htaccess` for Apache routing. Warning: SPAs have poor performance, SEO, and accessibility.

**Cloudflare** (`adapter-cloudflare`): Configure fallback (`'plaintext'` or `'spa'`), customize `_routes.json` with `include`/`exclude` (max 100 rules). Access runtime APIs via `platform?.env`. Test locally with `wrangler dev .svelte-kit/cloudflare` (Workers) or `wrangler pages dev .svelte-kit/cloudflare` (Pages).

**Netlify** (`adapter-netlify`): Use `edge: true` for Deno-based edge functions, `split: true` for function splitting. Access Netlify context via `event.platform?.context`. Use `_redirects` file for redirects. Use `read()` from `$app/server` instead of `fs` for file access.

**Vercel** (`adapter-vercel`): Set options via `export const config` in route files: `runtime` (`'edge'` or `'nodejs20.x'`/`'nodejs22.x'`), `regions`, `split`, `memory` (128-3008 MB), `maxDuration`. ISR configuration: `expiration`, `bypassToken`, `allowQuery`. Bypass cache with `__prerender_bypass=<token>` cookie or `x-prerender-revalidate` header. Configure image optimization with `sizes`, `formats`, `minimumCacheTTL`, `domains`. Use `read()` from `$app/server` instead of `fs`.

## Custom Adapters

Implement the Adapter API by exporting a function returning an object with `name` and `adapt(builder)` methods. The `adapt` method must clear the build directory, write output via `builder.writeClient/Server/Prerendered()`, generate code that imports `Server`, instantiate with `builder.generateManifest()`, listen for requests, convert to `Request`, call `server.respond(request, { getClientAddress })`, expose platform via `platform` option, shim `fetch` if needed, bundle output, and place files correctly.