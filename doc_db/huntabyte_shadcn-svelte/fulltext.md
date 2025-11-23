
## Directories

### ui_components
60+ composable, accessible UI components with Tailwind styling, form validation integration, and sub-component composition pattern.

## UI Components Library

A comprehensive collection of 60+ composable, accessible UI components built on Bits UI, Embla Carousel, Vaul, and other primitives. All components support Tailwind CSS styling and integrate with SvelteKit forms.

### Installation
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

### Core Components

**Layout & Structure**
- **Sidebar**: Collapsible sidebar with icon mode, multiple variants (sidebar/floating/inset), menu system, header/footer, theming via CSS variables
- **Card**: Composable sections (Root, Header, Title, Description, Action, Content, Footer)
- **Resizable**: Horizontal/vertical pane groups with nested layout support
- **Scroll Area**: Custom cross-browser scrolling with vertical/horizontal/bidirectional orientation
- **Separator**: Horizontal or vertical content dividers
- **Empty**: Empty state display with icon/avatar/image media variants

**Navigation**
- **Breadcrumb**: Path navigation with custom separators, dropdown/drawer integration, responsive collapsed states
- **Navigation Menu**: Grid-based navigation with descriptions, icons, and snippet-based children
- **Pagination**: Page navigation with prev/next buttons and ellipsis
- **Tabs**: Tabbed interface with single active panel
- **Menubar**: Desktop application-style menu with File/Edit/View structure

**Forms & Input**
- **Input**: Text/email/file inputs with labels and validation states
- **Textarea**: Multi-line text input with form integration
- **Label**: Accessible form labels with `for` attribute binding
- **Checkbox**: Toggle control with checked/disabled states, form integration
- **Radio Group**: Mutually exclusive selection with form binding
- **Switch**: Binary toggle control
- **Select**: Dropdown with single selection, grouping, dynamic options
- **Native Select**: Styled HTML select wrapper with OptGroup support
- **Input OTP**: One-time password input with configurable length and separators
- **Input Group**: Attach icons, text, buttons to inputs with flexible alignment (inline-end, block-start, block-end)
- **Slider**: Single/multiple thumb range input with vertical/horizontal orientation
- **Toggle**: Two-state button with variants and sizes
- **Toggle Group**: Multiple toggles with single/multiple selection modes
- **Field**: Composable form field wrapper with labels, descriptions, errors, validation states; supports vertical/horizontal/responsive layouts

**Dialogs & Overlays**
- **Dialog**: Modal overlay with header, title, description, footer
- **Alert Dialog**: Modal for important interruptions requiring response
- **Drawer**: Slide-out panel from screen edges (top/right/bottom/left)
- **Popover**: Rich content portal triggered by button
- **Hover Card**: Link preview on hover with avatar/content
- **Sheet**: Dialog-based complementary content from edges
- **Tooltip**: Popup on hover/focus with Provider/Root/Trigger/Content structure

**Dropdowns & Menus**
- **Dropdown Menu**: Menu with items, groups, separators, shortcuts, submenus, checkboxes, radio groups
- **Context Menu**: Right-click menu with nested submenus and state bindings
- **Combobox**: Autocomplete input composed from Popover + Command with status indicators

**Data Display**
- **Table**: Responsive table with Header/Body/Footer/Row/Head/Cell components
- **Data Table**: TanStack Table v8 integration with sorting, filtering, pagination, column visibility, row selection
- **Carousel**: Embla Carousel with sizing, spacing, vertical/horizontal orientation, plugins, reactive API
- **Chart**: LayerChart-based charts with customizable config, CSS variable theming, flexible tooltips
- **Badge**: Multiple variants (default/secondary/destructive/outline) with custom styling
- **Avatar**: Image with fallback text, supports groups with overlapping display
- **Item**: Flex container for content with title/description/media/actions; supports variants (default/outline/muted) and sizes

**Feedback & Status**
- **Alert**: Callout with default/destructive variants, icon support
- **Progress**: Visual progress bar with reactive value binding
- **Spinner**: Loading indicator with customizable size/color
- **Sonner**: Toast notifications with success/error types, descriptions, action buttons, dark mode support

