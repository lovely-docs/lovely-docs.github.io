## Rendering Modes
- **CSR**: Client-side rendering in browser (default, disable with `csr = false`)
- **SSR**: Server-side rendering (default, disable with `ssr = false`)
- **Hybrid**: Default SvelteKit mode—SSR initial load + CSR for navigation
- **SPA**: Single empty shell, all client-side routing (use `adapter-static`)
- **MPA**: Traditional server-rendered pages

## Static Generation
- **SSG**: All pages prerendered at build time (use `adapter-static`)
- **Prerendering**: Build-time HTML generation; pages must return same content for all users and cannot contain form actions
- **ISR**: Generate pages on-demand without redeploying (use `adapter-vercel`)

## Other
- **Hydration**: Server HTML enhanced with client-side interactivity and event listeners
- **Edge Rendering**: Rendering in CDN near user
- **Routing**: Client-side navigation interception (default, skip with `data-sveltekit-reload`)
- **PWA**: Web app installable as native app with offline support