**Build**: Two-stage process (Vite optimization → adapter tuning); check `building` flag to prevent build-time code execution.

**Adapters**: Deployment plugins in `svelte.config.js`; official: Cloudflare, Netlify, Node, static, Vercel; platform context via `RequestEvent.platform`.

**adapter-auto**: Auto-detects environment, installs correct adapter; install specific adapter for config options.

**adapter-node**: `npm run build` → `node build`; env vars: PORT, HOST, ORIGIN, PROTOCOL_HEADER, HOST_HEADER, ADDRESS_HEADER, XFF_DEPTH, BODY_SIZE_LIMIT, SHUTDOWN_TIMEOUT, IDLE_TIMEOUT; graceful shutdown via `sveltekit:shutdown`; export `handler.js` for custom servers.

**adapter-static**: Prerender entire site; set `prerender: true` in root layout; GitHub Pages: set `paths.base` to repo name, use `fallback: '404.html'`.

**SPA mode**: `ssr: false` + `adapter-static` with `fallback: '200.html'`; poor SEO/performance; prerender as many pages as possible.

**adapter-cloudflare**: Wrangler config with `assets` binding; access KV/Durable Objects via `platform.env`; `_headers`/`_redirects` for static only; add `nodejs_compat` flag if needed.

**adapter-netlify**: `netlify.toml` required; `edge: true` for Deno functions; `_headers`/`_redirects` for static; forms must be prerendered; access context via `platform.context`.

**adapter-vercel**: `export const config` in routes for runtime/regions/memory/maxDuration/ISR; ISR: `expiration`, `bypassToken` (≥32 chars), `allowQuery`; image optimization config; skew protection via cookie.

**Custom adapters**: Export function returning `{name, adapt(builder), emulate?(), supports?{read(), tracing()}}`; `adapt()` must clear build, write via `builder.write*()`, instantiate with `builder.generateManifest()`, convert requests to `Request`, call `server.respond()`, expose `platform`, shim `fetch` if needed.