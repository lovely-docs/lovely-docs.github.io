SvelteKit supports multiple rendering and deployment configurations:

**Default rendering**: Server-side rendering (SSR) for initial page load (improves SEO and perceived performance), then client-side rendering (CSR) for subsequent pages (faster navigation, no flash). Called transitional apps.

**Static site generation (SSG)**: Use `adapter-static` to fully prerender your site. Can prerender only some pages with the prerender option and use a different adapter for dynamic rendering of others. For very large sites, use Incremental Static Regeneration (ISR) with `adapter-vercel` to avoid long build times.

**Single-page app (SPA)**: Exclusively use client-side rendering. Can write backend in SvelteKit or another language. Skip server file documentation if using no backend or separate backend.

**Multi-page app (MPA)**: Not typical for SvelteKit, but can remove JavaScript with `csr = false` to render subsequent links on server, or use `data-sveltekit-reload` for specific links.

**Separate backend**: Deploy SvelteKit frontend separately from backend (Go, Java, PHP, Ruby, Rust, C#, etc.) using `adapter-node` or serverless adapters. Can also deploy as SPA served by backend (worse SEO/performance). Skip server file documentation.

**Serverless app**: Use `adapter-auto` (zero config), `adapter-vercel`, `adapter-netlify`, or `adapter-cloudflare`. Some adapters offer edge option for edge rendering and improved latency.

**Own server/VPS**: Use `adapter-node`.

**Container**: Use `adapter-node` with Docker or LXC.

**Library**: Use `@sveltejs/package` add-on with `sv create` library option.

**Offline/PWA**: Full service worker support.

**Mobile app**: Convert SPA to mobile app with Tauri or Capacitor. Use `bundleStrategy: 'single'` to limit concurrent requests (e.g., Capacitor uses HTTP/1).

**Desktop app**: Convert SPA to desktop app with Tauri, Wails, or Electron.

**Browser extension**: Use `adapter-static` or community adapters for browser extensions.

**Embedded device**: Use `bundleStrategy: 'single'` to reduce concurrent requests on low-power devices with limited connections.