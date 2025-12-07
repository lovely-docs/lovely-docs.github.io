## Svelte 5 Migration

Update `components.json` with new aliases (`ui`, `hooks`, `lib`) and registry field.

Update `tailwind.config.js`: install `tailwindcss-animate`, add sidebar colors and accordion/caret-blink animations.

Simplify `utils.ts` to only export `cn()` function and utility types.

Update dependencies: `bits-ui@latest`, `svelte-sonner@latest`, `@lucide/svelte@latest`, `paneforge@next`, `vaul-svelte@next`, `mode-watcher@latest`.

Optionally alias old `bits-ui` as `bits-ui-old` for gradual migration.

Migrate components with `npx shadcn-svelte@latest add <component> -y -o` (skip confirmation, overwrite files).

Remove deprecated packages: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`.