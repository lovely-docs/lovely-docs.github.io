

## Pages

### svelte_5_migration
Step-by-step guide to migrate shadcn-svelte projects from Svelte 4 to Svelte 5, including configuration updates, dependency upgrades, and component migration process.

## Svelte 5 Migration Steps

1. **Update configs**: Add registry and aliases to `components.json`, install `tailwindcss-animate` in `tailwind.config.js`, simplify `utils.ts` to only export `cn()` and utility types

2. **Update dependencies**: `npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D`

3. **Migrate components**: `npx shadcn-svelte@latest add dialog --overwrite` for each component, review diffs

4. **Remove deprecated packages**: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`

Optional: Alias old `bits-ui` as `bits-ui-old` for gradual migration

### tailwind_v4_migration
Step-by-step guide to upgrade shadcn-svelte projects from Tailwind v3 to v4 and Svelte 5, including Vite migration, CSS variable updates, and dependency upgrades.

## Tailwind v4 Migration

**Key changes**: HSL→OKLCH colors, `default` style deprecated, `tailwindcss-animate`→`tw-animate-css`, `data-slot` attributes added

**Main steps**:
1. Run Tailwind v4 upgrade guide and codemod
2. Replace PostCSS with Vite: uninstall `@tailwindcss/postcss`, install `@tailwindcss/vite`, update `vite.config.ts`
3. Update `app.css`: import `tailwindcss` and `tw-animate-css`, add `@custom-variant dark`, wrap colors in `hsl()`, replace config file with `@theme inline`
4. Use `size-*` utility instead of `w-* h-*`
5. Update dependencies to latest versions
6. Optionally update `utils.ts` with moved type helpers and re-add components for new dark mode colors

