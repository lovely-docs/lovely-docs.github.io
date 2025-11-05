## Rendering Modes

**CSR (Client-Side Rendering)**: Page generation in the browser using JavaScript. Default in SvelteKit but can be disabled with `csr = false`.

**SSR (Server-Side Rendering)**: Page generation on the server. Default in SvelteKit, can be disabled with `ssr = false`. Preferred for performance and SEO, improves accessibility when JavaScript fails.

**Hybrid App**: SvelteKit's default mode combining SSR for initial HTML load with CSR for subsequent navigations.

**SPA (Single-Page App)**: Serves a single empty HTML shell on initial request, all navigation handled client-side. Has performance and SEO downsides; recommended only for mobile app wrappers. Build with `adapter-static`.

**SSG (Static Site Generation)**: Every page prerendered at build time. No server needed, served from CDNs. Use `adapter-static` or configure `prerender` option.

**ISR (Incremental Static Regeneration)**: Generate static pages on-demand as visitors request them without redeploying. Available with `adapter-vercel`.

## Related Concepts

**Hydration**: Process where server-rendered HTML is enhanced with client-side interactivity. SvelteKit transmits fetched data with SSR HTML so components initialize without re-fetching APIs, then Svelte attaches event listeners. Enabled by default, disabled with `csr = false`.

**Prerendering**: Computing page contents at build time and saving HTML. Scales for free with visitors but requires rebuilding to update content. Pages must return same content for all users and cannot contain form actions. Can still be personalized if user-specific data loads client-side.

**Edge Rendering**: Rendering in CDNs near users to reduce latency.

**Routing**: SvelteKit intercepts navigation by default and updates page client-side (client-side routing). Can be skipped with `data-sveltekit-reload`.

**PWA (Progressive Web App)**: Web app installable as mobile/desktop app, often using service workers for offline capabilities.

**MPA (Multi-Page App)**: Traditional server-rendered applications rendering each page view on the server.