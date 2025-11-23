

## Pages

### svelte_5_migration
Migrate Svelte 4 to Svelte 5: update configs (components.json aliases/registry, tailwind.config.js with tailwindcss-animate and sidebar colors), simplify utils.ts, update dependencies (bits-ui@1.0.0, svelte-sonner@1.0.0, @lucide/svelte@0.482.0, paneforge@1.0.0-next.5, vaul-svelte@1.0.0-next.7, mode-watcher@1.0.0), migrate components with `npx shadcn-svelte@latest add <component> -y -o`, remove cmdk-sv/svelte-headless-table/svelte-radix/lucide-svelte.

## Svelte 4 to Svelte 5 Migration

Migrate from Svelte 4 with Tailwind 3 to Svelte 5 with Tailwind 3, then optionally to Tailwind 4.

### Prerequisites
- Read Svelte's v5 migration guide
- Commit pending changes
- Identify components with custom behavior/styles for reimplementation
- Use `sv-migrate` CLI tool to assist migration

### Update Configs

**components.json**: Add `registry` field and new aliases:
```json
{
  "registry": "https://shadcn-svelte.com/registry",
  "aliases": {
    "components": "$lib/components",
    "utils": "$lib/utils",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks",
    "lib": "$lib"
  }
}
```

**tailwind.config.js**: Install and add `tailwindcss-animate` plugin, add sidebar color variables and animations:
```bash
npm i tailwindcss-animate
```
```ts
import tailwindcssAnimate from "tailwindcss-animate";
const config = {
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--bits-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--bits-accordion-content-height)" }, to: { height: "0" } },
        "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
```

**utils.ts**: Update to export only `cn` function and utility types:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

### Upgrade Components

**Optional: Alias old dependencies** for gradual migration:
```json
{
  "devDependencies": {
    "bits-ui-old": "npm:bits-ui@0.22.0"
  }
}
```
Then update imports: `import { Dialog } from "bits-ui-old";`

**Update dependencies** to Svelte 5 compatible versions:
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```

Updated versions:
- `bits-ui` → `^1.0.0`
- `svelte-sonner` → `^1.0.0`
- `@lucide/svelte` → `^0.482.0`
- `paneforge` → `^1.0.0-next.5`
- `vaul-svelte` → `^1.0.0-next.7`
- `mode-watcher` → `^1.0.0`

**Deprecated/replaced dependencies**:
- `cmdk-sv` → replaced by Bits UI's `Command` component
- `svelte-headless-table` → replaced by `@tanstack/table-core`
- `svelte-radix` → replaced by `@lucide/svelte`
- `lucide-svelte` → replaced by `@lucide/svelte`

**Migrate components**: Commit changes, then run CLI to replace components:
```bash
git add . && git commit -m 'before migration'
npx shadcn-svelte@latest add dialog -y -o
```
The `-y` flag skips confirmation, `-o` overwrites existing files. Review diffs and repeat for each component.

**Remove unused dependencies**:
```bash
npm uninstall cmdk-sv svelte-headless-table svelte-radix lucide-svelte
```

### Next Steps
After completing Svelte 5 migration, proceed to Tailwind 4 migration guide.

### tailwind_v4_migration
Upgrade shadcn-svelte from Tailwind v3→v4 and Svelte 4→5: use Vite instead of PostCSS, replace `tailwind.config.ts` with CSS-based `@theme inline` in `app.css`, wrap colors in `hsl()`, replace `tailwindcss-animate` with `tw-animate-css`, use `size-*` utility, update dependencies and type helpers.

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

