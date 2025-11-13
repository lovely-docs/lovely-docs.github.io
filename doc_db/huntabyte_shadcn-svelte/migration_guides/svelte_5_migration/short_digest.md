## Svelte 5 Migration Steps

1. **Update configs**: Add registry and aliases to `components.json`, install `tailwindcss-animate` in `tailwind.config.js`, simplify `utils.ts` to only export `cn()` and utility types

2. **Update dependencies**: `npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D`

3. **Migrate components**: `npx shadcn-svelte@latest add dialog --overwrite` for each component, review diffs

4. **Remove deprecated packages**: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`

Optional: Alias old `bits-ui` as `bits-ui-old` for gradual migration