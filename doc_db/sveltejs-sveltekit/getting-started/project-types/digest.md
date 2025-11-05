SvelteKit supports multiple rendering and deployment approaches:

**Default rendering**: Server-side rendering (SSR) for initial page load (better SEO and perceived performance), then client-side rendering (CSR) for subsequent navigation (faster, no flash).

**Static site generation**: Use adapter-static to prerender entire site, or use the prerender option for selective pages. Vercel adapter supports Incremental Static Regeneration (ISR) for large sites.

**Single-page app (SPA)**: Client-side rendering only. Can use SvelteKit backend or separate backend in another language.

**Multi-page app**: Remove JavaScript with `csr = false` for server-rendered links, or use `data-sveltekit-reload` for specific links.

**Separate backend**: Deploy SvelteKit frontend separately using adapter-node or serverless adapters. Skip server files in docs if using external backend.

**Serverless**: Use adapter-auto (zero config), adapter-vercel, adapter-netlify, adapter-cloudflare, or community adapters. Some support edge rendering.

**Own server/VPS**: Use adapter-node.

**Container**: Use adapter-node with Docker or LXC.

**Library**: Use @sveltejs/package add-on with `sv create` library option.

**Offline/PWA**: Full service worker support.

**Mobile app**: Convert SPA to mobile with Tauri or Capacitor. Use `bundleStrategy: 'single'` to limit concurrent requests (useful for HTTP/1 limitations).

**Desktop app**: Convert SPA to desktop with Tauri, Wails, or Electron.

**Browser extension**: Use adapter-static or community adapters.

**Embedded device**: Use `bundleStrategy: 'single'` to reduce concurrent requests on low-power devices.