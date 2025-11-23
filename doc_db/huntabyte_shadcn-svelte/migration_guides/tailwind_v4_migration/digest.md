## Tailwind v4 Migration Guide

### Overview
Complete guide for upgrading shadcn-svelte projects from Tailwind v3 to v4 and Svelte 4 to v5. The `@latest` CLI now supports initializing projects with Tailwind v4 and Svelte 5.

### Key Changes in v4
- New `@theme` directive and `@theme inline` option for CSS-based configuration
- All components updated with `data-slot` attributes for styling
- Buttons now use default cursor
- `default` style deprecated; new projects use `new-york`
- HSL colors converted to OKLCH (non-breaking: existing Tailwind v3 apps continue working)
- Dark mode colors revisited for better accessibility

### Prerequisites
- Coming from Svelte 5 + Tailwind v3 (if on Svelte 4, first follow Svelte 4→5 migration)
- Read Tailwind v4 Compatibility Docs to ensure browser support (uses bleeding-edge features)

### Upgrade Steps

**1. Follow Tailwind v4 Upgrade Guide**
- Run official upgrade: https://tailwindcss.com/docs/upgrade-guide
- Use `@tailwindcss/upgrade` codemod to remove deprecated utilities and update config

**2. Replace PostCSS with Vite**
- Delete `postcss.config.js`
- Uninstall `@tailwindcss/postcss`: `npm uninstall @tailwindcss/postcss`
- Install `@tailwindcss/vite`: `npm i @tailwindcss/vite -D`
- Update `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**3. Update `app.css`**
- Replace `tailwindcss-animate` with `tw-animate-css`: `npm uninstall tailwindcss-animate && npm i tw-animate-css -D`
- Import both: `@import "tailwindcss"; @import "tw-animate-css";`
- Add custom dark variant: `@custom-variant dark (&:is(.dark *));`
- Remove border color compatibility styles (dead code)
- Move CSS variables to `:root` and `.dark` selectors, wrap color values in `hsl()`
- Replace `tailwind.config.ts` with `@theme inline` directive containing radius and color definitions
- Example structure:
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  /* ... other variables */
  --radius: 0.5rem;
}
.dark {
  --background: hsl(240 10% 3.9%);
  /* ... dark mode variables */
}
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  /* ... all color mappings */
}
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```
- Delete `tailwind.config.ts` after verification

**4. Use new `size-*` utility**
- Replace `w-* h-*` with `size-*`: `w-4 h-4` → `size-4`

**5. Update dependencies**
```bash
npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

**6. Update `utils.ts` (optional)**
Type helpers previously from `bits-ui` now in utils:
```ts
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```
Update imports in components: `import type { WithElementRef } from "$lib/utils.js";`

**7. Update Colors (optional)**
- Commit changes: `git add . && git commit -m "..."`
- Re-add all components with overwrite: `npx shadcn-svelte@latest add --all --overwrite`
- Update dark mode colors in `app.css` to new OKLCH values (see Base Colors reference)
- Review git diffs and re-apply custom changes

### Resources
- Demo site: https://v4.shadcn-svelte.com
- Installation docs: SvelteKit, Astro, Vite, Manual
- Report bugs on GitHub