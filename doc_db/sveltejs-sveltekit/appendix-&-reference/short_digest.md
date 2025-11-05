## FAQs & Integrations

**Package Management**: Import JSON with `import pkg from './package.json' with { type: 'json' };`. Use `nodeLinker: 'node-modules'` in `.yarnrc.yml` for Yarn 2/3.

**Library Packaging**: Validate with publint.dev, ensure `exports` field, ship Svelte components as uncompiled `.svelte` files.

**View Transitions**: Use `onNavigate` with `document.startViewTransition`.

**Database**: Put queries in server routes, create `db.js` singleton.

**Client-side Libraries**: Use `import { browser }` check, `onMount`, or `{#await}` blocks.

**Middleware**: Vite plugin with `configureServer` in dev; adapter-node in production.

**vitePreprocess**: Enables CSS preprocessors (PostCSS, SCSS, Less, Stylus). Use `vitePreprocess({ script: true })` for complex TypeScript in Svelte 5.

**Add-ons**: `npx sv add` installs prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

**Debugging**: VSCode debug terminal or `NODE_OPTIONS="--inspect" npm run dev` for browser DevTools.

## Migration Guides

**v1 to v2**: `error()`/`redirect()` no longer need `throw`. `cookies.set/delete` require `path`. Top-level promises must be `await`ed. `$app/stores` → `$app/state`. Requires Node 18.13+, Svelte 4, Vite 5, TypeScript 5. Run `npx sv migrate sveltekit-2`.

**Sapper to SvelteKit**: Add `"type": "module"`. Replace `sapper` with `@sveltejs/kit` + adapter. `_layout.svelte` → `+layout.svelte`. `preload` → `load` function. `@sapper/app` imports → `$app/navigation`.

## Glossary

**Rendering Modes**: CSR (browser), SSR (server), Hybrid (default), SPA (client-side routing), SSG (prerendered), ISR (on-demand).

**Key Concepts**: Hydration, Prerendering, Edge Rendering, Routing, PWA, MPA.