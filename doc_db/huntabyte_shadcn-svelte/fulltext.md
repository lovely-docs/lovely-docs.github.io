
## Directories

### ui_components
Complete UI component library for Svelte with 60+ composable, accessible, themeable components for forms, navigation, data display, and layouts.

A comprehensive collection of 60+ reusable Svelte UI components built on Bits UI, Embla Carousel, LayerChart, and other libraries. Each component is installed via `npx shadcn-svelte@latest add <component> -y -o` (flags: -y skips confirmation, -o overwrites existing files).

**Core Components:**
- **Accordion**: Vertically stacked expandable sections with single/multiple modes, WAI-ARIA accessible
- **Alert/AlertDialog**: Callout notifications and modal dialogs with variants (default, destructive)
- **Avatar**: Image with fallback text, composed of Root/Image/Fallback
- **Badge**: Styled badges with variants (default, secondary, destructive, outline), icon support
- **Breadcrumb**: Navigation path with Root/List/Item/Link/Page/Separator/Ellipsis, custom separators, dropdowns, responsive variants
- **Button**: Reusable button with variants (default, secondary, destructive, outline, ghost, link), sizes, icon support, href for links
- **ButtonGroup**: Groups related buttons with vertical/horizontal orientation, separators, nesting, composition with inputs/dropdowns/popovers

**Form Components:**
- **Checkbox**: Toggle control with checked/disabled states, data-[state=checked] styling, form integration
- **Input**: Text input with email/file/disabled/invalid states, labels, descriptions, validation
- **InputGroup**: Input/textarea wrapper with configurable addons (icons, text, buttons, tooltips, dropdowns, loading indicators), inline/block alignment
- **InputOTP**: Accessible OTP input with configurable length, pattern validation, separators, form integration
- **Label**: Accessible label with for attribute linking to form control id
- **RadioGroup**: Mutually exclusive selection with single-selection mode, form integration
- **Select**: Dropdown with single selection, grouping, state binding, form integration
- **Switch**: Toggle control with checked/disabled states, form integration
- **Textarea**: Multi-line text input with disabled state, labels, validation

**Layout & Structure:**
- **Card**: Composable card with Root/Header/Title/Description/Action/Content/Footer
- **Empty**: Empty state with Root/Header/Media/Title/Description/Content, icon/avatar variants, borders, gradients
- **Field**: Composable form field with labels, descriptions, errors, vertical/horizontal/responsive orientations, choice cards
- **Item**: Flex container for content with title/description/actions, variants (default, outline, muted), sizes, media types, grouping, link/dropdown integration
- **Separator**: Visual divider with horizontal/vertical orientation
- **Sidebar**: Composable sidebar with Provider/Root/Header/Content/Group/Menu/Footer/Trigger, left/right positioning, sidebar/floating/inset variants, offcanvas/icon/none collapse modes, useSidebar() hook, CSS variable theming

**Navigation & Menus:**
- **Breadcrumb**: Navigation hierarchy with custom separators, dropdowns, ellipsis for collapsed state, responsive desktop/mobile variants
- **DropdownMenu**: Menu triggered by button with items, checkboxes, radio groups, separators, nested submenus, keyboard shortcuts
- **Menubar**: Desktop menubar with Root/Menu/Trigger/Content/Item/Shortcut/Separator/Sub/CheckboxItem/RadioGroup, nested submenus
- **NavigationMenu**: Collection of navigation links with triggers, dropdowns, grid layouts, icons
- **Pagination**: Page navigation with configurable page count, items per page, sibling count, prev/next buttons, ellipsis

**Overlays & Popovers:**
- **Dialog**: Modal window with Root/Trigger/Content/Header/Title/Description/Footer
- **Drawer**: Slide-out panel (Vaul-based) with Root/Trigger/Content/Header/Title/Description/Footer/Close, responsive Dialog/Drawer switching
- **HoverCard**: Link preview on hover with Root/Trigger/Content
- **Popover**: Rich content portal triggered by button with Root/Trigger/Content
- **Sheet**: Dialog-based sheet with configurable side positioning (top/right/bottom/left), CSS-customizable sizing
- **Tooltip**: Popup on hover/focus with Provider/Root/Trigger/Content

