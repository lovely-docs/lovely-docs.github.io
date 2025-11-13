## Key topics
- **package.json**: Import with `import pkg from './package.json' with { type: 'json' };`
- **Library packaging**: Check publint.dev; use `exports` field, proper extensions (`.mjs`/`.cjs`), uncompiled `.svelte` files
- **View transitions**: Use `document.startViewTransition` in `onNavigate`
- **Database**: Query in server routes, create singleton in `db.js`
- **Client-side libraries**: Wrap in `browser` check or use `onMount`
- **External API**: Use proxy or API route to avoid CORS
- **Middleware**: `adapter-node` for production, Vite plugin for dev
- **Yarn**: Use `nodeLinker: node-modules` for Yarn 2/3 ESM compatibility