**Utilities**
- **Accordion**: Vertically stacked interactive headings with single/multiple type, WAI-ARIA accessible
- **Aspect Ratio**: Maintains content at specified ratio (e.g., 16/9)
- **Button**: Multiple variants (outline/secondary/destructive/ghost/link), href support, icon/size props
- **Button Group**: Groups related buttons with consistent styling, separators, nesting, integration with Input/DropdownMenu/Select/Popover
- **Collapsible**: Expand/collapse panel with Trigger and Content
- **Calendar**: Date selection with single/multi-month display, dropdown captions, timezone support
- **Date Picker**: Popover + Calendar composition with single/range selection, presets, form integration
- **Range Calendar**: Date range picker with start/end properties
- **Kbd**: Keyboard key display, groups multiple keys together
- **Skeleton**: Placeholder for loading states

### Form Integration

All form components integrate with **sveltekit-superforms** and **Zod** for type-safe validation:

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

### Composition Pattern

Components use composable sub-components:
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

### Accessibility

- WAI-ARIA compliant with proper roles and attributes
- Keyboard navigation support
- Screen reader friendly
- Form validation with error messages
- Semantic HTML structure

### Theming

- Tailwind CSS utility classes for styling
- CSS variables for component-specific theming (e.g., sidebar colors)
- Dark mode support via class or system preference
- Customizable via `class` prop on most components


### dark_mode
Implement dark mode using mode-watcher library with toggle components and theme persistence.

## Dark Mode Setup

Install `mode-watcher`:
```bash
npm i mode-watcher
```

Add `ModeWatcher` to your root layout (`src/routes/+layout.svelte`):
```svelte
<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
{@render children?.()}
```

## Mode Toggle Components

Create a simple toggle button:
```svelte
<script lang="ts">
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={toggleMode} variant="outline" size="icon">
  <SunIcon
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
  />
  <MoonIcon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
```

