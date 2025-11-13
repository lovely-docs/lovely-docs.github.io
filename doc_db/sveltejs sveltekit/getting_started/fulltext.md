

## Pages

### creating_a_project
How to create a new SvelteKit project and understand its basic structure.

Run `npx sv create my-app` to scaffold a project, then `npm run dev` to start the dev server on localhost:5173. Pages are Svelte components in `src/routes` that are server-rendered initially then hydrated client-side.

### project_types
Overview of all supported SvelteKit application types and deployment patterns with their respective adapters and configuration options.

SvelteKit supports multiple rendering patterns: default (SSR + CSR), static site generation with `adapter-static`, SPAs with CSR only, serverless with `adapter-vercel`/`adapter-netlify`/`adapter-cloudflare`, own server with `adapter-node`, and can be deployed as mobile apps (Tauri/Capacitor), desktop apps (Tauri/Wails/Electron), browser extensions, or on embedded devices. Use `bundleStrategy: 'single'` to limit concurrent requests for mobile/embedded.

### project_structure
Standard directory layout and configuration files for a SvelteKit project.

SvelteKit project structure with `src/` containing routes, lib, params, and special files (app.html, error.html, hooks, service-worker). Static assets go in `static/`. Key config files: `package.json` (requires @sveltejs/kit, svelte, vite), `svelte.config.js`, `tsconfig.json`, `vite.config.js`. The `app.html` template uses placeholders like `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.env.[NAME]%`.

### web_standards
SvelteKit builds on standard Web APIs (Fetch, Request, Response, Headers, FormData, Streams, URL, Web Crypto) with a special server-side fetch for direct endpoint invocation.

SvelteKit uses standard Web APIs: `fetch` (with special server-side version for direct endpoint invocation), Request/Response, Headers, FormData, Streams, URL/URLSearchParams, and Web Crypto. Special `fetch` in `load` functions and server hooks allows relative requests and credential preservation without HTTP calls. Example: `request.headers.get('user-agent')` and `body.get('name')` from FormData.

