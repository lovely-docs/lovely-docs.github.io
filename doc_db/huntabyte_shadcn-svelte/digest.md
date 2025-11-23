## UI Components Library

60+ composable, accessible components built on Bits UI, Embla Carousel, Vaul, and other primitives. All support Tailwind CSS styling and integrate with SvelteKit forms.

**Installation:**
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

**Component Categories:**
- **Layout & Structure**: Sidebar, Card, Resizable, Scroll Area, Separator, Empty
- **Navigation**: Breadcrumb, Navigation Menu, Pagination, Tabs, Menubar
- **Forms & Input**: Input, Textarea, Label, Checkbox, Radio Group, Switch, Select, Input OTP, Input Group, Slider, Toggle, Toggle Group, Field
- **Dialogs & Overlays**: Dialog, Alert Dialog, Drawer, Popover, Hover Card, Sheet, Tooltip
- **Dropdowns & Menus**: Dropdown Menu, Context Menu, Combobox
- **Data Display**: Table, Data Table (TanStack Table v8), Carousel (Embla), Chart, Badge, Avatar, Item
- **Feedback & Status**: Alert, Progress, Spinner, Sonner (toast notifications)
- **Utilities**: Accordion, Aspect Ratio, Button, Button Group, Collapsible, Calendar, Date Picker, Range Calendar, Kbd, Skeleton

**Form Integration with sveltekit-superforms & Zod:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const schema = z.object({ username: z.string().min(2) });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const form = superForm(defaults(zod4(schema)), {
    validators: zod4(schema),
    SPA: true
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>Public display name</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

**Composition Pattern:**
```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
```

**Accessibility:** WAI-ARIA compliant, keyboard navigation, screen reader friendly, semantic HTML.

---

## Dark Mode

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add to root layout (`src/routes/+layout.svelte`):
```svelte
<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
</script>
<ModeWatcher />
```

**Simple toggle:**
```svelte
<script lang="ts">
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0" />
  <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100" />
  <span class="sr-only">Toggle theme</span>
</Button>
```

**Dropdown with light/dark/system:**
```svelte
<script lang="ts">
  import { setMode, resetMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger>Theme</DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

---

## Installation

**SvelteKit:**
```bash
npm create sv@latest my-app
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```

**Vite:**
```bash
npx sv add tailwindcss
npx shadcn-svelte@latest init
```
Configure TypeScript paths in `tsconfig.json` and Vite resolution in `vite.config.ts`:
```ts
import path from "path";
export default defineConfig({
  resolve: {
    alias: { $lib: path.resolve("./src/lib") },
  },
});
```

**Astro:**
```bash
npm create astro@latest
npx astro add svelte tailwind
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```
Set `applyBaseStyles: false` in `astro.config.mjs` to prevent duplicate base styles.

**Manual:**
```bash
npx sv add tailwindcss
npm i tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte
npx shadcn-svelte@latest init
```
Create `src/lib/utils.ts` with `cn()` utility using clsx and tailwind-merge.

---

## Migration Guides

**Svelte 4 → 5:**
Update `components.json` with registry and aliases. Update dependencies:
```bash
npm i bits-ui@^1.0.0 svelte-sonner@^1.0.0 @lucide/svelte@^0.482.0 paneforge@^1.0.0-next.5 vaul-svelte@^1.0.0-next.7 mode-watcher@^1.0.0 -D
```
Deprecated packages: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`.

Re-add components:
```bash
npx shadcn-svelte@latest add <component> -y -o
```

**Tailwind v3 → v4:**
Replace PostCSS with Vite:
```bash
npm uninstall @tailwindcss/postcss && npm i @tailwindcss/vite -D
```

Update `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

Update `app.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.11 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.11 0 0);
  --foreground: oklch(0.99 0 0);
  /* ... */
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --color-background: var(--background);
  /* ... */
}
```

Re-add all components:
```bash
npx shadcn-svelte@latest add --all --overwrite
```

---

## Custom Registries

Create `registry.json` in project root:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

**Registry Item Types:**
- `registry:style` - Design systems with CSS variables (light/dark modes using OKLch)
- `registry:theme` - Color schemes with OKLch format
- `registry:block` - Reusable page templates
- `registry:component` - Single-file components
- `registry:hook` - Reusable hooks
- `registry:lib` - Libraries and utilities
- `registry:page` - Page/route files
- `registry:file` - Miscellaneous files

**File Structure:**
```json
{
  "files": [
    {
      "path": "registry/hello-world/page.svelte",
      "type": "registry:page",
      "target": "src/routes/hello/+page.svelte"
    }
  ]
}
```

**CSS Variables:**
```json
{
  "cssVars": {
    "theme": {"font-heading": "Poppins, sans-serif"},
    "light": {"brand": "oklch(0.99 0.00 0)"},
    "dark": {"brand": "oklch(0.14 0.00 286)"}
  }
}
```

**CSS Rules:**
```json
{
  "css": {
    "@layer base": {"h1": {"font-size": "var(--text-2xl)"}},
    "@layer components": {"card": {"padding": "var(--spacing-6)"}},
    "@utility scrollbar-hidden": {"&::-webkit-scrollbar": {"display": "none"}},
    "@keyframes wiggle": {"0%, 100%": {"transform": "rotate(-3deg)"}}
  }
}
```

**Dependencies:**
- `dependencies`: npm packages `["bits-ui", "zod@1.0.2"]`
- `registryDependencies`: Other registry items `["button", "input"]`, remote URLs, or local aliases `["local:stepper"]`

Build registry:
```bash
npm run registry:build
```

Install custom items:
```bash
npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o
```

---

## CLI Commands

**init** - Initialize project with dependencies, `cn` utility, and CSS variables:
```bash
npx shadcn-svelte@latest init
```
Options: `-c/--cwd`, `-o/--overwrite`, `--no-deps`, `--base-color`, `--css`, `--*-alias`, `--proxy`

**add** - Add components and dependencies:
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Options: `-c/--cwd`, `--no-deps`, `-a/--all`, `-y/--yes`, `-o/--overwrite`, `--proxy`

**registry build** - Generate registry JSON files:
```bash
npx shadcn-svelte@latest registry build [registry.json]
```
Options: `-c/--cwd`, `-o/--output`

**Proxy Support:**
```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