Or a dropdown menu with light/dark/system options:
```svelte
<script lang="ts">
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { resetMode, setMode } from "mode-watcher";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>
<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={buttonVariants({ variant: "outline", size: "icon" })}
  >
    <SunIcon
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
    />
    <MoonIcon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Use `toggleMode()` to switch modes, `setMode(mode)` to set a specific mode, and `resetMode()` to use system preference.

## Astro Support

For Astro projects, add an inline theme script to prevent FUOC and use `ModeWatcher` with `client:load`:
```astro
<script is:inline>
  const isBrowser = typeof localStorage !== 'undefined';
  const getThemePreference = () => {
    if (isBrowser && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
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

Then add `ModeWatcher` and toggle components with `client:load` directive.

### installation
Setup instructions for integrating shadcn-svelte into SvelteKit, Vite, Astro, or manual projects.

## Installation Guides

Setup instructions for shadcn-svelte across different frameworks and build tools.

### SvelteKit
```bash
npm create sv@latest my-app
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```
Configure path aliases in `svelte.config.js` if needed. Run init and answer prompts for base color, CSS file path, and import aliases.

### Vite
```bash
npx sv add tailwindcss
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```
Configure TypeScript paths in `tsconfig.json` and `tsconfig.app.json`, and Vite resolution in `vite.config.ts`:
```ts
import path from "path";
export default defineConfig({
  resolve: {
    alias: { $lib: path.resolve("./src/lib") },
  },
});
```

### Astro
```bash
npm create astro@latest
npx astro add svelte
npx astro add tailwind
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button -y -o
```
Configure path aliases in `tsconfig.json`. Create `src/styles/app.css` with Tailwind directives and import in `src/pages/index.astro`. Set `applyBaseStyles: false` in `astro.config.mjs` to prevent duplicate base styles.

### Manual Setup
```bash
npx sv add tailwindcss
npm i tailwind-variants clsx tailwind-merge tw-animate-css @lucide/svelte
npx shadcn-svelte@latest add button -y -o
```
Configure path aliases in `tsconfig.json` and `vite.config.ts`. Create `src/app.css` with Tailwind imports and CSS variables for theming. Create `src/lib/utils.ts` with `cn()` utility using clsx and tailwind-merge. Import styles in `src/routes/+layout.svelte`.

### Component Installation
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### migration_guides
Step-by-step guides for migrating shadcn-svelte projects from Svelte 4→5 and Tailwind v3→v4, including config updates, dependency changes, and component re-installation.

## Svelte 4 to Svelte 5 Migration

**Update configs:**
- `components.json`: Add `registry: "https://shadcn-svelte.com/registry"` and aliases for `components`, `utils`, `ui`, `hooks`, `lib`
- `tailwind.config.js`: Install `tailwindcss-animate`, add sidebar color variables and accordion/caret-blink animations
- `utils.ts`: Export only `cn()` function and utility types (`WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`, `WithElementRef`)

**Update dependencies:**
```bash
npm i bits-ui@^1.0.0 svelte-sonner@^1.0.0 @lucide/svelte@^0.482.0 paneforge@^1.0.0-next.5 vaul-svelte@^1.0.0-next.7 mode-watcher@^1.0.0 -D
```

**Deprecated packages** (remove after migration):
- `cmdk-sv` → use Bits UI's `Command`
- `svelte-headless-table` → use `@tanstack/table-core`
- `svelte-radix` → use `@lucide/svelte`
- `lucide-svelte` → use `@lucide/svelte`

**Migrate components:**
```bash
git add . && git commit -m 'before migration'
npx shadcn-svelte@latest add <component> -y -o
```
(`-y`: skip confirmation, `-o`: overwrite existing files)

---

## Tailwind v4 Migration

**Replace PostCSS with Vite:**
- Delete `postcss.config.js`
- `npm uninstall @tailwindcss/postcss && npm i @tailwindcss/vite -D`
- Update `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**Update `app.css`:**
- Replace `tailwindcss-animate` with `tw-animate-css`
- Import: `@import "tailwindcss"; @import "tw-animate-css";`
- Add custom dark variant: `@custom-variant dark (&:is(.dark *));`
- Move CSS variables to `:root` and `.dark` selectors, wrap colors in `hsl()`
- Replace `tailwind.config.ts` with `@theme inline` directive:
```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --color-background: var(--background);
  /* ... all color/radius mappings */
}
```

**Update dependencies:**
```bash
npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

**Update `utils.ts`:** Add type helpers (`WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`, `WithElementRef`)

**Re-add components with new colors:**
```bash
npx shadcn-svelte@latest add --all --overwrite
```

**Key changes:** Use `size-*` utility instead of `w-* h-*`, HSL colors converted to OKLCH, `default` style deprecated (use `new-york`)

### registry
JSON schema and setup for creating custom component registries with styles, themes, blocks, and components with CSS variables, dependencies, and installation.

## Registry Item Types

**registry:style** - Extends or creates design systems with CSS variables for themes (light/dark modes using OKLch colors), fonts, and shadows. Can extend shadcn-svelte defaults or start from scratch with `"extends": "none"`.

**registry:theme** - Defines color schemes using OKLch format for light/dark modes with variables like `background`, `foreground`, `primary`, `ring`, `sidebar-primary`, etc.

**registry:block** - Reusable page templates with multiple components and dependencies. Can override primitives with custom versions.

**registry:component** - Simple single-file components.

**registry:hook** - Reusable hooks.

**registry:lib** - Libraries and utilities.

**registry:page** - Page or file-based routes.

**registry:file** - Miscellaneous files.

## File Structure

Registry items contain files with `path` (location in registry), `type` (file category), and optional `target` (installation destination):

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
    }
  ]
}
```

## Dependencies

**dependencies** - npm packages: `["bits-ui", "zod@1.0.2"]`

**registryDependencies** - Other registry items in three formats:
- shadcn-svelte items: `["button", "input"]`
- Remote URLs: `["https://example.com/r/hello-world.json"]`
- Local aliases: `["local:stepper"]` converts to `["./stepper.json"]`

## Styling

**cssVars** - Define CSS variables by scope:
```json
{
  "cssVars": {
    "theme": {"font-heading": "Poppins, sans-serif"},
    "light": {"brand": "oklch(0.99 0.00 0)"},
    "dark": {"brand": "oklch(0.14 0.00 286)"}
  }
}
```

**css** - Add CSS rules using layers, utilities, and keyframes:
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

## Setup

Create `registry.json` in project root:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Add components to `registry/[NAME]/` directories and register in `registry.json` with `name`, `type`, `title`, `description`, `files`.

Ensure Tailwind detects custom directories by adding to `src/app.css`:
```css
@source "./registry/@acmecorp/ui-lib";
```

Build registry: `npm run registry:build` (generates JSON in `static/r/`)

Serve via dev server at `http://localhost:5173/r/[NAME].json`

