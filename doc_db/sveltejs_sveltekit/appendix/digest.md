## Common Questions

**Package Management**
- Import JSON: `import pkg from './package.json' with { type: 'json' };`
- Library packaging: check publint.dev; `exports` field takes precedence; Svelte components distributed as uncompiled `.svelte` files with ESM-only JS; use `svelte-package`
- Yarn 2: use `nodeLinker: 'node-modules'`; Yarn 3: add `nodeLinker: node-modules` to `.yarnrc.yml`

**Database & APIs**
- Query databases in server routes via `db.js` singleton; use `hooks.server.js` for setup
- External APIs: use `event.fetch` with proxy or API route; handle CORS via rewrite rules
- Client-side library access: wrap in `browser` check or use `onMount`/dynamic imports

**View Transitions**
```js
import { onNavigate } from '$app/navigation';
onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});
```

**Middleware**
- Production: use `adapter-node`
- Development: add Vite plugin with `configureServer`

## Integrations

**vitePreprocess** (default for TypeScript projects)
- Enables CSS preprocessing: PostCSS, SCSS, Less, Stylus, SugarSS
- TypeScript: native in Svelte 5 for type syntax; use `vitePreprocess({ script: true })` for complex TypeScript

**Add-ons**
- Install via `npx sv add`: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook

**svelte-preprocess**
- Alternative with Pug, Babel, global styles support; may be slower

**Vite Plugins**
- Any Vite plugin works; browse vitejs/awesome-vite

## Debugging

**VSCode**
- Debug Terminal: CMD/Ctrl + Shift + P → "Debug: JavaScript Debug Terminal"
- Launch Configuration: create `.vscode/launch.json` with Node.js config

**Browser DevTools**
- Run `NODE_OPTIONS="--inspect" npm run dev`
- Open `localhost:5173`, then DevTools → "Open dedicated DevTools for Node.js"

**Other Editors**
- WebStorm: built-in Svelte debugging
- Neovim: community guides available

## Migration to SvelteKit 2

**Error & Redirect Handling**
- `error()` and `redirect()` no longer need to be thrown
- Use `isHttpError` and `isRedirect` to distinguish from unexpected errors

**Cookie Path**
- `cookies.set()`, `cookies.delete()`, `cookies.serialize()` require `path` parameter (typically `path: '/'`)

**Load Functions**
- No auto-await of top-level promises; use `async/await` and `Promise.all()`
```js
export async function load({ fetch }) {
  const [a, b] = await Promise.all([
    fetch(url1).then(r => r.json()),
    fetch(url2).then(r => r.json()),
  ]);
  return { a, b };
}
```

**Navigation**
- `goto()` no longer accepts external URLs; use `window.location.href`
- `state` object determines `$page.state`

**Paths**
- Relative by default (`paths.relative = true`)
- `preloadCode()` requires `base` prefix; takes single argument
- `resolvePath()` removed; use `resolveRoute()` from `$app/paths`

**Environment Variables**
- Dynamic variables (`$env/dynamic/*`) cannot be used during prerendering; use `$env/static/*`

**Forms**
- `form` and `data` removed from `use:enhance` callbacks; use `formElement` and `formData`
- File inputs require `enctype="multipart/form-data"` or `use:enhance` will error

**Stores**
- `$app/stores` deprecated in favor of `$app/state` (Svelte 5 runes)

**Dependencies**
- Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+
- `@sveltejs/vite-plugin-svelte@3` required as peer dependency
- Adapter minimums: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

## Migration from Sapper

**package.json**
- Add `"type": "module"`
- Replace `sapper` with `@sveltejs/kit` and adapter
- Scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`

**Configuration**
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- Move preprocessor options to `config.preprocess`

**File Migrations**
- `src/client.js` → `+layout.svelte` `onMount`
- `src/template.html` → `src/app.html`; replace `%sapper.head%` → `%sveltekit.head%`, `%sapper.html%` → `%sveltekit.body%`
- `src/node_modules` → `src/lib`

**Routes**
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `_error.svelte` → `+error.svelte`
- `_layout.svelte` → `+layout.svelte`

**Imports**
- `@sapper/app` → `$app/navigation` and `$app/stores`
- `preload` → `load` function in `+page.js`/`+layout.js`

**Stores**
- `page` store still exists; `preloading` → `navigating` store

**Other**
- Regex routes removed
- `sapper:prefetch` → `data-sveltekit-preload-data`
- `sapper:noscroll` → `data-sveltekit-noscroll`

## Glossary

**Rendering Modes**
- **CSR**: Page generation in browser (can disable with `csr = false`)
- **SSR**: Page generation on server (default, can disable with `ssr = false`)
- **Hybrid**: SSR for initial load + CSR for navigation (SvelteKit default)
- **SPA**: Single empty HTML shell, all navigation client-side (use `adapter-static`)
- **MPA**: Traditional server-rendered per page

**Static Generation**
- **SSG**: Every page prerendered at build time; no server needed
- **Prerendering**: Computing page contents at build time; pages must return same content for all users
- **ISR**: Generate static pages on-demand without redeploying (Vercel adapter)

**Other Concepts**
- **Hydration**: Server-rendered HTML enhanced with client-side interactivity
- **Edge Rendering**: Rendering in CDN near user
- **Routing**: SvelteKit intercepts navigation client-side by default (skip with `data-sveltekit-reload`)
- **PWA**: Web app using web APIs that functions like native app