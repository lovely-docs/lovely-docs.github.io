## Svelte 5 Migration

Update `components.json` with new aliases and registry, add `tailwindcss-animate` to `tailwind.config.js` with sidebar colors and animations, simplify `utils.ts` to export only `cn` and utility types.

Update dependencies: `bits-ui@^1.0.0`, `svelte-sonner@^1.0.0`, `@lucide/svelte@^0.482.0`, `paneforge@^1.0.0-next.5`, `vaul-svelte@^1.0.0-next.7`, `mode-watcher@^1.0.0`.

Optionally alias old `bits-ui` as `bits-ui-old` for gradual migration. Migrate components with `npx shadcn-svelte@latest add <component> -y -o`. Remove deprecated: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`.