---

## Theming

CSS variables use `background`/`foreground` convention. Colors in OKLCH format.

**Available Variables:**
- Layout: `--radius`
- Base: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`
- Semantic: `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`
- UI: `--border`, `--input`, `--ring`
- Charts: `--chart-1` through `--chart-5`
- Sidebar: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`

**Add Custom Colors:**
```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Use as utilities:
```svelte
<div class="bg-warning text-warning-foreground"></div>
```

Preset color schemes: Neutral, Stone, Zinc, Gray, Slate (all with light/dark variants).

---

## Changelog

**June 2025:** Calendar components with month/year dropdowns, 30+ Calendar blocks

**May 2025:** Tailwind v4 support, Charts component (preview), Custom registry support

**March 2024:** Blocks introduction, Breadcrumb and Scroll Area components

**February 2024:** Resizable component, icon imports changed to deep imports (`@lucide/svelte/icons/check`), Formsnap rewrite with breaking changes

**January 2024:** Carousel, Drawer, Sonner, Pagination components

**December 2023:** Calendar, Range Calendar, Date Picker components

**November 2023:** Toggle Group component

**October 2023:** Command and Combobox components, Form.Label and Form.Control updates

---

## Additional Resources

**components.json** - Project configuration for CLI specifying Tailwind setup, path aliases, TypeScript config, and registry location.

**Component Structure** - Components split into multiple files with barrel exports (unlike React version). Import via namespace or named imports (both tree-shaken).

**IDE Extensions:**
- VSCode: shadcn-svelte extension by @selemondev
- JetBrains: shadcn/ui Components Manager by @WarningImHack3r

**JavaScript Support** - Set `"typescript": false` in `components.json` and configure `jsconfig.json` with import aliases.

**Custom Registry Template:**
```bash
npx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```