**Data Display:**
- **Calendar**: Date selection with single/range modes, dropdown month/year selectors, popover integration, natural language parsing, 30+ block variants
- **Chart**: Composable charts on LayerChart with data/config (labels/colors), CSS variable theming, customizable tooltips
- **DataTable**: TanStack Table v8 integration with pagination, sorting, filtering, column visibility, row selection, cell formatting using Svelte 5 snippets
- **Progress**: Progress bar with value and max props
- **Skeleton**: Placeholder loader component, customize dimensions/shape via Tailwind classes
- **Table**: Responsive table with Root/Caption/Header/Body/Footer/Row/Head/Cell, colspan support, custom styling
- **Tabs**: Tabbed interface with Root/List/Trigger/Content, only one panel visible at a time

**Input Enhancements:**
- **AspectRatio**: Maintains content at specified ratio (e.g., 16/9)
- **Carousel**: Embla-based carousel with sizing (basis classes), spacing (pl-/ml- utilities), vertical/horizontal orientation, configurable options, API access via setApi callback, Autoplay plugin support
- **DatePicker**: Date picker combining Popover + Calendar/RangeCalendar for single dates, ranges, presets, form integration with date constraints
- **RangeCalendar**: Date range picker calendar with {start, end} value object binding
- **Resizable**: Resizable panel groups with horizontal/vertical direction, defaultSize percentages, nested pane support, optional handle indicators
- **ScrollArea**: Custom-styled scroll area with configurable orientation (vertical/horizontal/both)
- **Slider**: Range input with single/multiple thumbs, configurable max/step/orientation

**Specialized:**
- **Command**: Unstyled command menu with Root/Input/List/Group/Item/Separator/Shortcut/Dialog variants, keyboard shortcuts, disabled items, automatic icon styling
- **Combobox**: Searchable dropdown/autocomplete built from Popover + Command, $state/$derived for open/value, closeAndFocusTrigger() after selection, Form.Control for form integration
- **ContextMenu**: Right-click context menu with items, checkboxes, radio groups, separators, nested submenus, keyboard shortcuts
- **Collapsible**: Expandable/collapsible panel with Root/Trigger/Content
- **Form**: Form components wrapping Formsnap & Superforms with Zod validation, ARIA attributes, composable field structure (Field/Control/Label/Description/FieldErrors)
- **Kbd**: Keyboard input display, supports grouping and nesting in buttons/tooltips/input groups
- **NativeSelect**: Styled native HTML select with option groups, disabled/invalid states, accessibility features
- **Sonner**: Toast notifications with success/error variants, description, action callback
- **Spinner**: Loading indicator, customize size/color with utility classes, works in buttons/badges/input groups/items/empty states
- **Toggle**: Two-state button with variants (default, outline), sizes (sm/default/lg), disabled state, icon/text support
- **ToggleGroup**: Toggle group with single/multiple selection modes, size variants, outline styling, disabled state support
- **Typography**: Styling examples using Tailwind utilities for headings (h1-h4), paragraphs, blockquotes, code, lists, tables

**Installation Pattern:**
All components follow the same installation: `npx shadcn-svelte@latest add <component> -y -o`

**Key Patterns:**
- Composable subcomponents (Root/Trigger/Content/Item structure)
- Svelte 5 snippets and $state/$derived reactivity
- Tailwind CSS for styling
- Form integration with sveltekit-superforms and Zod validation
- Accessibility via ARIA attributes and semantic HTML
- Keyboard navigation support
- Dark mode support via CSS variables
- Responsive design patterns

### dark_mode
Implement dark mode with mode-watcher package: install, add ModeWatcher component to layout, create toggle controls using toggleMode/setMode/resetMode functions.

## Dark Mode Implementation

Implement dark mode using the `mode-watcher` package which manages theme state and persistence.

### Setup

Install the package:
```bash
npm i mode-watcher
```

Add the `ModeWatcher` component to your root layout (`src/routes/+layout.svelte`):
```svelte
<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
{@render children?.()}
```

### Toggle Components

Create a simple toggle button:
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