Install items: `npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o`
- `-y`: skip confirmation prompt
- `-o`: overwrite existing files

## registry.json Configuration

**aliases** - Transform import paths (defaults: `lib`, `ui`, `components`, `utils`, `hooks`)

**overrideDependencies** - Force specific dependency versions: `["paneforge@next"]`



## Pages

### changelog
Changelog documenting component additions (Calendar, Carousel, Drawer, Sonner, Pagination, Command, Combobox, Breadcrumb, Scroll Area, Resizable, Toggle Group), Tailwind v4 support, icon import optimization, Formsnap rewrite with breaking changes, custom registry support, and form component API updates.

## June 2025

**Calendar Components Overhaul**
- `Calendar` and `RangeCalendar` components now support month/year dropdown selectors
- 30+ Calendar blocks added for building custom calendar components

## May 2025

**Tailwind v4 Support**
- Official Tailwind v4 support released with refreshed styles (demo at v4.shadcn-svelte.com)
- Full migration guide available; projects using Svelte v5 with Tailwind v3 continue to work until upgrade
- CLI supports adding components for Svelte v5 + Tailwind v4 projects

**Charts Component**
- Charts added as preview component (available via CLI for Svelte v5 + Tailwind v4)

**Custom Registry Support**
- Developers can now publish custom/remote components and share via shadcn-svelte CLI

## March 2024

**Blocks Introduction**
- Ready-made, fully responsive, accessible, composable components built using shadcn-svelte principles
- Note: v0 only supports React currently

**New Components: Breadcrumb, Scroll Area**
- `Breadcrumb`: Navigation component
- `Scroll Area`: Built on Bits UI, supports vertical and horizontal scrolling with consistent cross-browser experience

## February 2024

**New Component: Resizable**
- Built on PaneForge library (early stage)

**Icon Import Changes**
- Moved from unmaintained `radix-icons-svelte` to `svelte-radix` for new-york style
- Changed from: `import { Check } from "@lucide/svelte"`
- Changed to: `import Check from "@lucide/svelte/icons/check"`
- Deep imports prevent Vite from optimizing entire icon collections, significantly improving dev server performance

**Major Forms Update**
- Formsnap completely rewritten for flexibility and power
- Breaking changes: all `Form` components updated to new API
- No direct migration path; requires updating components to new API and latest formsnap/sveltekit-superforms versions
- Live examples available on Forms Examples page

## January 2024

**New Components: Carousel, Drawer, Sonner, Pagination**

**Carousel Example:**
```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
</script>
<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5), i}
      <Carousel.Item>
        <div class="p-1">
          <Card.Root>
            <Card.Content class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{i + 1}</span>
            </Card.Content>
          </Card.Root>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

**Drawer**
- Built on vaul-svelte (Svelte port of vaul by Emil Kowalski)
- Example with goal adjustment:
```svelte
<script lang="ts">
  import MinusIcon from "@lucide/svelte/icons/minus";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  
  let goal = $state(350);
  function handleClick(adjustment: number) {
    goal = Math.max(200, Math.min(400, goal + adjustment));
  }
</script>
<Drawer.Root>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open Drawer</Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full max-w-sm">
      <Drawer.Header>
        <Drawer.Title>Move Goal</Drawer.Title>
        <Drawer.Description>Set your daily activity goal.</Drawer.Description>
      </Drawer.Header>
      <div class="p-4 pb-0">
        <div class="flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full" onclick={() => handleClick(-10)} disabled={goal <= 200}>
            <MinusIcon />
            <span class="sr-only">Decrease</span>
          </Button>
          <div class="flex-1 text-center">
            <div class="text-7xl font-bold tracking-tighter">{goal}</div>
            <div class="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
          </div>
          <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full" onclick={() => handleClick(10)} disabled={goal >= 400}>
            <PlusIcon />
            <span class="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <Drawer.Footer>
        <Button>Submit</Button>
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
      </Drawer.Footer>
    </div>
  </Drawer.Content>
