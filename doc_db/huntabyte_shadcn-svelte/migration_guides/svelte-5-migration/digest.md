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