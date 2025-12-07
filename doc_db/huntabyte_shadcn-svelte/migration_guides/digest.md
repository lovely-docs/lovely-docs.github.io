## Svelte 4 to Svelte 5 Migration

**Prerequisites**: Read Svelte v5 migration guide, commit changes, identify custom components, use `sv-migrate` CLI.

**Update components.json**: Add `registry` field and aliases for `components`, `utils`, `ui`, `hooks`, `lib`:
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "style": "default",
  "tailwind": { "css": "src/app.css", "baseColor": "slate" },
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

**Update tailwind.config.js**: Install `tailwindcss-animate`, add sidebar colors and animations:
```bash
npm i tailwindcss-animate
```
```ts
import tailwindcssAnimate from "tailwindcss-animate";
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
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

**Simplify utils.ts**: Export only `cn` function and utility types:
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

**Update dependencies**:
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```

**Remove deprecated packages**: `cmdk-sv` (use Bits UI Command), `svelte-headless-table` (use @tanstack/table-core), `svelte-radix` (use @lucide/svelte), `lucide-svelte` (use @lucide/svelte).

**Migrate components**: Optionally alias old bits-ui as `bits-ui-old` in package.json for gradual migration. Commit before migrating:
```bash
git add . && git commit -m 'before migration'
npx shadcn-svelte@latest add <component> -y -o
```
(`-y`: skip confirmation, `-o`: overwrite existing files). Review diffs and repeat for each component. After all migrations, uninstall deprecated packages.

## Tailwind v4 and Svelte 5 Migration

**Overview**: For existing Svelte 5 + Tailwind v3 projects. HSL colors convert to OKLCH (non-breaking). Default style changes from `default` to `new-york`. All components updated with `data-slot` attributes.

**Follow Tailwind v4 upgrade guide**: Run official upgrade and use `@tailwindcss/upgrade` codemod.

**Replace PostCSS with Vite**:
```bash
npm uninstall @tailwindcss/postcss
npm i @tailwindcss/vite -D
```
Update `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**Update app.css**: Replace `tailwindcss-animate` with `tw-animate-css`:
```bash
npm uninstall tailwindcss-animate && npm i tw-animate-css -D
```
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --radius: 0.5rem;
}
.dark {
  --background: hsl(240 10% 3.9%);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

**Delete tailwind.config.ts** after verifying styles work.

**Use new `size-*` utility**: Replace `w-* h-*` with `size-*` (e.g., `w-4 h-4` → `size-4`).

**Update dependencies**:
```bash
npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

**Update utils.ts** (optional): Add type helpers:
```ts
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

**Update colors** (optional): Re-add components to get new dark mode colors:
```bash
git add . && git commit -m '...'
npm dlx shadcn-svelte@latest add --all --overwrite
```
Then update dark mode colors in `app.css` to new OKLCH values.