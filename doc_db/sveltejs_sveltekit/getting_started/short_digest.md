**Project setup**: `npx sv create my-app && npm run dev` (localhost:5173). Pages are Svelte components in `src/routes`, server-rendered then client-side takeover.

**Deployment options**: SSR+CSR (default), SSG (`adapter-static`), SPA, MPA, separate backend, serverless (`adapter-auto`/`adapter-vercel`/`adapter-netlify`/`adapter-cloudflare`), Node (`adapter-node`), containers, libraries, PWA, mobile (Tauri/Capacitor), desktop (Tauri/Wails/Electron), browser extensions, embedded devices. Use `bundleStrategy: 'single'` for limited connections.

**Directory structure**: `src/{lib,lib/server,params,routes,app.html,error.html,hooks.client.js,hooks.server.js,service-worker.js,instrumentation.server.js}`, `static/`, `tests/`, config files (`package.json`, `svelte.config.js`, `tsconfig.json`, `vite.config.js`). `.svelte-kit/` auto-generated.

**Web APIs**: `fetch` (SSR-optimized in `load`/hooks/routes), Request/Response/Headers, FormData, Streams, URL/URLSearchParams, Web Crypto available in hooks, server routes, and browser.