Or a dropdown menu with light/dark/system options:
```svelte
<script lang="ts">
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
    <SunIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0" />
    <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### API Functions

- `toggleMode()` - Toggle between light and dark modes
- `setMode("light" | "dark")` - Set a specific mode
- `resetMode()` - Use system preference

### Astro Integration

For Astro projects, use an inline script to prevent FUOC (Flash of Unstyled Content) and persist theme to localStorage:
```astro
<script is:inline>
  const isBrowser = typeof localStorage !== 'undefined';
  const getThemePreference = () => {
    if (isBrowser && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  if (isBrowser) {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
</script>
```

Then add `ModeWatcher` with `client:load` directive to your Astro layout.

### installation
Framework-specific installation and configuration guides for shadcn-svelte

## Installation Guides for shadcn-svelte

Setup instructions for multiple frameworks and build tools.

### SvelteKit
```bash
npx sv create my-app
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```
Configure `svelte.config.js` with path aliases if needed. During init, set base color to Slate, global CSS to src/app.css, and import aliases to $lib, $lib/components, $lib/utils, $lib/hooks, $lib/components/ui.

### Vite
Add Tailwind, configure TypeScript paths in `tsconfig.json` and `tsconfig.app.json` with `$lib` alias pointing to `./src/lib`, update `vite.config.ts` with path resolution alias, then run init and add components.

### Astro
Create Astro project with TypeScript (Strict), add Svelte and Tailwind integrations. Configure `tsconfig.json` with `$lib` path alias. Create `src/styles/app.css` with Tailwind directives and import in `src/pages/index.astro`. Run init with Slate theme and $lib aliases. Set `applyBaseStyles: false` in `astro.config.mjs` to prevent duplicate Tailwind base styles. Use client directives for interactive components.

### Manual Setup
Install dependencies: `tailwind-variants`, `clsx`, `tailwind-merge`, `tw-animate-css`, `@lucide/svelte`. Configure path aliases in `svelte.config.js` (SvelteKit) or `tsconfig.json`/`vite.config.ts` (non-SvelteKit). Create `src/app.css` with Tailwind imports and CSS variables for theming using oklch color format with dark mode overrides. Define `@theme inline` block mapping Tailwind theme values to CSS variables. Create `src/lib/utils.ts` with `cn()` utility combining clsx and tailwind-merge. Import styles in layout component.

### Component Installation
Add components with `npx shadcn-svelte@latest add <component> -y -o`:
- `-y`: skip confirmation prompt
- `-o`: overwrite existing files

Import from `$lib/components/ui/<component>/index.js`.

### migration_guides
Step-by-step guides for upgrading Svelte 4→5 and Tailwind v3→v4, with config updates, dependency changes, and component migration instructions.

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

### registry_schema_&_setup
JSON schema specification and setup guide for creating custom component registries with reusable items, styles, and themes.

## Registry Item JSON Schema

Registry items define reusable components, styles, themes, and blocks for shadcn-svelte projects. Each item is a JSON object with metadata and file references.

### Core Properties

**name**: Unique identifier (e.g., "hello-world")

**type**: Item classification:
- `registry:block` - Complex components with multiple files
- `registry:component` - Simple single components
- `registry:ui` - UI primitives
- `registry:lib` - Libraries/utilities
- `registry:hook` - Hooks
- `registry:page` - Routes
- `registry:file` - Miscellaneous files
- `registry:style` - Styles (e.g., "new-york")
- `registry:theme` - Themes

**title**, **description**: Human-readable metadata

**files**: Array of file objects with `path` (registry location), `type`, and optional `target` (installation location):
```json
{
  "files": [
    {
      "path": "registry/hello-world/page.svelte",
      "type": "registry:page",
      "target": "src/routes/hello/+page.svelte"
    },
    {
      "path": "registry/hello-world/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/.env",
      "type": "registry:file",
      "target": ".env"
    }
  ]
}
```

**dependencies**: npm packages (use `@version` for specific versions):
```json
{ "dependencies": ["bits-ui", "zod@3.0.0"] }
```

**registryDependencies**: Other registry items (names, URLs, or local paths):
```json
{ "registryDependencies": ["button", "input", "https://example.com/r/custom.json"] }
```

**cssVars**: CSS variables organized by theme sections:
```json
{
  "cssVars": {
    "theme": { "font-heading": "Poppins, sans-serif" },
    "light": { "brand": "20 14.3% 4.1%", "radius": "0.5rem" },
    "dark": { "brand": "20 14.3% 4.1%" }
  }
}
```

**css**: CSS rules added to project CSS file:
```json
{
  "css": {
    "@layer base": { "h1": { "font-size": "var(--text-2xl)" } },
    "@layer components": { "card": { "padding": "var(--spacing-6)" } },
    "@utility content-auto": { "content-visibility": "auto" },
    "@keyframes wiggle": { "0%, 100%": { "transform": "rotate(-3deg)" } }
  }
}
```

**docs**: Custom message shown during CLI installation

**categories**: Organize items by category (e.g., `["sidebar", "dashboard"]`)

**meta**: Additional key/value metadata

### Style & Theme Examples

**Extending shadcn-svelte style:**
```json
{
  "name": "example-style",
  "type": "registry:style",
  "dependencies": ["phosphor-svelte"],
  "registryDependencies": ["login-01", "calendar"],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "brand": "oklch(0.145 0 0)" },
    "dark": { "brand": "oklch(0.145 0 0)" }
  }
}
```

**Custom theme:**
```json
{
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.546 0.245 262.881)"
    },
    "dark": {
      "background": "oklch(1 0 0)",
      "primary": "oklch(0.707 0.165 254.624)"
    }
  }
}
```

**Block with dependencies:**
```json
{
  "name": "login-01",
  "type": "registry:block",
  "description": "A simple login form.",
  "registryDependencies": ["button", "card", "input", "label"],
  "files": [
    {
      "path": "blocks/login-01/page.svelte",
      "type": "registry:page",
      "target": "src/routes/login/+page.svelte"
    },
    {
      "path": "blocks/login-01/components/login-form.svelte",
      "type": "registry:component"
    }
  ]
}
```

## registry.json Schema

Root registry configuration file defining the registry itself.

**$schema**: `https://shadcn-svelte.com/schema/registry.json`

