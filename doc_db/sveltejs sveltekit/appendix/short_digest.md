## Common Questions
- Import JSON: `import pkg from './package.json' with { type: 'json' };`
- Library packaging: check publint.dev; `exports` takes precedence; Svelte components as uncompiled `.svelte` files
- Database: query in server routes via `db.js` singleton
- External APIs: use `event.fetch` with proxy or API route
- View transitions: use `onNavigate()` with `document.startViewTransition()`

## Integrations
- **vitePreprocess**: default for TypeScript; CSS preprocessing (PostCSS, SCSS, Less, Stylus)
- **Add-ons**: `npx sv add` for prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook
- **svelte-preprocess**: alternative with Pug, Babel, global styles

## Debugging
- **VSCode**: Debug Terminal or `.vscode/launch.json`
- **Browser DevTools**: `NODE_OPTIONS="--inspect" npm run dev` then DevTools → Node.js debugger

## Migration to SvelteKit 2
- `error()` and `redirect()` no longer need to be thrown
- `cookies.set()` requires `path` parameter
- Load functions: no auto-await; use `Promise.all()`
- `goto()` no longer accepts external URLs
- `$app/stores` deprecated; use `$app/state`
- Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+

## Migration from Sapper
- Add `"type": "module"` to package.json
- `src/template.html` → `src/app.html`
- `routes/about/index.svelte` → `routes/about/+page.svelte`
- `preload` → `load` function in `+page.js`/`+layout.js`
- `@sapper/app` → `$app/navigation` and `$app/stores`

## Glossary
- **CSR/SSR/Hybrid/SPA/MPA**: rendering modes
- **SSG/Prerendering/ISR**: static generation approaches
- **Hydration/Edge Rendering/Routing/PWA**: related concepts