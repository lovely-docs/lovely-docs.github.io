
## Directories

### ui_components
Comprehensive library of 60+ accessible, composable UI components for Svelte with built-in form validation, theming, and responsive design.

## UI Components Library

Complete collection of composable, accessible UI components for Svelte applications built on Bits UI and other primitives.

### Core Components

**Layout & Structure**
- `Card` - Composable sections (Header, Title, Description, Content, Footer)
- `Container` - Flex container with media, title, description, actions
- `Empty` - Empty state display with media, title, description
- `Sidebar` - Collapsible sidebar with menu, groups, and provider state management
- `Resizable` - Draggable panel layouts with keyboard support

**Navigation**
- `Breadcrumb` - Hierarchical navigation with custom separators and dropdowns
- `Navigation Menu` - Website navigation with triggers and collapsible content
- `Pagination` - Page navigation with customizable items per page
- `Tabs` - Tabbed interface with triggers and content panels
- `Menubar` - Desktop application menu with checkboxes, radio groups, submenus

**Forms & Input**
- `Input` - Text input with validation support
- `Textarea` - Multi-line text input
- `Checkbox` - Toggle control with label support
- `Radio Group` - Mutually exclusive options
- `Switch` - Boolean toggle control
- `Select` - Dropdown with single/multiple selection and grouping
- `Native Select` - Styled HTML select element
- `Combobox` - Searchable dropdown combining Popover and Command
- `Input OTP` - One-time password input with copy-paste
- `Input Group` - Prefix/suffix containers for inputs with icons, buttons, text
- `Slider` - Range input with single/multiple values
- `Field` - Composable form field with label, description, error states
- `Form` - Type-safe forms with Formsnap, Superforms, and Zod validation

**Dialogs & Overlays**
- `Dialog` - Modal window overlay
- `Alert Dialog` - Modal for important messages requiring confirmation
- `Drawer` - Slide-in panel from screen edges
- `Sheet` - Dialog-based content from edges with positioning
- `Popover` - Portal content triggered by button
- `Hover Card` - Preview content on hover
- `Command` - Command menu/palette with dialog variant
- `Context Menu` - Right-click menu with items, submenus, checkboxes, radio groups

**Data Display**
- `Table` - Responsive table with headers, rows, cells, footer
- `Data Table` - TanStack Table v8 with pagination, sorting, filtering, column visibility, row selection
- `Carousel` - Embla Carousel with sizing, spacing, orientation, API access, plugins
- `Calendar` - Date selection with single dates, multiple months, dropdowns
- `Range Calendar` - Date range picker
- `Date Picker` - Popover-based date picker with presets
- `Chart` - LayerChart-based charts with composition design and theming
- `Badge` - Styled badges with variants (default, secondary, destructive, outline)
- `Avatar` - Image with text fallback
- `Progress` - Task completion progress bar
- `Skeleton` - Loading state placeholder

**Buttons & Controls**
- `Button` - Reusable button with variants, sizes, link rendering
- `Button Group` - Grouped buttons with separators and orientation
- `Toggle` - Two-state button
- `Toggle Group` - Multiple two-state buttons with single/multiple selection
- `Kbd` - Keyboard input display

**Feedback & Status**
- `Alert` - Callout messages with icons, titles, descriptions, variants
- `Sonner` - Toast notifications with success/error types, descriptions, actions
- `Spinner` - Animated loading indicator

**Utilities**
- `Aspect Ratio` - Content constraint to specific aspect ratio
- `Label` - Accessible form label
- `Separator` - Visual content divider (horizontal/vertical)
- `Scroll Area` - Custom-styled scrollable container
- `Tooltip` - Information popup on hover/focus
- `Collapsible` - Expand/collapse panel
- `Accordion` - Vertically stacked collapsible sections
- `Typography` - Tailwind utility classes for text styling

### Installation & Usage

Install components via CLI:
```bash
npm install shadcn-svelte@latest add [component-name]
```

Components use composition pattern with sub-components:
```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```

### Key Features

- **Accessibility**: WAI-ARIA patterns, keyboard navigation, screen reader support
- **Composition**: Build complex UIs by combining sub-components
- **Form Integration**: Works with sveltekit-superforms and Zod validation
- **Theming**: CSS variables for customization, dark mode support
- **Responsive**: Mobile-first design with Tailwind CSS utilities
- **Type-Safe**: Full TypeScript support
- **Snippets**: Svelte 5 snippet support for flexible rendering
- **Icons**: Integration with lucide-svelte icons

### dark_mode
Configure dark mode using mode-watcher with Tailwind's class strategy, supporting toggle buttons and dropdown menus with light/dark/system options.

## Dark Mode Implementation

Dark mode is implemented using Tailwind CSS's `class` strategy with the `mode-watcher` library for theme management and persistence.

### Setup

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add `ModeWatcher` component to your root layout:
```svelte
<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
</script>
<ModeWatcher />
```

### Mode Toggle

Simple toggle button that switches between light and dark:
```svelte
<script lang="ts">
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
  <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
</Button>
```

