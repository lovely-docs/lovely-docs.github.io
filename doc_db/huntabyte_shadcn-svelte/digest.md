## Complete shadcn-svelte Documentation

**Overview**: shadcn-svelte is a comprehensive Svelte UI component library with 60+ composable, accessible, themeable components built on Bits UI, Embla Carousel, LayerChart, and other libraries. Components are installed via CLI and customizable through CSS variables.

### Core Components (60+)

**Accordion, Alert/AlertDialog, Avatar, Badge, Breadcrumb, Button, ButtonGroup** - Basic UI elements with variants, sizes, icon support, and accessibility features.

**Form Components**: Checkbox, Input, InputGroup, InputOTP, Label, RadioGroup, Select, Switch, Textarea - Full form control suite with validation, state binding, and form integration via sveltekit-superforms and Zod.

**Layout**: Card (Root/Header/Title/Description/Action/Content/Footer), Empty (with icon/avatar variants), Field (vertical/horizontal/responsive), Item (flex container with variants), Separator, Sidebar (Provider/Root/Header/Content/Group/Menu/Footer/Trigger with left/right positioning, sidebar/floating/inset variants, offcanvas/icon/none collapse modes, useSidebar() hook).

**Navigation**: Breadcrumb, DropdownMenu, Menubar, NavigationMenu, Pagination - Desktop and mobile navigation with nested submenus, keyboard shortcuts, responsive variants.

**Overlays**: Dialog, Drawer (Vaul-based slide-out), HoverCard, Popover, Sheet (configurable side positioning), Tooltip - Modal and overlay components with Portal support.

**Data Display**: Calendar (single/range modes, month/year dropdowns, 30+ block variants), Chart (LayerChart-based with CSS variable theming), DataTable (TanStack Table v8 with pagination/sorting/filtering/column visibility/row selection), Progress, Skeleton, Table, Tabs.

**Input Enhancements**: AspectRatio, Carousel (Embla-based with vertical/horizontal, autoplay plugin), DatePicker, RangeCalendar, Resizable (panel groups with nested panes), ScrollArea, Slider.

**Specialized**: Command (unstyled command menu), Combobox (searchable dropdown), ContextMenu, Collapsible, Form (Formsnap & Superforms wrapper with Zod validation), Kbd, NativeSelect, Sonner (toast notifications), Spinner, Toggle, ToggleGroup, Typography.

**Installation**: `npx shadcn-svelte@latest add <component> -y -o` (flags: -y skips confirmation, -o overwrites existing files). All components follow composable subcomponent pattern (Root/Trigger/Content/Item structure), use Svelte 5 snippets and $state/$derived reactivity, Tailwind CSS styling, ARIA attributes, keyboard navigation, dark mode via CSS variables, responsive design.

### Setup & Configuration

**Installation Paths**: SvelteKit, Vite, Astro, or manual setup. All require Tailwind CSS, TypeScript paths configured, and `src/app.css` with Tailwind imports and CSS variables.

**components.json**: CLI configuration file with $schema, tailwind.css path, baseColor (slate/gray/zinc/neutral/stone), aliases (lib/$lib, utils/$lib/utils, components/$lib/components, ui/$lib/components/ui, hooks/$lib/hooks), typescript flag, registry URL.

**Initialization**: `npx shadcn-svelte@latest init` - prompts for base color, CSS file path, import aliases. Creates components.json and installs dependencies.

### Dark Mode

**mode-watcher package**: Install with `npm i mode-watcher`, add `<ModeWatcher />` to root layout. Functions: `toggleMode()` (toggle light/dark), `setMode("light"|"dark")` (set specific mode), `resetMode()` (use system preference). Create toggle button with SunIcon/MoonIcon or dropdown menu with light/dark/system options. For Astro, use inline script to prevent FUOC and persist theme to localStorage.

### Theming

**CSS Variables**: Uses background/foreground naming convention with OKLCH color format. Default variables: --radius, --background, --foreground, --card, --popover, --primary, --secondary, --muted, --accent, --destructive, --border, --input, --ring, --chart-1 through --chart-5, --sidebar (with primary/accent/border/ring variants). Add custom colors to src/app.css with @theme inline directive for Tailwind integration. Pre-configured base color themes: Neutral, Stone, Zinc, Gray, Slate.