**name**: Registry identifier (used in data attributes)

**homepage**: Registry URL

**items**: Array of registry items (each follows registry-item schema)

**aliases**: Maps internal import paths to actual locations. Transformed during installation based on user's `components.json`:
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

Default aliases if not specified:
```json
{
  "aliases": {
    "lib": "$lib/registry/lib",
    "ui": "$lib/registry/ui",
    "components": "$lib/registry/components",
    "utils": "$lib/utils",
    "hooks": "$lib/registry/hooks"
  }
}
```

**overrideDependencies**: Force specific dependency versions (overrides `package.json` detection):
```json
{ "overrideDependencies": ["paneforge@next"] }
```

## Setting Up a Registry

Create `registry.json` in project root:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Create component file at `registry/hello-world/hello-world.svelte`:
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Hello World</Button>
```

Add to `registry.json`:
```json
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "./src/lib/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

For custom component directories, ensure Tailwind CSS detects them via `@source` in `src/app.css`:
```css
@source "./registry/@acmecorp/ui-lib";
```

### Build & Serve

Install CLI: `npm install shadcn-svelte@latest`

Add to `package.json`:
```json
{ "scripts": { "registry:build": "shadcn-svelte registry build" } }
```

Run: `npm run registry:build` (generates JSON in `static/r/` by default, customizable with `--output`)

Serve: `npm run dev` - registry available at `http://localhost:5173/r/[NAME].json`

### Publishing & Authentication

Deploy to public URL. For token-based auth, use query parameter: `http://localhost:5173/r/hello-world.json?token=[SECURE_TOKEN_HERE]`. Handle authorization on server, return 401 for invalid tokens. Encrypt and expire tokens.

### Installing Registry Items

`npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o`

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Guidelines

- Required block properties: `name`, `description`, `type`, `files`
- List all registry dependencies in `registryDependencies`
- Organize files in `components`, `hooks`, `lib` directories
- Use registry template at GitHub for new projects



## Pages

### changelog
Release history: June 2025 Calendar overhaul; May 2025 Tailwind v4, Charts, custom registries; Feb 2024 deep icon imports for perf, Formsnap rewrite; Jan 2024 Carousel/Drawer/Sonner/Pagination; Oct 2023 Command/Combobox, Form.Label store syntax, Form.Control.

## June 2025
Calendar and RangeCalendar components overhauled with month/year dropdown selectors and 30+ Calendar blocks added.