Dropdown menu with light/dark/system options:
```svelte
<script lang="ts">
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
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

### Astro Support

For Astro projects, add an inline script to prevent FUOC (Flash of Unstyled Content):
```astro
<script is:inline>
  const getThemePreference = () => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
</script>
```

Then add `<ModeWatcher client:load />` to your page.

### installation
Step-by-step setup instructions for integrating shadcn-svelte into SvelteKit, Vite, Astro, or custom projects.

## Installation Guides

Setup instructions for integrating shadcn-svelte into different project types.

### SvelteKit
```bash
npm create sv@latest my-app
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button
```
Configure `svelte.config.js` with path aliases if needed. Initialize with base color (Slate), CSS file (src/app.css), and aliases ($lib, $lib/components, $lib/utils, $lib/hooks, $lib/components/ui).

### Vite
```bash
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button
```
Configure TypeScript paths in `tsconfig.json` and `tsconfig.app.json`. Update `vite.config.ts` to resolve `$lib` alias.

### Astro
```bash
npm create astro@latest
npx astro add svelte
npx astro add tailwind
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button
```
Set path aliases in `tsconfig.json`. Create global CSS at `src/styles/app.css` with Tailwind directives. Import CSS in `src/pages/index.astro`. Disable Astro's Tailwind base styles in `astro.config.mjs` with `applyBaseStyles: false`. Use components in `.astro` files with client directives.

### Manual Setup
Install dependencies: `npm i tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte`

Create utils helper in `src/lib/utils.ts`:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Add global styles to `src/app.css` with Tailwind imports, CSS variables for colors (background, foreground, primary, secondary, etc.) in oklch format, theme configuration, and base layer styles. Import styles in `src/routes/+layout.svelte`.

### migration_guides
Step-by-step instructions for upgrading shadcn-svelte projects to Svelte 5 and Tailwind v4, including configuration changes, dependency updates, and component migration.

## Svelte 4 to Svelte 5 Migration

**Configuration Updates**:
- Add `registry` and aliases to `components.json`
- Install `tailwindcss-animate` plugin in `tailwind.config.js`
- Update `utils.ts` to export only `cn()` and utility types

**Dependencies**:
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```
Remove: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`

**Component Migration**:
```bash
npx shadcn-svelte@latest add dialog --overwrite
```
Repeat for each component, reviewing diffs for custom behavior.

## Tailwind v4 and Svelte 5 Migration

**Key Changes**:
- HSL colors converted to OKLCH
- `default` style deprecated for `new-york`
- All components have `data-slot` attributes
- `tailwindcss-animate` replaced with `tw-animate-css`

**Setup**:
- Delete `postcss.config.js`, replace with Vite:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**CSS Updates**:
- Replace `@config` with `@import "tailwindcss"`
- Add `@custom-variant dark (&:is(.dark *))`
- Wrap CSS variable values in `hsl()` function
- Replace `tailwind.config.ts` with `@theme inline` directive
- Use `size-4` instead of `w-4 h-4`

**Dependencies**: Update `bits-ui`, `@lucide/svelte`, `tailwind-variants`, `tailwind-merge`, `clsx`, `svelte-sonner`, `paneforge`, `vaul-svelte`, `formsnap`

### registry
Complete guide to creating, structuring, and serving custom component registries with shadcn-svelte, including schemas for registry items and CSS customization.

## Registry Item Types

**registry:style** - Extends or creates custom styles with dependencies, components, and CSS variables.

**registry:theme** - Define color schemes for light and dark modes using CSS variables (oklch format).

**registry:block** - Reusable component blocks with multiple files and registry dependencies.

## CSS Customization

**CSS Variables** - Add custom theme variables or override Tailwind variables:
```json
{
  "cssVars": {
    "light": { "brand-background": "20 14.3% 4.1%" },
    "dark": { "brand-background": "20 14.3% 4.1%" },
    "theme": { "text-base": "3rem", "font-heading": "Poppins, sans-serif" }
  }
}
```

**Base/Component Styles** - Define styles in `@layer base` and `@layer components`.

**Utilities** - Create custom Tailwind utilities:
```json
{
  "@utility content-auto": { "content-visibility": "auto" },
  "@utility scrollbar-hidden": { "&::-webkit-scrollbar": { "display": "none" } },
  "@utility tab-*": { "tab-size": "var(--tab-size-*)" }
}
```

**Animations** - Define @keyframes in css and animation variables in cssVars.theme.

## Complex Registry Items

Registry items can include multiple file types:
```json
{
  "name": "hello-world",
  "type": "registry:block",
  "files": [
    { "path": "registry/hello-world/page.svelte", "type": "registry:page", "target": "src/routes/hello/+page.svelte" },
    { "path": "registry/hello-world/components/hello-world.svelte", "type": "registry:component" },
    { "path": "registry/hello-world/hooks/use-hello.svelte.ts", "type": "registry:hook" },
    { "path": "registry/hello-world/lib/format-date.ts", "type": "registry:utils" }
  ]
}
```

## registry-item.json Schema

**Core Properties:**
- `$schema`: `https://shadcn-svelte.com/schema/registry-item.json`
- `name`, `title`, `description`, `type` (registry:block, registry:component, registry:lib, registry:hook, registry:ui, registry:page, registry:file, registry:style, registry:theme)