</Drawer.Root>
```

**Sonner**
- Svelte port of Sonner (by Emil Kowalski)
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button variant="outline" onclick={() => toast.success("Event has been created", { description: "Sunday, December 03, 2023 at 9:00 AM", action: { label: "Undo", onClick: () => console.info("Undo") } })}>
  Show Toast
</Button>
```

**Pagination**
- Built on Bits UI Pagination component

## December 2023

**New Components: Calendar, Range Calendar, Date Picker**

## November 2023

**New Component: Toggle Group**

## October 2023

**New Components: Command, Combobox**

**Command**
- Command palette component built on cmdk-sv (Svelte port of cmdk)
- Library in early stage

**Combobox**
- Combination of Command and Popover components
- Creates searchable dropdown menu

**Form Updates**

**Form.Label Changes**
- `ids` from `getFormField()` is now a store, must be prefixed with `$`:
```svelte
<Label for={$ids.input} class={cn($errors && "text-destructive", className)} {...$$restProps}>
  <slot />
</Label>
```

**Form.Control**
- New Formsnap component for wrapping non-traditional form elements
- Export in `src/lib/ui/form/index.ts`:
```ts
const Control = FormPrimitive.Control;
export { Control, Control as FormControl };
```

### cli
CLI commands: init (setup project with config), add (install components with -y -o flags), registry build (generate JSON), proxy support via HTTP_PROXY env var

## init

Initialize a new project with dependencies, the `cn` utility, and CSS variables.

```bash
npx shadcn-svelte@latest init
```

Prompts for configuration:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options: `-c/--cwd` (working directory), `-o/--overwrite` (overwrite files), `--no-deps` (skip dependency installation), `--base-color`, `--css`, `--components-alias`, `--lib-alias`, `--utils-alias`, `--hooks-alias`, `--ui-alias`, `--proxy`

## add

Add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add <component> -y -o
```

- `-y`: skip confirmation prompt
- `-o`: overwrite existing files

Presents interactive list of available components (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, card, checkbox, collapsible, etc.)

Options: `-c/--cwd` (working directory), `--no-deps` (skip package dependencies), `-a/--all` (install all components), `-y/--yes` (skip confirmation), `-o/--overwrite` (overwrite files), `--proxy`

## registry build

Generate registry JSON files from a `registry.json` source file.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

Outputs to `static/r` directory by default.

Options: `-c/--cwd` (working directory), `-o/--output` (destination directory)

## Proxy

Use HTTP proxy for registry requests via `HTTP_PROXY` or `http_proxy` environment variables:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

### components.json
Project configuration file for shadcn-svelte CLI specifying Tailwind setup, path aliases, TypeScript config, and component registry location.

## Purpose
The `components.json` file configures your project for the shadcn-svelte CLI. It's optional and only required when using the CLI to add components; not needed for copy-paste method.

## Initialization
Create the file by running:
```bash
npx shadcn-svelte@latest init
```

## Configuration Options

### $schema
Reference the JSON schema for validation:
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

### tailwind
Configures Tailwind CSS setup for the CLI.

**tailwind.css**: Path to the CSS file importing Tailwind CSS
```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

**tailwind.baseColor**: Generates the default color palette. Cannot be changed after initialization. Options: `gray`, `neutral`, `slate`, `stone`, `zinc`
```json
{
  "tailwind": {
    "baseColor": "gray"
  }
}
```

### aliases
Path aliases must be set up in `svelte.config.js`. The CLI uses these to place generated components correctly.

- **aliases.lib**: Import alias for library code (typically `$lib`)
- **aliases.utils**: Import alias for utility functions (typically `$lib/utils`)
- **aliases.components**: Import alias for components (typically `$lib/components`)
- **aliases.ui**: Import alias for UI components (typically `$lib/components/ui`)
- **aliases.hooks**: Import alias for hooks/reactive functions (typically `$lib/hooks`)

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

### typescript
Enable or disable TypeScript:
```json
{
  "typescript": true
}
```