### CLI Commands

**init**: `npx shadcn-svelte@latest init` - Initialize project with dependencies, cn util, CSS variables. Options: -c/--cwd, -o/--overwrite, --no-deps, --base-color, --css, --components-alias, --lib-alias, --utils-alias, --hooks-alias, --ui-alias, --proxy.

**add**: `npx shadcn-svelte@latest add <component> -y -o` - Add components with interactive list. Options: -c/--cwd, --no-deps, -a/--all (install all), -y/--yes, -o/--overwrite, --proxy.

**registry build**: `npx shadcn-svelte@latest registry build [registry.json]` - Generate registry JSON from source. Options: -c/--cwd, -o/--output (destination), -h/--help.

**Proxy**: Use HTTP_PROXY or http_proxy environment variables for registry requests.

### Custom Registries

**Registry Items**: JSON objects with name, type (registry:block/component/ui/lib/hook/page/file/style/theme), title, description, files (path/type/target), dependencies, registryDependencies, cssVars (theme/light/dark sections), css (@layer/@utility/@keyframes), docs, categories, meta.

**registry.json**: Root configuration with $schema, name, homepage, items array, aliases (lib/ui/components/utils/hooks), overrideDependencies. Default aliases if not specified: lib=$lib/registry/lib, ui=$lib/registry/ui, components=$lib/registry/components, utils=$lib/utils, hooks=$lib/registry/hooks.

**Setup**: Create registry.json in project root, add component files to registry/ directory, run `npm run registry:build` (add to package.json scripts), serve via `npm run dev`. Install items with `npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o`. Support token-based auth via query parameter with server-side authorization.

### Migrations

**Svelte 4→5**: Update components.json with registry field and aliases, install tailwindcss-animate, update tailwind.config.js with sidebar colors and animations, simplify utils.ts to export only cn function and utility types, update dependencies (bits-ui, svelte-sonner, @lucide/svelte, paneforge, vaul-svelte, mode-watcher), remove deprecated packages (cmdk-sv, svelte-headless-table, svelte-radix, lucide-svelte), migrate components with `npx shadcn-svelte@latest add <component> -y -o` for each.

**Tailwind v4 & Svelte 5**: Replace @tailwindcss/postcss with @tailwindcss/vite in vite.config.ts, update app.css to import tailwindcss and tw-animate-css (replace tailwindcss-animate), use @custom-variant dark for dark mode, define @theme inline block with CSS variables, delete tailwind.config.ts, use size-* utility instead of w-*/h-*, update dependencies, optionally re-add all components for new OKLCH dark mode colors.

### IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev - CLI initialization, component addition, documentation navigation, import/markup snippets.

**JetBrains IDEs**: shadcn/ui Components Manager by @WarningImHack3r - Auto-detect components, add/remove/update with one click, works with Svelte/React/Vue/Solid, search remote or existing components.

### JavaScript Support

Disable TypeScript in components.json with `"typescript": false`, configure jsconfig.json with path aliases for $lib.

### Component Structure

Components split across multiple files with barrel exports (index.ts). Import via `import * as ComponentName from '$lib/components/ui/component'` or named imports. Tree-shaken by Rollup, unused exports don't bloat bundle.

### Changelog

**June 2025**: Calendar/RangeCalendar overhaul with month/year dropdowns, 30+ Calendar blocks.
**May 2025**: Tailwind v4 support, Charts preview component, custom registry support.
**March 2024**: Blocks (ready-made components), Breadcrumb, ScrollArea.
**February 2024**: Resizable component, deep icon imports from @lucide/svelte for perf, Formsnap rewrite.
**January 2024**: Carousel, Drawer, Sonner, Pagination.
**December 2023**: Calendar, RangeCalendar, DatePicker.
**November 2023**: ToggleGroup.
**October 2023**: Command, Combobox, Form.Label store syntax, Form.Control.