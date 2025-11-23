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