**Dependencies:**
- `dependencies`: npm packages array
- `registryDependencies`: Other registry items (shadcn-svelte items, remote URLs, local aliases with `local:`, or relative paths)

**Styling:**
- `cssVars`: CSS variables by theme/light/dark
- `css`: CSS rules for layers and utilities
- `author`, `docs`, `categories`, `meta`

## Setting Up a Custom Registry

Create `registry.json`:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Create component file and register in `registry.json`:
```json
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [{ "path": "./src/lib/hello-world/hello-world.svelte", "type": "registry:component" }]
    }
  ]
}
```

Add to `src/app.css`:
```css
@source "./registry/@acmecorp/ui-lib";
```

Build and serve:
```json
{ "scripts": { "registry:build": "npm shadcn-svelte registry build" } }
```

Run `npm run registry:build` to generate registry JSON files in `static/r/`. Access at `http://localhost:5173/r/hello-world.json`.

**Authentication** - Use token query parameter: `http://localhost:5173/r/hello-world.json?token=[TOKEN]`. Validate server-side.

**Install items:**
```bash
npm dlx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json
```

## registry.json Schema

**Core Properties:**
- `$schema`: `https://shadcn-svelte.com/schema/registry.json`
- `name`: Registry name
- `homepage`: Registry URL
- `items`: Array of registry items

**Aliases** - Transform internal import paths:
```json
{
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "components": "@/lib/registry/components",
    "utils": "@/lib/utils",
    "hooks": "@/lib/hooks"
  }
}
```

**overrideDependencies** - Force specific dependency versions:
```json
{ "overrideDependencies": ["paneforge@next"] }
```



## Pages

### changelog
Timeline of component additions and major updates to shadcn-svelte from October 2023 through June 2025.

## Recent Updates
- **June 2025**: Calendar components overhauled with dropdowns, 30+ blocks added; custom registry support
- **May 2025**: Tailwind v4 support with migration guide; Charts preview component; custom registries
- **Feb 2024**: Icon imports now use deep imports (@lucide/svelte/icons/check) for better performance; Formsnap completely rewritten with new API
- **Jan 2024**: Carousel, Drawer, Sonner, Pagination components added
- **Oct 2023**: Command and Combobox components; Form.Label now uses $ids.input; Form.Control component added

### cli
CLI commands for initializing projects, adding components, building registries, and configuring proxy support.

## init
```bash
npx shadcn-svelte@latest init
```
Initializes project with dependencies, `cn` util, and CSS variables. Configures base color and import aliases.

## add
```bash
npx shadcn-svelte@latest add button
```
Adds components interactively or by name.

## registry build
```bash
npx shadcn-svelte@latest registry build ./registry.json
```
Generates registry JSON files to `static/r`.

## Proxy
```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```
Respects HTTP_PROXY environment variable for requests.

### components.json
Configuration file that tells the shadcn-svelte CLI how to set up and generate components for your project.

Configuration file for shadcn-svelte CLI (optional, only needed for CLI-based component installation).

Initialize: `npx shadcn-svelte@latest init`

Main settings:
- `tailwind.css`: Path to Tailwind CSS import
- `tailwind.baseColor`: Base color palette (gray/neutral/slate/stone/zinc) - immutable after init
- `aliases`: Import path aliases for lib, utils, components, ui, hooks
- `typescript`: Enable/disable or specify custom config path
- `registry`: Component registry URL

### installation
How to install shadcn-svelte, structure components across multiple files, and use IDE extensions for component management.

## Setup

Multiple installation guides available (SvelteKit, Astro, Vite, Manual).

## Imports

Components split into multiple `.svelte` files with `index.ts` exports:
```ts
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "$lib/components/ui/accordion"
```

Tree-shaken by Rollup.

## IDE Extensions

VSCode and JetBrains extensions available for component management and CLI operations.

### javascript_support
How to configure shadcn-svelte to use JavaScript instead of TypeScript.

Set `"typescript": false` in `components.json` to use JavaScript versions of components via CLI. Configure import aliases in `jsconfig.json` with path mappings.

### registry
Create and host your own component registry to distribute custom components, hooks, and files to Svelte projects via the shadcn-svelte CLI.

Create a custom component registry using the CLI to distribute components to Svelte projects. Registry items must be valid JSON files conforming to the registry-item schema. Use the official template as a starting point:

```bash
pnpm dlx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```

### theming
Customize component colors using CSS variables with background/foreground convention in OKLCH format, with built-in light/dark mode support and pre-configured color palettes.

## CSS Variables & Convention

Colors use `background`/`foreground` convention in OKLCH format:
```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```
```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

## Core Variables

`:root` and `.dark` include: `--radius`, `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` to `--chart-5`, sidebar variants.

## Custom Colors

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

Use: `<div class="bg-warning text-warning-foreground"></div>`

Pre-configured palettes: Neutral, Stone, Zinc, Gray, Slate.

