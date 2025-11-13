

## Pages

### frequently_asked_questions
Common questions about SvelteKit development covering package integration, library packaging, APIs, databases, and tooling compatibility.

## Key topics
- **package.json**: Import with `import pkg from './package.json' with { type: 'json' };`
- **Library packaging**: Check publint.dev; use `exports` field, proper extensions (`.mjs`/`.cjs`), uncompiled `.svelte` files
- **View transitions**: Use `document.startViewTransition` in `onNavigate`
- **Database**: Query in server routes, create singleton in `db.js`
- **Client-side libraries**: Wrap in `browser` check or use `onMount`
- **External API**: Use proxy or API route to avoid CORS
- **Middleware**: `adapter-node` for production, Vite plugin for dev
- **Yarn**: Use `nodeLinker: node-modules` for Yarn 2/3 ESM compatibility

### integrations
Guide to available preprocessors, add-ons, and plugins for SvelteKit projects.

## vitePreprocess

Enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS). Included by default with TypeScript.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: [vitePreprocess()] };
```

## Add-ons

`npx sv add` installs: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## svelte-preprocess

Alternative with Pug, Babel, global styles. Install: `npm i -D svelte-preprocess`.

## Vite plugins

Any Vite plugin works with SvelteKit.

### breakpoint_debugging
How to set up breakpoint debugging in SvelteKit projects using VSCode, browser DevTools, and other editors.

**VSCode**: Use Debug Terminal (Cmd+Shift+P → "Debug: JavaScript Debug Terminal") or create `.vscode/launch.json` with `"type": "node-terminal"` and `"command": "npm run dev"` to set breakpoints.

**Browser DevTools**: Run `NODE_OPTIONS="--inspect" npm run dev`, open `localhost:5173`, click Node.js DevTools icon in browser DevTools, or navigate to `chrome://inspect`/`edge://inspect`.

**Other Editors**: WebStorm and Neovim have community debugging guides available.

### migrating_to_sveltekit_v2
Breaking changes and migration guide for upgrading from SvelteKit 1 to 2, including error handling, cookie paths, promise handling, routing, environment variables, and dependency updates.

## Key Breaking Changes

- `error()` and `redirect()` no longer need `throw`
- `cookies.set/delete/serialize()` require `path` parameter
- Top-level promises in load functions no longer auto-awaited; use `async/await`
- `goto()` rejects external URLs; use `window.location.href`
- Paths relative by default (`paths.relative: true`)
- `resolvePath()` → `resolveRoute()` (includes `base`)
- `preloadCode()` requires `base` prefix and takes single argument
- Dynamic env vars blocked during prerendering; use static vars
- `use:enhance` callbacks: `form`/`data` removed, use `formElement`/`formData`
- Forms with file inputs must have `enctype="multipart/form-data"`
- Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+ required
- `$app/stores` deprecated; migrate to `$app/state`

### migrating_from_sapper
Step-by-step guide for migrating a Sapper application to SvelteKit, covering package.json updates, file reorganization, routing changes, import updates, and API modifications.

## Key Changes
- Add `"type": "module"` to package.json
- Replace `sapper` with `@sveltejs/kit` and adapter
- Update scripts: `sapper build` → `vite build`, `sapper dev` → `vite dev`
- Replace `webpack.config.js`/`rollup.config.js` with `svelte.config.js`
- Rename files: `src/template.html` → `src/app.html`, `_layout.svelte` → `+layout.svelte`, `_error.svelte` → `+error.svelte`
- Routes: `routes/about.svelte` → `routes/about/+page.svelte`
- `preload` → `load` in `+page.js`/`+layout.js` with single `event` argument
- Imports: `@sapper/app` → `$app/navigation`, `$app/stores`
- `src/node_modules` → `src/lib`
- Stores: `preloading` → `navigating`, `page` has `url`/`params` (no `path`/`query`)
- Attributes: `sapper:prefetch` → `data-sveltekit-preload-data`
- Endpoints no longer receive `req`/`res`; use environment-agnostic approach

### glossary
Definitions of rendering modes (CSR, SSR, SPA, MPA, hybrid), static generation approaches (SSG, prerendering, ISR), and related concepts (hydration, routing, PWA) used in SvelteKit.

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