## May 2025
**Tailwind v4 Support**: Official support landed with refreshed styles. Full migration guide available. Projects using Svelte v5 with Tailwind v3 continue to work until upgrade.

**Charts**: Added as preview component. Available via CLI for Svelte v5 + Tailwind v4 projects.

**Custom Registry Support**: Publish custom/remote components via shadcn-svelte CLI to share with community.

## March 2024
**Blocks**: Ready-made, fully responsive, accessible, composable components built using same principles as core components.

**New Components**: Breadcrumb, Scroll Area (built on Bits UI, supports vertical/horizontal scrolling).

## February 2024
**New Component: Resizable**: Built on PaneForge.

**Icon Imports Updated**: Moved from unmaintained `radix-icons-svelte` to `svelte-radix`. Changed from:
```ts
import { Check } from "@lucide/svelte";
```
to deep imports:
```ts
import Check from "@lucide/svelte/icons/check";
```
Deep imports prevent Vite from optimizing entire icon collections, only optimizing used icons. Significant dev server performance improvement.

**Major Forms Update**: Formsnap completely rewritten for flexibility and power. No direct migration path—update components to new API. All Form components updated. See Forms Examples page.

## January 2024
**New Component: Carousel**:
```svelte
<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5), i}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

**New Component: Drawer**: Built on vaul-svelte (Svelte port of vaul by Emil Kowalski). Includes header, description, content, footer with buttons.

**New Component: Sonner**: Svelte port of Sonner (by Emil Kowalski). Toast notifications:
```ts
import { toast } from "svelte-sonner";
toast.success("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: { label: "Undo", onClick: () => console.info("Undo") }
});
```

**New Component: Pagination**: Built on Bits UI Pagination component.

## December 2023
New components: Calendar, Range Calendar, Date Picker.

## November 2023
New component: Toggle Group.

## October 2023
**New Component: Command**: Command palette built on cmdk-sv (Svelte port of cmdk).

**New Component: Combobox**: Combination of Command + Popover for searchable dropdown.

**Form.Label Changes**: `ids` from `getFormField()` now a store, prefix with `$`:
```svelte
<Label for={$ids.input} class={cn($errors && "text-destructive", className)}>
  <slot />
</Label>
```

**Form.Control**: New formsnap component wraps non-traditional form elements. Export in `src/lib/ui/form/index.ts`:
```ts
const Control = FormPrimitive.Control;
export { Control, Control as FormControl };
```

### cli
CLI commands: init (setup project), add (install components with -y -o flags), registry build (generate JSON), proxy support via HTTP_PROXY env var.

## init

Initialize a new project with dependencies, the `cn` util, and CSS variables.

```bash
npx shadcn-svelte@latest init
```

Prompts for configuration:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options: `-c/--cwd <path>`, `-o/--overwrite`, `--no-deps`, `--base-color <name>`, `--css <path>`, `--components-alias <path>`, `--lib-alias <path>`, `--utils-alias <path>`, `--hooks-alias <path>`, `--ui-alias <path>`, `--proxy <proxy>`

## add

Add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add <component> -y -o
```

- `-y`: skip confirmation prompt
- `-o`: overwrite existing files

Presents interactive list of available components (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, card, checkbox, collapsible, etc.)

Options: `-c/--cwd <path>`, `--no-deps`, `-a/--all` (install all components), `-y/--yes`, `-o/--overwrite`, `--proxy <proxy>`

## registry build

Generate registry JSON files from a `registry.json` source file.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

Outputs to `static/r` directory by default.

Options: `-c/--cwd <path>`, `-o/--output <path>` (destination directory), `-h/--help`

## Proxy

Use HTTP proxy for registry requests via `HTTP_PROXY` or `http_proxy` environment variables:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

### components.json
Configuration file for shadcn-svelte CLI with settings for Tailwind CSS, path aliases, TypeScript, and component registry.

## Overview
The `components.json` file configures your project for the shadcn-svelte CLI. It's optional and only required when using the CLI to add components; not needed for copy-paste method.

Create it with:
```bash
npx shadcn-svelte@latest init
```

## Configuration Options

**$schema**: Reference the JSON schema at `https://shadcn-svelte.com/schema.json`
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

