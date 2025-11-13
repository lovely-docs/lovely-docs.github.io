## UI Components Library

60+ accessible, composable components built on Bits UI with form validation, theming, and responsive design.

**Core categories**: Layout (Card, Container, Sidebar, Resizable), Navigation (Breadcrumb, Tabs, Pagination, Menubar), Forms (Input, Checkbox, Select, Combobox, Field, Form with Superforms/Zod), Dialogs (Dialog, Drawer, Sheet, Popover, Command), Data Display (Table, Data Table with TanStack, Carousel, Calendar, Chart), Buttons, Feedback (Alert, Sonner toasts, Spinner), Utilities (Tooltip, Accordion, Scroll Area, Typography).

Install: `npm install shadcn-svelte@latest add [component-name]`

Components use composition pattern with sub-components exported from `index.ts`:
```svelte
import * as Card from "$lib/components/ui/card/index.js";
<Card.Root>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```

## Dark Mode

Implemented with `mode-watcher` library using Tailwind's `class` strategy.

```svelte
import { ModeWatcher } from "mode-watcher";
<ModeWatcher />
```

Toggle button or dropdown menu with light/dark/system options:
```svelte
import { toggleMode, setMode } from "mode-watcher";
<Button onclick={toggleMode}>Toggle</Button>
// or
<DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
```

## Installation

**SvelteKit**:
```bash
npm create sv@latest my-app
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button
```

**Vite**: Configure TypeScript paths in `tsconfig.json` and `vite.config.ts` for `$lib` alias, then run init/add commands.

**Astro**: Add Svelte and Tailwind integrations, set path aliases in `tsconfig.json`, create `src/styles/app.css` with Tailwind directives, disable Astro's base styles with `applyBaseStyles: false`.

**Manual**: Install `tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte`, create `src/lib/utils.ts` with `cn()` helper, add global styles with CSS variables in oklch format.

## CLI Commands

```bash
npx shadcn-svelte@latest init          # Initialize project
npx shadcn-svelte@latest add button    # Add component
npx shadcn-svelte@latest registry build ./registry.json  # Build custom registry
```

Options: `--cwd`, `--overwrite`, `--no-deps`, `--all`, `--yes`, `--proxy`

## Configuration

`components.json` configures the CLI:
```json
{
  "tailwind.css": "src/app.css",
  "tailwind.baseColor": "slate",
  "aliases": {
    "lib": "$lib",
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "utils": "$lib/utils",
    "hooks": "$lib/hooks"
  },
  "typescript": true,
  "registry": "https://shadcn-svelte.com/registry"
}
```

Set `"typescript": false` for JavaScript projects with `jsconfig.json` path aliases.

## Theming

CSS variables use `background`/`foreground` convention in OKLCH format with light/dark variants:
```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}
.dark {
  --primary: oklch(0.41 0.11 46);
  --primary-foreground: oklch(0.99 0.02 95);
}
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

Core variables: `--radius`, `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` through `--chart-5`, sidebar variants.

Pre-configured palettes: Neutral, Stone, Zinc, Gray, Slate.

## Migrations

**Svelte 4 to 5**: Update `components.json` with registry/aliases, install latest `bits-ui`, `svelte-sonner`, `@lucide/svelte`, `paneforge`, `vaul-svelte`, `mode-watcher`. Remove `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`. Re-add components with `--overwrite`.

**Tailwind v3 to v4**: Delete `postcss.config.js`, use Vite plugin. Replace `@config` with `@import "tailwindcss"`. Add `@custom-variant dark (&:is(.dark *))`. Convert HSL colors to OKLCH. Wrap CSS variable values in `hsl()`. Use `size-4` instead of `w-4 h-4`. Update all dependencies.

## Custom Registries

Create `registry.json` with registry items conforming to schema. Each item specifies `name`, `type` (registry:block, registry:component, registry:lib, registry:hook, registry:ui, registry:page, registry:file, registry:style, registry:theme), `files`, `dependencies`, `registryDependencies`, `cssVars`, `css`.

```json
{
  "name": "hello-world",
  "type": "registry:block",
  "files": [{ "path": "./src/lib/hello-world/hello-world.svelte", "type": "registry:component" }],
  "registryDependencies": ["button"]
}
```

Build with `npm run registry:build` (outputs to `static/r/`). Install with:
```bash
npm dlx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json
```

Support authentication via token query parameter validated server-side.

## Changelog

**June 2025**: Calendar/RangeCalendar overhaul with month/year dropdowns, 30+ Calendar blocks.

**May 2025**: Tailwind v4 support, Charts component (Svelte 5 + Tailwind v4), custom/remote registry support.

**March 2024**: Blocks introduced, Breadcrumb and Scroll Area added.

**February 2024**: Resizable component, icon imports moved to @lucide/svelte deep imports, Formsnap rewrite.

**January 2024**: Carousel, Drawer, Sonner, Pagination components.

**December 2023**: Calendar, Range Calendar, Date Picker.

**November 2023**: Toggle Group.

**October 2023**: Command, Combobox components.