Specify a custom TypeScript config file:
```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

### registry
Specifies where the CLI fetches components from. Can pin to a preview release or custom fork:
```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```

### installation
Installation guides for SvelteKit/Astro/Vite/Manual; components split into multiple files with barrel exports; VSCode and JetBrains IDE extensions available.

## Installation Guides

Installation instructions are provided for multiple frameworks:
- SvelteKit
- Astro
- Vite
- Manual setup

## Component Structure & Imports

Unlike the React version, components are split into multiple files because Svelte doesn't support multiple components per file. The CLI creates a folder for each component containing individual `.svelte` files and an `index.ts` barrel export.

Example: Accordion component structure:
```
accordion/
  ├── accordion.svelte
  ├── accordion-content.svelte
  ├── accordion-item.svelte
  ├── accordion-trigger.svelte
  └── index.ts
```

Import approaches (both are tree-shaken by Rollup):
```ts
import * as Accordion from '$lib/components/ui/accordion'
// or
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

## IDE Extensions

**VSCode**: Install shadcn-svelte extension by @selemondev
- Initialize CLI
- Add components
- Navigate to component documentation
- Component import snippets

**JetBrains IDEs**: Install shadcn/ui Components Manager by @WarningImHack3r (supports Svelte, React, Vue, Solid)
- Auto-detect components
- Add/remove/update with one click
- Search remote or existing components

### javascript_support
Use JavaScript instead of TypeScript by setting typescript: false in components.json and configuring jsconfig.json with import aliases.

shadcn-svelte is written in TypeScript, but JavaScript versions of components are available through the CLI. To use JavaScript instead of TypeScript, set `"typescript": false` in `components.json`:

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

Configure import aliases by creating `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

TypeScript is recommended for the project, but JavaScript support is provided as an alternative.

### registry
Create custom component registries with JSON-based items compatible with shadcn-svelte CLI; use provided template as starting point.

## Creating a Custom Component Registry

You can use the shadcn-svelte CLI to create and host your own component registry, allowing you to distribute custom components, hooks, pages, and other files to any Svelte project. Registry items are automatically compatible with the shadcn-svelte CLI.

### Requirements

Registry items must be valid JSON files conforming to the registry-item schema specification. You can design and host your registry however you prefer.

### Getting Started

Use the official template project as a starting point:

```bash
npx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```

This template provides a complete example of a properly structured registry.

### Note

This feature is currently experimental. Feedback and testing are encouraged via GitHub discussions.

### theming
CSS variables with background/foreground convention for theming; OKLCH color format; light/dark mode support; custom colors via @theme inline; preset color schemes included.

## CSS Variables for Theming

shadcn-svelte uses CSS variables to customize component appearance. This allows changing colors without updating class names.

### Convention

Colors follow a `background` and `foreground` convention:
- `background` variable: component background color
- `foreground` variable: text color
- The `background` suffix is omitted in utility classes

Example:
```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

Used as:
```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

### Available CSS Variables

Default light/dark theme variables in `src/app.css`:

**Layout & Structure:**
- `--radius`: Border radius (default: 0.625rem)

**Base Colors:**
- `--background` / `--foreground`: Page background and text
- `--card` / `--card-foreground`: Card components
- `--popover` / `--popover-foreground`: Popover components

**Semantic Colors:**
- `--primary` / `--primary-foreground`: Primary actions
- `--secondary` / `--secondary-foreground`: Secondary actions
- `--muted` / `--muted-foreground`: Disabled/muted states
- `--accent` / `--accent-foreground`: Accent highlights
- `--destructive`: Destructive actions (red)

**UI Elements:**
- `--border`: Border color
- `--input`: Input field background
- `--ring`: Focus ring color

**Charts:**
- `--chart-1` through `--chart-5`: Chart colors

**Sidebar:**
- `--sidebar` / `--sidebar-foreground`: Sidebar background and text
- `--sidebar-primary` / `--sidebar-primary-foreground`: Sidebar primary
- `--sidebar-accent` / `--sidebar-accent-foreground`: Sidebar accent
- `--sidebar-border` / `--sidebar-ring`: Sidebar borders and rings

Colors use OKLCH format. Dark mode overrides are defined in `.dark` selector.

### Adding Custom Colors

Add new color variables to both `:root` and `.dark` selectors, then register with Tailwind:

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

Use as utility classes:
```svelte
<div class="bg-warning text-warning-foreground"></div>
```

### Preset Color Schemes

Pre-configured neutral color palettes available: Neutral, Stone, Zinc, Gray, Slate. Each includes light and dark mode variants with all standard variables configured.