**tailwind.css**: Path to your Tailwind CSS import file
```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

**tailwind.baseColor**: Sets the default color palette (cannot be changed after initialization)
```json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

**aliases**: Path aliases for organizing generated components. Must be configured in `svelte.config.js`:
- `lib`: Library root (typically `$lib`)
- `utils`: Utility functions (typically `$lib/utils`)
- `components`: All components (typically `$lib/components`)
- `ui`: UI components (typically `$lib/components/ui`)
- `hooks`: Svelte 5 reactive functions/classes (typically `$lib/hooks`)

```json
{
  "aliases": {
    "lib": "$lib",
    "utils": "$lib/utils",
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks"
  }
}
```

**typescript**: Enable/disable TypeScript or specify custom config path
```json
{
  "typescript": true | false
}
```
```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

**registry**: URL for fetching components (can pin to preview release or custom fork)
```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```

### installation
Components split across multiple files with barrel exports; import from `$lib/components/ui/<component>`; tree-shaken by Rollup; VSCode and JetBrains IDE extensions available.

## Installation Guides

Multiple setup paths available: SvelteKit, Astro, Vite, or Manual installation.

## Component Structure & Imports

Unlike shadcn/ui for React, components are split across multiple files because Svelte doesn't support multiple components per file. The CLI creates a folder for each component with an `index.ts` barrel export.

Example: Accordion component split into 4 files:
- `accordion.svelte`
- `accordion-content.svelte`
- `accordion-item.svelte`
- `accordion-trigger.svelte`

Import options:
```ts
import * as Accordion from '$lib/components/ui/accordion'
// or
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

Components are tree-shaken by Rollup, so unused exports don't bloat the bundle.

## IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev provides:
- CLI initialization
- Component addition
- Documentation navigation
- Import/markup snippets

**JetBrains IDEs**: shadcn/ui Components Manager by @WarningImHack3r supports:
- Auto-detect shadcn/ui components
- Add/remove/update with one click
- Works with Svelte, React, Vue, Solid
- Search remote or existing components

### javascript
Disable TypeScript via components.json flag; JavaScript components available through CLI; configure jsconfig.json for import aliases.

## Using JavaScript Instead of TypeScript

The project is written in TypeScript, but JavaScript versions of components are available via the CLI.

**Disable TypeScript** in `components.json`:
```json
{
  "style": "default",
  "tailwind": {
    "css": "src/app.css"
  },
  "typescript": false,
  "aliases": {
    "utils": "$lib/utils",
    "components": "$lib/components",
    "hooks": "$lib/hooks",
    "ui": "$lib/components/ui"
  },
  "registry": "https://shadcn-svelte.com/registry"
}
```

**Configure import aliases** in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

### registry
Create and host custom component registries with shadcn-svelte CLI; items must be JSON files conforming to registry-item schema; use provided template as starting point.

## Creating a Custom Component Registry

The `shadcn-svelte` CLI allows you to create and host your own component registry to distribute custom components, hooks, pages, and other files to any Svelte project. Registry items are automatically compatible with the `shadcn-svelte` CLI.

### Requirements

Registry items must be valid JSON files conforming to the registry-item schema specification. You can design and host your registry however you prefer.

### Getting Started

Clone the official template project as a starting point:

```bash
npx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```

This template provides a complete example of a properly structured registry.

### theming
CSS variable theming with background/foreground convention using OKLCH colors; customize by adding variables to src/app.css with @theme inline directive; includes default variables for primary, secondary, accent, destructive, border, input, ring, charts, sidebar; pre-configured themes available.

## Theming with CSS Variables

shadcn-svelte uses CSS variables for styling, allowing easy customization without changing class names.

### Convention

Uses `background` and `foreground` naming convention. The `background` suffix is omitted when used for component backgrounds.

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

### Available Variables

Default light/dark theme variables in `src/app.css`:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1 through --chart-5: [color values];
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  /* dark mode overrides for all variables above */
}
```

### Adding Custom Colors

Add new color variables to `src/app.css`:

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

Then use in components:

```svelte
<div class="bg-warning text-warning-foreground"></div>
```

### Base Color Themes

Pre-configured theme options available: Neutral, Stone, Zinc, Gray, Slate. Each includes full light/dark mode variable sets using OKLCH color format.

