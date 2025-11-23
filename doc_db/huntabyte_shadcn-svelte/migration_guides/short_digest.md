## Svelte 4→5 Migration
- Update `components.json` with registry and aliases
- Add `tailwindcss-animate` to `tailwind.config.js` with sidebar colors/animations
- Simplify `utils.ts` to export `cn()` and utility types
- Update dependencies: `bits-ui@^1.0.0`, `svelte-sonner@^1.0.0`, `@lucide/svelte@^0.482.0`, `paneforge@^1.0.0-next.5`, `vaul-svelte@^1.0.0-next.7`, `mode-watcher@^1.0.0`
- Remove: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`
- Migrate components: `npx shadcn-svelte@latest add <component> -y -o`

## Tailwind v3→v4 Migration
- Replace PostCSS with Vite: `npm uninstall @tailwindcss/postcss && npm i @tailwindcss/vite -D`
- Update `vite.config.ts` to use `@tailwindcss/vite` plugin
- Replace `tailwind.config.ts` with `@theme inline` in `app.css`
- Replace `tailwindcss-animate` with `tw-animate-css`
- Wrap CSS variables in `hsl()`, add custom dark variant
- Use `size-*` utility instead of `w-* h-*`
- Re-add components: `npx shadcn-svelte@latest add --all --overwrite`