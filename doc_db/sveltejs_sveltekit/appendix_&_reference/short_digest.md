**FAQ**: Package compatibility (publint, exports field, ESM/CommonJS extensions), client-side libraries (browser check, onMount, dynamic imports), database (server routes, singleton, hooks.server.js), view transitions (onNavigate + startViewTransition), external APIs (event.fetch or proxy), middleware (Vite plugin or adapter-node), Yarn (nodeLinker workaround).

**Integrations**: vitePreprocess for CSS preprocessors, svelte-preprocess alternative, npx sv add for common setups, Vite plugins supported.

**Debugging**: VSCode debug terminal/launch.json, browser DevTools with NODE_OPTIONS="--inspect", editor-specific tools.

**SvelteKit 2 breaking changes**: error()/redirect() not thrown, cookies require path, top-level promises not auto-awaited, goto() rejects external URLs, paths relative by default, resolvePath→resolveRoute, improved error handling, dynamic env vars blocked during prerendering, use:enhance form/data removed, file forms need multipart/form-data, stricter tsconfig, Node 18.13+ required, $app/stores→$app/state.

**Sapper migration**: package.json (add "type": "module", replace sapper with @sveltejs/kit), config (svelte.config.js), file renames (client.js, server.js, service-worker.js, template.html→app.html), routes (index.svelte→+page.svelte, _layout→+layout), data loading (preload→load with event), stores (direct imports from $app/stores), imports (@sapper/*→$app/*), links (sapper:prefetch→data-sveltekit-preload-data), endpoints (environment-agnostic).

**Glossary**: Rendering modes (CSR, SSR, Hybrid, SPA, MPA, SSG, ISR), prerendering rules, hydration, client-side routing, edge rendering, PWA concepts.