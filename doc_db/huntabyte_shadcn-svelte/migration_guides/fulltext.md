

## Pages

### svelte-5-migration
Migrate from Svelte 4 to Svelte 5: update components.json aliases and registry, add tailwindcss-animate with sidebar/animation config, simplify utils.ts, update bits-ui/svelte-sonner/@lucide/svelte/paneforge/vaul-svelte/mode-watcher, optionally alias old bits-ui, migrate components with `npx shadcn-svelte@latest add <component> -y -o`, remove cmdk-sv/svelte-headless-table/svelte-radix/lucide-svelte.

## Svelte 4 to Svelte 5 Migration

Prerequisites:
- Read Svelte's v5 migration guide
- Commit pending changes
- Identify components with custom behavior/styles
- Use `sv-migrate` CLI tool

### Update Configs

**components.json**: Add `registry` field and new aliases:
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "style": "default",
  "tailwind": {
    "css": "src/app.css",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "$lib/components",
    "utils": "$lib/utils",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks",
    "lib": "$lib"
  },
  "typescript": true,
  "registry": "https://shadcn-svelte.com/registry"
}
```

**tailwind.config.js**: Install and add `tailwindcss-animate` plugin, sidebar colors, and animations:
```bash
npm i tailwindcss-animate
```
```ts
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
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
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--bits-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--bits-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
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
export default config;
```

**utils.ts**: Simplify to only export `cn` function and utility types:
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

### Update Dependencies

Update to Svelte 5 compatible versions:
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```

Deprecated packages to remove:
- `cmdk-sv` → replaced by Bits UI's `Command` component
- `svelte-headless-table` → replaced by `@tanstack/table-core`
- `svelte-radix` → replaced by `@lucide/svelte`
- `lucide-svelte` → replaced by `@lucide/svelte`

### Migrate Components

For gradual migration, optionally alias old dependencies in package.json:
```json
{
  "devDependencies": {
    "bits-ui-old": "npm:bits-ui@0.22.0"
  }
}
```

Then update imports to use `bits-ui-old` in old components.

Commit changes before migrating:
```bash
git add .
git commit -m 'before migration'
```

Migrate components one at a time:
```bash
npx shadcn-svelte@latest add dialog -y -o
```
(`-y`: skip confirmation, `-o`: overwrite existing files)

Review diffs and adjust as needed. Repeat for each component.

### Remove Unused Dependencies

After migrating all components:
```bash
npm uninstall cmdk-sv svelte-headless-table svelte-radix lucide-svelte
```

### tailwind-v4
Migrate Tailwind v3→v4 + Svelte 5: run official upgrade, replace PostCSS with Vite, convert app.css to CSS variables + @theme inline, delete tailwind.config.ts, update deps, optionally refresh components for new dark colors.

## Upgrading to Tailwind v4 and Svelte 5

**Overview**: Migration guide for existing Svelte 5 + Tailwind v3 projects to Tailwind v4. New projects can use `@latest` CLI directly. HSL colors convert to OKLCH (non-breaking for v3 projects). Default style changes from `default` to `new-york`.

**Key Changes**:
- All components updated for Tailwind v4 and Svelte 5
- Every element now has `data-slot` attribute for styling
- Buttons use default cursor
- HSL colors converted to OKLCH

**Upgrade Steps**:

1. **Follow Tailwind v4 Upgrade Guide**: Run official upgrade and use `@tailwindcss/upgrade` codemod to remove deprecated utilities and update config.

2. **Replace PostCSS with Vite**:
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

3. **Update `app.css`**:
   - Replace `tailwindcss-animate` with `tw-animate-css`: `npm uninstall tailwindcss-animate && npm i tw-animate-css -D`
   - Import both: `@import "tailwindcss"; @import "tw-animate-css";`
   - Add dark mode variant: `@custom-variant dark (&:is(.dark *));`
   - Remove border color compatibility styles
   - Move CSS variables to `:root` and `.dark` selectors, wrap color values in `hsl()`:
     ```css
     :root {
       --background: hsl(0 0% 100%);
       --foreground: hsl(240 10% 3.9%);
       /* ... more variables ... */
       --radius: 0.5rem;
     }
     .dark {
       --background: hsl(240 10% 3.9%);
       /* ... dark mode variables ... */
     }
     ```
   - Add `@theme inline` directive to replace `tailwind.config.ts`:
     ```css
     @theme inline {
       --radius-sm: calc(var(--radius) - 4px);
       --radius-md: calc(var(--radius) - 2px);
       --radius-lg: var(--radius);
       --radius-xl: calc(var(--radius) + 4px);
       --color-background: var(--background);
       --color-foreground: var(--foreground);
       /* ... map all color variables ... */
     }
     ```
   - Remove `@config '../tailwind.config.ts'` import

4. **Delete `tailwind.config.ts`** after verifying styles work.

5. **Use new `size-*` utility**: Replace `w-* h-*` with `size-*` (e.g., `w-4 h-4` → `size-4`).

6. **Update dependencies**: `npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest`

7. **Update `utils.ts`** (optional): Add type helpers previously from `bits-ui`:
   ```ts
   export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
   export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
   export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
   export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
   ```
   Then replace imports: `import type { WithElementRef } from "$lib/utils.js";`

8. **Update colors** (optional): Re-add components to get new dark mode colors:
   ```bash
   git add . && git commit -m '...'
   npm dlx shadcn-svelte@latest add --all --overwrite
   ```
   Then update dark mode colors in `app.css` to new OKLCH values per theming reference.

