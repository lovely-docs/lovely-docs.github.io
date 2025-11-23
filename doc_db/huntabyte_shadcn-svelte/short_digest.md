## Quick Reference

**Install components:**
```bash
npx shadcn-svelte@latest add <component> -y -o
```
(`-y`: skip confirmation, `-o`: overwrite files)

**60+ UI components** - Layout, Navigation, Forms, Dialogs, Dropdowns, Data Display, Feedback, Utilities. All composable, accessible, Tailwind-styled, form-integrated.

**Dark mode** - Install `mode-watcher`, add `<ModeWatcher />` to layout, use `toggleMode()` / `setMode()` / `resetMode()`.

**Setup** - SvelteKit, Vite, Astro, or manual. Run `npx shadcn-svelte@latest init` then add components.

**Migrations** - Svelte 4→5 and Tailwind v3→v4 guides with dependency updates and re-installation steps.

**Custom registries** - Create `registry.json` with items (components, hooks, pages, styles, themes, blocks). Define CSS variables, dependencies, and files. Build with `npm run registry:build`.

**Theming** - CSS variables with `background`/`foreground` convention, OKLCH colors, light/dark modes. Preset color schemes included.

**CLI** - `init`, `add`, `registry build` commands with proxy support.