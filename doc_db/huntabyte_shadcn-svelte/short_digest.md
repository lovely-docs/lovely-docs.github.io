## UI Components

60+ accessible, composable components with form validation, theming, responsive design.

Install: `npm install shadcn-svelte@latest add [component-name]`

Composition pattern with sub-components:
```svelte
import * as Card from "$lib/components/ui/card/index.js";
<Card.Root><Card.Header><Card.Title>Title</Card.Title></Card.Header></Card.Root>
```

## Dark Mode

`mode-watcher` with Tailwind class strategy:
```svelte
import { ModeWatcher } from "mode-watcher";
<ModeWatcher />
```

## Installation

**SvelteKit**: `npm create sv@latest my-app && npx sv add tailwindcss && npx shadcn-svelte@latest init && npx shadcn-svelte@latest add button`

**Vite/Astro**: Configure path aliases, run init/add commands.

**Manual**: Install dependencies, create `src/lib/utils.ts` with `cn()`, add global styles with CSS variables.

## CLI

```bash
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button
npx shadcn-svelte@latest registry build ./registry.json
```

## Configuration

`components.json`:
```json
{
  "tailwind.css": "src/app.css",
  "tailwind.baseColor": "slate",
  "aliases": { "lib": "$lib", "components": "$lib/components", "ui": "$lib/components/ui", "utils": "$lib/utils", "hooks": "$lib/hooks" },
  "typescript": true
}
```

## Theming

CSS variables in OKLCH format with light/dark variants:
```css
:root { --primary: oklch(0.205 0 0); --primary-foreground: oklch(0.985 0 0); }
.dark { --primary: oklch(0.41 0.11 46); --primary-foreground: oklch(0.99 0.02 95); }
@theme inline { --color-primary: var(--primary); --color-primary-foreground: var(--primary-foreground); }
```

## Migrations

**Svelte 4→5**: Update `components.json`, install latest deps, remove old packages, re-add components with `--overwrite`.

**Tailwind v3→v4**: Use Vite plugin, convert HSL to OKLCH, update dependencies.

## Custom Registries

Create `registry.json` with items, build with `npm run registry:build`, install with CLI from URL.