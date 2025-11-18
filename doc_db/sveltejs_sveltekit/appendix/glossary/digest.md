## Rendering Modes

**CSR (Client-Side Rendering)**: Page generation in the browser using JavaScript. Enabled by default in SvelteKit but can be disabled with `csr = false`.

**SSR (Server-Side Rendering)**: Page generation on the server. Enabled by default in SvelteKit, can be disabled with `ssr = false`. Preferred for performance and SEO.

**Hybrid App**: SvelteKit's default mode combining SSR for initial HTML load with CSR for subsequent navigations.

**SPA (Single-Page App)**: Serves a single empty HTML shell on initial request, all navigation handled client-side. Has performance and SEO drawbacks; use only in limited cases like mobile app wrappers. Build with `adapter-static`.

**MPA (Multi-Page App)**: Traditional server-rendered applications where each page view is rendered on the server.

## Static Generation

**SSG (Static Site Generation)**: Every page is prerendered at build time. No server needed; served from CDNs. Use `adapter-static` or configure `prerender` option.

**Prerendering**: Computing page contents at build time and saving HTML. Scales for free but requires rebuilding to update. Pages must return same content for all users and cannot contain form actions. Can still be personalized if user-specific data is fetched client-side.

**ISR (Incremental Static Regeneration)**: Generate static pages on-demand as visitors request them without redeploying. Reduces build times for large sites. Available with `adapter-vercel`.

## Other Concepts

**Hydration**: Process where server-rendered HTML is enhanced with client-side interactivity. SvelteKit transmits fetched data to the client with SSR HTML, components initialize with that data, then Svelte attaches event listeners. Enabled by default, can be disabled with `csr = false`.

**Edge Rendering**: Rendering in a CDN near the user to reduce latency.

**Routing**: SvelteKit intercepts navigation by default and handles it client-side (client-side routing). Can be skipped with `data-sveltekit-reload`.

**PWA (Progressive Web App)**: Web app built with web APIs that functions like a native app. Can be installed and use service workers for offline capabilities.