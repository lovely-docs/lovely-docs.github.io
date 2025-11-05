## Rendering Modes

- **CSR**: Browser-based rendering, default but can disable with `csr = false`
- **SSR**: Server-side rendering, default, disable with `ssr = false`
- **Hybrid**: Default SvelteKit mode (SSR initial + CSR navigation)
- **SPA**: Single HTML shell, all client-side routing, use `adapter-static`
- **SSG**: All pages prerendered, use `adapter-static` or `prerender` option
- **ISR**: On-demand static generation with `adapter-vercel`

## Key Concepts

- **Hydration**: Server data transmitted with HTML, components initialize without re-fetching, event listeners attached
- **Prerendering**: Build-time HTML generation, must return same content for all users, no form actions
- **Edge Rendering**: CDN-based rendering near users
- **Routing**: Client-side navigation by default, skip with `data-sveltekit-reload`
- **PWA**: Installable web app with offline capabilities via service workers
- **MPA**: Traditional server-rendered multi-page applications