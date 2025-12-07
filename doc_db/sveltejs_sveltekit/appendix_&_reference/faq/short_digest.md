**Package inclusion**: Check publint.dev; ensure `exports` field, correct file extensions (`.mjs`/`.cjs`), ESM-only JS for Svelte components, use `svelte-package`.

**Client-side libraries**: Use `browser` check, `onMount`, or `{#await}` block for dynamic imports.

**Database**: Put queries in server routes, create `db.js` singleton, setup in `hooks.server.js`.

**View transitions**: Call `document.startViewTransition` in `onNavigate`.

**Backend API**: Use `event.fetch` with CORS handling, or proxy via Vite's `server.proxy` / production rewrites, or create API route.

**Middleware**: Use Vite plugin with `configureServer` for dev; `adapter-node` provides middleware for production.

**Yarn**: Yarn 2 pnp broken with ESM (use `nodeLinker: node-modules`); Yarn 3 experimental ESM support (same workaround).