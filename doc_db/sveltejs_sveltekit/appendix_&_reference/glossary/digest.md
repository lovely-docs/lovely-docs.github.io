## Rendering Modes and Strategies

**CSR (Client-Side Rendering)**: Page contents generated in the browser using JavaScript. Default in SvelteKit but can be disabled with `csr = false` page option.

**SSR (Server-Side Rendering)**: Page contents generated on the server. Default in SvelteKit, can be disabled with `ssr` page option. Preferred for performance and SEO, improves accessibility when JavaScript fails.

**Hybrid App**: SvelteKit's default mode combining SSR for initial HTML load with CSR for subsequent navigations.

**SPA (Single-Page App)**: Application serving a single empty HTML shell on initial request, with all navigation handled client-side. Has large performance and SEO impacts; recommended only in limited circumstances like mobile app wrapping. Built with `adapter-static`.

**MPA (Multi-Page App)**: Traditional applications rendering each page view on the server (common in non-JavaScript languages).

**SSG (Static Site Generation)**: Every page is prerendered at build time. No server maintenance needed; can be served from CDNs. Achieved with `adapter-static` or by configuring all pages with `prerender` option.

**ISR (Incremental Static Regeneration)**: Generate static pages on-demand as visitors request them without redeploying. Reduces build times vs SSG for large sites. Available with `adapter-vercel`.

**Prerendering**: Computing page contents at build time and saving HTML. Scales nearly free as visitors increase but has expensive build process and requires redeployment for updates. Not all pages can be prerendered—content must be identical for all users and pages must not contain actions. Can still prerender personalized pages if user-specific data is fetched client-side. Controlled with `prerender` page option and config in `svelte.config.js`.

## Core Concepts

**Hydration**: Process where server-rendered HTML is enhanced on the client. SvelteKit stores data fetched during SSR and transmits it with HTML. Components initialize with this data without re-fetching APIs. Svelte verifies DOM state and attaches event listeners. Enabled by default, disabled with `csr = false`.

**Routing**: Client-side routing intercepts navigation (links, back/forward buttons) and updates page contents without server requests. Default behavior; can be skipped with `data-sveltekit-reload`.

**Edge**: Rendering in a CDN near the user, reducing request/response distance and improving latency.

## App Types

**PWA (Progressive Web App)**: Web app built with web APIs/technologies functioning like mobile/desktop apps. Can be installed with shortcuts on launcher/home screen/start menu. Often uses service workers for offline capabilities.